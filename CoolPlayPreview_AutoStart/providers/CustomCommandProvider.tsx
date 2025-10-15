import { useState, useCallback, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useStorage, safeJsonParse } from '@/providers/StorageProvider';

export interface CustomCommand {
  id: string;
  text: string;
  intent: string;
  action?: string;
  slot?: any;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

interface CustomCommandState {
  commands: CustomCommand[];
  isLoading: boolean;
}

const STORAGE_KEY = 'custom_voice_commands';

export const [CustomCommandProvider, useCustomCommands] = createContextHook(() => {
  const storage = useStorage();
  const [state, setState] = useState<CustomCommandState>({
    commands: [],
    isLoading: true,
  });

  const loadCommands = useCallback(async () => {
    try {
      if (!storage || typeof storage.getItem !== 'function') {
        console.warn('Storage not available');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const data = await storage.getItem(STORAGE_KEY);
      if (data && typeof data === 'string' && data.trim()) {
        const parsed = safeJsonParse(data, null);
        if (Array.isArray(parsed)) {
          setState({ commands: parsed, isLoading: false });
          console.log(`[CustomCommands] Loaded ${parsed.length} custom commands`);
        } else {
          setState({ commands: [], isLoading: false });
        }
      } else {
        setState({ commands: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load custom commands:', error);
      setState({ commands: [], isLoading: false });
    }
  }, [storage]);

  const saveCommands = useCallback(async (commands: CustomCommand[]) => {
    try {
      if (!storage || typeof storage.setItem !== 'function') {
        console.warn('Storage not available');
        return;
      }

      const jsonString = JSON.stringify(commands);
      await storage.setItem(STORAGE_KEY, jsonString);
      console.log(`[CustomCommands] Saved ${commands.length} custom commands`);
    } catch (error) {
      console.error('Failed to save custom commands:', error);
    }
  }, [storage]);

  useEffect(() => {
    loadCommands();
  }, [loadCommands]);

  const addCommand = useCallback(async (
    text: string,
    intent: string,
    action?: string,
    slot?: any
  ): Promise<CustomCommand> => {
    const newCommand: CustomCommand = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.toLowerCase().trim(),
      intent,
      action,
      slot,
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedCommands = [...state.commands, newCommand];
    setState(prev => ({ ...prev, commands: updatedCommands }));
    await saveCommands(updatedCommands);
    
    console.log(`[CustomCommands] Added: "${text}" -> ${intent}${action ? `.${action}` : ''}`);
    return newCommand;
  }, [state.commands, saveCommands]);

  const updateCommand = useCallback(async (
    id: string,
    updates: Partial<Omit<CustomCommand, 'id' | 'createdAt'>>
  ): Promise<void> => {
    const updatedCommands = state.commands.map(cmd =>
      cmd.id === id
        ? { ...cmd, ...updates, updatedAt: Date.now() }
        : cmd
    );

    setState(prev => ({ ...prev, commands: updatedCommands }));
    await saveCommands(updatedCommands);
    
    console.log(`[CustomCommands] Updated: ${id}`);
  }, [state.commands, saveCommands]);

  const deleteCommand = useCallback(async (id: string): Promise<void> => {
    const updatedCommands = state.commands.filter(cmd => cmd.id !== id);
    setState(prev => ({ ...prev, commands: updatedCommands }));
    await saveCommands(updatedCommands);
    
    console.log(`[CustomCommands] Deleted: ${id}`);
  }, [state.commands, saveCommands]);

  const toggleCommand = useCallback(async (id: string): Promise<void> => {
    const command = state.commands.find(cmd => cmd.id === id);
    if (command) {
      await updateCommand(id, { enabled: !command.enabled });
    }
  }, [state.commands, updateCommand]);

  const findMatchingCustomCommand = useCallback((text: string): CustomCommand | null => {
    const normalizedText = text.toLowerCase().trim();
    
    const enabledCommands = state.commands.filter(cmd => cmd.enabled);
    
    for (const cmd of enabledCommands) {
      if (normalizedText === cmd.text || normalizedText.includes(cmd.text)) {
        return cmd;
      }
    }
    
    return null;
  }, [state.commands]);

  const clearAllCommands = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, commands: [] }));
    await saveCommands([]);
    console.log('[CustomCommands] Cleared all commands');
  }, [saveCommands]);

  return {
    ...state,
    addCommand,
    updateCommand,
    deleteCommand,
    toggleCommand,
    findMatchingCustomCommand,
    clearAllCommands,
    reload: loadCommands,
  };
});
