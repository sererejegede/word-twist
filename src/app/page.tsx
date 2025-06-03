"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { getShuffledWordBank, type WordPair } from '@/lib/words';
import { GamePlay } from '@/components/game-play';
import { ResultsDisplay } from '@/components/results-display';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const TOTAL_WORDS = 5; // Number of words per game

export default function WordTwistPage() {
  const [gameWords, setGameWords] = useState<WordPair[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number | null>(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'results'>('loading');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [displayedWordTime, setDisplayedWordTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const initializeGame = useCallback(() => {
    setGameState('loading');
    const newGameWords = getShuffledWordBank(TOTAL_WORDS);
    setGameWords(newGameWords);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalTimeTaken(0);
    setInputValue('');
    setFeedbackMessage(null);
    if (newGameWords.length > 0) {
      setWordStartTime(Date.now());
      setGameState('playing');
    } else {
      // Handle case where no words are loaded, though unlikely with local bank
      setGameState('results'); // Or an error state
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (gameState === 'playing' && wordStartTime) {
      setDisplayedWordTime(0); // Reset for new word
      intervalId = setInterval(() => {
        setDisplayedWordTime(Math.floor((Date.now() - wordStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameState, wordStartTime]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const proceedToNextWord = useCallback(() => {
    if (currentWordIndex + 1 < gameWords.length) {
      setCurrentWordIndex(prevIndex => prevIndex + 1);
      setInputValue('');
      setWordStartTime(Date.now());
      setFeedbackMessage(null);
    } else {
      setGameState('results');
    }
    setIsSubmitting(false);
  }, [currentWordIndex, gameWords.length]);

  const handleSubmit = useCallback(() => {
    if (!wordStartTime || isSubmitting) return;
    setIsSubmitting(true);

    const timeTakenForWord = (Date.now() - wordStartTime) / 1000;
    setTotalTimeTaken(prevTotal => prevTotal + timeTakenForWord);

    const currentWord = gameWords[currentWordIndex];
    if (inputValue.trim().toLowerCase() === currentWord.original.toLowerCase()) {
      const wordScore = Math.max(10, 100 - Math.floor(timeTakenForWord));
      setScore(prevScore => prevScore + wordScore);
      setFeedbackMessage(`Correct! +${wordScore} points`);
      toast({ title: "Correct!", description: `You earned ${wordScore} points.`, duration: 2000 });
      setTimeout(proceedToNextWord, 1500);
    } else {
      setFeedbackMessage("Incorrect. Try again or skip.");
      toast({ title: "Incorrect", description: "That's not the word. Keep trying or skip!", variant: "destructive", duration: 2000 });
      setIsSubmitting(false);
    }
  }, [wordStartTime, inputValue, gameWords, currentWordIndex, proceedToNextWord, toast, isSubmitting]);

  const handleSkip = useCallback(() => {
    if (!wordStartTime || isSubmitting) return;
    setIsSubmitting(true);

    const timeTakenForWord = (Date.now() - wordStartTime) / 1000;
    setTotalTimeTaken(prevTotal => prevTotal + timeTakenForWord);
    setFeedbackMessage(`Skipped! The word was: ${gameWords[currentWordIndex].original}`);
    toast({ title: "Word Skipped", description: `The word was "${gameWords[currentWordIndex].original}".`, duration: 2000 });
    setTimeout(proceedToNextWord, 1500);
  }, [wordStartTime, gameWords, currentWordIndex, proceedToNextWord, toast, isSubmitting]);

  const handlePlayAgain = () => {
    initializeGame();
  };

  if (gameState === 'loading' || gameWords.length === 0) {
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

  const currentWord = gameWords[currentWordIndex];
  if (!currentWord) {
     // This case should ideally not be reached if gameWords is populated
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
        currentWord={currentWord}
        progressText={`Word ${currentWordIndex + 1}/${TOTAL_WORDS}`}
        score={score}
        currentWordTime={displayedWordTime}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        feedbackMessage={feedbackMessage}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
