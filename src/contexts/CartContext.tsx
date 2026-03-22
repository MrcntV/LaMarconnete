import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  titre: string;
  prix: number;
  image: string;
  quantite: number;
  couleur?: string;
  taille?: string;
  reference?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, couleur?: string, taille?: string) => void;
  updateQuantite: (id: string, quantite: number, couleur?: string, taille?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrix: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'marconnete_cart';

const itemKey = (item: Pick<CartItem, 'id' | 'couleur' | 'taille'>) =>
  `${item.id}__${item.couleur || ''}__${item.taille || ''}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const key = itemKey(newItem);
      const existing = prev.find(i => itemKey(i) === key);
      if (existing) {
        return prev.map(i =>
          itemKey(i) === key ? { ...i, quantite: i.quantite + newItem.quantite } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string, couleur?: string, taille?: string) => {
    const key = itemKey({ id, couleur, taille });
    setItems(prev => prev.filter(i => itemKey(i) !== key));
  };

  const updateQuantite = (id: string, quantite: number, couleur?: string, taille?: string) => {
    const key = itemKey({ id, couleur, taille });
    if (quantite <= 0) {
      setItems(prev => prev.filter(i => itemKey(i) !== key));
    } else {
      setItems(prev => prev.map(i => itemKey(i) === key ? { ...i, quantite } : i));
    }
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantite, 0);
  const totalPrix = items.reduce((sum, i) => sum + i.prix * i.quantite, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantite, clearCart, totalItems, totalPrix }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
