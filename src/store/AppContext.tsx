import React, { createContext, useContext, useState, useEffect } from 'react';
import { Child, Movie, AppSettings } from '@/types';
import { mockChildren, mockMovies } from '@/data/mock';
import Taro from '@tarojs/taro';

interface AppContextType {
  children: Child[];
  currentChild: Child | null;
  movies: Movie[];
  settings: AppSettings;
  setCurrentChild: (child: Child) => void;
  addMovie: (movie: Movie) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (movieId: string) => void;
  addChild: (child: Child) => void;
  updateChild: (child: Child) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childrenList, setChildrenList] = useState<Child[]>(mockChildren);
  const [currentChild, setCurrentChildState] = useState<Child | null>(mockChildren[0] || null);
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [settings, setSettings] = useState<AppSettings>({
    currentChildId: mockChildren[0]?.id || '',
    watchTimeReminder: {
      enabled: true,
      maxDuration: 60,
      showNotification: true
    },
    privacySettings: {
      familyOnlyVisible: true,
      shareEnabled: true
    }
  });

  useEffect(() => {
    try {
      const storageData = Taro.getStorageSync('appData');
      if (storageData) {
        const parsed = JSON.parse(storageData);
        setChildrenList(parsed.children || mockChildren);
        setMovies(parsed.movies || mockMovies);
        setSettings(parsed.settings || settings);
        const current = parsed.children?.find((c: Child) => c.id === parsed.settings?.currentChildId);
        setCurrentChildState(current || parsed.children?.[0] || null);
      }
    } catch (error) {
      console.error('[AppContext] Failed to load storage:', error);
    }
  }, []);

  const saveToStorage = (newChildren: Child[], newMovies: Movie[], newSettings: AppSettings) => {
    try {
      Taro.setStorageSync('appData', JSON.stringify({
        children: newChildren,
        movies: newMovies,
        settings: newSettings
      }));
    } catch (error) {
      console.error('[AppContext] Failed to save storage:', error);
    }
  };

  const setCurrentChild = (child: Child) => {
    setCurrentChildState(child);
    const newSettings = { ...settings, currentChildId: child.id };
    setSettings(newSettings);
    saveToStorage(childrenList, movies, newSettings);
  };

  const addMovie = (movie: Movie) => {
    const newMovies = [...movies, movie];
    setMovies(newMovies);
    saveToStorage(childrenList, newMovies, settings);
  };

  const updateMovie = (movie: Movie) => {
    const newMovies = movies.map(m => m.id === movie.id ? movie : m);
    setMovies(newMovies);
    saveToStorage(childrenList, newMovies, settings);
  };

  const deleteMovie = (movieId: string) => {
    const newMovies = movies.filter(m => m.id !== movieId);
    setMovies(newMovies);
    saveToStorage(childrenList, newMovies, settings);
  };

  const addChild = (child: Child) => {
    const newChildren = [...childrenList, child];
    setChildrenList(newChildren);
    saveToStorage(newChildren, movies, settings);
  };

  const updateChild = (child: Child) => {
    const newChildren = childrenList.map(c => c.id === child.id ? child : c);
    setChildrenList(newChildren);
    saveToStorage(newChildren, movies, settings);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveToStorage(childrenList, movies, updated);
  };

  return (
    <AppContext.Provider
      value={{
        children: childrenList,
        currentChild,
        movies,
        settings,
        setCurrentChild,
        addMovie,
        updateMovie,
        deleteMovie,
        addChild,
        updateChild,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
