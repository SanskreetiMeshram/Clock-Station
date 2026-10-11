import type { ClockTime, Question } from '../types/game';
import { addMinutes, formatDigital, normalizeTime } from './clockMath';
import { LEVEL_CONFIGS } from './levels';
import { SeededRng } from './seededRng';

const TRAIN_NAMES = [
  'Mumbai Express',
  'Cheetah Superfast',
  'Toy Steamie',
  'Rainbow Flyer',
  'Sunrise Special',
  'Mountain Climber',
  'River Valley Rapid',
  'Starlight Cruiser',
  'Peacock Express',
  'Golden Arrow',
  'Island Hopper',
  'Skyline Rocket',
];

export function generateQuestionsForLevel(levelId: number, seed: number = 1000 + levelId): Question[] {
  const rng = new SeededRng(seed);
  const config = LEVEL_CONFIGS[levelId] || LEVEL_CONFIGS[1];
  const questions: Question[] = [];

  for (let i = 0; i < config.questionCount; i++) {
    const trainName = TRAIN_NAMES[(i + levelId * 3) % TRAIN_NAMES.length];
    const q = generateSingleQuestion(levelId, i, rng, trainName);
    questions.push(q);
  }

  return questions;
}

function generateSingleQuestion(
  levelId: number,
  index: number,
  rng: SeededRng,
  trainName: string
): Question {
  const qId = `lvl${levelId}-q${index + 1}`;
  const config = LEVEL_CONFIGS[levelId];

  switch (levelId) {
    case 1: {
      // Whole hours
      const h = rng.nextInt(1, 12);
      const target: ClockTime = { h, m: 0 };
      const initialH = ((h + rng.nextInt(2, 6) - 1) % 12) + 1;
      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: target,
        initialTime: { h: initialH, m: 0 },
        promptText: `${trainName} departs at ${target.h}:00`,
        readAloudText: `${trainName} departs at ${target.h} o'clock.`,
        clockMode: 'simple',
        snapStep: 15,
      };
    }

    case 2: {
      // Half past (:30)
      const h = rng.nextInt(1, 12);
      const target: ClockTime = { h, m: 30 };
      const initialH = ((h + rng.nextInt(1, 5) - 1) % 12) + 1;
      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: target,
        initialTime: { h: initialH, m: 0 },
        promptText: `${trainName} departs at ${target.h}:30 (half past ${target.h})`,
        readAloudText: `${trainName} departs at half past ${target.h}.`,
        clockMode: 'simple',
        snapStep: 15,
      };
    }

    case 3: {
      // Quarter past (:15) and quarter to (:45)
      const h = rng.nextInt(1, 12);
      const m = rng.choice([15, 45]);
      const target: ClockTime = { h, m };
      const desc = m === 15 ? `quarter past ${h}` : `quarter to ${h === 12 ? 1 : h + 1}`;
      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: target,
        initialTime: { h: 12, m: 0 },
        promptText: `${trainName} departs at ${formatDigital(target)} (${desc})`,
        readAloudText: `${trainName} departs at ${desc}.`,
        clockMode: 'simple',
        snapStep: 15,
      };
    }

    case 4: {
      // Any 5-minute mark
      const h = rng.nextInt(1, 12);
      const m = rng.nextInt(0, 11) * 5;
      const target: ClockTime = { h, m };
      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: target,
        initialTime: { h: 12, m: 0 },
        promptText: `${trainName} departs at ${formatDigital(target)}`,
        readAloudText: `${trainName} departs at ${formatDigital(target)}.`,
        clockMode: 'full',
        snapStep: 5,
      };
    }

    case 5: {
      // Every minute 1..59
      const h = rng.nextInt(1, 12);
      const m = rng.nextInt(1, 59);
      const target: ClockTime = { h, m };
      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: target,
        initialTime: { h: 12, m: 0 },
        promptText: `${trainName} departs at ${formatDigital(target)}`,
        readAloudText: `${trainName} departs at ${formatDigital(target)}.`,
        clockMode: 'full',
        snapStep: 1,
      };
    }

    case 6: {
      // Read mode: clock is shown, pick matching digital time from choices
      const h = rng.nextInt(1, 12);
      const m = rng.nextInt(0, 11) * 5;
      const target: ClockTime = { h, m };
      const choices = generateChoicesForReadMode(target, rng);
      return {
        id: qId,
        type: 'read_clock',
        trainName,
        targetTime: target,
        promptText: `What time does the station clock show for the ${trainName}?`,
        readAloudText: `What time does the station clock show?`,
        choices,
        clockMode: 'full',
        snapStep: 5,
      };
    }

    case 7: {
      // Journey Time I: elapsed time in whole or half hours (e.g. 1 hr, 2 hrs, 1h 30m)
      const depH = rng.nextInt(1, 10);
      const depM = rng.choice([0, 30]);
      const departure: ClockTime = { h: depH, m: depM };
      const durationHours = rng.choice([1, 2, 3]);
      const durationDelta = durationHours * 60;
      const arrival = addMinutes(departure, durationDelta);
      const durText = durationHours === 1 ? '1 hour' : `${durationHours} hours`;

      return {
        id: qId,
        type: 'journey_elapsed',
        trainName,
        departureTime: departure,
        durationMinutes: durationDelta,
        targetTime: arrival,
        initialTime: departure,
        promptText: `${trainName} leaves at ${formatDigital(departure)}. Journey takes ${durText}. When does it arrive?`,
        readAloudText: `${trainName} leaves at ${formatDigital(departure)}. Journey takes ${durText}. When does it arrive?`,
        clockMode: 'full',
        snapStep: 15,
      };
    }

    case 8: {
      // Journey Time II: elapsed time in 15, 20, 45, or 50 minutes, crossing the hour
      const depH = rng.nextInt(1, 11);
      const duration = rng.choice([15, 20, 45, 50]);
      // Ensure crossing the hour: departure.m + duration >= 60
      const minDepM = Math.max(0, 60 - duration);
      // Pick a 5-minute step >= minDepM
      const possibleDepM = [30, 35, 40, 45, 50].filter(m => m >= minDepM);
      const depM = rng.choice(possibleDepM.length > 0 ? possibleDepM : [45]);
      const departure: ClockTime = { h: depH, m: depM };
      const arrival = addMinutes(departure, duration);

      return {
        id: qId,
        type: 'journey_elapsed',
        trainName,
        departureTime: departure,
        durationMinutes: duration,
        targetTime: arrival,
        initialTime: departure,
        promptText: `${trainName} leaves at ${formatDigital(departure)}. Journey takes ${duration} minutes. When does it arrive?`,
        readAloudText: `${trainName} leaves at ${formatDigital(departure)}. Journey takes ${duration} minutes. When does it arrive?`,
        clockMode: 'full',
        snapStep: 5,
      };
    }

    case 9: {
      // Twin Clocks: alternate between setting analogue to match digital, and reading analogue for digital
      const subType = index % 2 === 0 ? 'twin_match' : 'read_clock';
      const h = rng.nextInt(1, 12);
      const m = rng.choice([0, 15, 30, 45, 20, 40]);
      const target: ClockTime = { h, m };

      if (subType === 'read_clock') {
        const choices = generateChoicesForReadMode(target, rng);
        return {
          id: qId,
          type: 'read_clock',
          trainName,
          targetTime: target,
          choices,
          promptText: `Match the twin clocks: What digital time matches the analogue clock?`,
          readAloudText: `What digital time matches the analogue clock?`,
          clockMode: 'full',
          snapStep: 5,
        };
      } else {
        return {
          id: qId,
          type: 'twin_match',
          trainName,
          targetTime: target,
          initialTime: { h: 12, m: 0 },
          promptText: `Set the analogue clock to match the digital board: ${formatDigital(target)}`,
          readAloudText: `Set the analogue clock to match ${formatDigital(target)}.`,
          clockMode: 'full',
          snapStep: 5,
        };
      }
    }

    case 10: {
      // Station Master Boss: 8 mixed questions across all skills
      const skillTypes = [1, 2, 3, 4, 6, 7, 8, 9];
      const delegatedLevel = skillTypes[index % skillTypes.length];
      const q = generateSingleQuestion(delegatedLevel, index, rng, trainName);
      return {
        ...q,
        id: qId,
        promptText: `⭐ Station Master Challenge: ${q.promptText}`,
      };
    }

    default:
      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: { h: 12, m: 0 },
        promptText: `${trainName} departs at 12:00`,
        readAloudText: `${trainName} departs at 12 o'clock.`,
        clockMode: config.mode,
        snapStep: config.snapStep,
      };
  }
}

