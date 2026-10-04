import React from 'react';
import { Settings } from 'lucide-react';
import { PixelPuppy } from './PixelPuppy';
import { PetConfig, TabType } from '../types';
import { audio } from '../utils/audio';

interface HeaderProps {
  currentTab: TabType;
  petConfig: PetConfig;
  onOpenSettings: () => void;
  onPuppyTap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  petConfig,
  onOpenSettings,
  onPuppyTap,
}) => {
  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'diary':
        return 'PUPPY’S PLAYBOOK';
      case 'prizes':
        return 'PAW-TY PRIZES';
      case 'paw-ty':
        return 'POCKET PAL PRO';
      case 'log':
      default:
        return 'POCKET PAL PRO';
    }
  };

  return (
    <header className="w-full bg-[#585308] border-b-[3px] border-black px-4 py-3 flex items-center justify-between shadow-md z-30 sticky top-0">
      {/* Left: Pixel Puppy Icon Badge */}
      <button
        type="button"
        id="header-puppy-btn"
        onClick={() => {
          audio.playBark();
          if (onPuppyTap) onPuppyTap();
        }}
        className="w-11 h-11 bg-[#FEE135] rounded-xl border-[2.5px] border-black flex items-center justify-center p-0.5 brutal-shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer overflow-hidden"
        title="Tap Buster for a bark!"
      >
        <PixelPuppy
          size={36}
          breed={petConfig.breed}
          accessory={petConfig.accessory}
          isAnimated={false}
        />
      </button>

      {/* Center: Title */}
      <h1
        id="header-app-title"
        className="text-white text-xl sm:text-2xl font-heading tracking-wide uppercase font-bold text-center drop-shadow-[2px_2px_0px_#000000] px-2 truncate"
      >
        {getHeaderTitle()}
      </h1>

      {/* Right: Settings Gear */}
      <button
        type="button"
        id="header-settings-btn"
        onClick={() => {
          audio.playClick();
          onOpenSettings();
        }}
        className="w-10 h-10 bg-black/40 hover:bg-black/60 active:scale-95 border-2 border-black rounded-lg text-white flex items-center justify-center cursor-pointer transition-all"
        title="Open Settings"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>
    </header>
  );
};
