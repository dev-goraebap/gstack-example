import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DailyLog from '../components/DailyLog';
import type { BulletItem } from '../types/bullet';

function makeBullet(overrides: Partial<BulletItem> = {}): BulletItem {
  return {
    id: `test-${Math.random()}`,
    type: 'task',
    state: 'open',
    text: 'Test',
    date: '2026-03-28',
    createdAt: Date.now(),
    order: Date.now(),
    ...overrides,
  };
}

describe('DailyLog', () => {
  it('groups bullets by type', () => {
    const bullets: BulletItem[] = [
      makeBullet({ type: 'task', text: 'Task 1', order: 1 }),
      makeBullet({ type: 'event', text: 'Event 1', order: 2 }),
      makeBullet({ type: 'note', text: 'Note 1', order: 3 }),
      makeBullet({ type: 'task', text: 'Task 2', order: 4 }),
    ];

    render(
      <DailyLog
        date="2026-03-28"
        bullets={bullets}
        onAdd={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('TASKS')).toBeInTheDocument();
    expect(screen.getByText('EVENTS')).toBeInTheDocument();
    expect(screen.getByText('NOTES')).toBeInTheDocument();
  });

  it('shows empty state message when no bullets', () => {
    render(
      <DailyLog
        date="2026-03-28"
        bullets={[]}
        onAdd={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('오늘 항목이 없습니다')).toBeInTheDocument();
  });

  it('renders bullets in the order provided', () => {
    const bullets: BulletItem[] = [
      makeBullet({ type: 'task', text: 'First', order: 1 }),
      makeBullet({ type: 'task', text: 'Second', order: 2 }),
      makeBullet({ type: 'task', text: 'Third', order: 3 }),
    ];

    render(
      <DailyLog
        date="2026-03-28"
        bullets={bullets}
        onAdd={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const taskTexts = screen.getAllByText(/First|Second|Third/);
    expect(taskTexts[0].textContent).toBe('First');
    expect(taskTexts[1].textContent).toBe('Second');
    expect(taskTexts[2].textContent).toBe('Third');
  });
});
