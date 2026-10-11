# 🚂 Clock Station

**Clock Station** is a colourful, kid-friendly, accessible educational web game designed for children in Classes 2–4 (ages 7–10). In this game, trains wait at railway station platforms, and the child must set an analogue clock to the train's scheduled departure time (or solve journey elapsed time questions) to whistle and send the train off on its journey.

---

## 🚀 How to Run

### 1. Installation
Install the dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite dev server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Running the Test Suite
Run the Vitest deterministic pure logic test suite:
```bash
npm run test
```

### 4. Production Build
Build for production:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 🎨 How to Change the Colours

The game's visual identity is driven by design tokens and Tailwind CSS theme extensions:

1. **CSS Variables (`src/styles/tokens.css`)**:
   Global palette variables are defined in `:root`:
   ```css
   --sky-top: #8EDBFF;
   --sky-bottom: #E6F7FF;
   --train-red: #FF5A5F;
   --train-yellow: #FFD23F;
   --train-green: #3DDC84;
   --train-blue: #3A86FF;
   --train-purple: #8338EC;
   --train-orange: #FF9F1C;
   --clock-face: #FFF8E7;
   --navy-text: #1B2A49;
   ```
   To adjust the game theme (e.g. darker station night mode or alternative sky), edit these CSS variables.

2. **Tailwind Config (`tailwind.config.js`)**:
   The theme extension defines semantic color classes such as `bg-clock-face`, `text-clock-navy`, `bg-train-green`, and `border-clock-rim`.

3. **Level Accent Colours (`src/logic/levels.ts`)**:
   Each level defines its own accent color used on the level card and the clock's rim:
   ```ts
   accentColor: '#FF5A5F', // Level 1 Red
   accentColor: '#3DDC84', // Level 2 Green
   // etc.
   ```

---

## 🚉 How to Add a New Level

To add or modify levels:

1. Open `src/logic/levels.ts` and add a new entry to `LEVEL_CONFIGS`:
   ```ts
   11: {
     id: 11,
     name: "Night Express",
     subtitle: "24-Hour & Night Time",
     accentColor: '#4338CA',
     locomotiveStyle: 'star_silver',
     snapStep: 5,
     mode: 'full',
     questionCount: 6,
     questionType: 'set_clock',
   }
   ```

2. Open `src/logic/questionGenerator.ts` and add a `case 11:` branch in `generateSingleQuestion()` to customize the question generator logic and train prompts.

3. Update the strings in `src/strings/strings.en.ts` under `levels` to add localized names and descriptions for the new level.

---

## ♿ Accessibility & Features
- **Keyboard Navigation**: Clock hands are `role="slider"` with `aria-valuenow` and `aria-valuetext`. Use Tab to focus, Arrow keys to step hands, and PageUp/PageDown for 5-step jumps.
- **Pure WebAudio Synthesis**: Train whistles, chuffing steam loops, clock snapping ticks, and victory fanfare are synthesized in real-time with zero external audio assets.
- **Child-Friendly Feedback**: No red buzzers or lives lost. Mistakes gently shake the clock and train (400ms wobble) and offer progressive hints.
- **Parent / Teacher Dashboard**: Hold the settings gear icon on the home screen for 2 seconds to view student accuracy and diagnosed mistake patterns.
- **Local Persistence**: Unlocked levels, earned stars, mute, and text size preferences persist in `localStorage`.
