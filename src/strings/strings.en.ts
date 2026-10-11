export const strings = {
  appTitle: "Clock Station",
  appSubtitle: "A Colorful Time-Learning Adventure",
  
  buttons: {
    play: "Play",
    levels: "Levels",
    replay: "Play Again",
    nextStation: "Next Station 🚂",
    go: "Go! 🚂",
    pause: "Pause",
    resume: "Keep Going",
    soundOn: "Sound On",
    soundOff: "Sound Off",
    mute: "Mute",
    unmute: "Unmute",
    readAloud: "Read to me",
    showMe: "Show me",
    resetProgress: "Reset Progress",
    close: "Close",
    textSize: "Text Size",
    home: "Station Home",
    backToMap: "Map",
    parentTeacher: "Parent / Teacher",
  },

  mascot: {
    greeting: "All aboard! Welcome to Clock Station!",
    helpPrompt: "Can you set the clock so our train departs right on time?",
    ghostGuide: "Touch the clock hand and drag it round to set the time!",
    correctCelebration: [
      "Right on time! 🎉",
      "Choo choo! Fantastic work! 🚂",
      "All aboard! Off goes the train! 🌟",
      "Spot on, Station Master! ⭐",
      "Super job! The passengers are cheering! 🎈",
    ],
    wrongAttempt1: "Not yet, have another look! 🤔",
    revealedNotice: "Here is the right time! Look at how the hands line up.",
  },

  hints: {
    hourMistake: "The short blue hand tells the hour.",
    minuteMistake: "The long red hand tells the minutes. Each big number is 5 minutes!",
    handsSwapped: "Did you swap the hands? Remember: Short hand = Hours, Long hand = Minutes!",
    offByFive: "Almost there! You are just 5 minutes away.",
    mirrorError: "Check the direction! Count minutes clockwise, starting from the 12.",
    halfPast: "Half past means the long minute hand points straight down at 6 (30 minutes)!",
    quarterPast: "Quarter past means the long hand points at 3 (15 minutes).",
    quarterTo: "Quarter to means the long hand points at 9 (45 minutes).",
    elapsedWhole: "Add the journey hours to the departure hour!",
    elapsedMinutes: "Count the minutes from departure to arrival!",
  },

  levels: {
    1: {
      name: "O'clock Express",
      skill: "Whole hours",
      description: "Set the clock to exact hours (:00).",
    },
    2: {
      name: "Half Past Halt",
      skill: "Half past (:30)",
      description: "Set the clock to half past the hour.",
    },
    3: {
      name: "Quarter Junction",
      skill: "Quarter past and quarter to",
      description: "Set the clock to :15 and :45.",
    },
    4: {
      name: "Five-Minute Line",
      skill: "5-minute intervals",
      description: "Set the clock to any 5-minute mark.",
    },
    5: {
      name: "Every-Minute Central",
      skill: "Precise minutes 1–59",
      description: "Set the clock to the exact minute.",
    },
    6: {
      name: "Read the Clock",
      skill: "Read analogue & pick digital",
      description: "Look at the clock face and choose the matching digital time.",
    },
    7: {
      name: "Journey Time I",
      skill: "Elapsed time (hours)",
      description: "Calculate the arrival time after 1 or 2 hours of travel.",
    },
    8: {
      name: "Journey Time II",
      skill: "Elapsed time (crossing hours)",
      description: "Calculate the arrival time with minute journeys.",
    },
    9: {
      name: "Twin Clocks",
      skill: "Matching & duration",
      description: "Match analogue and digital clocks side by side.",
    },
    10: {
      name: "Station Master",
      skill: "Grand Master Challenge",
      description: "The ultimate station challenge with all clock skills!",
    },
  },

  board: {
    trainDeparts: "departs at",
    trainArrives: "arrives at",
    leavesAt: "Leaves at",
    journeyTakes: "Journey takes",
    whenDoesItArrive: "When does it arrive?",
    matchTheTime: "Set the analogue clock to match:",
    pickTheTime: "What time does this clock show?",
    journeyDuration: "Journey duration:",
  },

  parentPanel: {
    title: "Parent & Teacher Dashboard",
    childLockNotice: "Hold the gear icon for 2 seconds to enter.",
    statsHeader: "Learning Progress & Accuracy",
    levelHeader: "Level",
    starsHeader: "Stars",
    attemptsHeader: "Accuracy",
    mistakesHeader: "Common Mistakes",
    noMistakes: "No mistakes recorded yet. Excellent!",
    resetConfirm: "Are you sure you want to reset all game progress?",
    resetSuccess: "Progress has been reset.",
  },

  levelComplete: {
    greatJob: "Station Cleared!",
    starsEarned: "You earned",
    outOfThree: "stars!",
    stationMasterBadge: "Master Conductor Star Awarded!",
  },
} as const;

export type AppStrings = typeof strings;
