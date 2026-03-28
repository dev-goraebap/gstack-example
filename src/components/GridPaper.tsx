import type { ReactNode } from 'react';

export default function GridPaper({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: '780px',
        minHeight: '100vh',
        margin: '0 auto',
        padding: 'calc(var(--grid-size) * 1.5) calc(var(--grid-size) * 2)',
        borderLeft: '2px solid var(--margin-red)',
      }}
    >
      {children}
    </div>
  );
}
