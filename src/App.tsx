import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DailyActivityLog } from './components/DailyActivityLog';
import { PuppyPlaybookDiary } from './components/PuppyPlaybookDiary';
import { PawtyPetPlay } from './components/PawtyPetPlay';
import { PawsomePrizes } from './components/PawsomePrizes';
import { SettingsModal } from './components/SettingsModal';
import { FetchMiniGameModal } from './components/FetchMiniGameModal';
import {
  TabType,
  ActivityItem,
  DiaryEntry,
  PetStats,
  PetConfig,
  Achievement,
  StreakData,
  PuppyMood,
  PuppyAccessory,
} from './types';
import { audio } from './utils/audio';

const STORAGE_KEYS = {
  ACTIVITIES: 'pocketpal_activities_v1',
  DIARY: 'pocketpal_diary_v1',
  STATS: 'pocketpal_stats_v1',
  CONFIG: 'pocketpal_config_v1',
  ACHIEVEMENTS: 'pocketpal_achievements_v1',
  STREAK: 'pocketpal_streak_v1',
};

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { id: '1', title: 'Morning Workout', completed: false },
  { id: '2', title: 'Breakfast', completed: true },
  { id: '3', title: 'Morning Walk', completed: false },
  { id: '4', title: 'Afternoon Rest', completed: false },
  { id: '5', title: 'Reading Time', completed: false },
  { id: '6', title: 'Evening Meditation', completed: false },
];

const DEFAULT_DIARY: DiaryEntry[] = [
  {
    id: 'entry-1',
    dateStr: 'OCT 23',
    fullDate: new Date(Date.now() - 86400000).toISOString(),
    content:
      'We went for a 20-minute walk around the block. Discovered a new fire hydrant. Very exciting day.',
    mood: 'heart',
    pinColor: 'yellow',
    liked: true,
  },
  {
    id: 'entry-2',
    dateStr: 'OCT 22',
    fullDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    content:
      'Refused to eat the new premium kibble. Wanted bacon instead. Stood by fridge for 2 hours until hooman surrendered a treat.',
    mood: 'neutral',
    pinColor: 'green',
    liked: false,
  },
];

const DEFAULT_STATS: PetStats = {
  belly: 80,
  tailWags: 60,
  zoomies: 40,
  happiness: 75,
  lastInteracted: Date.now(),
};

const DEFAULT_CONFIG: PetConfig = {
  name: 'Buster',
  breed: 'golden',
  accessory: 'none',
  soundEnabled: true,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: '7 DAYS OF FETCH',
    subtitle: 'Unlocked!',
    description: 'Keep a 7-day streak of daily activities.',
    iconType: 'trophy',
    status: 'unlocked',
    progress: 7,
    maxProgress: 7,
    rewardAccessory: 'party-hat',
  },
  {
    id: 'ach-2',
    title: 'MONTHLY BARKER',
    subtitle: 'In Progress',
    description: 'Complete daily habits for 30 consecutive days.',
    iconType: 'lock',
    status: 'in_progress',
    progress: 14,
    maxProgress: 30,
    rewardAccessory: 'crown',
  },
  {
    id: 'ach-3',
    title: 'SUPER SNIFFER',
    subtitle: 'In Progress',
    description: 'Write 5 diary entries in Puppy’s Playbook.',
    iconType: 'star',
    status: 'in_progress',
    progress: 2,
    maxProgress: 5,
    rewardAccessory: 'sunglasses',
  },
  {
    id: 'ach-4',
    title: 'ZOOMIE MASTER',
    subtitle: 'Locked',
    description: 'Score 100+ points in Puppy Fetch Arcade.',
    iconType: 'lock',
    status: 'locked',
    progress: 0,
    maxProgress: 100,
    rewardAccessory: 'red-bandana',
  },
];

