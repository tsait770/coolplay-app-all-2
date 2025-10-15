import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';

interface SpeechRecognitionState {
  isListening: boolean;
  isAuthorized: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  permissionStatus: 'not-determined' | 'authorized' | 'denied' | 'restricted';
}

interface SpeechRecognitionContextValue extends SpeechRecognitionState {
  requestPermission: () => Promise<boolean>;
  startRecognition: () => Promise<void>;
  stopRecognition: () => Promise<void>;
  resetTranscript: () => void;
}

const SpeechRecognitionContext = createContext<SpeechRecognitionContextValue | null>(null);

export const useSpeechRecognition = () => {
  const context = useContext(SpeechRecognitionContext);
  if (!context) {
    throw new Error('useSpeechRecognition must be used within SpeechRecognitionProvider');
  }
  return context;
};

interface SpeechRecognitionProviderProps {
  children: React.ReactNode;
  onCommand?: (command: string, confidence: number) => void;
  continuous?: boolean;
  maxRecordingTime?: number;
}

export const SpeechRecognitionProvider: React.FC<SpeechRecognitionProviderProps> = ({
  children,
  onCommand,
  continuous = false,
  maxRecordingTime = 60000,
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isAuthorized: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null,
    permissionStatus: 'not-determined',
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          setState(prev => ({
            ...prev,
            error: t('speech_recognition_not_supported'),
            permissionStatus: 'restricted',
          }));
          return false;
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          
          setState(prev => ({
            ...prev,
            isAuthorized: true,
            permissionStatus: 'authorized',
            error: null,
          }));
          return true;
        } catch (error) {
          console.error('Microphone permission denied:', error);
          setState(prev => ({
            ...prev,
            isAuthorized: false,
            permissionStatus: 'denied',
            error: t('microphone_permission_denied'),
          }));
          
          Alert.alert(
            t('permission_required'),
            t('microphone_permission_message'),
            [{ text: t('ok') }]
          );
          return false;
        }
      } else {
        console.log('Native speech recognition not yet implemented for mobile');
        setState(prev => ({
          ...prev,
          error: t('native_speech_not_available'),
          permissionStatus: 'restricted',
        }));
        return false;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setState(prev => ({
        ...prev,
        error: t('permission_request_failed'),
        permissionStatus: 'denied',
      }));
      return false;
    }
  }, [t]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      recognitionRef.current = null;
    }
  }, []);

  const startRecognition = useCallback(async () => {
    try {
      if (state.isListening) {
        console.log('Already listening');
        return;
      }

      if (!state.isAuthorized) {
        const granted = await requestPermission();
        if (!granted) {
          return;
        }
      }

      if (Platform.OS === 'web') {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        
        if (!SpeechRecognition) {
          setState(prev => ({
            ...prev,
            error: t('speech_recognition_not_supported'),
          }));
          return;
        }

        cleanup();

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = getLanguageCode(language);
        recognitionRef.current.maxAlternatives = 3;

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setState(prev => ({
            ...prev,
            isListening: true,
            isProcessing: false,
            error: null,
          }));

          if (maxRecordingTime > 0) {
            timeoutRef.current = setTimeout(() => {
              console.log('Max recording time reached, stopping...');
              if (recognitionRef.current) {
                recognitionRef.current.stop();
              }
            }, maxRecordingTime);
          }
        };

        recognitionRef.current.onresult = (event: any) => {
          try {
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
              transcript: finalTranscript || prev.transcript,
              interimTranscript,
              confidence: maxConfidence || prev.confidence,
              isProcessing: !!finalTranscript,
            }));

            if (finalTranscript && onCommand) {
              console.log(`Final transcript: "${finalTranscript}" (confidence: ${maxConfidence})`);
              onCommand(finalTranscript.trim(), maxConfidence);
            }
          } catch (error) {
            console.error('Error processing speech result:', error);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          let errorMessage = t('speech_recognition_error');
          let shouldRestart = false;

          switch (event.error) {
            case 'no-speech':
              errorMessage = t('no_speech_detected');
              shouldRestart = continuous;
              break;
            case 'audio-capture':
              errorMessage = t('microphone_error');
              break;
            case 'not-allowed':
              errorMessage = t('microphone_permission_denied');
              setState(prev => ({
                ...prev,
                isAuthorized: false,
                permissionStatus: 'denied',
              }));
              break;
            case 'network':
              errorMessage = t('network_error');
              shouldRestart = continuous;
              break;
            case 'aborted':
              errorMessage = '';
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

          if (shouldRestart && continuous) {
            restartTimeoutRef.current = setTimeout(() => {
              console.log('Restarting recognition after error...');
              startRecognition();
            }, 1000);
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          
          setState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
          }));

          if (continuous && state.isListening) {
            restartTimeoutRef.current = setTimeout(() => {
              console.log('Restarting recognition (continuous mode)...');
              startRecognition();
            }, 300);
          }
        };

        recognitionRef.current.onspeechstart = () => {
          console.log('Speech detected');
          setState(prev => ({ ...prev, isProcessing: true }));
        };

        recognitionRef.current.onspeechend = () => {
          console.log('Speech ended');
        };

        recognitionRef.current.start();
      } else {
        console.log('Native speech recognition for mobile not yet implemented');
        setState(prev => ({
          ...prev,
          error: t('native_speech_not_available'),
        }));
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setState(prev => ({
        ...prev,
        isListening: false,
        error: t('failed_to_start_recognition'),
      }));
    }
  }, [state.isListening, state.isAuthorized, continuous, maxRecordingTime, language, onCommand, requestPermission, getLanguageCode, cleanup, t]);

  const stopRecognition = useCallback(async () => {
    try {
      console.log('Stopping speech recognition...');
      cleanup();
      
      setState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
      }));
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }, [cleanup]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      confidence: 0,
    }));
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