/**
 * Generates 4 choices for read mode (1 correct + 3 clever distractors: swapped, off-by-5, off-by-1-hour).
 */
export function generateChoicesForReadMode(target: ClockTime, rng: SeededRng): ClockTime[] {
  const choices: ClockTime[] = [target];
  const keys = new Set<string>([`${target.h}:${target.m}`]);

  function tryAdd(candidate: ClockTime) {
    const norm = normalizeTime(candidate);
    const key = `${norm.h}:${norm.m}`;
    if (!keys.has(key)) {
      keys.add(key);
      choices.push(norm);
      return true;
    }
    return false;
  }

  // 1. Swapped hands distractor (e.g. h=3, m=15 -> swapped is h=3, m=15 so check diff)
  // Hand angle of m=15 is at 3, h at 3 is 90 deg -> minute = h * 5, hour = Math.floor(m / 5) || 12
  const swappedH = Math.round(target.m / 5) % 12 || 12;
  const swappedM = (target.h * 5) % 60;
  tryAdd({ h: swappedH, m: swappedM });

  // 2. Off by 5 minutes
  const delta5 = rng.choice([5, -5, 10]);
  tryAdd(addMinutes(target, delta5));

  // 3. Off by 1 hour
  const deltaH = rng.choice([1, -1, 2]);
  const newH = ((target.h + deltaH - 1 + 12) % 12) + 1;
  tryAdd({ h: newH, m: target.m });

  // Fallbacks if we don't have 4 choices yet
  let fallbackDelta = 15;
  while (choices.length < 4) {
    tryAdd(addMinutes(target, fallbackDelta));
    fallbackDelta += 15;
  }

  return rng.shuffle(choices.slice(0, 4));
}
