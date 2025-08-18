# Deployment Guide

This document explains how to deploy the Seamly2D Web App to GitHub Pages.

## GitHub Pages Setup

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Environment Variables

The GitHub Actions workflow automatically sets the required environment variables:

- `NEXT_PUBLIC_BASE_PATH`: Set to the repository name for proper asset paths
- `NEXT_PUBLIC_STATIC_MODE`: Set to `'1'` to enable static mode features

### 3. Deployment Process

The deployment happens automatically when you push to the `main` branch:

1. **Build**: The app is built with static export configuration
2. **Upload**: The built files are uploaded as an artifact
3. **Deploy**: The artifact is deployed to GitHub Pages

### 4. Accessing Your Deployed App

After successful deployment, your app will be available at:
```
https://<username>.github.io/<repository-name>/
```

For example: `https://bradmarnold.github.io/seamly2dwebapp/`

## Static Mode Features

When deployed to GitHub Pages (static mode), the app has the following characteristics:

### Enabled Features
- ✅ Full pattern drafting functionality
- ✅ Auto-save to browser localStorage
- ✅ Import/Export JSON files
- ✅ All client-side tools and features
- ✅ Offline functionality after first load

### Disabled Features
- ❌ Server-side authentication
- ❌ Database storage
- ❌ User accounts
- ❌ Cloud synchronization

### Data Storage

In static mode, all user data is stored in the browser's localStorage:

- **Automatic saving**: Changes are automatically saved as you work
- **Persistence**: Data persists between browser sessions
- **Export/Import**: Use the File menu to export/import JSON files
- **Manual backup**: Export your work regularly as JSON files

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Basic support (limited by screen size)

## Local Development

To test the static export locally:

```bash
# Install dependencies
npm install

# Build for static export
NEXT_PUBLIC_BASE_PATH=/seamly2dwebapp NEXT_PUBLIC_STATIC_MODE=1 npm run build

# Serve the static files (requires a static server)
npx serve out
```

## Troubleshooting

### Build Failures

If the GitHub Actions build fails:

1. Check the **Actions** tab in your repository
2. Review the build logs for errors
3. Ensure all dependencies are listed in `package.json`
4. Verify the build works locally

### Page Not Loading

If the deployed page doesn't load:

1. Verify GitHub Pages is enabled in repository settings
2. Check that the deployment completed successfully
3. Ensure the repository is public (or you have GitHub Pro for private repos)
4. Wait a few minutes for DNS propagation

### Assets Not Loading

If CSS/JS files aren't loading:

1. Verify `NEXT_PUBLIC_BASE_PATH` is set correctly in the workflow
2. Check browser developer tools for 404 errors
3. Ensure `basePath` configuration in `next.config.mjs` is correct

### Data Loss

To prevent losing your work in static mode:

1. **Export regularly**: Use File → Export JSON to save your patterns
2. **Browser storage**: Don't clear browser data for the site
3. **Backup projects**: Keep exported JSON files in a safe location
4. **Version control**: Consider committing pattern files to the repository

## Advanced Configuration

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public` directory with your domain
2. Configure DNS settings with your domain provider
3. Update repository Pages settings to use the custom domain

### Build Optimization

The build is configured for optimal static deployment:

- Images are unoptimized (no server-side optimization)
- Trailing slashes enabled for better static hosting compatibility
- Assets are prefixed with the base path
- Server-side features are disabled

## Support

For deployment issues:

1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the [Next.js static export documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
3. Open an issue in the repository for app-specific problems