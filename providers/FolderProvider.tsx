import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Folder {
  id: string;
  name: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface FolderContextType {
  folders: Folder[];
  addFolder: (name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  updateFolderCount: (id: string, count: number) => Promise<void>;
  getFolderById: (id: string) => Folder | undefined;
  isLoading: boolean;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

const STORAGE_KEY = '@folders';

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validatedFolders = parsed.map((folder: any) => ({
          ...folder,
          count: typeof folder.count === 'number' ? folder.count : 0,
        }));
        setFolders(validatedFolders);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFolders = async (newFolders: Folder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFolders));
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  };

  const addFolder = React.useCallback(async (name: string) => {
    try {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: name.trim(),
        count: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setFolders(prev => {
        const updatedFolders = [...prev, newFolder];
        saveFolders(updatedFolders);
        return updatedFolders;
      });
      
      console.log('Folder created:', newFolder);
    } catch (error) {
      console.error('Error adding folder:', error);
      throw error;
    }
  }, []);

  const deleteFolder = React.useCallback(async (id: string) => {
    try {
      setFolders(prev => {
        const updatedFolders = prev.filter(f => f.id !== id);
        saveFolders(updatedFolders);
        return updatedFolders;
      });
      
      console.log('Folder deleted:', id);
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  }, []);

  const updateFolderCount = React.useCallback(async (id: string, count: number) => {
    try {
      const validCount = typeof count === 'number' && !isNaN(count) ? count : 0;
      
      setFolders(prev => {
        const updatedFolders = prev.map(folder =>
          folder.id === id
            ? {
                ...folder,
                count: validCount,
                updatedAt: new Date().toISOString(),
              }
            : folder
        );
        saveFolders(updatedFolders);
        return updatedFolders;
      });
      
      console.log('Folder count updated:', { id, count: validCount });
    } catch (error) {
      console.error('Error updating folder count:', error);
      throw error;
    }
  }, []);

  const getFolderById = React.useCallback((id: string): Folder | undefined => {
    return folders.find(f => f.id === id);
  }, [folders]);

  const value = useMemo(
    () => ({
      folders,
      addFolder,
      deleteFolder,
      updateFolderCount,
      getFolderById,
      isLoading,
    }),
    [folders, isLoading, addFolder, deleteFolder, updateFolderCount, getFolderById]
  );

  return (
    <FolderContext.Provider value={value}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error('useFolders must be used within a FolderProvider');
  }
  return context;
}
