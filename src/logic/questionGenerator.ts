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
      // Every-Minute Central: tricky non-5 minutes with "before/to" & "past" clues, no digital bubble
      const subType = index % 3;
      let target: ClockTime;
      let promptText: string;
      let readAloudText: string;

      if (subType === 0) {
        // Reverse mental subtraction: "X minutes before/to Y"
        const beforeMin = pickNonFiveMinute(rng, 2, 24);
        const nextH = rng.nextInt(1, 12);
        const targetH = nextH === 1 ? 12 : nextH - 1;
        target = { h: targetH, m: 60 - beforeMin };
        const preposition = rng.choice(['before', 'to']);
        promptText = `${trainName} departs ${beforeMin} minutes ${preposition} ${nextH}`;
        readAloudText = `${trainName} departs ${beforeMin} minutes ${preposition} ${nextH}.`;
      } else if (subType === 1) {
        // High-minute hour-creep zone (36..59, non-multiple of 5)
        const h = rng.nextInt(1, 12);
        const m = pickNonFiveMinute(rng, 36, 59);
        target = { h, m };
        promptText = `${trainName} departs at ${formatDigital(target)}`;
        readAloudText = `${trainName} departs at ${formatDigital(target)}.`;
      } else {
        // Verbal "minutes past" clue
        const h = rng.nextInt(1, 12);
        const m = pickNonFiveMinute(rng, 2, 29);
        target = { h, m };
        promptText = `${trainName} departs ${m} minutes past ${h}`;
        readAloudText = `${trainName} departs ${m} minutes past ${h}.`;
      }

      return {
        id: qId,
        type: 'set_clock',
        trainName,
        targetTime: target,
        initialTime: pickDistinctInitialTime(rng, target),
        promptText,
        readAloudText,
        clockMode: 'full',
        dialStyle: 'full',
        allowVisualHints: true,
        snapStep: 1,
      };
    }

    case 6: {
      // Read the Clock (Hard): exact 1-minute precision + hour-creep / +-1 min close traps
      const h = rng.nextInt(1, 12);
      const m =
        index % 2 === 0
          ? pickNonFiveMinute(rng, 36, 59)
          : pickNonFiveMinute(rng, 1, 34);
      const target: ClockTime = { h, m };
      const choices = generateChoicesForReadMode(target, rng, true);
      return {
        id: qId,
        type: 'read_clock',
        trainName,
        targetTime: target,
        promptText: `Read the exact minute! What time is shown for ${trainName}?`,
        readAloudText: `Read the exact minute. What time is shown for ${trainName}?`,
        choices,
        clockMode: 'full',
        dialStyle: 'full',
        allowVisualHints: true,
        snapStep: 1,
      };
    }

    case 7: {
      // Journey Time I (Hard): compound hours+minutes wrapping 12, and reverse departure trips
      const isBackward = index % 2 === 1;
      const duration = rng.choice([85, 95, 105, 135, 145, 165, 195]);
      const durText = formatDurationVerbose(duration);

      if (isBackward) {
        const arrH = rng.choice([12, 1, 2, 3]);
        const arrM = rng.choice([5, 10, 15, 20, 25, 35]);
        const arrival: ClockTime = { h: arrH, m: arrM };
        const departure = addMinutes(arrival, -duration);
        return {
          id: qId,
          type: 'journey_elapsed',
          trainName,
          arrivalTime: arrival,
          durationMinutes: duration,
          direction: 'backward',
          targetTime: departure,
          initialTime: arrival,
          promptText: `${trainName} arrives at ${formatDigital(arrival)} after a ${durText} trip. When did it leave?`,
          readAloudText: `${trainName} arrives at ${formatDigital(arrival)} after a ${durText} trip. When did it leave?`,
          clockMode: 'full',
          dialStyle: 'full',
          allowVisualHints: false,
          snapStep: 5,
        };
      }

      const depH = rng.choice([9, 10, 11, 12]);
      const depM = rng.choice([15, 25, 35, 40, 45, 50, 55]);
      const departure: ClockTime = { h: depH, m: depM };
      const arrival = addMinutes(departure, duration);
      return {
        id: qId,
        type: 'journey_elapsed',
        trainName,
        departureTime: departure,
        durationMinutes: duration,
        direction: 'forward',
        targetTime: arrival,
        initialTime: departure,
        promptText: `${trainName} leaves at ${formatDigital(departure)}. Trip takes ${durText}. When does it arrive?`,
        readAloudText: `${trainName} leaves at ${formatDigital(departure)}. Trip takes ${durText}. When does it arrive?`,
        clockMode: 'full',
        dialStyle: 'full',
        allowVisualHints: false,
        snapStep: 5,
      };
    }

    case 8: {
      // Journey Time II (Expert): Quarter-numbered clock (12,3,6,9), 1-min precision, delays & reverse crossing
      const subType = index % 3;

      if (subType === 0) {
        // Two-step delay + ride calculation
        const depH = rng.nextInt(1, 11);
        const depM = pickNonFiveMinute(rng, 28, 54);
        const departure: ClockTime = { h: depH, m: depM };
        const delay = pickNonFiveMinute(rng, 13, 27);
        const ride = pickNonFiveMinute(rng, 32, 54);
        const totalDuration = delay + ride;
        const arrival = addMinutes(departure, totalDuration);

        return {
          id: qId,
          type: 'journey_elapsed',
          trainName,
          departureTime: departure,
          durationMinutes: totalDuration,
          direction: 'forward',
          legBreakdownText: `+${delay}m delay + ${ride}m`,
          targetTime: arrival,
          initialTime: departure,
          promptText: `${trainName} leaves at ${formatDigital(departure)}. Delayed ${delay} min, then rides ${ride} min. Arrival?`,
          readAloudText: `${trainName} leaves at ${formatDigital(departure)}. It is delayed ${delay} minutes, then rides ${ride} minutes. When does it arrive?`,
          clockMode: 'full',
          dialStyle: 'quarters',
          allowVisualHints: false,
          snapStep: 1,
        };
      }

      if (subType === 1) {
        // Backward hour-crossing trip
        const arrH = rng.nextInt(1, 12);
        const arrM = pickNonFiveMinute(rng, 4, 29);
        const arrival: ClockTime = { h: arrH, m: arrM };
        const duration = pickNonFiveMinute(rng, 36, 58);
        const departure = addMinutes(arrival, -duration);

        return {
          id: qId,
          type: 'journey_elapsed',
          trainName,
          arrivalTime: arrival,
          durationMinutes: duration,
          direction: 'backward',
          targetTime: departure,
          initialTime: arrival,
          promptText: `${trainName} arrives at ${formatDigital(arrival)} after a ${duration}-minute run. When did it leave?`,
          readAloudText: `${trainName} arrives at ${formatDigital(arrival)} after a ${duration} minute run. When did it leave?`,
          clockMode: 'full',
          dialStyle: 'quarters',
          allowVisualHints: false,
          snapStep: 1,
        };
      }

      // SubType 2: Exact-minute >1 hr crossing
      const depH = rng.choice([10, 11, 12, 4, 8]);
      const depM = pickNonFiveMinute(rng, 33, 57);
      const departure: ClockTime = { h: depH, m: depM };
      const duration = 60 + pickNonFiveMinute(rng, 29, 56);
      const arrival = addMinutes(departure, duration);
      const durText = formatDurationVerbose(duration);

      return {
        id: qId,
        type: 'journey_elapsed',
        trainName,
        departureTime: departure,
        durationMinutes: duration,
        direction: 'forward',
        targetTime: arrival,
        initialTime: departure,
        promptText: `${trainName} leaves at ${formatDigital(departure)}. Journey takes ${durText}. When does it arrive?`,
        readAloudText: `${trainName} leaves at ${formatDigital(departure)}. Journey takes ${durText}. When does it arrive?`,
        clockMode: 'full',
        dialStyle: 'quarters',
        allowVisualHints: false,
        snapStep: 1,
      };
    }

    case 9: {
      // Twin Clocks (Expert): 24h conversion, fast/slow offset clocks, & quarter-dial precision reading
      const subType = index % 3;

      if (subType === 0) {
        // 24-hour Railway Timetable conversion
        const ref24 = generate24HourTime(rng);
        const target: ClockTime = { h: ref24.h, m: ref24.m };
        const time24Str = formatDigital(ref24, '24h');
        return {
          id: qId,
          type: 'twin_match',
          trainName,
          referenceTime: ref24,
          reference24h: true,
          boardLabel: '24h Timetable',
          targetTime: target,
          initialTime: pickDistinctInitialTime(rng, target),
          promptText: `Convert 24-hour timetable ${time24Str} onto the station clock!`,
          readAloudText: `Convert 24-hour time ${time24Str} onto the station clock.`,
          clockMode: 'full',
          dialStyle: 'quarters',
          allowVisualHints: false,
          snapStep: 1,
        };
      }

      if (subType === 1) {
        // Twin Duration / Offset Puzzle (cannot blindly copy the digital board!)
        const refTime: ClockTime = {
          h: rng.nextInt(1, 12),
          m: pickNonFiveMinute(rng, 1, 59),
        };
        const isFastClock = index % 2 === 1;

        if (isFastClock) {
          const offset = pickNonFiveMinute(rng, 14, 38);
          const realTime = addMinutes(refTime, -offset);
          return {
            id: qId,
            type: 'twin_duration',
            trainName,
            referenceTime: refTime,
            boardLabel: 'Faulty Clock',
            direction: 'backward',
            targetTime: realTime,
            initialTime: refTime,
            promptText: `Platform clock shows ${formatDigital(refTime)} (runs ${offset} min FAST). Set the REAL time!`,
            readAloudText: `The platform clock shows ${formatDigital(refTime)}, which runs ${offset} minutes fast. Set the real time.`,
            clockMode: 'full',
            dialStyle: 'quarters',
            allowVisualHints: false,
            snapStep: 1,
          };
        }

        const offset = 60 + pickNonFiveMinute(rng, 17, 48);
        const nextTrain = addMinutes(refTime, offset);
        const offsetText = formatDurationVerbose(offset);
        return {
          id: qId,
          type: 'twin_duration',
          trainName,
          referenceTime: refTime,
          boardLabel: 'Local Train',
          direction: 'forward',
          targetTime: nextTrain,
          initialTime: refTime,
          promptText: `Express leaves ${offsetText} AFTER the ${formatDigital(refTime)} local train! Set Express time.`,
          readAloudText: `The Express leaves ${offsetText} after the ${formatDigital(refTime)} local train. Set the Express time.`,
          clockMode: 'full',
          dialStyle: 'quarters',
          allowVisualHints: false,
          snapStep: 1,
        };
      }

      // SubType 2: Quarter-dial precision read_clock
      const h = rng.nextInt(1, 12);
      const m = pickNonFiveMinute(rng, 36, 59);
      const target: ClockTime = { h, m };
      const choices = generateChoicesForReadMode(target, rng, true);
      return {
        id: qId,
        type: 'read_clock',
        trainName,
        targetTime: target,
        choices,
        promptText: `Quarter-dial check: What exact time does this clock show?`,
        readAloudText: `What exact time does this clock show?`,
        clockMode: 'full',
        dialStyle: 'quarters',
        allowVisualHints: false,
        snapStep: 1,
      };
    }

    case 10: {
      // Station Master Boss (Master): 8 hard challenges, ALL on a numbers-free ticks_only dial
      const bossSlot = index % 8;
      let q: Question;

      if (bossSlot === 0) {
        // Hard "minutes before" on ticks_only
        q = generateSingleQuestion(5, 0, rng, trainName);
      } else if (bossSlot === 1) {
        // Precision read_clock on ticks_only
        q = generateSingleQuestion(6, 0, rng, trainName);
      } else if (bossSlot === 2) {
        // 24h conversion on ticks_only
        q = generateSingleQuestion(9, 0, rng, trainName);
      } else if (bossSlot === 3) {
        // Compound 12-wrap forward journey with exact single minutes
        const depH = rng.choice([10, 11, 12]);
        const depM = pickNonFiveMinute(rng, 34, 57);
        const departure: ClockTime = { h: depH, m: depM };
        const duration = rng.choice([97, 138, 159, 173]);
        const arrival = addMinutes(departure, duration);
        const durText = formatDurationVerbose(duration);
        q = {
          id: qId,
          type: 'journey_elapsed',
          trainName,
          departureTime: departure,
          durationMinutes: duration,
          direction: 'forward',
          targetTime: arrival,
          initialTime: departure,
          promptText: `${trainName} leaves at ${formatDigital(departure)} for ${durText}. Arrival?`,
          readAloudText: `${trainName} leaves at ${formatDigital(departure)} for ${durText}. When does it arrive?`,
          clockMode: 'full',
          snapStep: 1,
        };
      } else if (bossSlot === 4) {
        // Two-step delay journey
        q = generateSingleQuestion(8, 0, rng, trainName);
      } else if (bossSlot === 5) {
        // Backward hour-crossing elapsed trip
        const arrH = rng.choice([12, 1, 2]);
        const arrM = pickNonFiveMinute(rng, 6, 28);
        const arrival: ClockTime = { h: arrH, m: arrM };
        const duration = 60 + pickNonFiveMinute(rng, 34, 57);
        const departure = addMinutes(arrival, -duration);
        const durText = formatDurationVerbose(duration);
        q = {
          id: qId,
          type: 'journey_elapsed',
          trainName,
          arrivalTime: arrival,
          durationMinutes: duration,
          direction: 'backward',
          targetTime: departure,
          initialTime: arrival,
          promptText: `${trainName} arrives at ${formatDigital(arrival)} after ${durText}. When did it depart?`,
          readAloudText: `${trainName} arrives at ${formatDigital(arrival)} after ${durText}. When did it depart?`,
          clockMode: 'full',
          snapStep: 1,
        };
      } else if (bossSlot === 6) {
        // Slow clock offset puzzle
        const refTime: ClockTime = {
          h: rng.nextInt(1, 12),
          m: pickNonFiveMinute(rng, 1, 59),
        };
        const slowBy = pickNonFiveMinute(rng, 16, 44);
        const realTime = addMinutes(refTime, slowBy);
        q = {
          id: qId,
          type: 'twin_duration',
          trainName,
          referenceTime: refTime,
          boardLabel: 'Slow Clock',
          direction: 'forward',
          targetTime: realTime,
          initialTime: refTime,
          promptText: `Station clock shows ${formatDigital(refTime)} (runs ${slowBy} min SLOW). Set the REAL time!`,
          readAloudText: `Station clock shows ${formatDigital(refTime)} and runs ${slowBy} minutes slow. Set the real time.`,
          clockMode: 'full',
          snapStep: 1,
        };
      } else {
        // Finale Q8: Combined 24-hour conversion + offset duration on ticks_only dial
        const ref24 = generate24HourTime(rng);
        const offset = 60 + pickNonFiveMinute(rng, 22, 54);
        const realTarget = addMinutes({ h: ref24.h, m: ref24.m }, offset);
        const time24Str = formatDigital(ref24, '24h');
        const offsetText = formatDurationVerbose(offset);
        q = {
          id: qId,
          type: 'twin_duration',
          trainName,
          referenceTime: ref24,
          reference24h: true,
          boardLabel: '24h Express',
          direction: 'forward',
          targetTime: realTarget,
          initialTime: { h: ref24.h, m: ref24.m },
          promptText: `24h Express shows ${time24Str}. Night Mail leaves ${offsetText} AFTER it—set Night Mail time!`,
          readAloudText: `The 24-hour Express board shows ${time24Str}. Night Mail leaves ${offsetText} after it. Set Night Mail time.`,
          clockMode: 'full',
          snapStep: 1,
        };
      }

      return {
        ...q,
        id: qId,
        dialStyle: 'ticks_only',
        allowVisualHints: false,
        snapStep: 1,
        promptText: `⭐ Station Master: ${q.promptText}`,
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
        dialStyle: config.dialStyle || 'full',
        snapStep: config.snapStep,
      };
  }
}

