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
import { guessDoodle } from '@/ai/flows/guess-doodle';

export default function DoodleGuesserPage() {
  const canvasRef = useRef<CanvasRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>('');
  const [showGuessAlert, setShowGuessAlert] = useState(false);
  const [error, setError] = useState<string>('');

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  const handleGuessDoodle = async () => {
    if (!canvasRef.current) return;

    const imageDataUrl = canvasRef.current.getImageDataUrl('image/png');

    // Validate canvas has content
    if (!imageDataUrl || imageDataUrl === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') {
      setError('Please draw something first!');
      setShowGuessAlert(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setAiGuess('');
    setShowGuessAlert(true);

    try {
      const result = await guessDoodle({ photoDataUri: imageDataUrl });

      // Check if result is an error
      if ('error' in result) {
        console.error('AI Error:', result);

        // Display user-friendly error based on error code
        switch (result.code) {
          case 'CONFIG_ERROR':
            setError('⚠️ The AI service needs to be configured. Please check the deployment settings.');
            break;
          case 'AUTH_ERROR':
            setError('🔑 Authentication failed. Please verify the API credentials.');
            break;
          case 'QUOTA_ERROR':
            setError('⏳ Service quota exceeded. Please try again in a few moments.');
            break;
          case 'INVALID_INPUT':
            setError('❌ Invalid drawing data. Please try drawing again.');
            break;
          default:
            setError(`❌ ${result.error}. Please try again.`);
        }
      } else {
        // Success!
        setAiGuess(result.guess);
      }
    } catch (e: any) {
      console.error('Error guessing doodle:', e);
      setError('❌ An unexpected error occurred. Please try again or check your connection.');
    } finally {
      setIsLoading(false);
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
            <AlertDialogDescription className="text-center">
              {error ? (
                <div className="space-y-3">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <Button
                    onClick={() => {
                      setShowGuessAlert(false);
                      setError('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              ) : aiGuess ? (
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    🎨 "{aiGuess}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    That's what the AI thinks you drew!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <p>The AI is analyzing your doodle...</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!error && aiGuess && (
            <AlertDialogFooter className="mt-4">
              <AlertDialogAction
                onClick={() => setShowGuessAlert(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-2 px-4 text-sm"
                aria-label="Close alert dialog"
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Developed by Johnsberg. Built with fun and AI ✨</p>
      </footer>
    </div>
  );
}
