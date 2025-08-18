'use client';

import { useEffect } from 'react';
import AppShell from '@/src/ui/shell/AppShell';
import DraftingCanvas from '@/components/DraftingCanvas';
import { useStore } from '@/lib/store';

export default function DraftPage() {
  const ensureDefaultPiece = useStore(s => s.ensureDefaultPiece);

  useEffect(() => { 
    ensureDefaultPiece(); 
  }, [ensureDefaultPiece]);

  return (
    <AppShell>
      <DraftingCanvas />
    </AppShell>
  );
}