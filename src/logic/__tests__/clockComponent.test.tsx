import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnalogClock } from '../../components/clock/AnalogClock';
import { DigitalClock } from '../../components/clock/DigitalClock';
import { TimelineJump } from '../../components/board/TimelineJump';

describe('AnalogClock component', () => {
  it('renders accessible hour and minute sliders', () => {
    render(<AnalogClock time={{ h: 4, m: 30 }} interactive={true} />);

    const hourHand = screen.getByLabelText('Hour hand');
    const minuteHand = screen.getByLabelText('Minute hand');

    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    expect(hourHand).toHaveAttribute('aria-valuenow', '4');
    expect(minuteHand).toHaveAttribute('aria-valuenow', '30');
  });

  it('renders only quarter numerals in quarters dialStyle and no numerals in ticks_only dialStyle', () => {
    const { container: quartersContainer } = render(
      <AnalogClock time={{ h: 4, m: 30 }} dialStyle="quarters" />
    );
    const quarterTexts = Array.from(quartersContainer.querySelectorAll('text')).map(
      (n) => n.textContent
    );
    expect(quarterTexts).toEqual(['3', '6', '9', '12']);

    const { container: ticksContainer } = render(
      <AnalogClock time={{ h: 4, m: 30 }} dialStyle="ticks_only" />
    );
    expect(ticksContainer.querySelectorAll('text').length).toBe(0);
  });

  it('renders 24-hour timetable formatting on DigitalClock and hides answers on TimelineJump', () => {
    render(<DigitalClock time={{ h: 7, m: 43, period: 'PM' }} mode="24h" />);
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', 'Digital time: 19:43');

    render(
      <TimelineJump
        departure={{ h: 10, m: 45 }}
        durationMinutes={105}
        direction="forward"
      />
    );
    expect(screen.getByText('10:45')).toBeInTheDocument();
    expect(screen.getByText('??:??')).toBeInTheDocument();
    expect(screen.queryByText('12:30')).not.toBeInTheDocument();
  });

  it('updates time via keyboard arrow keys', () => {
    const handleChange = vi.fn();
    render(
      <AnalogClock
        time={{ h: 4, m: 30 }}
        interactive={true}
        snapStep={5}
        onChange={handleChange}
      />
    );

    const minuteHand = screen.getByLabelText('Minute hand');
    minuteHand.focus();
    fireEvent.keyDown(minuteHand, { key: 'ArrowRight' });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ m: 35 })
    );

    const hourHand = screen.getByLabelText('Hour hand');
    hourHand.focus();
    fireEvent.keyDown(hourHand, { key: 'ArrowRight' });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ h: 5 })
    );
  });

  it('calls onChange when minute hand is dragged to 180 degrees (:30)', () => {
    const handleChange = vi.fn();
    render(
      <AnalogClock
        time={{ h: 4, m: 0 }}
        interactive={true}
        snapStep={5}
        mode="full"
        onChange={handleChange}
      />
    );

    const minuteHand = screen.getByLabelText('Minute hand');

    // Simulate pointerdown
    fireEvent.pointerDown(minuteHand, {
      button: 0,
      pointerId: 1,
      clientX: 200,
      clientY: 60, // near 12 o'clock
    });

    // Simulate pointermove to 6 o'clock (180 deg: x=200, y=350)
    fireEvent.pointerMove(minuteHand, {
      button: 0,
      pointerId: 1,
      clientX: 200,
      clientY: 350,
    });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ m: 30 })
    );
  });
});
