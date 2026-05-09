import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ComboboxInputProps {
  suggestions: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  multi?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ComboboxInput({
  suggestions,
  value,
  onChange,
  placeholder,
  multi = false,
  className = '',
  style,
}: ComboboxInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentSearchTerm = () => {
    if (!multi) return value;
    const parts = value.split(',');
    return parts[parts.length - 1].trimLeft(); // Keep leading space if typed, but trim left for logic is tricky. Let's just return the last part.
  };

  const getFilteredSuggestions = () => {
    const term = getCurrentSearchTerm().trim().toLowerCase();
    if (!term) return suggestions;
    return suggestions.filter(s => s.toLowerCase().includes(term));
  };

  const filtered = getFilteredSuggestions();

  const handleSelect = (suggestion: string) => {
    if (multi) {
      const parts = value.split(',');
      parts.pop(); // Remove the current partial term
      const prefix = parts.join(',');
      const newVal = prefix ? `${prefix}, ${suggestion}, ` : `${suggestion}, `;
      onChange(newVal);
    } else {
      onChange(suggestion);
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
      scrollToIndex(focusedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
      scrollToIndex(focusedIndex - 1);
    } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < filtered.length) {
      e.preventDefault();
      handleSelect(filtered[focusedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!listRef.current || index < 0 || index >= filtered.length) return;
    const list = listRef.current;
    const item = list.children[index] as HTMLElement;
    if (!item) return;
    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    const listScroll = list.scrollTop;
    const listHeight = list.clientHeight;

    if (itemTop < listScroll) {
      list.scrollTop = itemTop;
    } else if (itemBottom > listScroll + listHeight) {
      list.scrollTop = itemBottom - listHeight;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} style={{ color: '#14F195', fontWeight: 'bold' }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const searchTerm = getCurrentSearchTerm().trim();

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className={className}
        value={value}
        placeholder={placeholder}
        style={{ ...style, width: '100%' }}
        onChange={e => {
          onChange(e.target.value);
          setIsOpen(true);
          setFocusedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '240px', // Roughly 6 items (approx 40px each)
            overflowY: 'auto',
            background: '#0d0d0d',
            border: '1px solid #333',
            borderTop: 'none',
            zIndex: 100,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: '0.85rem'
          }}
        >
          {filtered.map((s, i) => (
            <li
              key={s}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setFocusedIndex(i)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                background: focusedIndex === i ? 'rgba(20,241,149,0.1)' : 'transparent',
                color: '#fff',
                borderBottom: i < filtered.length - 1 ? '1px solid #1a1a1a' : 'none',
                transition: 'background 0.1s'
              }}
            >
              {highlightMatch(s, searchTerm)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
