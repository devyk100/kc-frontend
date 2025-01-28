"use client"

import dynamic from 'next/dynamic';

const CodeEditorWrapper = dynamic(
  () => import('@/components/ui/code-editor'), // Replace with the correct path to your component
  { ssr: false } // Disable SSR for this component
);

export default CodeEditorWrapper