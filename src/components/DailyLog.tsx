import type { BulletItem as BulletItemType, BulletType } from '../types/bullet';
import BulletItem from './BulletItem';
import BulletInput from './BulletInput';

interface DailyLogProps {
  date: string;
  bullets: BulletItemType[];
  onAdd: (type: BulletType, text: string, date: string) => void;
  onUpdate: (id: string, updates: Partial<BulletItemType>) => void;
  onDelete: (id: string) => void;
}

const SECTIONS: { type: BulletType; label: string }[] = [
  { type: 'task', label: 'TASKS' },
  { type: 'event', label: 'EVENTS' },
  { type: 'note', label: 'NOTES' },
];

export default function DailyLog({ date, bullets, onAdd, onUpdate, onDelete }: DailyLogProps) {
  if (bullets.length === 0) {
    return (
      <div>
        <div
          className="text-sm italic"
          style={{
            color: 'var(--ink-light)',
            padding: 'var(--grid-size) 0',
          }}
        >
          오늘 항목이 없습니다
        </div>
        <BulletInput date={date} onAdd={onAdd} />
      </div>
    );
  }

  const grouped = SECTIONS.map(({ type, label }) => ({
    type,
    label,
    items: bullets.filter((b) => b.type === type),
  })).filter(({ items }) => items.length > 0);

  return (
    <div>
      {grouped.map(({ type, label, items }) => (
        <div key={type} style={{ marginBottom: 'calc(var(--grid-size) * 2)' }}>
          <div
            className="text-[11px] uppercase tracking-[3px]"
            style={{
              color: 'var(--ink-light)',
              marginBottom: 'var(--grid-size)',
            }}
          >
            {label}
          </div>
          {items.map((bullet) => (
            <BulletItem
              key={bullet.id}
              bullet={bullet}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
      <BulletInput date={date} onAdd={onAdd} />
    </div>
  );
}
