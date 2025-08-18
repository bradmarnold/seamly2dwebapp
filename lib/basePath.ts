/**
 * Helper for handling base path in static export mode
 * This prefixes all routes with the base path when deployed to GitHub Pages
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Simple helper as specified in the problem statement
 */
export const withBase = (p: string) => (BASE_PATH ? `${BASE_PATH}${p}` : p);

/**
 * Prefix a path with the base path for use in Link href and router.push
 */
export function withBasePath(path: string): string {
  if (!BASE_PATH) return path;
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Don't double-prefix
  if (path.startsWith(BASE_PATH)) {
    return path;
  }
  
  return BASE_PATH + path;
}

/**
 * Get the base path for assets and images
 */
export function getAssetPrefix(): string {
  return BASE_PATH;
}

/**
 * Check if we're in static mode (GitHub Pages deployment)
 */
export function isStaticMode(): boolean {
  return process.env.NEXT_PUBLIC_STATIC_MODE === '1';
}