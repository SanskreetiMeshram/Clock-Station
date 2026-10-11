export type ClockTime = {
  h: number; // 1..12
  m: number; // 0..59
  period?: 'AM' | 'PM';
};

export type ClockMode = 'simple' | 'full';

export type QuestionType =
  | 'set_clock'
  | 'read_clock'
  | 'journey_elapsed'
  | 'twin_match'
  | 'twin_duration';

export interface Question {
  id: string;
  type: QuestionType;
  trainName: string;
  targetTime: ClockTime;
  initialTime?: ClockTime; // Starting position of clock hands
  departureTime?: ClockTime; // For journey questions
  durationMinutes?: number; // For journey questions
  promptText: string;
  readAloudText: string;
  choices?: ClockTime[]; // For read_clock or multiple choice
  clockMode: ClockMode;
  snapStep: 1 | 5 | 15;
}

export type MistakeCategory =
  | 'correct'
  | 'hands_swapped'
  | 'hour_off'
  | 'minute_off'
  | 'off_by_five'
  | 'mirror'
  | 'elapsed_calculation_error'
  | 'unknown';

export interface MistakeDiagnostic {
  category: MistakeCategory;
  message: string;
  highlightHand?: 'hour' | 'minute' | 'both';
  showMultiplierHint?: boolean;
  showQuarterSlice?: boolean;
  showHalfSlice?: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  accentColor: string;
  locomotiveStyle: LocomotiveStyle;
  snapStep: 1 | 5 | 15;
  mode: ClockMode;
  questionCount: number;
  questionType: QuestionType;
}

export type LocomotiveStyle =
  | 'steam_red'
  | 'mountain_green'
  | 'toy_yellow'
  | 'diesel_blue'
  | 'bullet_purple'
  | 'metro_gold'
  | 'cargo_orange'
  | 'electric_teal'
  | 'star_silver'
  | 'royal_grand';

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0..3
  bestAccuracy: number;
  attemptsCount: number;
}

export interface MistakeRecord {
  levelId: number;
  category: MistakeCategory;
  target: ClockTime;
  answer: ClockTime;
  timestamp: number;
}

export interface UserProgressState {
  currentLevel: number;
  levels: Record<number, LevelProgress>;
  mistakeHistory: MistakeRecord[];
  soundMuted: boolean;
  largeText: boolean;
  showDigitalBubble: boolean;
}
