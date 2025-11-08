module.exports = {
  apps: [
    {
      name: 'retrocarolis-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3003',
      cwd: '/root/brecho',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/root/brecho/logs/pm2-error.log',
      out_file: '/root/brecho/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      watch: false
    }
  ]
}

