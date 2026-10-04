import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Plus, Trash2, Sparkles, RotateCcw, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { ActivityItem, PetConfig } from '../types';
import { audio } from '../utils/audio';

interface DailyActivityLogProps {
  activities: ActivityItem[];
  petConfig: PetConfig;
  onToggleActivity: (id: string) => void;
  onAddActivity: (title: string, category?: string) => void;
  onDeleteActivity: (id: string) => void;
  onResetActivities: () => void;
  onReorderActivities?: (newActivities: ActivityItem[]) => void;
}

const PUPPY_QUOTES = [
  "\"YOU'RE DOING GREAT TODAY!\"",
  "\"WOOF! READY TO CRUSH IT!\"",
  "\"ONE PAW AT A TIME!\"",
  "\"YOU'RE THE BEST HOOMAN EVER!\"",
  "\"SNIFF OUT THOSE GOALS!\"",
  "\"EXTRA BELLY RUBS AWAIT!\"",
  "\"PROUD OF YOU ALWAYS!\"",
];

export const DailyActivityLog: React.FC<DailyActivityLogProps> = ({
  activities,
  petConfig,
  onToggleActivity,
  onAddActivity,
  onDeleteActivity,
  onResetActivities,
  onReorderActivities,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleNextQuote = () => {
    audio.playBark();
    setQuoteIndex((prev) => (prev + 1) % PUPPY_QUOTES.length);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    audio.playToggle(!currentlyCompleted);
    onToggleActivity(id);

    // If this completes all tasks, trigger celebratory confetti!
    if (!currentlyCompleted && completedCount + 1 === totalCount && totalCount > 0) {
      audio.playChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#22C55E', '#EF4444', '#3B82F6'],
      });
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    audio.playClick();
    onAddActivity(newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    audio.playClick();
    const updated = [...activities];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    if (onReorderActivities) {
      onReorderActivities(updated);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Quick move step for touch / buttons
  const handleMoveStep = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= activities.length) return;
    audio.playClick();
    const updated = [...activities];
    const [movedItem] = updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    if (onReorderActivities) {
      onReorderActivities(updated);
    }
  };

  return (
    <div className="w-full bg-[#82E687] min-h-[calc(100vh-120px)] p-4 sm:p-6 flex flex-col items-center select-none pb-12">
      {/* Top Card: Puppy Speech Bubble */}
      <div
        id="puppy-speech-card"
        className="w-full max-w-md bg-white border-[3px] border-black rounded-lg p-3 brutal-shadow mb-6 flex items-center gap-3 relative cursor-pointer hover:bg-zinc-50 transition-colors"
        onClick={handleNextQuote}
        title="Tap to hear more from Buster!"
      >
        {/* Puppy Avatar Box with checkerboard */}
        <div className="w-16 h-16 flex-shrink-0 bg-[#FEE24E] border-2 border-black rounded-md p-1 flex items-center justify-center pixel-checkerboard overflow-hidden shadow-inner">
          <PixelPuppy
            size={52}
            breed={petConfig.breed}
            accessory={petConfig.accessory}
            isAnimated={true}
            actionState="happy"
          />
        </div>

        {/* Speech Bubble Arrow */}
        <div className="relative flex-1">
          <div className="bg-white border-2 border-black rounded-md px-3 py-2 text-center brutal-shadow-sm">
            <p className="font-code font-bold text-xs sm:text-sm tracking-wider text-black uppercase leading-tight">
              {PUPPY_QUOTES[quoteIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <div>
          <h2
            id="activity-log-title"
            className="text-2xl sm:text-3xl font-heading font-black tracking-wider text-black drop-shadow-[2px_2px_0px_#FFFFFF] uppercase"
          >
            DAILY ACTIVITY LOG
          </h2>
          <p className="text-xs font-code font-bold text-black/70 mt-0.5">
            {completedCount} of {totalCount} completed ({progressPercent}%)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            audio.playClick();
            setIsAdding(!isAdding);
          }}
          className="bg-black hover:bg-zinc-800 active:scale-95 text-white font-heading font-bold text-xs px-3 py-2 rounded-md border-2 border-black brutal-shadow-sm flex items-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>NEW</span>
        </button>
      </div>

      {/* Daily Progress Bar */}
      <div className="w-full max-w-md bg-white/90 border-2 border-black rounded-md p-1.5 brutal-shadow-sm mb-4">
        <div className="w-full bg-zinc-200 h-3 border border-black rounded-sm overflow-hidden flex">
          <div
            className="bg-[#22C55E] h-full transition-all duration-300 border-r border-black"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add New Activity Input Card (Expandable) */}
      {isAdding && (
        <form
          onSubmit={handleAddNew}
          className="w-full max-w-md bg-white border-[3px] border-black rounded-md p-3 brutal-shadow mb-4 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
        >
          <label className="text-xs font-code font-bold uppercase text-zinc-700">
            Activity Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Afternoon Walk, Read 10 Pages..."
              className="flex-1 border-2 border-black px-3 py-1.5 font-heading text-sm rounded bg-zinc-50 focus:outline-none focus:bg-white"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#22C55E] hover:bg-green-500 font-heading font-bold text-xs uppercase px-4 py-1.5 border-2 border-black rounded brutal-shadow-sm cursor-pointer active:scale-95"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Activity Items List (Matching exact screenshot styling with Drag & Drop) */}
      <div className="w-full max-w-md flex flex-col gap-2.5">
        {activities.map((item, index) => {
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <div
              key={item.id}
              id={`activity-item-${item.id}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => handleDragLeave(index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`w-full bg-white border-[3px] border-black rounded-md p-3 sm:p-3.5 brutal-shadow flex items-center justify-between group transition-all select-none ${
                isDragging
                  ? 'opacity-40 scale-98 border-dashed bg-yellow-50'
                  : isDragOver
                  ? 'border-dashed border-[#585308] bg-[#FEE24E]/30 translate-y-1 shadow-none'
                  : 'hover:translate-y-[-1px]'
              }`}
            >
              {/* Left Side: Drag Handle & Task Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                {/* Drag Handle Icon */}
                <div
                  className="text-zinc-400 hover:text-black active:text-black cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-zinc-100 touch-none flex items-center justify-center flex-shrink-0"
                  title="Drag up or down to reorder"
                >
                  <GripVertical className="w-4 h-4 stroke-[2.5]" />
                </div>

                {/* Task Name */}
                <span
                  className={`font-heading font-bold text-base sm:text-lg tracking-wide select-none truncate ${
                    item.completed ? 'line-through text-zinc-400' : 'text-black'
                  }`}
                >
                  {item.title}
                </span>
              </div>

              {/* Right side controls: Reorder arrows + Delete button + Brutalist Checkbox */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Quick Step Buttons for easy one-click / mobile reordering */}
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveStep(index, 'up')}
                    className="p-0.5 text-zinc-500 hover:text-black disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move item up"
                    aria-label="Move item up"
                  >
                    <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    disabled={index === activities.length - 1}
                    onClick={() => handleMoveStep(index, 'down')}
                    className="p-0.5 text-zinc-500 hover:text-black disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move item down"
                    aria-label="Move item down"
                  >
                    <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                {/* Delete button (on hover/click) */}
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    onDeleteActivity(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity cursor-pointer"
                  title="Delete activity"
                  aria-label="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Neo-brutalist Checkbox (Square with thick black border) */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.id, item.completed)}
                  className={`w-9 h-9 border-2 border-black rounded-sm flex items-center justify-center font-code font-black text-xl cursor-pointer transition-colors ${
                    item.completed
                      ? 'bg-[#555208] text-white shadow-inner'
                      : 'bg-zinc-100/70 hover:bg-zinc-200'
                  }`}
                  title={item.completed ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {item.completed && (
                    <span className="font-heading font-black text-lg select-none">
                      X
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="w-full max-w-md mt-6 flex justify-between items-center text-xs font-code font-bold text-black/70">
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onResetActivities();
          }}
          className="flex items-center gap-1 hover:text-black underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All For Today</span>
        </button>

        {progressPercent === 100 && (
          <span className="flex items-center gap-1 text-black font-black bg-white px-2 py-0.5 border border-black rounded">
            <Sparkles className="w-3 h-3 text-amber-500" />
            ALL DONE! +50 PAW POINTS
          </span>
        )}
      </div>
    </div>
  );
};
