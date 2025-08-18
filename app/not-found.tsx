'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Page not found</h1>
      <p>The file you requested does not exist on GitHub Pages.</p>
      <p><Link href="/">Back to home</Link></p>
    </main>
  );
}