function pickNonFiveMinute(rng: SeededRng, min: number, max: number): number {
  const candidates: number[] = [];
  for (let m = min; m <= max; m++) {
    if (m % 5 !== 0) {
      candidates.push(m);
    }
  }
  return candidates.length > 0 ? rng.choice(candidates) : rng.nextInt(min, max);
}

function pickDistinctInitialTime(rng: SeededRng, target: ClockTime): ClockTime {
  const offsetH = rng.nextInt(2, 9);
  const h = ((target.h + offsetH - 1) % 12) + 1;
  const m = (target.m + rng.nextInt(7, 23)) % 60;
  return { h, m };
}

function generate24HourTime(rng: SeededRng): ClockTime {
  const raw24 = rng.choice([0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
  const period: 'AM' | 'PM' = raw24 >= 12 ? 'PM' : 'AM';
  const h = raw24 % 12 || 12;
  const m = pickNonFiveMinute(rng, 2, 58);
  return { h, m, period };
}

function formatDurationVerbose(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return hrs === 1 ? '1 hour' : `${hrs} hours`;
  return `${hrs} hr ${mins} min`;
}

/**
 * Generates 4 choices for read mode (1 correct + 3 clever distractors).
 * In precisionTraps mode, adds hour-creep and +-1..2 min look-alike distractors.
 */
export function generateChoicesForReadMode(
  target: ClockTime,
  rng: SeededRng,
  precisionTraps: boolean = false
): ClockTime[] {
  const choices: ClockTime[] = [target];
  const keys = new Set<string>([`${target.h % 12}:${target.m}`]);

  function tryAdd(candidate: ClockTime) {
    const norm = normalizeTime(candidate);
    const key = `${norm.h % 12}:${norm.m}`;
    if (!keys.has(key)) {
      keys.add(key);
      choices.push(norm);
      return true;
    }
    return false;
  }

  if (precisionTraps) {
    // 1. Classic hour-creep trap: when minute >= 35, hour hand points close to the next hour
    const hourBias = target.m >= 35 ? 1 : -1;
    const trapH = ((target.h + hourBias - 1 + 12) % 12) + 1;
    tryAdd({ h: trapH, m: target.m });

    // 2. +-1 or +-2 minute close tick distractor
    const fineDelta = rng.choice([1, -1, 2, -2]);
    tryAdd(addMinutes(target, fineDelta));

    // 3. Mirror across 12-6 axis (60 - m) or swapped-hand trap
    tryAdd({ h: target.h, m: (60 - target.m) % 60 });
  }

  // Classic distractors / backups
  const swappedH = Math.round(target.m / 5) % 12 || 12;
  const swappedM = (target.h * 5) % 60;
  tryAdd({ h: swappedH, m: swappedM });

  const delta5 = rng.choice([5, -5, 10]);
  tryAdd(addMinutes(target, delta5));

  const deltaH = rng.choice([1, -1, 2]);
  const newH = ((target.h + deltaH - 1 + 12) % 12) + 1;
  tryAdd({ h: newH, m: target.m });

  let fallbackDelta = 15;
  while (choices.length < 4) {
    tryAdd(addMinutes(target, fallbackDelta));
    fallbackDelta += 15;
  }

  return rng.shuffle(choices.slice(0, 4));
}
