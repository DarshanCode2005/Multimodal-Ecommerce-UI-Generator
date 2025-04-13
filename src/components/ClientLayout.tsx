'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to prevent hydration errors with Monaco Editor
const AppLayout = dynamic(() => import('./AppLayout'), { ssr: false });

export default function ClientLayout() {
  return <AppLayout />;
} 