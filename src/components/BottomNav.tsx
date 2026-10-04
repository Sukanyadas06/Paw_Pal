import React from 'react';
import { ClipboardList, FileText, Gamepad2, Trophy } from 'lucide-react';
import { TabType } from '../types';
import { audio } from '../utils/audio';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'log' as TabType,
      label: 'LOG',
      icon: ClipboardList,
    },
    {
      id: 'diary' as TabType,
      label: 'DIARY',
      icon: FileText,
    },
    {
      id: 'paw-ty' as TabType,
      label: 'PAW-TY',
      icon: Gamepad2,
    },
    {
      id: 'prizes' as TabType,
      label: 'PRIZES',
      icon: Trophy,
    },
  ];

  const handleSelect = (tab: TabType) => {
    if (currentTab !== tab) {
      audio.playClick();
      onChangeTab(tab);
    }
  };

  return (
    <nav
      id="bottom-nav"
      className="w-full bg-[#E5E2D9] border-t-[3px] border-black px-3 py-2 flex items-center justify-around z-30 sticky bottom-0"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            id={`nav-tab-${tab.id}`}
            onClick={() => handleSelect(tab.id)}
            className={`flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
              isActive
                ? 'bg-[#E13434] text-white px-4 py-1.5 rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000000] -translate-y-1'
                : 'text-zinc-700 hover:text-black px-3 py-1 hover:bg-black/5 rounded-xl'
            }`}
          >
            <Icon
              className={`w-6 h-6 stroke-[2.5] ${
                isActive ? 'text-white' : 'text-zinc-800'
              }`}
            />
            <span
              className={`text-[11px] font-heading font-black tracking-wider uppercase mt-0.5 ${
                isActive ? 'text-white drop-shadow-[1px_1px_0px_#000000]' : 'text-zinc-700'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
