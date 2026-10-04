import React, { useState } from 'react';
import { Heart, Smile, Meh, Frown, Sparkles, Trash2, Edit3, Check } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { DiaryEntry, PetConfig, PuppyMood } from '../types';
import { audio } from '../utils/audio';

interface PuppyPlaybookDiaryProps {
  entries: DiaryEntry[];
  petConfig: PetConfig;
  onAddEntry: (content: string, mood: PuppyMood) => void;
  onDeleteEntry: (id: string) => void;
  onToggleLike: (id: string) => void;
}

export const PuppyPlaybookDiary: React.FC<PuppyPlaybookDiaryProps> = ({
  entries,
  petConfig,
  onAddEntry,
  onDeleteEntry,
  onToggleLike,
}) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<PuppyMood>('heart');
  const [activeFilter, setActiveFilter] = useState<'all' | 'liked'>('all');

  // Format today's date badge e.g. "OCT 24"
  const today = new Date();
  const monthStr = today.toLocaleString('default', { month: 'short' }).toUpperCase();
  const dayStr = today.getDate();
  const todayBadge = `${monthStr} ${dayStr}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    audio.playChime();
    onAddEntry(content.trim(), selectedMood);
    setContent('');
  };

  const getMoodIcon = (mood: PuppyMood) => {
    switch (mood) {
      case 'heart':
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'happy':
        return <Smile className="w-5 h-5 text-amber-500" />;
      case 'excited':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'sad':
        return <Frown className="w-5 h-5 text-blue-500" />;
      case 'neutral':
      default:
        return <Meh className="w-5 h-5 text-zinc-700" />;
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === 'liked') return entry.liked;
    return true;
  });

  return (
    <div className="w-full bg-[#E03A3A] min-h-[calc(100vh-120px)] p-4 sm:p-6 flex flex-col items-center select-none pb-12">
      {/* Top Section: Title & Polaroid Sticker */}
      <div className="w-full max-w-md flex items-start justify-between mb-4">
        <div>
          <h2
            id="diary-title"
            className="text-2xl sm:text-3xl font-heading font-black tracking-wider text-white drop-shadow-[2px_2px_0px_#000000] uppercase"
          >
            PUPPY’S<br />PLAYBOOK
          </h2>
          <p className="text-xs font-code font-bold text-white/90 tracking-widest uppercase mt-1">
            SNIFFING OUT THE DAY
          </p>
        </div>

        {/* Top Right Sticker: *scribble with Pixel Puppy */}
        <div className="relative rotate-2 hover:rotate-0 transition-transform">
          {/* Scribble Tape Banner */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-2 py-0.5 z-10 brutal-shadow-sm -rotate-3">
            <span className="text-[10px] font-code font-bold tracking-tight text-black">
              *scribble
            </span>
          </div>

          {/* Polaroid Card */}
          <div className="w-20 h-22 bg-white border-[2.5px] border-black p-1 pt-3 brutal-shadow flex flex-col items-center justify-center pixel-checkerboard">
            <PixelPuppy
              size={56}
              breed={petConfig.breed}
              accessory={petConfig.accessory}
              isAnimated={true}
              actionState="wagging"
            />
          </div>
        </div>
      </div>

      {/* NEW SNIFF CARD (Matching exact screenshot layout) */}
      <form
        onSubmit={handleSubmit}
        id="new-sniff-card"
        className="w-full max-w-md bg-white border-[3.5px] border-black rounded-sm brutal-shadow mb-6 overflow-hidden"
      >
        {/* Top Tag Header */}
        <div className="bg-[#E6BE25] border-b-[3px] border-black px-3 py-1.5 flex items-center justify-between">
          <span className="font-code font-black text-xs tracking-wider text-black uppercase">
            NEW SNIFF
          </span>
          <span className="font-code font-black text-xs tracking-wider text-black uppercase">
            {todayBadge}
          </span>
        </div>

        {/* Lined Notebook Writing Area */}
        <div className="p-3 sm:p-4 bg-[#F8F8F8]">
          <div className="border-2 border-black bg-white rounded-sm p-3 brutal-shadow-sm relative">
            <textarea
              id="sniff-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's the howl for today?..."
              rows={4}
              className="w-full bg-transparent resize-none font-heading text-sm text-black focus:outline-none lined-paper placeholder:text-zinc-500"
            />

            {/* Mood selector pills */}
            <div className="mt-2 pt-2 border-t border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-code font-bold text-zinc-500 uppercase mr-1">
                  Mood:
                </span>
                {(['heart', 'happy', 'neutral', 'excited', 'sad'] as PuppyMood[]).map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setSelectedMood(mood);
                    }}
                    className={`p-1 rounded border ${
                      selectedMood === mood
                        ? 'border-black bg-amber-100 scale-110 shadow-sm'
                        : 'border-transparent hover:bg-zinc-100 opacity-60'
                    }`}
                    title={mood}
                  >
                    {getMoodIcon(mood)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BURY BONE Submit Button */}
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              id="bury-bone-btn"
              disabled={!content.trim()}
              className="bg-[#78EB89] hover:bg-[#68DE79] disabled:opacity-50 active:scale-95 text-black font-code font-black text-sm uppercase px-5 py-2 border-[2.5px] border-black brutal-shadow brutal-btn cursor-pointer transition-all flex items-center gap-2"
            >
              <span>BURY BONE</span>
            </button>
          </div>
        </div>
      </form>

      {/* OLD SCENTS SECTION DIVIDER */}
      <div className="w-full max-w-md my-3 flex items-center justify-center gap-3">
        <div className="flex-1 h-[3px] bg-black" />
        <span className="font-code font-black text-sm sm:text-base tracking-widest text-black uppercase bg-[#E03A3A] px-2 text-center text-white drop-shadow-[1px_1px_0px_#000000]">
          OLD SCENTS
        </span>
        <div className="flex-1 h-[3px] bg-black" />
      </div>

      {/* Entry Filters */}
      <div className="w-full max-w-md mb-4 flex justify-end gap-2 text-xs font-code font-bold">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded border-2 border-black cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-zinc-100'
          }`}
        >
          ALL ({entries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('liked')}
          className={`px-2.5 py-1 rounded border-2 border-black cursor-pointer flex items-center gap-1 ${
            activeFilter === 'liked'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-zinc-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          FAVORITES
        </button>
      </div>

      {/* TIMELINE OF ENTRIES (Matching Screenshot style with center pin and date stamp) */}
      <div className="w-full max-w-md flex flex-col gap-5">
        {filteredEntries.length === 0 ? (
          <div className="w-full bg-white border-[3px] border-black rounded-md p-6 text-center brutal-shadow">
            <p className="font-heading font-bold text-sm text-zinc-600">
              No scents recorded yet. Write your first howl above!
            </p>
          </div>
        ) : (
          filteredEntries.map((entry, idx) => {
            const pinBg =
              entry.pinColor === 'yellow'
                ? 'bg-[#EAB308]'
                : entry.pinColor === 'green'
                ? 'bg-[#22C55E]'
                : entry.pinColor === 'red'
                ? 'bg-[#EF4444]'
                : 'bg-[#3B82F6]';

            return (
              <div key={entry.id} className="relative group">
                {/* Connecting Timeline Pin */}
                <div
                  className={`w-6 h-6 rounded-full border-2 border-black ${pinBg} absolute -top-3 left-1/2 -translate-x-1/2 z-10 shadow-sm`}
                />

                {/* Entry Card */}
                <div
                  id={`diary-entry-${entry.id}`}
                  className="w-full bg-white border-[3px] border-black rounded-sm p-4 pt-5 brutal-shadow hover:translate-y-[-1px] transition-transform"
                >
                  {/* Top Header inside card: Date box & Mood icon */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Date Stamp Box */}
                    <div className="border-2 border-black px-2.5 py-1 bg-zinc-50 font-code font-black text-xs tracking-wider uppercase text-black">
                      {entry.dateStr}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          audio.playPet();
                          onToggleLike(entry.id);
                        }}
                        className="cursor-pointer p-1 hover:scale-110 transition-transform"
                        title={entry.liked ? 'Remove Favorite' : 'Save Favorite'}
                      >
                        {getMoodIcon(entry.mood)}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          onDeleteEntry(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Note Content */}
                  <p className="font-heading text-sm sm:text-base text-zinc-900 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
