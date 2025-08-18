'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withBasePath } from '@/lib/basePath';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the draft page
    router.push(withBasePath('/draft'));
  }, [router]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Seamly2D Web App</h1>
        <p className="text-secondary">Loading...</p>
      </div>
    </div>
  );
}
