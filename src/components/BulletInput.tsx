import { useState, useRef } from 'react';
import type { BulletType } from '../types/bullet';
import { getSymbol, nextBulletType } from '../types/bullet';

interface BulletInputProps {
  date: string;
  onAdd: (type: BulletType, text: string, date: string) => void;
}

export default function BulletInput({ date, onAdd }: BulletInputProps) {
  const [active, setActive] = useState(false);
  const [type, setType] = useState<BulletType>('task');
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setActive(true);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(type, text.trim(), date);
      setText('');
      setType('task');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setText('');
      setActive(false);
    }
  };

  const handleBlur = () => {
    if (!text.trim()) {
      setActive(false);
      setType('task');
    }
  };

  const handleTypeClick = () => {
    setType(nextBulletType(type));
  };

  const symbol = getSymbol(type, 'open');

  return (
    <div
      className="flex items-center"
      style={{
        height: 'var(--grid-size)',
        marginTop: 'var(--grid-size)',
        opacity: active ? 1 : 0.5,
      }}
      onClick={() => !active && inputRef.current?.focus()}
    >
      <button
        onClick={active ? handleTypeClick : undefined}
        className="flex items-center justify-center text-sm bg-transparent border-none font-[inherit]"
        style={{
          width: 'var(--grid-size)',
          height: 'var(--grid-size)',
          flexShrink: 0,
          color: 'var(--ink-light)',
          cursor: active ? 'pointer' : 'default',
        }}
        tabIndex={-1}
      >
        {symbol}
      </button>
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={active ? '' : '새 항목 추가...'}
        className="bg-transparent border-none outline-none font-[inherit] text-sm w-full"
        style={{
          lineHeight: 'var(--grid-size)',
          paddingLeft: '8px',
          color: active ? 'var(--ink)' : 'var(--ink-light)',
          fontStyle: active ? 'normal' : 'italic',
        }}
      />
    </div>
  );
}
