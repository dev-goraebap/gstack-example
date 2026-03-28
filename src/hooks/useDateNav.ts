import { useState, useCallback } from 'react';
import { format, addDays, addWeeks, addMonths, parseISO } from 'date-fns';
import type { ViewMode } from '../types/bullet';

export function useDateNav() {
  const [currentDate, setCurrentDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd')
  );
  const [viewMode, setViewMode] = useState<ViewMode>('daily');

  const goNext = useCallback(() => {
    setCurrentDate((d) => {
      const parsed = parseISO(d);
      if (viewMode === 'daily') return format(addDays(parsed, 1), 'yyyy-MM-dd');
      if (viewMode === 'weekly') return format(addWeeks(parsed, 1), 'yyyy-MM-dd');
      return format(addMonths(parsed, 1), 'yyyy-MM-dd');
    });
  }, [viewMode]);

  const goPrev = useCallback(() => {
    setCurrentDate((d) => {
      const parsed = parseISO(d);
      if (viewMode === 'daily') return format(addDays(parsed, -1), 'yyyy-MM-dd');
      if (viewMode === 'weekly') return format(addWeeks(parsed, -1), 'yyyy-MM-dd');
      return format(addMonths(parsed, -1), 'yyyy-MM-dd');
    });
  }, [viewMode]);

  const goToday = useCallback(() => {
    setCurrentDate(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  const goToDate = useCallback((date: string, mode?: ViewMode) => {
    setCurrentDate(date);
    if (mode) setViewMode(mode);
  }, []);

  return {
    currentDate,
    viewMode,
    setViewMode,
    goNext,
    goPrev,
    goToday,
    goToDate,
  };
}
