import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlayScreen } from '../../components/screens/PlayScreen';

describe('PlayScreen interactive gameplay', () => {
  it('pressing Go with a wrong time triggers not yet state without advancing', async () => {
    const handleLevelComplete = vi.fn();
    const handlePause = vi.fn();
    const handleRecordMistake = vi.fn();
    const dummyFn = vi.fn();

    render(
      <PlayScreen
        levelId={1}
        onLevelComplete={handleLevelComplete}
        onPause={handlePause}
        onRecordMistake={handleRecordMistake}
        isMuted={true}
        onToggleMute={dummyFn}
        onToggleTextSize={dummyFn}
        totalStars={0}
        showDigitalBubble={true}
        playTick={dummyFn}
        playWhistle={dummyFn}
        playChuff={dummyFn}
        playBoing={dummyFn}
      />
    );

    // Initial question is loaded. Carriage 1 is active.
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');

    // Press "Go! 🚂" with default initial clock time (which is intentionally wrong)
    const goButton = screen.getByRole('button', { name: /send train/i });
    fireEvent.click(goButton);

    // Level complete should not have been called
    expect(handleLevelComplete).not.toHaveBeenCalled();

    // Mistake should be recorded
    await waitFor(() => {
      expect(handleRecordMistake).toHaveBeenCalled();
    });

    // The carriage progress should remain on 1 (not advanced)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });
});
