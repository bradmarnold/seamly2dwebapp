# Seamly2D Web App

A web-based port of the Seamly2D pattern drafting software, built with Next.js 14 and TypeScript.

## Project Status

**Current Phase:** Planning Complete, Implementation Not Started  
**Progress:** 1/14 planned milestones completed (7%)  
**Estimated Timeline:** 8-12 weeks to completion  

### Quick Links
- 📊 [Detailed Project Status](./PROJECT_STATUS.md)
- 🗓️ [Development Timeline](./TIMELINE.md)
- 🔧 [Original Development Plan](https://github.com/bradmarnold/seamly2dwebapp/pull/1) (PR #1)

## What's Been Done

✅ **Planning Phase Complete** (First Agent)
- Comprehensive development roadmap created
- Technology stack selected (Next.js 14 + TypeScript)
- Detailed checklist with phases D1-D4 defined

❌ **Implementation Phase** (Not Started)
- No code has been written yet
- Development environment not set up
- Project scaffolding not created

## Next Steps

The next agent should begin with:
1. Initialize Next.js 14 project with TypeScript
2. Set up basic development environment
3. Create core project structure (app/, components/, lib/)
4. Begin implementing the DraftingCanvas component

---

*Last updated: August 16, 2025*
=======
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

### Local Preview
To preview the app with the same base path as GitHub Pages:
```bash
NEXT_PUBLIC_BASE_PATH=/seamly2dwebapp NEXT_PUBLIC_STATIC_MODE=1 npm run dev
```
Visit `http://localhost:3000/seamly2dwebapp/`

### Build for Static Export
To build the app for GitHub Pages deployment:
```bash
NEXT_PUBLIC_BASE_PATH=/seamly2dwebapp NEXT_PUBLIC_STATIC_MODE=1 npm run build
```
Or use the convenience script:
```bash
npm run build:static
npm run deploy  # Optional: manual deploy
```

### GitHub Pages Configuration
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow automatically deploys on push to `main` branch

## Static Mode

When deployed to GitHub Pages, the app runs in "static mode" which:

- ✅ Stores all data in browser localStorage
- ✅ Provides import/export functionality for JSON files  
- ✅ Works completely offline after first load
- ❌ Disables server-side features (auth, database)

**Important:** All data is stored locally in your browser. Use the Import/Export JSON functionality to backup your work!

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
