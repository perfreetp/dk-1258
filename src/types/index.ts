export interface Child {
  id: string;
  name: string;
  avatar: string;
  birthDate: string;
  age: number;
  gender: 'male' | 'female';
  createdAt: string;
}

export interface Movie {
  id: string;
  childId: string;
  title: string;
  poster: string;
  type: 'animation' | 'documentary' | 'family_movie';
  watchDate: string;
  ageRating: string;
  duration: number;
  rating: number;
  review: string;
  reaction: string;
  educationThemes: string[];
  hasRewatch: boolean;
  rewatchCount: number;
  photos: string[];
  isHoliday: boolean;
  holidayName?: string;
  familyRating: number;
  createdAt: string;
}

export interface RecommendedMovie {
  id: string;
  title: string;
  poster: string;
  type: 'animation' | 'documentary' | 'family_movie';
  ageRange: string;
  themes: string[];
  description: string;
  duration: number;
  rating: number;
  familyRating: number;
}

export interface WatchTimeReminder {
  enabled: boolean;
  maxDuration: number;
  showNotification: boolean;
}

export interface PrivacySettings {
  familyOnlyVisible: boolean;
  shareEnabled: boolean;
}

export interface AppSettings {
  currentChildId: string;
  watchTimeReminder: WatchTimeReminder;
  privacySettings: PrivacySettings;
}
