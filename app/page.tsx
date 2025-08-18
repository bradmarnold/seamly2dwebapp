'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function SafeRedirectOnce(targetPath?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const did = useRef(false);

  useEffect(() => {
    if (did.current) return;
    did.current = true;

    // Example: normalize trailing slash ONLY if different
    if (targetPath && pathname !== targetPath) {
      router.replace(targetPath, { scroll: false });
    }
  }, [router, pathname, targetPath]);

  return null;
}
