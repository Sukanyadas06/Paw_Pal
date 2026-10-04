export type TabType = 'log' | 'diary' | 'paw-ty' | 'prizes';

export type PuppyBreed = 'golden' | 'corgi' | 'shiba' | 'dalmatian' | 'midnight';
export type PuppyAccessory = 'none' | 'party-hat' | 'sunglasses' | 'red-bandana' | 'bowler' | 'crown';
export type PuppyMood = 'heart' | 'happy' | 'neutral' | 'sad' | 'excited' | 'sleepy';

export interface ActivityItem {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
  time?: string;
}

export interface DiaryEntry {
  id: string;
  dateStr: string; // e.g. "OCT 24"
  fullDate: string; // ISO string or formatted
  content: string;
  mood: PuppyMood;
  pinColor: 'yellow' | 'green' | 'red' | 'blue' | 'pink';
  liked?: boolean;
}

export interface PetStats {
  belly: number; // 0-100
  tailWags: number; // 0-100
  zoomies: number; // 0-100
  happiness: number; // 0-100
  lastInteracted: number;
}

export interface PetConfig {
  name: string;
  breed: PuppyBreed;
  accessory: PuppyAccessory;
  soundEnabled: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconType: 'trophy' | 'lock' | 'heart' | 'bone' | 'star' | 'crown';
  status: 'unlocked' | 'claimed' | 'in_progress' | 'locked';
  progress: number;
  maxProgress: number;
  rewardAccessory?: PuppyAccessory;
}

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  totalTasksCompleted: number;
  totalDiaryEntries: number;
  totalBonesFed: number;
  lastActiveDate: string;
}
