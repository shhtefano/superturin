import { useState, useEffect } from 'react';

export function useMenuKeyboard(
  itemCount: number,
  onConfirm: (index: number) => void,
  onCancel?: () => void,
  initialIndex: number = 0
) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigazione verso l'alto
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
      }
      // Navigazione verso il basso
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
      }
      // Conferma selezione
      else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onConfirm(selectedIndex);
      }
      // Indietro / chiudi
      else if (e.code === 'Escape' && onCancel) {
        e.preventDefault();
        onCancel();
      }
      // Scorciatoia rapida da tastiera con i tasti 1, 2, 3, 4...
      else if (e.code.startsWith('Digit')) {
        const num = parseInt(e.code.replace('Digit', ''), 10);
        if (num >= 1 && num <= itemCount) {
          e.preventDefault();
          const targetIdx = num - 1;
          setSelectedIndex(targetIdx);
          onConfirm(targetIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemCount, onConfirm, onCancel, selectedIndex]);

  return { selectedIndex, setSelectedIndex };
}
