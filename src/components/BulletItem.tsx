import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BulletItem as BulletItemType } from '../types/bullet';
import { getSymbol, nextTaskState } from '../types/bullet';

interface BulletItemProps {
  bullet: BulletItemType;
  onUpdate: (id: string, updates: Partial<BulletItemType>) => void;
  onDelete: (id: string) => void;
}

export default function BulletItem({ bullet, onUpdate, onDelete }: BulletItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(bullet.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSymbolClick = () => {
    if (bullet.type !== 'task') return;
    const newState = nextTaskState(bullet.state);
    onUpdate(bullet.id, {
      state: newState,
      completedAt: newState === 'completed' ? Date.now() : undefined,
    });
  };

  const handleTextClick = () => {
    setEditText(bullet.text);
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (editText.trim() === '') {
      onDelete(bullet.id);
    } else if (editText !== bullet.text) {
      onUpdate(bullet.id, { text: editText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditText(bullet.text);
      setEditing(false);
    }
  };

  const symbol = getSymbol(bullet.type, bullet.state);
  const isCompleted = bullet.type === 'task' && bullet.state === 'completed';
  const isMigrated = bullet.type === 'task' && bullet.state === 'migrated';

  // Stable rotation based on id hash, not Math.random()
  const rotation = bullet.id.charCodeAt(0) % 2 === 0 ? -0.3 : 0.2;

  return (
    <div
      className="flex items-center"
      style={{
        minHeight: 'calc(var(--grid-size) * 1.25)',
        marginBottom: '3px',
        paddingLeft: '4px',
      }}
    >
      <button
        onClick={handleSymbolClick}
        className="flex items-center justify-center bg-transparent border-none font-[inherit]"
        style={{
          width: 'var(--grid-size)',
          height: 'var(--grid-size)',
          flexShrink: 0,
          fontSize: '15px',
          cursor: bullet.type === 'task' ? 'pointer' : 'default',
          color: isCompleted ? 'var(--complete-green)' : isMigrated ? 'var(--ink-blue)' : 'var(--ink)',
          fontWeight: isCompleted ? 'bold' : 'normal',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={`${bullet.state}-${symbol}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {symbol}
          </motion.span>
        </AnimatePresence>
      </button>

      {editing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none font-[inherit]"
          style={{
            fontSize: '15px',
            lineHeight: '1.6',
            paddingLeft: '10px',
            color: 'var(--ink)',
            width: '100%',
          }}
        />
      ) : (
        <span
          onClick={handleTextClick}
          className="cursor-text"
          style={{
            fontSize: '15px',
            lineHeight: '1.6',
            paddingLeft: '10px',
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted || isMigrated ? 'var(--ink-light)' : 'var(--ink)',
            fontStyle: isMigrated ? 'italic' : 'normal',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {bullet.text}
        </span>
      )}
    </div>
  );
}
