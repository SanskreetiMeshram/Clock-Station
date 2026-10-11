import type { LevelConfig } from '../types/game';

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    name: "O'clock Express",
    subtitle: "Whole Hours",
    accentColor: '#FF5A5F', // Train Red
    locomotiveStyle: 'steam_red',
    snapStep: 15,
    mode: 'simple',
    questionCount: 6,
    questionType: 'set_clock',
  },
  2: {
    id: 2,
    name: "Half Past Halt",
    subtitle: "Half Past (:30)",
    accentColor: '#3DDC84', // Grass Green
    locomotiveStyle: 'mountain_green',
    snapStep: 15,
    mode: 'simple',
    questionCount: 6,
    questionType: 'set_clock',
  },
  3: {
    id: 3,
    name: "Quarter Junction",
    subtitle: "Quarter Past & Quarter To",
    accentColor: '#FFD23F', // Sunny Yellow
    locomotiveStyle: 'toy_yellow',
    snapStep: 15,
    mode: 'simple',
    questionCount: 6,
    questionType: 'set_clock',
  },
  4: {
    id: 4,
    name: "Five-Minute Line",
    subtitle: "Five-Minute Intervals",
    accentColor: '#3A86FF', // Ocean Blue
    locomotiveStyle: 'diesel_blue',
    snapStep: 5,
    mode: 'full',
    questionCount: 6,
    questionType: 'set_clock',
  },
  5: {
    id: 5,
    name: "Every-Minute Central",
    subtitle: "Every Single Minute",
    accentColor: '#8338EC', // Grape Purple
    locomotiveStyle: 'bullet_purple',
    snapStep: 1,
    mode: 'full',
    questionCount: 6,
    questionType: 'set_clock',
  },
  6: {
    id: 6,
    name: "Read the Clock",
    subtitle: "Match the Digital Time",
    accentColor: '#FF9F1C', // Orange
    locomotiveStyle: 'metro_gold',
    snapStep: 5,
    mode: 'full',
    questionCount: 6,
    questionType: 'read_clock',
  },
  7: {
    id: 7,
    name: "Journey Time I",
    subtitle: "Hours of Travel",
    accentColor: '#10B981', // Emerald
    locomotiveStyle: 'cargo_orange',
    snapStep: 15,
    mode: 'full',
    questionCount: 6,
    questionType: 'journey_elapsed',
  },
  8: {
    id: 8,
    name: "Journey Time II",
    subtitle: "Hour-Crossing Journeys",
    accentColor: '#06B6D4', // Cyan
    locomotiveStyle: 'electric_teal',
    snapStep: 5,
    mode: 'full',
    questionCount: 6,
    questionType: 'journey_elapsed',
  },
  9: {
    id: 9,
    name: "Twin Clocks",
    subtitle: "Side-by-Side Matching",
    accentColor: '#6366F1', // Indigo
    locomotiveStyle: 'star_silver',
    snapStep: 5,
    mode: 'full',
    questionCount: 6,
    questionType: 'twin_match',
  },
  10: {
    id: 10,
    name: "Station Master",
    subtitle: "Grand Station Finale",
    accentColor: '#F59E0B', // Amber Gold
    locomotiveStyle: 'royal_grand',
    snapStep: 5,
    mode: 'full',
    questionCount: 8,
    questionType: 'set_clock', // Mixed inside generator
  },
};
