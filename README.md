# Seamly2D Web App

A modern web-based port of the open-source Seamly2D pattern drafting application.

🚀 **[Live Demo](https://bradmarnold.github.io/seamly2dwebapp/)**

## Features

- Full drafting kernel with point and curve tools
- Measurement system with .vit/.vst import
- Pattern piece extraction with seam allowances
- Layout and printing capabilities
- **GitHub Pages deployment with static export**
- **Auto-save to localStorage in static mode**
- **Import/Export JSON functionality**

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Build for static export (GitHub Pages)
NEXT_PUBLIC_BASE_PATH=/seamly2dwebapp NEXT_PUBLIC_STATIC_MODE=1 npm run build
```

## Deployment

This app is configured for deployment to GitHub Pages. See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## Static Mode

When deployed to GitHub Pages, the app runs in "static mode" which:

- ✅ Stores all data in browser localStorage
- ✅ Provides import/export functionality for JSON files  
- ✅ Works completely offline after first load
- ❌ Disables server-side features (auth, database)

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3). See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all changes maintain compatibility with the GPLv3 license.
- Light mode theme (with dark mode toggle)
- File import/export (.val, .svg, .pdf, .dxf)

## Tech Stack

- Next.js 14 with App Router
- React 18 + TypeScript
- Zustand for state management
- SVG for rendering
- Tailwind CSS for styling

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linter
npm run test     # Run tests
npm run e2e      # Run E2E tests
```

## License

GPL-3.0 compatible (see Seamly2D source licensing)