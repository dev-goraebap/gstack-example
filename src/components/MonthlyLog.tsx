import { useMemo } from 'react';
import { startOfMonth, endOfMonth, getDaysInMonth, addDays, format, parseISO, getDay } from 'date-fns';
import type { BulletItem } from '../types/bullet';
import { getSymbol } from '../types/bullet';

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface MonthlyLogProps {
  currentDate: string;
  getBulletsByDateRange: (start: string, end: string) => BulletItem[];
  onDayClick: (date: string) => void;
}

export default function MonthlyLog({ currentDate, getBulletsByDateRange, onDayClick }: MonthlyLogProps) {
  const parsed = parseISO(currentDate);
  const monthStart = startOfMonth(parsed);
  const monthEnd = endOfMonth(parsed);
  const totalDays = getDaysInMonth(parsed);

  const bullets = useMemo(() => {
    return getBulletsByDateRange(
      format(monthStart, 'yyyy-MM-dd'),
      format(monthEnd, 'yyyy-MM-dd'),
    );
  }, [getBulletsByDateRange, monthStart.getTime(), monthEnd.getTime()]);

  const rows = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const day = addDays(monthStart, i);
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayBullets = bullets.filter((b) => b.date === dateStr);
      return { day, dateStr, dayBullets, dayOfWeek: getDay(day) };
    });
  }, [totalDays, monthStart.getTime(), bullets]);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: 'auto 1fr',
        marginTop: 'var(--grid-size)',
      }}
    >
      {rows.map(({ day, dateStr, dayBullets, dayOfWeek }) => (
        <div key={dateStr} className="contents cursor-pointer" onClick={() => onDayClick(dateStr)}>
          <div
            className="text-[13px]"
            style={{
              padding: '4px 12px 4px 0',
              textAlign: 'right',
              color: dayBullets.length > 0 ? 'var(--ink)' : 'var(--ink-light)',
              fontWeight: dayBullets.length > 0 ? 'bold' : 'normal',
              borderBottom: '1px solid var(--grid-color)',
              lineHeight: 'var(--grid-size)',
            }}
          >
            {format(day, 'd')} {DAY_NAMES[dayOfWeek]}
          </div>
          <div
            className="text-xs"
            style={{
              padding: '4px 0',
              borderBottom: '1px solid var(--grid-color)',
              lineHeight: 'var(--grid-size)',
              color: 'var(--ink)',
            }}
          >
            {dayBullets.slice(0, 3).map((b, i) => (
              <span key={b.id}>
                {i > 0 && ' \u00A0 '}
                {getSymbol(b.type, b.state)} {b.text}
              </span>
            ))}
            {dayBullets.length > 3 && (
              <span style={{ color: 'var(--ink-light)' }}>
                {' '}+{dayBullets.length - 3}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
