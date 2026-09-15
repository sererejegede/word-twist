import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, RotateCcw, Play } from 'lucide-react';

type GameStatusCardProps =
  | { variant: 'start'; totalWords: number; onAction: () => void }
  | { variant: 'results'; finalScore: number; totalGameTime: number; onAction: () => void };

export function GameStatusCard(props: GameStatusCardProps) {
  const isStart = props.variant === 'start';

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline text-primary">
          {isStart ? 'Word Twist' : 'Game Over!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        {props.variant === 'start' ? (
          <p className="text-lg text-muted-foreground">
            Unscramble {props.totalWords} words as fast as you can. The quicker you answer, the more points you earn.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-center text-2xl">
              <Trophy className="mr-2 h-8 w-8 text-yellow-400" />
              <span>Final Score: {props.finalScore}</span>
            </div>
            <div className="flex items-center justify-center text-lg text-muted-foreground">
              <Clock className="mr-2 h-5 w-5" />
              <span>Total Time: {props.totalGameTime} seconds</span>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={props.onAction} className="w-full bg-accent hover:bg-accent/90">
          {isStart ? (
            <><Play className="mr-2 h-4 w-4" /> Start Game</>
          ) : (
            <><RotateCcw className="mr-2 h-4 w-4" /> Play Again</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
