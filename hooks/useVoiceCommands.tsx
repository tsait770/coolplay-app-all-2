import { useCallback, useMemo } from 'react';
import { useLanguage } from './useLanguage';
import voiceCommandsData from '@/constants/voiceCommands.json';
import voiceIntentsData from '@/constants/voiceIntents.json';

interface VoiceCommand {
  intent: string;
  action?: string;
  slot: any;
  usage_count: number;
  utterances: Record<string, string[]>;
}

interface CommandMatch {
  command: VoiceCommand;
  confidence: number;
  matchedUtterance: string;
}

export const useVoiceCommands = () => {
  const { language } = useLanguage();

  const findMatchingCommand = useCallback((text: string): CommandMatch | null => {
    if (!text || typeof text !== 'string') return null;
    
    const normalizedText = text.toLowerCase().trim();
    let bestMatch: CommandMatch | null = null;
    let bestScore = 0;
    
    const intents: { intent: string; utterances: Record<string, string[]>; }[] = Array.isArray(voiceIntentsData) ? voiceIntentsData : [];
    for (const item of intents) {
      if (!item || !item.utterances) continue;
      const utterances = (item.utterances as any)[language] || (item.utterances as any)['en'];
      if (!Array.isArray(utterances)) continue;
      
      for (const utterance of utterances) {
        if (typeof utterance !== 'string') continue;
        const normUtter = utterance.toLowerCase().trim();
        
        if (normalizedText === normUtter) {
          return {
            command: {
              intent: item.intent,
              action: undefined,
              slot: null,
              usage_count: 1,
              utterances: item.utterances,
            },
            confidence: 1.0,
            matchedUtterance: utterance,
          };
        }
        
        if (normalizedText.includes(normUtter)) {
          const score = normUtter.length / normalizedText.length;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = {
              command: {
                intent: item.intent,
                action: undefined,
                slot: null,
                usage_count: 1,
                utterances: item.utterances,
              },
              confidence: score,
              matchedUtterance: utterance,
            };
          }
        }
      }
    }

    const commands = (voiceCommandsData as any)?.commands || [];
    
    for (const command of commands) {
      if (!command || !command.utterances) continue;
      
      const utterances = (command.utterances as any)[language] || (command.utterances as any)['en'];
      if (!Array.isArray(utterances)) continue;
      
      for (const utterance of utterances) {
        if (typeof utterance !== 'string') continue;
        
        const normalizedUtterance = utterance.toLowerCase();
        
        if (normalizedText === normalizedUtterance) {
          return {
            command,
            confidence: 1.0,
            matchedUtterance: utterance,
          };
        }
        
        if (normalizedText.includes(normalizedUtterance)) {
          const score = normalizedUtterance.length / normalizedText.length;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = {
              command,
              confidence: score,
              matchedUtterance: utterance,
            };
          }
        }
      }
    }
    
    return bestScore > 0.5 ? bestMatch : null;
  }, [language]);

  const parseCommand = useCallback((text: string, speechConfidence: number = 0.7): CommandMatch | null => {
    const match = findMatchingCommand(text);
    
    if (match) {
      return {
        ...match,
        confidence: match.confidence * speechConfidence,
      };
    }
    
    return null;
  }, [findMatchingCommand]);

  const getCommandDescription = useCallback((intent: string, action?: string): string => {
    const commands = (voiceCommandsData as any)?.commands || [];
    const command = commands.find((cmd: any) => 
      cmd.intent === intent && (!action || cmd.action === action)
    );
    
    if (command && command.utterances) {
      const utterances = command.utterances[language] || command.utterances['en'];
      if (Array.isArray(utterances) && utterances.length > 0) {
        return utterances[0];
      }
    }
    
    return intent;
  }, [language]);

  const getAllCommands = useMemo(() => {
    const commands = (voiceCommandsData as any)?.commands || [];
    return commands.map((cmd: any) => ({
      intent: cmd.intent,
      action: cmd.action,
      slot: cmd.slot,
      examples: cmd.utterances[language] || cmd.utterances['en'] || [],
    }));
  }, [language]);

  return {
    parseCommand,
    findMatchingCommand,
    getCommandDescription,
    getAllCommands,
  };
};
