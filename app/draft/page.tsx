'use client';

import AppShell from '@/src/ui/shell/AppShell';
import DraftingCanvas from '@/components/DraftingCanvas';

export default function DraftPage() {
  return (
    <AppShell>
      <DraftingCanvas />
    </AppShell>
  );
}