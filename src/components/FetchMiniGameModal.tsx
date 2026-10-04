import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { PetConfig } from '../types';
import { audio } from '../utils/audio';

interface FetchMiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  petConfig: PetConfig;
  onGameEnd: (score: number) => void;
}

interface FallingItem {
  id: number;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  type: 'bone' | 'ball' | 'treat' | 'cloud';
  speed: number;
}

export const FetchMiniGameModal: React.FC<FetchMiniGameModalProps> = ({
  isOpen,
  onClose,
  petConfig,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [puppyX, setPuppyX] = useState(50); // 0 to 100%
  const [items, setItems] = useState<FallingItem[]>([]);

  const puppyXRef = useRef(50);
  puppyXRef.current = puppyX;

  const onGameEndRef = useRef(onGameEnd);
  useEffect(() => {
    onGameEndRef.current = onGameEnd;
  });

  const lastSpawnRef = useRef<number>(0);
  const gameEndedReportedRef = useRef(false);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audio.stopAll();
    };
  }, []);

  // Reset on open/close
  useEffect(() => {
    if (!isOpen) {
      audio.stopAll();
      setGameState('intro');
      setScore(0);
      setTimeLeft(25);
      setItems([]);
      gameEndedReportedRef.current = false;
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    audio.stopAll();
    audio.playClick();
    onClose();
  }, [onClose]);

  // Reset game
  const startGame = useCallback(() => {
    audio.stopAll();
    audio.playChime();
    setScore(0);
    setTimeLeft(25);
    setPuppyX(50);
    setItems([]);
    gameEndedReportedRef.current = false;
    setGameState('playing');
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPuppyX((prev) => Math.max(10, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPuppyX((prev) => Math.min(90, prev + 8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gameState]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          audio.stopAll();
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gameState]);

  // Game loop for falling objects
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Spawn new items every ~600ms
      if (currentTime - lastSpawnRef.current > 600) {
        lastSpawnRef.current = currentTime;
        const types: FallingItem['type'][] = ['bone', 'ball', 'treat', 'cloud'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const newItem: FallingItem = {
          id: Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: -5,
          type: chosenType,
          speed: 25 + Math.random() * 20,
        };
        setItems((prev) => [...prev, newItem]);
      }

      // Update positions and collision detection
      setItems((prev) => {
        const next: FallingItem[] = [];
        for (const item of prev) {
          const newY = item.y + item.speed * dt;

          // Check collision with puppy (around y = 80-92)
          if (newY >= 75 && newY <= 92 && Math.abs(item.x - puppyXRef.current) < 14) {
            // Caught!
            if (item.type === 'bone') {
              audio.playEat();
              setScore((s) => s + 10);
            } else if (item.type === 'ball') {
              audio.playPet();
              setScore((s) => s + 15);
            } else if (item.type === 'treat') {
              audio.playChime();
              setScore((s) => s + 25);
            } else if (item.type === 'cloud') {
              audio.playToggle(false);
              setScore((s) => Math.max(0, s - 10));
            }
            continue; // Caught item consumed
          }

          // Off screen
          if (newY < 105) {
            next.push({ ...item, y: newY });
          }
        }
        return next;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, gameState]);

  // When game finishes
  useEffect(() => {
    if (gameState === 'gameover' && !gameEndedReportedRef.current) {
      gameEndedReportedRef.current = true;
      audio.stopAll();
      audio.playChime();
      onGameEndRef.current(score);
    }
  }, [gameState, score]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FDD843] border-[4px] border-black rounded-lg brutal-shadow-lg overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-[#585308] border-b-[3px] border-black p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <h3 className="font-heading font-black text-white text-base sm:text-lg uppercase tracking-wider">
              PUPPY FETCH ARCADE
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 bg-black/40 hover:bg-black/70 text-white rounded border border-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score & Timer Dashboard */}
        <div className="bg-white border-b-2 border-black px-4 py-2 flex items-center justify-between font-code font-bold text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600 uppercase">SCORE:</span>
            <span className="text-black font-black text-base">{score}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600 uppercase">TIME:</span>
            <span className={`font-black text-base ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Game Stage Area */}
        <div className="relative w-full h-80 bg-sky-200 border-b-2 border-black overflow-hidden select-none touch-none">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#82E687] border-t-2 border-black" />

          {/* Intro Screen */}
          {gameState === 'intro' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="bg-white border-[3px] border-black p-4 rounded-lg brutal-shadow max-w-xs">
                <h4 className="font-heading font-black text-xl text-black uppercase mb-1">
                  CATCH THE TREATS!
                </h4>
                <p className="font-heading text-xs text-zinc-700 mb-3">
                  Move {petConfig.name} left & right to catch falling bones & balls. Avoid dark storm clouds!
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="w-full bg-[#22C55E] hover:bg-green-500 text-white font-code font-black text-sm uppercase py-2.5 px-4 border-2 border-black rounded brutal-shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  START FETCH!
                </button>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in zoom-in-95">
              <div className="bg-white border-[3px] border-black p-5 rounded-lg brutal-shadow max-w-xs flex flex-col items-center">
                <Trophy className="w-10 h-10 text-amber-500 stroke-[2.5] mb-2" />
                <h4 className="font-heading font-black text-2xl text-black uppercase">
                  TIME'S UP!
                </h4>
                <p className="font-code font-bold text-base text-zinc-800 my-2">
                  FINAL SCORE: {score}
                </p>
                <p className="font-heading text-xs text-green-700 font-bold mb-4">
                  +{Math.round(score / 2)} Zoomie Energy Added!
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={startGame}
                    className="flex-1 bg-[#22C55E] hover:bg-green-500 text-white font-code font-bold text-xs uppercase py-2 border-2 border-black rounded brutal-shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    PLAY AGAIN
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3 bg-zinc-200 hover:bg-zinc-300 text-black font-code font-bold text-xs uppercase py-2 border-2 border-black rounded cursor-pointer"
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Falling Items */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute text-2xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.type === 'bone' && '🦴'}
              {item.type === 'ball' && '🎾'}
              {item.type === 'treat' && '⭐'}
              {item.type === 'cloud' && '🌧️'}
            </div>
          ))}

          {/* Moving Puppy on Ground */}
          <div
            className="absolute bottom-2 transform -translate-x-1/2 transition-transform duration-75"
            style={{ left: `${puppyX}%` }}
          >
            <PixelPuppy
              size={54}
              breed={petConfig.breed}
              accessory={petConfig.accessory}
              isAnimated={true}
              actionState={gameState === 'playing' ? 'happy' : 'idle'}
            />
          </div>
        </div>

        {/* Touch / Click On-Screen Controls */}
        <div className="bg-white p-3 border-t-2 border-black flex items-center justify-between gap-3">
          <button
            type="button"
            onPointerDown={() => setPuppyX((prev) => Math.max(10, prev - 12))}
            className="flex-1 bg-[#FEE135] hover:bg-yellow-400 active:bg-yellow-500 py-3 rounded border-2 border-black brutal-shadow-sm flex items-center justify-center font-code font-black text-sm uppercase gap-1 cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            LEFT
          </button>

          <button
            type="button"
            onPointerDown={() => setPuppyX((prev) => Math.min(90, prev + 12))}
            className="flex-1 bg-[#FEE135] hover:bg-yellow-400 active:bg-yellow-500 py-3 rounded border-2 border-black brutal-shadow-sm flex items-center justify-center font-code font-black text-sm uppercase gap-1 cursor-pointer select-none active:scale-95"
          >
            RIGHT
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

