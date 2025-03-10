module.exports = {
  apps: [
    {
      name: 'logengine-public-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};