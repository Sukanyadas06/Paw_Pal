import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Lock, Star, Award, Check, Sparkles, Flame } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { Achievement, PetConfig, StreakData } from '../types';
import { audio } from '../utils/audio';

interface PawsomePrizesProps {
  streakData: StreakData;
  achievements: Achievement[];
  petConfig: PetConfig;
  onClaimAchievement: (id: string) => void;
  onEquipAccessory: (accessory: PetConfig['accessory']) => void;
}

export const PawsomePrizes: React.FC<PawsomePrizesProps> = ({
  streakData,
  achievements,
  petConfig,
  onClaimAchievement,
  onEquipAccessory,
}) => {
  const handleClaim = (ach: Achievement) => {
    if (ach.status === 'unlocked') {
      audio.playChime();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#22C55E', '#EC4899', '#3B82F6'],
      });
      onClaimAchievement(ach.id);
      if (ach.rewardAccessory) {
        onEquipAccessory(ach.rewardAccessory);
      }
    }
  };

  // 6-segmented streak progress bar calculation
  const streakSegments = 7;
  const filledSegments = Math.min(streakSegments, Math.max(1, streakData.currentStreak % 7 || 7));

  return (
    <div className="w-full bg-[#FBD206] min-h-[calc(100vh-120px)] p-4 sm:p-6 flex flex-col items-center select-none pb-12">
      {/* Top Header with Angled "LEVEL UP!" Badge */}
      <div className="w-full max-w-md relative mb-4 flex items-center justify-between">
        <h2
          id="prizes-heading"
          className="text-2xl sm:text-3xl font-heading font-black tracking-wider text-black drop-shadow-[2px_2px_0px_#FFFFFF] uppercase"
        >
          PAWSOME PRIZES
        </h2>

        {/* Level Up Angled Badge */}
        <div className="bg-[#15803D] border-[2.5px] border-black px-3 py-1 rounded-sm rotate-6 brutal-shadow-sm flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span className="font-code font-black text-xs text-white uppercase tracking-wider">
            LEVEL UP!
          </span>
        </div>
      </div>

      {/* MAIN STREAK HERO CARD */}
      <div
        id="streak-hero-card"
        className="w-full max-w-md bg-white border-[3.5px] border-black rounded-sm p-4 brutal-shadow mb-6 flex flex-col items-center"
      >
        {/* Puppy Portrait Box */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white border-[2.5px] border-black p-1.5 brutal-shadow-sm pixel-checkerboard flex items-center justify-center mb-4">
          <PixelPuppy
            size={110}
            breed={petConfig.breed}
            accessory={petConfig.accessory}
            isAnimated={true}
            actionState="happy"
          />
        </div>

        {/* Divider line */}
        <div className="w-full h-[2px] bg-black mb-3" />

        {/* Wag-A-Long Streak Header & Counter */}
        <div className="w-full flex items-center justify-between mb-2">
          <span className="font-code font-bold text-xs tracking-wider text-black uppercase flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            WAG-A-LONG STREAK
          </span>
          <span className="font-heading font-black text-xl sm:text-2xl text-black">
            {streakData.currentStreak} DAYS
          </span>
        </div>

        {/* Segmented Streak Bar */}
        <div className="w-full h-7 bg-zinc-200 border-2 border-black rounded-xs flex p-0.5 gap-1">
          {Array.from({ length: streakSegments }).map((_, idx) => {
            const isFilled = idx < filledSegments;
            return (
              <div
                key={idx}
                className={`flex-1 h-full border border-black/30 transition-all ${
                  isFilled ? 'bg-[#15803D]' : 'bg-zinc-100'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ACHIEVEMENTS GRID (2x2 matching exact screenshots) */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        {achievements.map((ach) => {
          const isUnlocked = ach.status === 'unlocked';
          const isClaimed = ach.status === 'claimed';
          const isInProgress = ach.status === 'in_progress';
          const isLocked = ach.status === 'locked';

          if (isLocked) {
            return (
              <div
                key={ach.id}
                className="bg-[#D8CD93]/80 border-[3px] border-black rounded-sm p-4 h-44 flex flex-col items-center justify-center brutal-shadow-sm opacity-85"
              >
                <Lock className="w-10 h-10 text-[#555208] stroke-[2.5]" />
                <span className="font-code font-bold text-xs text-[#555208] uppercase mt-2">
                  LOCKED
                </span>
              </div>
            );
          }

          return (
            <div
              key={ach.id}
              id={`achievement-${ach.id}`}
              className="bg-white border-[3px] border-black rounded-sm p-3.5 brutal-shadow flex flex-col items-center justify-between text-center relative h-48"
            >
              {/* Status indicator dot */}
              <div
                className={`w-3 h-3 rounded-full border border-black absolute top-2.5 left-2.5 ${
                  isClaimed || isUnlocked ? 'bg-[#15803D]' : 'bg-zinc-300'
                }`}
              />

              {/* Icon */}
              <div className="mt-1">
                {ach.iconType === 'trophy' ? (
                  <Trophy className="w-9 h-9 text-[#555208] stroke-[2.5]" />
                ) : ach.iconType === 'star' ? (
                  <Star className="w-9 h-9 text-amber-500 fill-amber-500 stroke-[2.5]" />
                ) : (
                  <Lock className="w-9 h-9 text-zinc-700 stroke-[2.5]" />
                )}
              </div>

              {/* Text content */}
              <div>
                <h3 className="font-code font-black text-xs sm:text-sm uppercase tracking-tight text-black leading-tight">
                  {ach.title}
                </h3>
                <p className="font-heading text-xs text-zinc-600 mt-0.5">
                  {isClaimed
                    ? 'Claimed!'
                    : isUnlocked
                    ? 'Unlocked!'
                    : isInProgress
                    ? `${ach.progress}/${ach.maxProgress}`
                    : 'In Progress'}
                </p>
              </div>

              {/* Action / Progress Area */}
              <div className="w-full mt-1">
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(ach)}
                    className="w-full bg-[#15803D] hover:bg-green-800 text-white font-code font-black text-xs uppercase py-1.5 px-2 border-2 border-black rounded brutal-shadow-sm brutal-btn cursor-pointer"
                  >
                    FETCHED!
                  </button>
                ) : isClaimed ? (
                  <div className="w-full bg-zinc-100 text-black border-2 border-black font-code font-bold text-[11px] py-1 rounded flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#15803D] stroke-[3]" />
                    FETCHED
                  </div>
                ) : (
                  /* Mini progress bar for in progress */
                  <div className="w-full h-4 bg-zinc-200 border-2 border-black rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-[#15803D] transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((ach.progress / ach.maxProgress) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
