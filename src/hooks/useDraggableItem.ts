import { useState, useRef, useCallback, useEffect } from 'react';

export interface DropTargetRect {
  id: string;
  rect: DOMRect;
}

export interface UseDraggableItemOptions<T> {
  data: T;
  disabled?: boolean;
  onDragStart?: () => void;
  onDrop?: (targetId: string, data: T) => void;
  onCancel?: () => void;
  onClickFallback?: (data: T) => void;
  dropTargetSelector?: string; // CSS selector to query candidate drop target elements
}

export interface DragPosition {
  x: number;
  y: number;
}

export function useDraggableItem<T>({
  data,
  disabled = false,
  onDragStart,
  onDrop,
  onCancel,
  onClickFallback,
  dropTargetSelector = '[data-droptarget]',
}: UseDraggableItemOptions<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<DragPosition>({ x: 0, y: 0 });
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);

  const startPointerRef = useRef<{ x: number; y: number } | null>(null);
  const grabOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const justTriggeredTapRef = useRef(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Helper to query all active drop targets on screen
  const getDropTargets = useCallback((): DropTargetRect[] => {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(dropTargetSelector);
    const targets: DropTargetRect[] = [];
    elements.forEach((el) => {
      const id = el.getAttribute('data-droptarget') || 'default';
      targets.push({ id, rect: el.getBoundingClientRect() });
    });
    return targets;
  }, [dropTargetSelector]);

  const checkHoveredTarget = useCallback(
    (clientX: number, clientY: number): string | null => {
      const targets = getDropTargets();
      for (const t of targets) {
        if (
          clientX >= t.rect.left &&
          clientX <= t.rect.right &&
          clientY >= t.rect.top &&
          clientY <= t.rect.bottom
        ) {
          return t.id;
        }
      }
      return null;
    },
    [getDropTargets]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;

      const el = elementRef.current || (e.currentTarget as HTMLDivElement);
      const rect = el.getBoundingClientRect();

      startPointerRef.current = { x: e.clientX, y: e.clientY };
      grabOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      hasMovedRef.current = false;

      // Capture pointer
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback in non-standard test environments
      }
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!startPointerRef.current) return;

      const dist = Math.hypot(
        e.clientX - startPointerRef.current.x,
        e.clientY - startPointerRef.current.y
      );

      // Start drag once moved past 5px threshold
      if (!hasMovedRef.current && dist > 5) {
        hasMovedRef.current = true;
        setIsDragging(true);
        onDragStart?.();
      }

      if (hasMovedRef.current) {
        setDragPosition({
          x: e.clientX - grabOffsetRef.current.x,
          y: e.clientY - grabOffsetRef.current.y,
        });

        const hovered = checkHoveredTarget(e.clientX, e.clientY);
        setActiveTargetId(hovered);
      }
    },
    [checkHoveredTarget, onDragStart]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!startPointerRef.current) return;

      const el = elementRef.current || (e.currentTarget as HTMLDivElement);
      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback
      }

      if (hasMovedRef.current) {
        const hovered = checkHoveredTarget(e.clientX, e.clientY);
        if (hovered && onDrop) {
          onDrop(hovered, data);
        } else {
          onCancel?.();
        }
      } else {
        // Considered a clean tap/click
        justTriggeredTapRef.current = true;
        onClickFallback?.(data);
        setTimeout(() => {
          justTriggeredTapRef.current = false;
        }, 100);
      }

      startPointerRef.current = null;
      hasMovedRef.current = false;
      setIsDragging(false);
      setActiveTargetId(null);
    },
    [checkHoveredTarget, data, onClickFallback, onDrop, onCancel]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = elementRef.current || (e.currentTarget as HTMLDivElement);
      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback
      }
      startPointerRef.current = null;
      hasMovedRef.current = false;
      setIsDragging(false);
      setActiveTargetId(null);
      onCancel?.();
    },
    [onCancel]
  );

  // Clean up if unmounted mid-drag
  useEffect(() => {
    return () => {
      startPointerRef.current = null;
    };
  }, []);

  return {
    elementRef,
    isDragging,
    dragPosition,
    activeTargetId,
    dragProps: {
      ref: elementRef,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onClick: (_e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (!hasMovedRef.current && !justTriggeredTapRef.current) {
          onClickFallback?.(data);
        }
      },
      style: {
        touchAction: 'none' as const,
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
      },
    },
  };
}