const DEFAULT_STREAK: StreakData = {
  currentStreak: 14,
  maxStreak: 14,
  totalTasksCompleted: 48,
  totalDiaryEntries: 2,
  totalBonesFed: 12,
  lastActiveDate: new Date().toDateString(),
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('log');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);

  // Persistent States
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
    } catch {
      return DEFAULT_ACTIVITIES;
    }
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIARY);
      return saved ? JSON.parse(saved) : DEFAULT_DIARY;
    } catch {
      return DEFAULT_DIARY;
    }
  });

  const [petStats, setPetStats] = useState<PetStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [petConfig, setPetConfig] = useState<PetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  });

  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved ? JSON.parse(saved) : DEFAULT_STREAK;
    } catch {
      return DEFAULT_STREAK;
    }
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(petStats));
  }, [petStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(petConfig));
    audio.setEnabled(petConfig.soundEnabled);
  }, [petConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streakData));
  }, [streakData]);

  // Activity Handlers
  const handleToggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = !item.completed;
          if (nextVal) {
            // Reward pet stats
            setPetStats((ps) => ({
              ...ps,
              tailWags: Math.min(100, ps.tailWags + 10),
              happiness: Math.min(100, ps.happiness + 5),
            }));
            setStreakData((sd) => ({
              ...sd,
              totalTasksCompleted: sd.totalTasksCompleted + 1,
            }));
          }
          return { ...item, completed: nextVal };
        }
        return item;
      })
    );
  };

  const handleAddActivity = (title: string, category?: string) => {
    const newItem: ActivityItem = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
    };
    setActivities((prev) => [...prev, newItem]);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleResetActivities = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, completed: false })));
  };

  // Diary Handlers
  const handleAddDiaryEntry = (content: string, mood: PuppyMood) => {
    const today = new Date();
    const monthStr = today.toLocaleString('default', { month: 'short' }).toUpperCase();
    const dayStr = today.getDate();
    const pinColors: ('yellow' | 'green' | 'red' | 'blue' | 'pink')[] = [
      'yellow',
      'green',
      'red',
      'blue',
      'pink',
    ];
    const randomPin = pinColors[Math.floor(Math.random() * pinColors.length)];

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      dateStr: `${monthStr} ${dayStr}`,
      fullDate: today.toISOString(),
      content,
      mood,
      pinColor: randomPin,
      liked: false,
    };

    setDiaryEntries((prev) => [newEntry, ...prev]);

    // Boost stats & update achievements
    setPetStats((ps) => ({
      ...ps,
      tailWags: Math.min(100, ps.tailWags + 15),
      zoomies: Math.min(100, ps.zoomies + 10),
    }));

    setStreakData((sd) => ({
      ...sd,
      totalDiaryEntries: sd.totalDiaryEntries + 1,
    }));

    // Update Super Sniffer progress
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'ach-3') {
          const nextCount = (ach.progress || 0) + 1;
          const isDone = nextCount >= ach.maxProgress;
          return {
            ...ach,
            progress: nextCount,
            status: isDone ? 'unlocked' : 'in_progress',
          };
        }
        return ach;
      })
    );
  };

  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleLikeDiaryEntry = (id: string) => {
    setDiaryEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, liked: !e.liked } : e))
    );
  };

  // Pet Care Action Handlers
  const handleFeedPet = () => {
    setPetStats((prev) => ({
      ...prev,
      belly: Math.min(100, prev.belly + 20),
      happiness: Math.min(100, prev.happiness + 10),
      lastInteracted: Date.now(),
    }));
    setStreakData((sd) => ({
      ...sd,
      totalBonesFed: sd.totalBonesFed + 1,
    }));
  };

  const handlePetBelly = () => {
    setPetStats((prev) => ({
      ...prev,
      tailWags: Math.min(100, prev.tailWags + 20),
      happiness: Math.min(100, prev.happiness + 15),
      lastInteracted: Date.now(),
    }));
  };

  const handlePlayFetch = () => {
    setPetStats((prev) => ({
      ...prev,
      zoomies: Math.min(100, prev.zoomies + 25),
      belly: Math.max(10, prev.belly - 10),
      happiness: Math.min(100, prev.happiness + 20),
      lastInteracted: Date.now(),
    }));
  };

  const handleGameEnd = (score: number) => {
    const zoomieBoost = Math.min(60, Math.round(score / 2));
    setPetStats((prev) => ({
      ...prev,
      zoomies: Math.min(100, prev.zoomies + zoomieBoost),
      happiness: 100,
    }));

    if (score >= 50) {
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'ach-4') {
            return {
              ...ach,
              status: 'unlocked',
              progress: score,
            };
          }
          return ach;
        })
      );
    }
  };

  const handleClaimAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === id ? { ...ach, status: 'claimed' } : ach))
    );
  };

  const handleEquipAccessory = (accessory: PuppyAccessory) => {
    setPetConfig((prev) => ({ ...prev, accessory }));
  };

  const handleResetData = () => {
    setActivities(DEFAULT_ACTIVITIES);
    setDiaryEntries(DEFAULT_DIARY);
    setPetStats(DEFAULT_STATS);
    setPetConfig(DEFAULT_CONFIG);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStreakData(DEFAULT_STREAK);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-zinc-800 flex justify-center items-start sm:py-6 p-0">
      {/* Device / App Container (Pixel styled frame) */}
      <div className="w-full sm:max-w-[430px] min-h-screen sm:min-h-[860px] bg-white sm:rounded-3xl sm:border-[4px] sm:border-black overflow-hidden flex flex-col shadow-2xl relative">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          petConfig={petConfig}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onPuppyTap={() => {
            setPetStats((ps) => ({
              ...ps,
              tailWags: Math.min(100, ps.tailWags + 5),
            }));
          }}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 w-full overflow-y-auto">
          {currentTab === 'log' && (
            <DailyActivityLog
              activities={activities}
              petConfig={petConfig}
              onToggleActivity={handleToggleActivity}
              onAddActivity={handleAddActivity}
              onDeleteActivity={handleDeleteActivity}
              onResetActivities={handleResetActivities}
            />
          )}

          {currentTab === 'diary' && (
            <PuppyPlaybookDiary
              entries={diaryEntries}
              petConfig={petConfig}
              onAddEntry={handleAddDiaryEntry}
              onDeleteEntry={handleDeleteDiaryEntry}
              onToggleLike={handleToggleLikeDiaryEntry}
            />
          )}

          {currentTab === 'paw-ty' && (
            <PawtyPetPlay
              stats={petStats}
              petConfig={petConfig}
              onFeed={handleFeedPet}
              onPet={handlePetBelly}
              onPlayFetch={handlePlayFetch}
              onOpenMiniGame={() => setIsMiniGameOpen(true)}
            />
          )}

          {currentTab === 'prizes' && (
            <PawsomePrizes
              streakData={streakData}
              achievements={achievements}
              petConfig={petConfig}
              onClaimAchievement={handleClaimAchievement}
              onEquipAccessory={handleEquipAccessory}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

        {/* Modals */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={petConfig}
          onUpdateConfig={setPetConfig}
          onResetData={handleResetData}
        />

        <FetchMiniGameModal
          isOpen={isMiniGameOpen}
          onClose={() => setIsMiniGameOpen(false)}
          petConfig={petConfig}
          onGameEnd={handleGameEnd}
        />
      </div>
    </div>
  );
}
