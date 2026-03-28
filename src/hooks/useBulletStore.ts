import { useState, useEffect, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { nanoid } from 'nanoid';
import type { BulletItem, BulletType } from '../types/bullet';

const STORAGE_KEY = 'bullets';

export function useBulletStore() {
  const [bullets, setBullets] = useState<BulletItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    get<BulletItem[]>(STORAGE_KEY)
      .then((data) => {
        setBullets(data ?? []);
        setLoaded(true);
      })
      .catch(() => {
        setStorageError(true);
        setLoaded(true);
      });
  }, []);

  const persist = useCallback(async (newBullets: BulletItem[]) => {
    try {
      await set(STORAGE_KEY, newBullets);
    } catch {
      setStorageError(true);
    }
  }, []);

  const addBullet = useCallback((
    type: BulletType,
    text: string,
    date: string,
  ) => {
    const newBullet: BulletItem = {
      id: nanoid(),
      type,
      state: 'open',
      text,
      date,
      createdAt: Date.now(),
      order: Date.now(),
    };
    setBullets((prev) => {
      const next = [...prev, newBullet];
      persist(next);
      return next;
    });
    return newBullet;
  }, [persist]);

  const updateBullet = useCallback((id: string, updates: Partial<Omit<BulletItem, 'id'>>) => {
    setBullets((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteBullet = useCallback((id: string) => {
    setBullets((prev) => {
      const next = prev.filter((b) => b.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const getBulletsByDate = useCallback((date: string) => {
    return bullets
      .filter((b) => b.date === date)
      .sort((a, b) => a.order - b.order);
  }, [bullets]);

  const getBulletsByDateRange = useCallback((start: string, end: string) => {
    return bullets
      .filter((b) => b.date >= start && b.date <= end)
      .sort((a, b) => a.order - b.order);
  }, [bullets]);

  return {
    bullets,
    loaded,
    storageError,
    addBullet,
    updateBullet,
    deleteBullet,
    getBulletsByDate,
    getBulletsByDateRange,
  };
}
