
import React from 'react';
import { SkipForward, Clock, BarChart2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { WordPair } from '@/lib/words';

interface GamePlayProps {
  currentWord: WordPair;
  progressText: string;
  score: number;
  currentWordTime: number;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onShuffleWord: () => void;
  feedbackMessage: string | null;
  isSubmitting: boolean;
  animatedScore: number | null;
}

export function GamePlay({
  currentWord,
  progressText,
  score,
  currentWordTime,
  inputValue,
  onInputChange,
  onSubmit,
  onSkip,
  onShuffleWord,
  feedbackMessage,
  isSubmitting,
  animatedScore,
}: GamePlayProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      onSubmit();
    }
  };

  const handleScrambledWordClick = () => {
    if (!isSubmitting) {
      onShuffleWord();
    }
  };

  const handleScrambledWordKeyDown = (e: React.KeyboardEvent) => {
    if (!isSubmitting && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onShuffleWord();
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline text-primary">WordTwist</CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span className="flex items-center"><BarChart2 className="mr-1 h-4 w-4" /> {progressText}</span>
          <div className="relative"> {/* Wrapper for score and animated feedback */}
            <span className="flex items-center"><TrendingUp className="mr-1 h-4 w-4" /> Score: {score}</span>
            {animatedScore !== null && (
              <div
                key={Date.now()} // Re-trigger animation if score changes rapidly (though unlikely here)
                className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow-lg animate-score-popup whitespace-nowrap"
              >
                +{animatedScore}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Unscramble this word (click to reshuffle):</p>
          <div
            key={`${currentWord.id}-${currentWord.scrambled}`}
            className={`text-5xl font-bold tracking-widest text-accent animate-fadeIn font-code select-none ${
              !isSubmitting ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-not-allowed opacity-50'
            }`}
            onClick={handleScrambledWordClick}
            onKeyDown={handleScrambledWordKeyDown}
            role="button"
            tabIndex={!isSubmitting ? 0 : -1}
            aria-label="Scrambled word, click or press Enter to reshuffle"
          >
            {currentWord.scrambled.toUpperCase()}
          </div>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your answer"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="text-center text-lg"
            aria-label="Word input"
            disabled={isSubmitting}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || !inputValue.trim()}>
            {isSubmitting ? 'Checking...' : 'Submit'}
          </Button>
        </form>
        {feedbackMessage && (
          <p className={`text-center text-sm ${feedbackMessage.startsWith("Skipped") ? 'text-yellow-400' : 'text-red-400'}`}>
            {feedbackMessage}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Button variant="outline" onClick={onSkip} className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent" disabled={isSubmitting}>
          <SkipForward className="mr-2 h-4 w-4" /> Skip Word
        </Button>
        <div className="text-sm text-muted-foreground flex items-center font-code">
          <Clock className="mr-1 h-4 w-4" /> Time for this word: {currentWordTime}s
        </div>
      </CardFooter>
    </Card>
  );
}
