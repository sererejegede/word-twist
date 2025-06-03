import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, RotateCcw } from 'lucide-react';

interface ResultsDisplayProps {
  finalScore: number;
  totalGameTime: number;
  onPlayAgain: () => void;
}

export function ResultsDisplay({ finalScore, totalGameTime, onPlayAgain }: ResultsDisplayProps) {
  return (
    <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline text-primary">Game Over!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="flex items-center justify-center text-2xl">
          <Trophy className="mr-2 h-8 w-8 text-yellow-400" />
          <span>Final Score: {finalScore}</span>
        </div>
        <div className="flex items-center justify-center text-lg text-muted-foreground">
          <Clock className="mr-2 h-5 w-5" />
          <span>Total Time: {totalGameTime} seconds</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onPlayAgain} className="w-full bg-accent hover:bg-accent/90">
          <RotateCcw className="mr-2 h-4 w-4" /> Play Again
        </Button>
      </CardFooter>
    </Card>
  );
}
