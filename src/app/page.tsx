
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GamePlay } from '@/components/game-play';
import { ResultsDisplay } from '@/components/results-display';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWords } from '@/hooks/use-words';


export default function WordTwistPage() {
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number | null>(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'results' | 'error'>('loading');
  const [displayedWordTime, setDisplayedWordTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animatedScore, setAnimatedScore] = useState<number | null>(null);
  const { toast } = useToast();
  const { word, usedWords, setUsedWords, getNextWord, shuffleWord, isWordCorrect, TOTAL_WORDS } = useWords();

  const initializeGame = useCallback(() => {
    getNextWord();
    setGameState('loading');
    setScore(0);
    setTotalTimeTaken(0);
    setInputValue('');
    setAnimatedScore(null);
    setWordStartTime(Date.now());
    setGameState('playing');
    setUsedWords([]);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (gameState === 'playing' && wordStartTime) {
      setDisplayedWordTime(0);
      intervalId = setInterval(() => {
        setDisplayedWordTime(_prevTime => {
          const newTime = Math.floor((Date.now() - wordStartTime) / 1000);
          if (newTime >= 5) {
            clearInterval(intervalId);
            return 5;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameState, wordStartTime, usedWords.length]);

  const proceedToNextWord = useCallback(() => {
    if (usedWords.length < TOTAL_WORDS) {
      getNextWord();
      setInputValue('');
      setWordStartTime(Date.now());
    } else {
      setGameState('results');
    }
    setIsSubmitting(false);
  }, [usedWords.length]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    if (gameState === 'error') {
      setGameState('playing');
    }
  }, [gameState]);

  const handleSubmit = useCallback(() => {
    if (!wordStartTime || !word || isSubmitting) return;
    setIsSubmitting(true);

    const timeTakenForWord = (Date.now() - wordStartTime) / 1000;
    setTotalTimeTaken(prevTotal => prevTotal + timeTakenForWord);

    if (isWordCorrect(inputValue, word.original)) {
      const wordScore = Math.max(10, 100 - Math.floor(timeTakenForWord));
      setScore(prevScore => prevScore + wordScore);
      setAnimatedScore(wordScore);
      setTimeout(() => setAnimatedScore(null), 1500); // Animation lasts 1.5s
      toast({ title: "Correct!", description: `You earned ${wordScore} points.`, duration: 2000 });
      proceedToNextWord()
    } else {
      setGameState('error');
      toast({ title: "Incorrect", description: "That's not the word. Keep trying or skip!", variant: "destructive", duration: 2000 });
      setIsSubmitting(false);
    }
  }, [wordStartTime, inputValue, proceedToNextWord, toast, isSubmitting]);

  const handleSkip = useCallback(() => {
    if (!wordStartTime || isSubmitting) return;
    setIsSubmitting(true);
    setAnimatedScore(null); // Clear any existing score animation

    const timeTakenForWord = (Date.now() - wordStartTime) / 1000;
    setTotalTimeTaken(prevTotal => prevTotal + timeTakenForWord);
    proceedToNextWord()
  }, [wordStartTime, proceedToNextWord, isSubmitting]);

  const handleShuffleWord = useCallback(() => {
    if (word == null || isSubmitting) return;

    shuffleWord();

  }, [gameState, isSubmitting, word]);


  const handlePlayAgain = () => {
    initializeGame();
  };

  if (gameState === 'loading' || word == null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-foreground">Loading Game...</p>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <ResultsDisplay
          finalScore={score}
          totalGameTime={Math.floor(totalTimeTaken)}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    );
  }

  if (word == null) {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <p className="text-lg text-destructive">Error: Could not load word.</p>
        <Button onClick={handlePlayAgain} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      <GamePlay
        currentWord={word}
        progressText={`Word ${usedWords.length}/${TOTAL_WORDS}`}
        score={score}
        currentWordTime={displayedWordTime}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        onShuffleWord={handleShuffleWord}
        isSubmitting={isSubmitting}
        animatedScore={animatedScore}
        gameState={gameState}
      />
    </main>
  );
}
