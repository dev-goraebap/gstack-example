import type { ReactNode } from 'react';

export default function GridPaper({ children }: { children: ReactNode }) {
  return (
    <div
      className="max-w-[720px] min-h-screen"
      style={{
        padding: 'var(--grid-size)',
        borderLeft: '2px solid var(--margin-red)',
        marginLeft: 'calc(var(--grid-size) * 3)',
      }}
    >
      {children}
    </div>
  );
}
