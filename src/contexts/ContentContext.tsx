import React, { createContext, useContext, useEffect, useState } from 'react';

export type SiteContent = Record<string, any>;

const ContentContext = createContext<SiteContent>({});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>({});

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(setContent)
      .catch(() => {});
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
