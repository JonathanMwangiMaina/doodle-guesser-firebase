"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Canvas, { type CanvasRef } from '@/components/canvas';
import { Eraser, Brain, Loader2 } from 'lucide-react';
import { guessDoodle } from '@/ai/flows/guess-doodle'; // Assuming this path is correct

export default function DoodleGuesserPage() {
  const canvasRef = useRef<CanvasRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGuess, setAiGuess] = useState<string | null>(null);
  const [showGuessAlert, setShowGuessAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  const handleGuessDoodle = async () => {
    if (!canvasRef.current) return;

    const imageDataUrl = canvasRef.current.getImageDataUrl('image/png');
    if (!imageDataUrl) {
      setError('Could not get image data from canvas.');
      setShowGuessAlert(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiGuess(null);

    try {
      const result = await guessDoodle({ photoDataUri: imageDataUrl });
      setAiGuess(result.guess);
    } catch (e) {
      console.error('Error guessing doodle:', e);
      setError('Failed to get a guess from the AI. Please try again.');
    } finally {
      setIsLoading(false);
      setShowGuessAlert(true);
    }
  };

  const canvasWidth = 600;
  const canvasHeight = 400;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 selection:bg-accent selection:text-accent-foreground">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary">
          Doodle Guesser
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Draw something and let the AI guess what it is!</p>
      </header>

      <div className="w-full max-w-[${canvasWidth}px] mb-6">
        <Canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-2 border-primary rounded-lg shadow-xl bg-white cursor-crosshair w-full"
          aria-label="Doodling canvas"
        />
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={handleClearCanvas}
          variant="outline"
          className="w-full sm:w-auto text-base py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          aria-label="Clear the canvas"
        >
          <Eraser className="mr-2 h-5 w-5" />
          Clear
        </Button>
        <Button
          onClick={handleGuessDoodle}
          disabled={isLoading}
          className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-base py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label="Ask AI to guess the doodle"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Brain className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Guessing...' : 'Guess Doodle!'}
        </Button>
      </div>

      <AlertDialog open={showGuessAlert} onOpenChange={setShowGuessAlert}>
        <AlertDialogContent className="rounded-xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl text-primary">
              {error ? 'Oops!' : "AI's Guess"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground pt-2">
              {error ? error : (aiGuess ? `The AI thinks you drew: "${aiGuess}"` : "The AI is thinking...")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction 
              onClick={() => setShowGuessAlert(false)} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-2 px-4 text-sm"
              aria-label="Close alert dialog"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Built with fun and AI ✨</p>
      </footer>
    </div>
  );
}
