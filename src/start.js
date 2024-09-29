(async () => {
    const { default: serve } = await import('serve');
    serve('build', { port: 43749 });
  })();