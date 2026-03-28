import type { ViewMode } from '../types/bullet';

interface ViewNavProps {
  dateTitle: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
}

const TABS: { mode: ViewMode; label: string }[] = [
  { mode: 'daily', label: 'DAILY' },
  { mode: 'weekly', label: 'WEEKLY' },
  { mode: 'monthly', label: 'MONTHLY' },
];

export default function ViewNav({
  dateTitle,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
}: ViewNavProps) {
  return (
    <div
      className="flex items-baseline"
      style={{
        gap: 'calc(var(--grid-size) * 2)',
        padding: 'var(--grid-size) 0',
        marginBottom: 'var(--grid-size)',
        borderBottom: '1px solid var(--grid-color-strong)',
      }}
    >
      <div className="text-xl font-bold tracking-wide">{dateTitle}</div>
      <div className="flex" style={{ gap: 'var(--grid-size)' }}>
        {TABS.map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className="font-[inherit] text-[13px] bg-transparent border-none cursor-pointer tracking-[2px]"
            style={{
              padding: '4px 8px',
              color: viewMode === mode ? 'var(--ink)' : 'var(--ink-light)',
              borderBottom: viewMode === mode ? '2px solid var(--ink)' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 ml-auto">
        <NavButton onClick={onPrev}>&larr;</NavButton>
        <NavButton onClick={onNext}>&rarr;</NavButton>
      </div>
    </div>
  );
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="font-[inherit] text-base bg-transparent cursor-pointer flex items-center justify-center"
      style={{
        width: 'var(--grid-size)',
        height: 'var(--grid-size)',
        border: '1px solid var(--grid-color-strong)',
        color: 'var(--ink-light)',
        borderRadius: '2px',
      }}
    >
      {children}
    </button>
  );
}
