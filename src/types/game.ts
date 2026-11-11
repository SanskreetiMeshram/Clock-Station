export type ClockTime = {
  h: number; // 1..12
  m: number; // 0..59
  period?: 'AM' | 'PM';
};

export type ClockMode = 'simple' | 'full';

export type DialStyle = 'full' | 'quarters' | 'ticks_only';

export type DifficultyTier = 'starter' | 'medium' | 'hard' | 'expert' | 'master';

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
  departureTime?: ClockTime; // For forward journey questions
  arrivalTime?: ClockTime; // For backward journey questions
  durationMinutes?: number; // For journey questions
  direction?: 'forward' | 'backward';
  legBreakdownText?: string; // Multi-step delay/run breakdown
  referenceTime?: ClockTime; // Reference digital board time in twin_match / twin_duration
  reference24h?: boolean; // Render twin board in 24-hour format
  boardLabel?: string; // Label above twin board
  allowVisualHints?: boolean; // Disable cheat overlays in harder stations
  promptText: string;
  readAloudText: string;
  choices?: ClockTime[]; // For read_clock or multiple choice
  clockMode: ClockMode;
  dialStyle?: DialStyle;
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
  dialStyle?: DialStyle;
  difficulty?: DifficultyTier;
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
