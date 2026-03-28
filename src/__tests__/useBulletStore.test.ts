import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { del } from 'idb-keyval';
import { useBulletStore } from '../hooks/useBulletStore';

beforeEach(async () => {
  await del('bullets');
});

describe('useBulletStore', () => {
  it('initializes with empty array on first load', async () => {
    const { result } = renderHook(() => useBulletStore());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(result.current.loaded).toBe(true);
    expect(result.current.bullets).toEqual([]);
  });

  it('adds a bullet and persists', async () => {
    const { result } = renderHook(() => useBulletStore());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    act(() => {
      result.current.addBullet('task', 'Test task', '2026-03-28');
    });

    expect(result.current.bullets).toHaveLength(1);
    expect(result.current.bullets[0].text).toBe('Test task');
    expect(result.current.bullets[0].type).toBe('task');
    expect(result.current.bullets[0].state).toBe('open');
    expect(result.current.bullets[0].date).toBe('2026-03-28');
  });

  it('updates a bullet', async () => {
    const { result } = renderHook(() => useBulletStore());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    act(() => {
      result.current.addBullet('task', 'Original', '2026-03-28');
    });

    const id = result.current.bullets[0].id;

    act(() => {
      result.current.updateBullet(id, { state: 'completed', completedAt: Date.now() });
    });

    expect(result.current.bullets[0].state).toBe('completed');
    expect(result.current.bullets[0].completedAt).toBeDefined();
  });

  it('deletes a bullet', async () => {
    const { result } = renderHook(() => useBulletStore());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    act(() => {
      result.current.addBullet('task', 'To delete', '2026-03-28');
    });

    const id = result.current.bullets[0].id;

    act(() => {
      result.current.deleteBullet(id);
    });

    expect(result.current.bullets).toHaveLength(0);
  });

  it('filters by date', async () => {
    const { result } = renderHook(() => useBulletStore());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    act(() => {
      result.current.addBullet('task', 'Day 1', '2026-03-28');
      result.current.addBullet('task', 'Day 2', '2026-03-29');
      result.current.addBullet('event', 'Day 1 event', '2026-03-28');
    });

    const day1 = result.current.getBulletsByDate('2026-03-28');
    expect(day1).toHaveLength(2);
    expect(day1[0].text).toBe('Day 1');

    const day2 = result.current.getBulletsByDate('2026-03-29');
    expect(day2).toHaveLength(1);
  });

  it('handles update of nonexistent id gracefully', async () => {
    const { result } = renderHook(() => useBulletStore());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    act(() => {
      result.current.addBullet('task', 'Existing', '2026-03-28');
    });

    act(() => {
      result.current.updateBullet('nonexistent-id', { text: 'Changed' });
    });

    expect(result.current.bullets).toHaveLength(1);
    expect(result.current.bullets[0].text).toBe('Existing');
  });
});
