module.exports = {
  apps: [
    {
      name: "keyboard_shortcut_mapper",
      script: "bun",
      args: "--hot src/index.ts",
      cwd: __dirname,
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
