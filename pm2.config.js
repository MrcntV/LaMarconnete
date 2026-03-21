module.exports = {
  apps: [
    {
      name: 'marconnete',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 43749
      }
    },
    {
      name: 'marconnete-admin',
      script: 'server-admin.js',
      env: {
        NODE_ENV: 'production',
        ADMIN_PORT: 43750
      }
    }
  ]
};
