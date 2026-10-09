'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AntiInspectShield() {
  const pathname = usePathname();

  useEffect(() => {
    // Do not block inspect or copying inside the Admin Panel
    if (pathname && pathname.startsWith('/admin')) {
      return;
    }

    const isInteractiveElement = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return !!(
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[contenteditable="true"]') ||
        target.closest('.allow-select')
      );
    };

    // 1. Disable Right-Click Context Menu (Except inside interactive inputs)
    const handleContextMenu = (e: MouseEvent) => {
      if (isInteractiveElement(e.target)) return true;
      e.preventDefault();
      return false;
    };

    // 2. Prevent Text Selection on Public Content (Allowed in input fields)
    const handleSelectStart = (e: Event) => {
      if (isInteractiveElement(e.target)) return true;
      e.preventDefault();
      return false;
    };

    // 3. Prevent Copy & Cut Commands on Public Content
    const handleCopyCut = (e: ClipboardEvent) => {
      if (isInteractiveElement(e.target)) return true;
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.clearData();
      }
      return false;
    };

    // 4. Prevent Dragging Images & Text
    const handleDragStart = (e: DragEvent) => {
      if (isInteractiveElement(e.target)) return true;
      e.preventDefault();
      return false;
    };

    // 5. Block Copy/Select Shortcuts & Inspect DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = isInteractiveElement(e.target);

      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + I (Inspect) or Cmd + Option + I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + J (Console) or Cmd + Option + J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + C (Element selector) or Cmd + Option + C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + U (View Source) or Cmd + Option + U
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Save page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // If user is NOT in an input/textarea, block Copy, Cut, Select All & Print
      if (!isInput) {
        // Ctrl/Cmd + C (Copy)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.keyCode === 67)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl/Cmd + A (Select All)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A' || e.keyCode === 65)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl/Cmd + X (Cut)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'X' || e.keyCode === 88)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl/Cmd + P (Print to PDF)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('selectstart', handleSelectStart, { capture: true });
    window.addEventListener('copy', handleCopyCut, { capture: true });
    window.addEventListener('cut', handleCopyCut, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('selectstart', handleSelectStart, { capture: true });
      window.removeEventListener('copy', handleCopyCut, { capture: true });
      window.removeEventListener('cut', handleCopyCut, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [pathname]);

  return null;
}
