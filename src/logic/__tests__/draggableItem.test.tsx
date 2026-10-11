import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { useDraggableItem } from '../../hooks/useDraggableItem';

const TestDraggable: React.FC<{
  data: string;
  onDrop?: (target: string, data: string) => void;
  onClickFallback?: (data: string) => void;
}> = ({ data, onDrop, onClickFallback }) => {
  const { isDragging, dragProps } = useDraggableItem<string>({
    data,
    onDrop,
    onClickFallback,
  });

  return (
    <div>
      <div data-droptarget="test-drop-zone" style={{ width: 100, height: 100 }}>
        Drop Here
      </div>
      <div {...dragProps} data-testid="draggable-card">
        {isDragging ? 'DRAGGING' : 'IDLE'}
      </div>
    </div>
  );
};

describe('useDraggableItem hook', () => {
  it('calls onClickFallback when clicked without moving past threshold', () => {
    const handleFallback = vi.fn();
    render(<TestDraggable data="token-123" onClickFallback={handleFallback} />);

    const card = screen.getByTestId('draggable-card');

    fireEvent.pointerDown(card, { button: 0, clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerUp(card, { button: 0, clientX: 51, clientY: 51, pointerId: 1 });

    expect(handleFallback).toHaveBeenCalledWith('token-123');
  });

  it('enters dragging state when moved past threshold', () => {
    render(<TestDraggable data="token-456" />);

    const card = screen.getByTestId('draggable-card');

    fireEvent.pointerDown(card, { button: 0, clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerMove(card, { button: 0, clientX: 90, clientY: 90, pointerId: 1 });

    expect(screen.getByText('DRAGGING')).toBeInTheDocument();

    fireEvent.pointerUp(card, { button: 0, clientX: 90, clientY: 90, pointerId: 1 });
    expect(screen.getByText('IDLE')).toBeInTheDocument();
  });
});
