import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeChipsDrawer } from '../../components/clock/TimeChipsDrawer';

describe('TimeChipsDrawer component', () => {
  it('renders all 4 quick jump time chips', () => {
    const handleApply = vi.fn();
    render(<TimeChipsDrawer onApplyDeltaMinutes={handleApply} />);

    expect(screen.getByRole('button', { name: /time jump \+5 min/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /time jump \+15 min/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /time jump \+30 min/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /time jump \+1 hour/i })).toBeInTheDocument();
  });

  it('triggers onApplyDeltaMinutes with 15 when clicking +15 min chip', () => {
    const handleApply = vi.fn();
    render(<TimeChipsDrawer onApplyDeltaMinutes={handleApply} />);

    const chip15 = screen.getByRole('button', { name: /time jump \+15 min/i });
    fireEvent.click(chip15);

    expect(handleApply).toHaveBeenCalledWith(15);
  });

  it('triggers onApplyDeltaMinutes with 60 when pressing Enter on +1 hour chip', () => {
    const handleApply = vi.fn();
    render(<TimeChipsDrawer onApplyDeltaMinutes={handleApply} />);

    const chip60 = screen.getByRole('button', { name: /time jump \+1 hour/i });
    fireEvent.keyDown(chip60, { key: 'Enter' });

    expect(handleApply).toHaveBeenCalledWith(60);
  });
});
