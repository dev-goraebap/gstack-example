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
      style={{
        padding: 'calc(var(--grid-size) * 1.25) 0',
        marginBottom: 'calc(var(--grid-size) * 1.5)',
        borderBottom: '1px solid rgba(168, 192, 216, 0.3)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
        <div className="text-[22px] font-bold tracking-wide whitespace-nowrap">{dateTitle}</div>
        <div className="flex gap-2">
          <NavButton onClick={onPrev}>&larr;</NavButton>
          <NavButton onClick={onNext}>&rarr;</NavButton>
        </div>
      </div>
      <div className="flex" style={{ gap: 'calc(var(--grid-size) * 0.75)' }}>
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
