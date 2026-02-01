# Keyboard Shortcut Mapper

A visual keyboard mapping tool for MacBook that lets you view and edit keyboard shortcut layers

https://tigershen23.github.io/keyboard_shortcut_mapper/

## Development

```bash
# Install dependencies
bun install

# Run dev server with HMR
bun --hot src/index.ts
# Opens at http://localhost:3000

# Build for production
bun run build
# Output in dist/
```

## Deployment

The app is automatically deployed to GitHub Pages on push to `master` via GitHub Actions.

- Workflow: `.github/workflows/deploy.yml`
- Build: Bun HTML bundler (`bun build ./src/index.html`)
- Static assets: Icons copied to `dist/icons/`
