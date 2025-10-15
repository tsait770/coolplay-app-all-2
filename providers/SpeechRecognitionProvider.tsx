import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

interface SpeechRecognitionState {
  isListening: boolean;
  isAuthorized: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
}

interface SpeechRecognitionContextValue extends SpeechRecognitionState {
  requestPermission: () => Promise<void>;
  startRecognition: (options?: { continuous?: boolean; maxRecordingTime?: number; language?: string; onCommand?: (command: string) => void }) => Promise<void>;
  stopRecognition: () => Promise<void>;
  resetTranscript: () => void;
}

const SpeechRecognitionContext = createContext<SpeechRecognitionContextValue | null>(null);

export const SpeechRecognitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const isMountedRef = useRef(true);
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isAuthorized: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null,
    permissionStatus: 'undetermined',
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getLanguageCode = useCallback((language?: string): string => {
    if (language) return language;
    
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    return locale;
  }, []);

  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (error) {
        console.warn('Error stopping recognition:', error);
      }
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMountedRef.current) {
            setState(prev => ({
              ...prev,
              permissionStatus: 'denied',
              error: t('microphone_not_supported'),
            }));
          }
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            isAuthorized: true,
            permissionStatus: 'granted',
            error: null,
          }));
        }
      } else {
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            isAuthorized: true,
            permissionStatus: 'granted',
          }));
        }
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isAuthorized: false,
          permissionStatus: 'denied',
          error: t('microphone_permission_denied'),
        }));
      }
    }
  }, [t]);

  const startRecognition = useCallback(async (options?: {
    continuous?: boolean;
    maxRecordingTime?: number;
    language?: string;
    onCommand?: (command: string) => void;
  }) => {
    const { continuous = false, maxRecordingTime = 30000, language, onCommand } = options || {};

    try {
      if (state.isListening) {
        console.log('Recognition already running');
        return;
      }

      if (!state.isAuthorized) {
        await requestPermission();
        if (!state.isAuthorized) {
          return;
        }
      }

      if (Platform.OS === 'web') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          if (isMountedRef.current) {
            setState(prev => ({
              ...prev,
              error: t('speech_recognition_not_supported'),
            }));
          }
          return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = getLanguageCode(language);

        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            isListening: true,
            error: null,
            transcript: '',
            interimTranscript: '',
          }));
        }

        recognitionRef.current.onresult = (event: any) => {
          if (!isMountedRef.current) return;

          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (isMountedRef.current) {
            setState(prev => ({
              ...prev,
              transcript: prev.transcript + finalTranscript,
              interimTranscript,
              confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0,
            }));
          }

          if (finalTranscript && onCommand) {
            onCommand(finalTranscript.trim());
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (!isMountedRef.current) return;

          let errorMessage = t('speech_recognition_error');
          
          switch (event.error) {
            case 'network':
              errorMessage = t('network_error_speech');
              break;
            case 'not-allowed':
              errorMessage = t('microphone_permission_denied');
              break;
            case 'no-speech':
              errorMessage = t('no_speech_detected');
              break;
            default:
              errorMessage = `${t('speech_recognition_error')}: ${event.error}`;
          }

          setState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            error: errorMessage,
          }));
        };

        recognitionRef.current.onend = () => {
          if (!isMountedRef.current) return;

          console.log('Speech recognition ended');
          setState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
          }));

          if (continuous && state.isListening) {
            console.log('Restarting speech recognition (continuous mode)...');
            setTimeout(() => {
              if (isMountedRef.current && state.isListening) {
                startRecognition(options);
              }
            }, 300);
          }
        };

        recognitionRef.current.onspeechstart = () => {
          if (!isMountedRef.current) return;
          console.log('Speech detected');
          setState(prev => ({ ...prev, isProcessing: true }));
        };

        recognitionRef.current.onspeechend = () => {
          if (!isMountedRef.current) return;
          console.log('Speech ended');
        };

        recognitionRef.current.start();
      } else {
        console.log('Native speech recognition for mobile not yet implemented');
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            error: t('native_speech_not_available'),
          }));
        }
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isListening: false,
          error: t('failed_to_start_recognition'),
        }));
      }
    }
  }, [state.isListening, state.isAuthorized, requestPermission, getLanguageCode, t]);

  const stopRecognition = useCallback(async () => {
    try {
      console.log('Stopping speech recognition...');
      cleanup();
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isListening: false,
          isProcessing: false,
        }));
      }
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }, [cleanup]);

  const resetTranscript = useCallback(() => {
    if (isMountedRef.current) {
      setState(prev => ({
        ...prev,
        transcript: '',
        interimTranscript: '',
        confidence: 0,
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const value: SpeechRecognitionContextValue = {
    ...state,
    requestPermission,
    startRecognition,
    stopRecognition,
    resetTranscript,
  };

  return (
    <SpeechRecognitionContext.Provider value={value}>
      {children}
    </SpeechRecognitionContext.Provider>
  );
};

export const useSpeechRecognition = () => {
  const context = useContext(SpeechRecognitionContext);
  if (!context) {
    throw new Error('useSpeechRecognition must be used within SpeechRecognitionProvider');
  }
  return context;
};
