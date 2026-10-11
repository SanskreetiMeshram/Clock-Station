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
  const [mascotMessage, setMascotMessage] = useState<string>(strings.mascot.helpPrompt);
  const [isEvaluating, setIsEvaluating] = useState(false);

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

  const handleGo = () => {
    if (isEvaluating) return;

    const answerToCheck = question.type === 'read_clock' ? selectedChoice : clockTime;
    if (!answerToCheck) {
      setMascotMessage('Pick a digital time from the buttons first! 👆');
      playBoing();
      return;
    }

    setIsEvaluating(true);
    const correct = isCorrect(question.targetTime, answerToCheck);

    if (correct) {
      setSignalState('green');
      playWhistle();
      playChuff();
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
      <main className="w-full max-w-5xl mx-auto my-auto py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-center">
          {/* Clock Display */}
          <div className="flex flex-col items-center justify-center p-3 bg-white/70 backdrop-blur-sm rounded-3xl border-4 border-[#1B2A49] shadow-chunky">
            {isTwinMode ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-around">
                <AnalogClock
                  time={clockTime}
                  interactive={true}
                  mode={question.clockMode}
                  snapStep={question.snapStep}
                  accentColor={accentColor}
                  onChange={setClockTime}
                  onSnap={playTick}
                  size={260}
                />
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-[#1B2A49] mb-1 uppercase tracking-wider">
                    Target Board
                  </span>
                  <DigitalClock time={question.targetTime} size="md" />
                </div>
              </div>
            ) : (
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
                onChange={setClockTime}
                onSnap={playTick}
              />
            )}
          </div>

          {/* Departure Board & Interaction Controls */}
          <div className="flex flex-col justify-between gap-4 h-full">
            <DepartureBoard
              question={question}
              onReadAloud={handleReadAloud}
              isSpeaking={isSpeaking}
            />

            {isReadMode && question.choices && (
              <div className="my-2">
                <AnswerChoices
                  choices={question.choices}
                  selectedChoice={selectedChoice}
                  onSelect={(c) => {
                    setSelectedChoice(c);
                    playTick();
                  }}
                  disabled={isEvaluating}
                />
              </div>
            )}

            <div className="hidden sm:block">
              <Mascot
                message={mascotMessage}
                showGhostHand={levelId === 1 && questionIndex === 0 && attempts === 0}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Platform & Go Button */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col gap-3">
        <TrainScene
          trainState={trainState}
          signalState={signalState}
          locomotiveStyle={locomotiveStyle}
          trainName={question.trainName}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="sm:hidden flex-1">
            <Mascot message={mascotMessage} />
          </div>

          <button
            type="button"
            disabled={isEvaluating}
            onClick={handleGo}
            className="w-full sm:w-auto sm:min-w-[260px] min-h-[64px] ml-auto px-8 py-3.5 rounded-3xl bg-[#3DDC84] hover:bg-[#34c776] text-[#1B2A49] text-3xl font-black border-4 border-[#1B2A49] shadow-chunky active:translate-y-1 active:shadow-chunky-active flex items-center justify-center gap-3 transition-transform focus-ring disabled:opacity-50"
            aria-label="Send train"
          >
            <Play className="w-8 h-8 fill-current" />
            <span>{strings.buttons.go}</span>
          </button>
        </div>
      </footer>

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
    <div className="min-h-screen p-3 sm:p-5 bg-gradient-to-b from-[#8EDBFF] via-[#BAE6FD] to-[#E6F7FF] flex flex-col justify-between select-none">
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
