import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BulletItem from '../components/BulletItem';
import type { BulletItem as BulletItemType } from '../types/bullet';

function makeBullet(overrides: Partial<BulletItemType> = {}): BulletItemType {
  return {
    id: 'test-1',
    type: 'task',
    state: 'open',
    text: 'Test task',
    date: '2026-03-28',
    createdAt: Date.now(),
    order: 1,
    ...overrides,
  };
}

describe('BulletItem', () => {
  it('cycles task state on symbol click: open → completed', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const bullet = makeBullet();

    render(<BulletItem bullet={bullet} onUpdate={onUpdate} onDelete={onDelete} />);

    const symbol = screen.getByRole('button');
    fireEvent.click(symbol);

    expect(onUpdate).toHaveBeenCalledWith('test-1', expect.objectContaining({
      state: 'completed',
    }));
  });

  it('does not cycle state for event type', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const bullet = makeBullet({ type: 'event' });

    render(<BulletItem bullet={bullet} onUpdate={onUpdate} onDelete={onDelete} />);

    const symbol = screen.getByRole('button');
    fireEvent.click(symbol);

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('enters edit mode on text click and saves on blur', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const bullet = makeBullet({ text: 'Original text' });

    render(<BulletItem bullet={bullet} onUpdate={onUpdate} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Original text'));

    const input = screen.getByDisplayValue('Original text');
    fireEvent.change(input, { target: { value: 'Updated text' } });
    fireEvent.blur(input);

    expect(onUpdate).toHaveBeenCalledWith('test-1', { text: 'Updated text' });
  });

  it('deletes on empty text blur', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const bullet = makeBullet({ text: 'To delete' });

    render(<BulletItem bullet={bullet} onUpdate={onUpdate} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('To delete'));

    const input = screen.getByDisplayValue('To delete');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(onDelete).toHaveBeenCalledWith('test-1');
  });

  it('cancels edit on Escape', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const bullet = makeBullet({ text: 'Keep this' });

    render(<BulletItem bullet={bullet} onUpdate={onUpdate} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Keep this'));

    const input = screen.getByDisplayValue('Keep this');
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Keep this')).toBeInTheDocument();
  });
});
