"use client";

import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  width: number;
  height: number;
  lineWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

export interface CanvasRef {
  clear: () => void;
  getImageDataUrl: (type?: string, quality?: number) => string | undefined;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(({
  width,
  height,
  lineWidth = 5,
  strokeColor = 'black',
  backgroundColor = 'white',
  className,
  ...props
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        setContext(ctx);

        // Initialize canvas with background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [width, height, lineWidth, strokeColor, backgroundColor]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (context && canvasRef.current) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    },
    getImageDataUrl: (type = 'image/png', quality = 0.92) => {
      return canvasRef.current?.toDataURL(type, quality);
    },
  }));

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): { offsetX: number; offsetY: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    if ('touches' in event) { // Touch event
      return {
        offsetX: event.touches[0].clientX - rect.left,
        offsetY: event.touches[0].clientY - rect.top,
      };
    }
    // Mouse event
    return {
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(event);
    if (context && coords) {
      context.beginPath();
      context.moveTo(coords.offsetX, coords.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const coords = getCoordinates(event);
    if (coords) {
      context.lineTo(coords.offsetX, coords.offsetY);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };
  
  // Prevent scrolling on touch devices when drawing on canvas
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const preventScroll = (event: TouchEvent) => {
      if (isDrawing) {
        event.preventDefault();
      }
    };

    canvasElement.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      canvasElement.removeEventListener('touchmove', preventScroll);
    };
  }, [isDrawing]);


  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className={className}
      {...props}
      style={{ touchAction: 'none', ...props.style }} // touchAction none to help prevent scrolling
    />
  );
});

Canvas.displayName = 'Canvas';
export default Canvas;
