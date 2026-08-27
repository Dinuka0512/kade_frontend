module.exports = {
  apps: [
    {
      name: 'kade-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 8080',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: '8080',
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
}
