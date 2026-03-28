export type BulletType = 'task' | 'event' | 'note';
export type BulletState = 'open' | 'completed' | 'migrated';
export type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface BulletItem {
  id: string;
  type: BulletType;
  state: BulletState;
  text: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  completedAt?: number;
  migratedTo?: string;
  order: number;
}

export const BULLET_SYMBOLS: Record<BulletType, Record<BulletState | 'default', string>> = {
  task: {
    open: '\u2022',      // •
    completed: '\u00D7', // ×
    migrated: '>',
    default: '\u2022',
  },
  event: {
    open: '\u25CB',      // ○
    completed: '\u25CB',
    migrated: '\u25CB',
    default: '\u25CB',
  },
  note: {
    open: '\u2013',      // –
    completed: '\u2013',
    migrated: '\u2013',
    default: '\u2013',
  },
};

export function getSymbol(type: BulletType, state: BulletState): string {
  return BULLET_SYMBOLS[type][state];
}

export function nextTaskState(state: BulletState): BulletState {
  const cycle: BulletState[] = ['open', 'completed', 'migrated'];
  const idx = cycle.indexOf(state);
  return cycle[(idx + 1) % cycle.length];
}

export function nextBulletType(type: BulletType): BulletType {
  const cycle: BulletType[] = ['task', 'event', 'note'];
  const idx = cycle.indexOf(type);
  return cycle[(idx + 1) % cycle.length];
}
