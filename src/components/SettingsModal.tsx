import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, RefreshCw, Palette, Shield } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { PetConfig, PuppyBreed, PuppyAccessory } from '../types';
import { audio } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PetConfig;
  onUpdateConfig: (newConfig: PetConfig) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onResetData,
}) => {
  const [name, setName] = useState(config.name);
  const [breed, setBreed] = useState<PuppyBreed>(config.breed);
  const [accessory, setAccessory] = useState<PuppyAccessory>(config.accessory);
  const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled);

  if (!isOpen) return null;

  const breeds: { id: PuppyBreed; label: string }[] = [
    { id: 'golden', label: 'Golden Retriever' },
    { id: 'corgi', label: 'Welsh Corgi' },
    { id: 'shiba', label: 'Shiba Inu' },
    { id: 'dalmatian', label: 'Dalmatian' },
    { id: 'midnight', label: 'Midnight Pup' },
  ];

  const accessories: { id: PuppyAccessory; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'party-hat', label: 'Party Hat 🥳' },
    { id: 'sunglasses', label: 'Cool Shades 😎' },
    { id: 'red-bandana', label: 'Red Bandana 🧣' },
    { id: 'bowler', label: 'Detective Hat 🕵️' },
    { id: 'crown', label: 'Royal Crown 👑' },
  ];

  const handleSave = () => {
    audio.playChime();
    audio.setEnabled(soundEnabled);
    onUpdateConfig({
      name: name.trim() || 'Buster',
      breed,
      accessory,
      soundEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[3.5px] border-black rounded-lg brutal-shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#585308] border-b-[3px] border-black p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FEE135] rounded-md border border-black flex items-center justify-center">
              <PixelPuppy size={24} breed={breed} accessory={accessory} isAnimated={false} />
            </div>
            <h3 className="font-heading font-black text-lg text-white uppercase tracking-wider">
              PUPPY SETTINGS
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded border border-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 font-heading">
          {/* Live Preview Box */}
          <div className="w-full bg-[#FEE24E]/40 border-2 border-black rounded-md p-3 flex items-center justify-center pixel-checkerboard">
            <PixelPuppy size={90} breed={breed} accessory={accessory} isAnimated={true} />
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-code font-bold uppercase text-zinc-700 mb-1">
              Pet Companion Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 text-sm rounded bg-zinc-50 focus:bg-white focus:outline-none"
              placeholder="e.g. Buster, Barnaby, Daisy..."
            />
          </div>

          {/* Breed selection */}
          <div>
            <label className="block text-xs font-code font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              Choose Breed / Fur Coat
            </label>
            <div className="grid grid-cols-2 gap-2">
              {breeds.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setBreed(b.id);
                  }}
                  className={`p-2 border-2 rounded text-xs font-code font-bold uppercase transition-all cursor-pointer ${
                    breed === b.id
                      ? 'border-black bg-[#FEE135] brutal-shadow-sm font-black'
                      : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessory dressing room */}
          <div>
            <label className="block text-xs font-code font-bold uppercase text-zinc-700 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Equip Accessory
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {accessories.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setAccessory(acc.id);
                  }}
                  className={`p-1.5 border-2 rounded text-[11px] font-code font-bold uppercase truncate transition-all cursor-pointer ${
                    accessory === acc.id
                      ? 'border-black bg-[#78EB89] brutal-shadow-sm font-black'
                      : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
            <div>
              <span className="font-code font-bold text-xs uppercase text-zinc-800 block">
                8-Bit Sound Effects
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">
                Nostalgic barks, clicks and chimes
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                audio.setEnabled(next);
                if (next) audio.playBark();
              }}
              className={`p-2 border-2 border-black rounded cursor-pointer ${
                soundEnabled ? 'bg-[#78EB89]' : 'bg-zinc-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-500" />}
            </button>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset habits, diary, and stats back to default demo?')) {
                  audio.playClick();
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-red-600 hover:text-red-800 underline font-code font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Demo Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-100 border-t-2 border-black p-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black rounded text-xs font-code font-bold uppercase hover:bg-zinc-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#78EB89] hover:bg-green-400 border-2 border-black rounded text-xs font-code font-black uppercase brutal-shadow-sm cursor-pointer active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
