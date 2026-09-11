// PM2 process file. On the VPS, from ~/tentmakers/project:
//   pm2 start deploy/ecosystem.config.js
//   pm2 save && pm2 startup   (run the command it prints)
module.exports = {
  apps: [
    {
      name: 'tentmakers',
      cwd: '/root/tentmakers/project',
      script: 'npm',
      args: 'start -- -p 3000',
      env: { NODE_ENV: 'production', PORT: '3000' },
    },
  ],
};
