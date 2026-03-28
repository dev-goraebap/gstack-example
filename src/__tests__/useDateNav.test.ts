import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { useDateNav } from '../hooks/useDateNav';

describe('useDateNav', () => {
  it('goNext advances by 1 day in daily mode', () => {
    const { result } = renderHook(() => useDateNav());
    const today = result.current.currentDate;

    act(() => {
      result.current.goNext();
    });

    const expected = format(addDays(new Date(today), 1), 'yyyy-MM-dd');
    expect(result.current.currentDate).toBe(expected);
  });

  it('goNext advances by 1 week in weekly mode', () => {
    const { result } = renderHook(() => useDateNav());
    const today = result.current.currentDate;

    act(() => {
      result.current.setViewMode('weekly');
    });

    act(() => {
      result.current.goNext();
    });

    const expected = format(addWeeks(new Date(today), 1), 'yyyy-MM-dd');
    expect(result.current.currentDate).toBe(expected);
  });

  it('goNext advances by 1 month in monthly mode', () => {
    const { result } = renderHook(() => useDateNav());
    const today = result.current.currentDate;

    act(() => {
      result.current.setViewMode('monthly');
    });

    act(() => {
      result.current.goNext();
    });

    const expected = format(addMonths(new Date(today), 1), 'yyyy-MM-dd');
    expect(result.current.currentDate).toBe(expected);
  });

  it('goToday resets to current date', () => {
    const { result } = renderHook(() => useDateNav());

    act(() => {
      result.current.goNext();
      result.current.goNext();
    });

    act(() => {
      result.current.goToday();
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    expect(result.current.currentDate).toBe(today);
  });
});
