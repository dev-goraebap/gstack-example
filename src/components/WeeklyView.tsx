import { useMemo } from 'react';
import { startOfWeek, endOfWeek, addDays, format, isToday, parseISO } from 'date-fns';
import type { BulletItem } from '../types/bullet';
import { getSymbol } from '../types/bullet';

interface WeeklyViewProps {
  currentDate: string;
  getBulletsByDateRange: (start: string, end: string) => BulletItem[];
  onDayClick: (date: string) => void;
}

export default function WeeklyView({ currentDate, getBulletsByDateRange, onDayClick }: WeeklyViewProps) {
  const parsed = parseISO(currentDate);
  const weekStart = startOfWeek(parsed, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(parsed, { weekStartsOn: 1 });

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart.getTime()]);

  const bullets = useMemo(() => {
    return getBulletsByDateRange(
      format(weekStart, 'yyyy-MM-dd'),
      format(weekEnd, 'yyyy-MM-dd'),
    );
  }, [getBulletsByDateRange, weekStart.getTime(), weekEnd.getTime()]);

  const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div
      className="grid grid-cols-7 gap-[2px]"
      style={{ marginTop: 'var(--grid-size)' }}
    >
      {days.map((day, i) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayBullets = bullets.filter((b) => b.date === dateStr);
        const today = isToday(day);

        return (
          <div
            key={dateStr}
            className="cursor-pointer"
            style={{
              padding: '8px',
              minHeight: 'calc(var(--grid-size) * 8)',
              borderRight: i < 6 ? '1px solid var(--grid-color)' : 'none',
            }}
            onClick={() => onDayClick(dateStr)}
          >
            <div
              className="text-[10px] uppercase tracking-[2px] text-center"
              style={{
                color: 'var(--ink-light)',
                marginBottom: '8px',
              }}
            >
              {DAY_LABELS[i]}
            </div>
            <div
              className="text-base font-bold text-center"
              style={{
                marginBottom: '8px',
                ...(today ? {
                  background: 'var(--ink)',
                  color: 'var(--paper-bg)',
                  width: 'var(--grid-size)',
                  height: 'var(--grid-size)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                } : {}),
              }}
            >
              {format(day, 'd')}
            </div>
            {dayBullets.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="text-[11px] leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                <span className="mr-1">{getSymbol(b.type, b.state)}</span>
                {b.text}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
