import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { useLanguage } from '@/hooks/useLanguage';
import { useCustomCommands } from './CustomCommandProvider';
import voiceCommandsData from '@/constants/voiceCommands.json';
import voiceIntentsData from '@/constants/voiceIntents.json';

interface VoiceCommand {
  intent: string;
  action?: string;
  slot: any;
  source: 'builtin' | 'custom';
  confidence: number;
}

interface UnifiedVoiceControlState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  lastCommand: VoiceCommand | null;
  error: string | null;
  confidenceThreshold: number;
}

export const [UnifiedVoiceControlProvider, useUnifiedVoiceControl] = createContextHook(() => {
  const { language } = useLanguage();
  const { findMatchingCustomCommand } = useCustomCommands();
  
  const [state, setState] = useState<UnifiedVoiceControlState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    lastCommand: null,
    error: null,
    confidenceThreshold: 0.5,
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getLanguageCode = useCallback((lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'zh-TW': 'zh-TW',
      'zh-CN': 'zh-CN',
      'es': 'es-ES',
      'pt-BR': 'pt-BR',
      'pt': 'pt-PT',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'ru': 'ru-RU',
      'ar': 'ar-SA',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
    };
    return langMap[lang] || 'en-US';
  }, []);

  const findBuiltinCommand = useCallback((text: string): VoiceCommand | null => {
    const normalizedText = text.toLowerCase().trim();
    
    const intents: { intent: string; utterances: Record<string, string[]>; }[] = 
      Array.isArray(voiceIntentsData) ? voiceIntentsData : [];
    
    for (const item of intents) {
      if (!item || !item.utterances) continue;
      const utterances = (item.utterances as any)[language] || (item.utterances as any)['en'];
      if (!Array.isArray(utterances)) continue;
      
      for (const utterance of utterances) {
        if (typeof utterance !== 'string') continue;
        const normUtter = utterance.toLowerCase().trim();
        
        if (normalizedText === normUtter || normalizedText.includes(normUtter)) {
          return {
            intent: item.intent,
            action: undefined,
            slot: null,
            source: 'builtin',
            confidence: normalizedText === normUtter ? 1.0 : 0.8,
          };
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
            intent: command.intent,
            action: command.action,
            slot: command.slot,
            source: 'builtin',
            confidence: 1.0,
          };
        }
        
        if (normalizedText.includes(normalizedUtterance)) {
          const score = normalizedUtterance.length / normalizedText.length;
          if (score > 0.5) {
            return {
              intent: command.intent,
              action: command.action,
              slot: command.slot,
              source: 'builtin',
              confidence: score,
            };
          }
        }
      }
    }
    
    return null;
  }, [language]);

  const parseCommand = useCallback((text: string, speechConfidence: number): VoiceCommand | null => {
    if (!text || typeof text !== 'string') return null;

    const customCommand = findMatchingCustomCommand(text);
    if (customCommand) {
      console.log(`[UnifiedVoiceControl] Custom command matched: "${text}" -> ${customCommand.intent}`);
      return {
        intent: customCommand.intent,
        action: customCommand.action,
        slot: customCommand.slot,
        source: 'custom',
        confidence: speechConfidence,
      };
    }

    const builtinCommand = findBuiltinCommand(text);
    if (builtinCommand) {
      console.log(`[UnifiedVoiceControl] Builtin command matched: "${text}" -> ${builtinCommand.intent}`);
      return {
        ...builtinCommand,
        confidence: builtinCommand.confidence * speechConfidence,
      };
    }

    console.log(`[UnifiedVoiceControl] No command matched for: "${text}"`);
    return null;
  }, [findMatchingCustomCommand, findBuiltinCommand]);

  const executeCommand = useCallback((command: VoiceCommand) => {
    if (command.confidence < state.confidenceThreshold) {
      console.log(`[UnifiedVoiceControl] Command confidence too low: ${command.confidence}`);
      setState(prev => ({ 
        ...prev, 
        error: 'Command confidence too low, please try again',
      }));
      return;
    }

    setState(prev => ({ ...prev, lastCommand: command, error: null }));

    const event = new CustomEvent('voiceCommand', {
      detail: {
        intent: command.intent,
        action: command.action,
        slot: command.slot,
        source: command.source,
        confidence: command.confidence,
      },
    });

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(event);
    }

    console.log(`[UnifiedVoiceControl] Command executed:`, command);
  }, [state.confidenceThreshold]);

  const processTranscript = useCallback((text: string, confidence: number) => {
    setState(prev => ({ ...prev, transcript: text, isProcessing: true }));

    const command = parseCommand(text, confidence);
    if (command) {
      executeCommand(command);
    } else {
      setState(prev => ({ 
        ...prev, 
        error: 'Command not recognized',
      }));
    }

    setState(prev => ({ ...prev, isProcessing: false }));
  }, [parseCommand, executeCommand]);

  const startListening = useCallback(async () => {
    try {
      if (state.isListening) {
        console.log('[UnifiedVoiceControl] Already listening');
        return;
      }

      if (Platform.OS === 'web') {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          setState(prev => ({ 
            ...prev, 
            error: 'Speech recognition not supported',
          }));
          return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = getLanguageCode(language);
        recognitionRef.current.maxAlternatives = 3;

        recognitionRef.current.onstart = () => {
          console.log('[UnifiedVoiceControl] Recognition started');
          setState(prev => ({ 
            ...prev, 
            isListening: true, 
            error: null,
            transcript: '',
            interimTranscript: '',
          }));

          timeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 10000);
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          let maxConfidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence || 0.7;

            if (result.isFinal) {
              finalTranscript += transcript;
              maxConfidence = Math.max(maxConfidence, confidence);
            } else {
              interimTranscript += transcript;
            }
          }

          setState(prev => ({
            ...prev,
            interimTranscript,
          }));

          if (finalTranscript) {
            processTranscript(finalTranscript.trim(), maxConfidence);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('[UnifiedVoiceControl] Recognition error:', event.error);
          
          let errorMessage = 'Speech recognition error';
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected';
              break;
            case 'audio-capture':
              errorMessage = 'Microphone error';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone permission denied';
              break;
            case 'network':
              errorMessage = 'Network error';
              break;
          }

          setState(prev => ({
            ...prev,
            isListening: false,
            error: errorMessage,
          }));
        };

        recognitionRef.current.onend = () => {
          console.log('[UnifiedVoiceControl] Recognition ended');
          setState(prev => ({ ...prev, isListening: false }));
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };

        recognitionRef.current.start();
      } else {
        console.log('[UnifiedVoiceControl] Native speech recognition not yet implemented');
        setState(prev => ({ 
          ...prev, 
          error: 'Native speech recognition not available',
        }));
      }
    } catch (error) {
      console.error('[UnifiedVoiceControl] Failed to start listening:', error);
      setState(prev => ({ 
        ...prev, 
        isListening: false,
        error: 'Failed to start recognition',
      }));
    }
  }, [state.isListening, language, getLanguageCode, processTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn('[UnifiedVoiceControl] Error stopping recognition:', error);
      }
      recognitionRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const setConfidenceThreshold = useCallback((threshold: number) => {
    setState(prev => ({ ...prev, confidenceThreshold: Math.max(0, Math.min(1, threshold)) }));
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('[UnifiedVoiceControl] Cleanup error:', e);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    setConfidenceThreshold,
  };
});
