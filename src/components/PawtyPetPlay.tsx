import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Bone, Heart, Zap, Gamepad2, Volume2, RefreshCw } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { PetConfig, PetStats } from '../types';
import { audio } from '../utils/audio';

interface PawtyPetPlayProps {
  stats: PetStats;
  petConfig: PetConfig;
  onFeed: () => void;
  onPet: () => void;
  onPlayFetch: () => void;
  onOpenMiniGame: () => void;
}

const PUPPY_WISDOMS = [
  "\"Every sniff today is a bone for tomorrow!\"",
  "\"When in doubt, chase your tail!\"",
  "\"A good belly rub cures any ruff day!\"",
  "\"Bark softly, but carry a big squeaky toy!\"",
  "\"Squirrels are just dreams waiting to be chased!\"",
  "\"Loyalty is the sweetest treat of all!\"",
];

export const PawtyPetPlay: React.FC<PawtyPetPlayProps> = ({
  stats,
  petConfig,
  onFeed,
  onPet,
  onPlayFetch,
  onOpenMiniGame,
}) => {
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [actionAnim, setActionAnim] = useState<'idle' | 'happy' | 'eating' | 'wagging' | 'barking' | 'sleeping'>('idle');
  const [floatingEmoji, setFloatingEmoji] = useState<{ id: number; text: string; x: number }[]>([]);

  const handleNextWisdom = () => {
    audio.playBark();
    setActionAnim('barking');
    setWisdomIndex((prev) => (prev + 1) % PUPPY_WISDOMS.length);
    setTimeout(() => setActionAnim('idle'), 800);
  };

  const triggerFloatingEmoji = (text: string) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 - 40;
    setFloatingEmoji((prev) => [...prev, { id, text, x }]);
    setTimeout(() => {
      setFloatingEmoji((prev) => prev.filter((e) => e.id !== id));
    }, 1200);
  };

  const handleFeedAction = () => {
    audio.playEat();
    setActionAnim('eating');
    triggerFloatingEmoji('🍖');
    onFeed();
    setTimeout(() => setActionAnim('idle'), 1000);
  };

  const handlePetAction = () => {
    audio.playPet();
    setActionAnim('wagging');
    triggerFloatingEmoji('❤️');
    onPet();
    setTimeout(() => setActionAnim('idle'), 1000);
  };

  const handleFetchAction = () => {
    audio.playChime();
    setActionAnim('happy');
    triggerFloatingEmoji('🎾');
    onPlayFetch();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#FACC15', '#4ADE80', '#F87171'],
    });
    setTimeout(() => setActionAnim('idle'), 1200);
  };

  return (
    <div className="w-full bg-[#FDD843] min-h-[calc(100vh-120px)] p-4 sm:p-6 flex flex-col items-center select-none pb-12">
      {/* Speech Bubble with Down Pointer */}
      <div className="w-full max-w-md mb-4 flex flex-col items-center">
        <div
          id="pet-wisdom-bubble"
          onClick={handleNextWisdom}
          className="w-full bg-white border-[3px] border-black rounded-lg p-3.5 brutal-shadow cursor-pointer hover:bg-zinc-50 transition-colors relative"
          title="Tap for fresh puppy wisdom!"
        >
          <p className="font-heading font-black text-center text-sm sm:text-base text-zinc-900 tracking-wide">
            {PUPPY_WISDOMS[wisdomIndex]}
          </p>

          {/* Speech bubble pointer bottom triangle */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
          <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[13px] border-t-black -z-10" />
        </div>
      </div>

      {/* Main Puppy Interactive Stage */}
      <div className="relative my-3 flex flex-col items-center">
        {/* Floating Animation Emojis */}
        {floatingEmoji.map((item) => (
          <div
            key={item.id}
            className="absolute top-4 text-3xl font-bold animate-bounce z-20 pointer-events-none transition-all"
            style={{ transform: `translateX(${item.x}px) translateY(-40px)` }}
          >
            {item.text}
          </div>
        ))}

        {/* Checkerboard Backdrop Frame */}
        <div
          id="puppy-stage"
          onClick={handleNextWisdom}
          className="w-56 h-56 sm:w-64 sm:h-64 bg-white border-[3.5px] border-black p-3 brutal-shadow pixel-checkerboard flex items-center justify-center cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
        >
          <PixelPuppy
            size={180}
            breed={petConfig.breed}
            accessory={petConfig.accessory}
            isAnimated={true}
            actionState={actionAnim}
          />
        </div>

        {/* Puppy Name Tag */}
        <div className="mt-2 bg-black text-white px-3 py-0.5 rounded-full border border-white font-code text-xs font-bold tracking-widest uppercase">
          {petConfig.name} • {petConfig.breed}
        </div>
      </div>

      {/* STATUS METERS CARD (Matching exact screenshot bars) */}
      <div
        id="pet-status-card"
        className="w-full max-w-md bg-white border-[3px] border-black rounded-lg p-4 brutal-shadow my-4 flex flex-col gap-3"
      >
        {/* BELLY STATUS */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-code font-bold text-xs tracking-wider text-black uppercase flex items-center gap-1.5">
              <Bone className="w-3.5 h-3.5 text-red-600" />
              BELLY STATUS
            </span>
            <span className="font-code font-bold text-xs text-black">
              {stats.belly}%
            </span>
          </div>
          <div className="w-full h-5 bg-zinc-200 border-2 border-black rounded-xs overflow-hidden">
            <div
              className="h-full bg-[#B91C1C] border-r-2 border-black transition-all duration-300"
              style={{ width: `${stats.belly}%` }}
            />
          </div>
        </div>

        {/* TAIL WAGS */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-code font-bold text-xs tracking-wider text-black uppercase flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-green-600" />
              TAIL WAGS
            </span>
            <span className="font-code font-bold text-xs text-black">
              {stats.tailWags}%
            </span>
          </div>
          <div className="w-full h-5 bg-zinc-200 border-2 border-black rounded-xs overflow-hidden">
            <div
              className="h-full bg-[#4ADE80] border-r-2 border-black transition-all duration-300"
              style={{ width: `${stats.tailWags}%` }}
            />
          </div>
        </div>

        {/* ZOOMIE METER */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-code font-bold text-xs tracking-wider text-black uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              ZOOMIE METER
            </span>
            <span className="font-code font-bold text-xs text-black">
              {stats.zoomies}%
            </span>
          </div>
          <div className="w-full h-5 bg-zinc-200 border-2 border-black rounded-xs overflow-hidden">
            <div
              className="h-full bg-[#EAB308] border-r-2 border-black transition-all duration-300"
              style={{ width: `${stats.zoomies}%` }}
            />
          </div>
        </div>
      </div>

      {/* INTERACTIVE ACTION BUTTONS */}
      <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
        {/* Feed Bone */}
        <button
          type="button"
          id="action-feed-btn"
          onClick={handleFeedAction}
          className="bg-[#B91C1C] hover:bg-red-700 text-white font-code font-bold text-xs uppercase py-2.5 px-2 rounded border-2 border-black brutal-shadow-sm brutal-btn cursor-pointer flex flex-col items-center gap-1"
        >
          <Bone className="w-4 h-4" />
          <span>FEED BONE</span>
        </button>

        {/* Pet / Scratch */}
        <button
          type="button"
          id="action-pet-btn"
          onClick={handlePetAction}
          className="bg-[#15803D] hover:bg-green-700 text-white font-code font-bold text-xs uppercase py-2.5 px-2 rounded border-2 border-black brutal-shadow-sm brutal-btn cursor-pointer flex flex-col items-center gap-1"
        >
          <Heart className="w-4 h-4" />
          <span>PET BELLY</span>
        </button>

        {/* Play Fetch */}
        <button
          type="button"
          id="action-fetch-btn"
          onClick={handleFetchAction}
          className="bg-[#CA8A04] hover:bg-amber-600 text-white font-code font-bold text-xs uppercase py-2.5 px-2 rounded border-2 border-black brutal-shadow-sm brutal-btn cursor-pointer flex flex-col items-center gap-1"
        >
          <Zap className="w-4 h-4" />
          <span>ZOOMIES</span>
        </button>

        {/* Mini Game */}
        <button
          type="button"
          id="action-minigame-btn"
          onClick={() => {
            audio.playClick();
            onOpenMiniGame();
          }}
          className="bg-black hover:bg-zinc-800 text-white font-code font-bold text-xs uppercase py-2.5 px-2 rounded border-2 border-black brutal-shadow-sm brutal-btn cursor-pointer flex flex-col items-center gap-1"
        >
          <Gamepad2 className="w-4 h-4 text-[#FACC15]" />
          <span>ARCADE</span>
        </button>
      </div>
    </div>
  );
};
