import React, { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import type { Question, ClockTime, MistakeDiagnostic } from '../../types/game';
import { LEVEL_CONFIGS } from '../../logic/levels';
import { generateQuestionsForLevel } from '../../logic/questionGenerator';
import { isCorrect } from '../../logic/clockMath';
import { diagnoseMistake } from '../../logic/diagnose';
import { calculateQuestionStars, calculateLevelStars } from '../../logic/scoring';
import { strings } from '../../strings/strings.en';
import { TopBar } from '../game/TopBar';
import { AnalogClock } from '../clock/AnalogClock';
import { DigitalClock } from '../clock/DigitalClock';
import { DepartureBoard } from '../board/DepartureBoard';
import { TrainScene } from '../scene/TrainScene';
import type { TrainState, SignalState } from '../scene/TrainScene';
import { Mascot } from '../scene/Mascot';
import { AnswerChoices } from '../game/AnswerChoices';
import { TimeChipsDrawer } from '../clock/TimeChipsDrawer';
import { HintOverlay } from '../game/HintOverlay';
import { Confetti } from '../game/Confetti';
import { useSpeech } from '../../hooks/useSpeech';

export interface PlayScreenProps {
  levelId: number;
  onLevelComplete: (levelId: number, starsEarned: number) => void;
  onPause: () => void;
  onRecordMistake: (levelId: number, category: any, target: ClockTime, answer: ClockTime) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTextSize: () => void;
  totalStars: number;
  showDigitalBubble: boolean;
  playTick: () => void;
  playWhistle: () => void;
  playChuff: () => void;
  playBoing: () => void;
}

interface QuestionPlayAreaProps {
  question: Question;
  questionIndex: number;
  levelId: number;
  accentColor: string;
  locomotiveStyle: any;
  showDigitalBubble: boolean;
  playTick: () => void;
  playWhistle: () => void;
  playChuff: () => void;
  playBoing: () => void;
  onRecordMistake: (levelId: number, category: any, target: ClockTime, answer: ClockTime) => void;
  onSuccess: (attempts: number, revealed: boolean) => void;
}

const QuestionPlayArea: React.FC<QuestionPlayAreaProps> = ({
  question,
  questionIndex,
  levelId,
  accentColor,
  locomotiveStyle,
  showDigitalBubble,
  playTick,
  playWhistle,
  playChuff,
  playBoing,
  onRecordMistake,
  onSuccess,
}) => {
  const [clockTime, setClockTime] = useState<ClockTime>(() => {
    return question.type === 'read_clock'
      ? question.targetTime
      : question.initialTime || { h: 12, m: 0 };
  });

  const [selectedChoice, setSelectedChoice] = useState<ClockTime | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [diagnostic, setDiagnostic] = useState<MistakeDiagnostic | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [revealedSolution, setRevealedSolution] = useState(false);

  const [trainState, setTrainState] = useState<TrainState>('arriving');
  const [signalState, setSignalState] = useState<SignalState>('red');
  const [mascotMessage, setMascotMessage] = useState<string>(() =>
    question.type === 'read_clock'
      ? 'Read the clock and drop the matching boarding ticket onto the train! 🎫'
      : strings.mascot.helpPrompt
  );
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Drag and drop interaction states
  const [isDraggingTicket, setIsDraggingTicket] = useState(false);
  const [hoveredDropTarget, setHoveredDropTarget] = useState<string | null>(null);
  const [clockDropTargetHovered, setClockDropTargetHovered] = useState(false);

  const { speak, isSpeaking } = useSpeech();

  // Arrival animation and sound on question mount
  useEffect(() => {
    playChuff();
    const timer = setTimeout(() => {
      setTrainState('waiting');
    }, 700);
    return () => clearTimeout(timer);
  }, [playChuff]);

  const handleReadAloud = useCallback(() => {
    speak(question.readAloudText || question.promptText);
  }, [question, speak]);

  const handleEvaluateAnswer = (answerToCheck: ClockTime) => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    const correct = isCorrect(question.targetTime, answerToCheck);

    if (correct) {
      setSignalState('green');
      playWhistle();
      // Realistic accelerating chuffs as train departs
      playChuff();
      setTimeout(playChuff, 350);
      setTimeout(playChuff, 700);
      setTimeout(playChuff, 1050);
      setTrainState('departing');

      const cheers = strings.mascot.correctCelebration;
      const cheer = cheers[Math.floor(Math.random() * cheers.length)];
      setMascotMessage(cheer);

      setTimeout(() => {
        setIsEvaluating(false);
        onSuccess(attempts + 1, revealedSolution);
      }, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      setSignalState('amber');
      playBoing();
      setTrainState('wobble');

      const diag = diagnoseMistake(question.targetTime, answerToCheck, levelId);
      setDiagnostic(diag);
      onRecordMistake(levelId, diag.category, question.targetTime, answerToCheck);

      setTimeout(() => {
        setTrainState('waiting');
        setSignalState('red');
        setIsEvaluating(false);

        if (newAttempts === 1) {
          setMascotMessage(diag.message || strings.mascot.wrongAttempt1);
        } else if (newAttempts === 2) {
          setShowHintModal(true);
          setMascotMessage(diag.message);
        } else {
          setClockTime(question.targetTime);
          setRevealedSolution(true);
          setShowHintModal(true);
          setMascotMessage(strings.mascot.revealedNotice);
        }
      }, 500);
    }
  };

  const handleGo = () => {
    if (isEvaluating) return;
    const answerToCheck = question.type === 'read_clock' ? selectedChoice : clockTime;
    if (!answerToCheck) {
      setMascotMessage('Pick a digital time from the buttons first! 👆');
      playBoing();
      return;
    }
    handleEvaluateAnswer(answerToCheck);
  };

  const handleDropTicket = (droppedChoice: ClockTime) => {
    setSelectedChoice(droppedChoice);
    handleEvaluateAnswer(droppedChoice);
  };

  const handleApplyDeltaMinutes = (deltaMin: number) => {
    playTick();
    setClockTime((prev) => {
      const totalMinutes = prev.h * 60 + prev.m + deltaMin;
      const newH = Math.floor(totalMinutes / 60) % 12 || 12;
      const newM = totalMinutes % 60;
      return { h: newH, m: newM };
    });
  };

  const handleDismissHint = () => {
    setShowHintModal(false);
    if (revealedSolution) {
      onSuccess(attempts + 1, true);
    }
  };

  const isReadMode = question.type === 'read_clock';
  const isTwinMode = question.type === 'twin_match';
  const showBubble = showDigitalBubble && levelId < 6;

  return (
    <>
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto py-1 sm:py-2 flex flex-col justify-center">
        <div className="h-full w-full grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-5 items-stretch min-h-0">
          {/* LEFT COLUMN: Interactive Clock Station */}
          <div className="md:col-span-6 lg:col-span-5 h-full flex flex-col items-center justify-between p-3 sm:p-4 bg-white/75 backdrop-blur-sm rounded-3xl border-4 border-[#1B2A49] shadow-chunky min-h-0 overflow-hidden">
            {isTwinMode ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-around flex-1 min-h-0">
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <AnalogClock
                    time={clockTime}
                    interactive={true}
                    mode={question.clockMode}
                    snapStep={question.snapStep}
                    accentColor={accentColor}
                    isDropTargetHovered={clockDropTargetHovered}
                    onChange={setClockTime}
                    onSnap={playTick}
                    className="max-h-[min(340px,46vh)] aspect-square"
                  />
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-xs font-black text-[#1B2A49] mb-1 uppercase tracking-wider">
                    Target Board
                  </span>
                  <DigitalClock time={question.targetTime} size="md" />
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1">
                <AnalogClock
                  time={clockTime}
                  interactive={!isReadMode}
                  mode={question.clockMode}
                  snapStep={question.snapStep}
                  accentColor={accentColor}
                  showDigitalBubble={showBubble}
                  highlight={diagnostic?.highlightHand}
                  showMultiplierHint={diagnostic?.showMultiplierHint}
                  showHalfSlice={diagnostic?.showHalfSlice}
                  showQuarterSlice={diagnostic?.showQuarterSlice}
                  isDropTargetHovered={clockDropTargetHovered}
                  onChange={setClockTime}
                  onSnap={playTick}
                  className="max-h-[min(360px,50vh)] aspect-square"
                />
              </div>
            )}

            {/* Quick-Advance Draggable Time Chips when setting clock */}
            {!isReadMode && (
              <div className="w-full shrink-0 pt-2">
                <TimeChipsDrawer
                  onApplyDeltaMinutes={handleApplyDeltaMinutes}
                  onDragStateChange={(_isDragging, activeTarget) => {
                    setClockDropTargetHovered(activeTarget === 'analog-clock-face');
                  }}
                  disabled={isEvaluating}
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Station Board, Tickets, Train Platform & Controls */}
          <div className="md:col-span-6 lg:col-span-7 h-full flex flex-col justify-between gap-2.5 min-h-0">
            {/* 1. Departure Board */}
            <div className="shrink-0">
              <DepartureBoard
                question={question}
                onReadAloud={handleReadAloud}
                isSpeaking={isSpeaking}
              />
            </div>

            {/* 2. Draggable Boarding Tickets in read_clock mode */}
            {isReadMode && question.choices && (
              <div className="shrink-0">
                <AnswerChoices
                  choices={question.choices}
                  selectedChoice={selectedChoice}
                  onSelect={(c) => {
                    setSelectedChoice(c);
                    playTick();
                  }}
                  onDropTicket={handleDropTicket}
                  onDragStateChange={(isDragging, activeTarget) => {
                    setIsDraggingTicket(isDragging);
                    setHoveredDropTarget(activeTarget);
                  }}
                  disabled={isEvaluating}
                />
              </div>
            )}

            {/* 3. Train Platform on Track (Side-by-Side!) */}
            <div className="flex-1 min-h-0 w-full flex items-center">
              <TrainScene
                trainState={trainState}
                signalState={signalState}
                locomotiveStyle={locomotiveStyle}
                trainName={question.trainName}
                isDragActive={isDraggingTicket}
                isHoveredDropTarget={hoveredDropTarget === 'train-ticket-slot'}
                className="w-full h-full max-h-[175px]"
              />
            </div>

            {/* 4. Action Row: Conductor Mascot & Big Go Button */}
            <div className="shrink-0 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Mascot
                  message={mascotMessage}
                  showGhostHand={levelId === 1 && questionIndex === 0 && attempts === 0}
                />
              </div>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleGo}
                className="shrink-0 min-w-[190px] sm:min-w-[230px] min-h-[58px] sm:min-h-[64px] px-6 sm:px-8 py-3 rounded-3xl bg-[#3DDC84] hover:bg-[#34c776] text-[#1B2A49] text-2xl sm:text-3xl font-black border-4 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-3 transition-transform focus-ring disabled:opacity-50"
                aria-label="Send train"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                <span>{strings.buttons.go}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <HintOverlay
        diagnostic={showHintModal ? diagnostic : null}
        attemptNumber={attempts}
        revealed={revealedSolution}
        onDismiss={handleDismissHint}
      />
    </>
  );
};

export const PlayScreen: React.FC<PlayScreenProps> = ({
  levelId,
  onLevelComplete,
  onPause,
  onRecordMistake,
  isMuted,
  onToggleMute,
  onToggleTextSize,
  totalStars,
  showDigitalBubble,
  playTick,
  playWhistle,
  playChuff,
  playBoing,
}) => {
  const config = LEVEL_CONFIGS[levelId] || LEVEL_CONFIGS[1];
  const [questions] = useState<Question[]>(() =>
    generateQuestionsForLevel(levelId)
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [starsPerQuestion, setStarsPerQuestion] = useState<number[]>([]);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);

  const currentQ = questions[questionIndex] || questions[0];

  const handleQuestionSuccess = useCallback(
    (attemptsTaken: number, wasRevealed: boolean) => {
      const earnedStars = calculateQuestionStars(attemptsTaken, wasRevealed, false);
      const newStars = [...starsPerQuestion, earnedStars];
      setStarsPerQuestion(newStars);
      setShowSuccessConfetti(true);

      setTimeout(() => {
        setShowSuccessConfetti(false);
        if (questionIndex + 1 < questions.length) {
          setQuestionIndex((prev) => prev + 1);
        } else {
          const finalStars = calculateLevelStars(newStars);
          onLevelComplete(levelId, finalStars);
        }
      }, 1000);
    },
    [starsPerQuestion, questionIndex, questions.length, levelId, onLevelComplete]
  );

  return (
    <div className="h-screen max-h-screen overflow-hidden p-2 sm:p-3 bg-gradient-to-b from-[#8EDBFF] via-[#BAE6FD] to-[#E6F7FF] flex flex-col justify-between select-none">
      {showSuccessConfetti && <Confetti count={40} />}

      <TopBar
        levelId={levelId}
        levelName={config.name}
        totalQuestions={questions.length}
        currentQuestionIndex={questionIndex}
        starsPerQuestion={starsPerQuestion}
        totalStars={totalStars}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onToggleTextSize={onToggleTextSize}
        onPause={onPause}
        className="shrink-0 max-w-7xl"
      />

      <QuestionPlayArea
        key={currentQ.id}
        question={currentQ}
        questionIndex={questionIndex}
        levelId={levelId}
        accentColor={config.accentColor}
        locomotiveStyle={config.locomotiveStyle}
        showDigitalBubble={showDigitalBubble}
        playTick={playTick}
        playWhistle={playWhistle}
        playChuff={playChuff}
        playBoing={playBoing}
        onRecordMistake={onRecordMistake}
        onSuccess={handleQuestionSuccess}
      />
    </div>
  );
};
