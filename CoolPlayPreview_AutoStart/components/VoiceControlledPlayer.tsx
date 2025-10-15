import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { useSpeechRecognition } from '@/providers/SpeechRecognitionProvider';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/colors';

interface VoiceControlledPlayerProps {
  videoPlayer: any;
  onCommandExecuted?: (command: string, action: string) => void;
}

export const VoiceControlledPlayer: React.FC<VoiceControlledPlayerProps> = ({
  videoPlayer,
  onCommandExecuted,
}) => {
  const { t } = useTranslation();
  const {
    isListening,
    isAuthorized,
    isProcessing,
    transcript,
    interimTranscript,
    confidence,
    error,
    permissionStatus,
    requestPermission,
    startRecognition,
    stopRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  const { parseCommand } = useVoiceCommands();
  
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string>('');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening || isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, isProcessing, pulseAnim]);

  useEffect(() => {
    if (commandFeedback) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCommandFeedback('');
      });
    }
  }, [commandFeedback, fadeAnim]);

  const executeVideoCommand = useCallback((intent: string, action?: string, slot?: any) => {
    if (!videoPlayer) {
      console.warn('Video player not available');
      return;
    }

    try {
      switch (intent) {
        case 'playback_control':
          switch (action) {
            case 'play':
              videoPlayer.play();
              setCommandFeedback(t('playing'));
              break;
            case 'pause':
              videoPlayer.pause();
              setCommandFeedback(t('paused'));
              break;
            case 'stop':
              videoPlayer.pause();
              videoPlayer.currentTime = 0;
              setCommandFeedback(t('stopped'));
              break;
            case 'restart':
              videoPlayer.currentTime = 0;
              videoPlayer.play();
              setCommandFeedback(t('restarting'));
              break;
            default:
              console.log('Unknown playback action:', action);
          }
          break;

        case 'seek_control':
          const currentTime = videoPlayer.currentTime || 0;
          const duration = videoPlayer.duration || 0;
          
          switch (action) {
            case 'forward':
              const forwardSeconds = slot?.seconds || 10;
              const newForwardTime = Math.min(currentTime + forwardSeconds, duration);
              videoPlayer.currentTime = newForwardTime;
              setCommandFeedback(`${t('forward')} ${forwardSeconds}s`);
              break;
            case 'rewind':
              const rewindSeconds = slot?.seconds || 10;
              const newRewindTime = Math.max(currentTime - rewindSeconds, 0);
              videoPlayer.currentTime = newRewindTime;
              setCommandFeedback(`${t('rewind')} ${rewindSeconds}s`);
              break;
            default:
              console.log('Unknown seek action:', action);
          }
          break;

        case 'volume_control':
          switch (action) {
            case 'max':
              videoPlayer.volume = 1.0;
              setCommandFeedback(t('volume_max'));
              break;
            case 'mute':
              videoPlayer.muted = true;
              setCommandFeedback(t('muted'));
              break;
            case 'unmute':
              videoPlayer.muted = false;
              setCommandFeedback(t('unmuted'));
              break;
            case 'up':
              const currentVolumeUp = videoPlayer.volume || 0;
              videoPlayer.volume = Math.min(currentVolumeUp + 0.1, 1.0);
              setCommandFeedback(t('volume_increased'));
              break;
            case 'down':
              const currentVolumeDown = videoPlayer.volume || 0;
              videoPlayer.volume = Math.max(currentVolumeDown - 0.1, 0);
              setCommandFeedback(t('volume_decreased'));
              break;
            default:
              console.log('Unknown volume action:', action);
          }
          break;

        case 'speed_control':
          if (action === 'set' && slot?.speed) {
            videoPlayer.playbackRate = slot.speed;
            setCommandFeedback(`${t('speed')}: ${slot.speed}x`);
          }
          break;

        case 'fullscreen_control':
          console.log('Fullscreen control:', action);
          setCommandFeedback(action === 'enter' ? t('entering_fullscreen') : t('exiting_fullscreen'));
          break;

        default:
          console.log('Unknown intent:', intent);
      }

      if (onCommandExecuted) {
        onCommandExecuted(intent, action || '');
      }
    } catch (error) {
      console.error('Error executing video command:', error);
      setCommandFeedback(t('command_execution_failed'));
    }
  }, [videoPlayer, onCommandExecuted, t]);

  useEffect(() => {
    if (transcript) {
      console.log(`Processing command: "${transcript}" (confidence: ${confidence})`);
      
      const match = parseCommand(transcript, confidence);
      
      if (match && match.confidence > 0.3) {
        console.log(`Matched command: ${match.command.intent} (confidence: ${match.confidence})`);
        setLastCommand(match.matchedUtterance);
        executeVideoCommand(match.command.intent, match.command.action, match.command.slot);
        resetTranscript();
      } else {
        console.log('No matching command found or confidence too low');
        setCommandFeedback(t('command_not_recognized'));
      }
    }
  }, [transcript, confidence, parseCommand, executeVideoCommand, resetTranscript, t]);

  const toggleVoiceControl = useCallback(async () => {
    if (isListening) {
      await stopRecognition();
    } else {
      if (!isAuthorized) {
        const granted = await requestPermission();
        if (!granted) {
          return;
        }
      }
      await startRecognition();
    }
  }, [isListening, isAuthorized, requestPermission, startRecognition, stopRecognition]);

  const getStatusText = () => {
    if (error) return error;
    if (isProcessing) return t('processing');
    if (interimTranscript) return interimTranscript;
    if (transcript) return transcript;
    if (isListening) return t('listening');
    if (permissionStatus === 'denied') return t('permission_denied');
    if (permissionStatus === 'restricted') return t('not_supported');
    return t('tap_to_speak');
  };

  const getStatusColor = () => {
    if (error) return Colors.danger;
    if (isProcessing) return Colors.accent.primary;
    if (isListening) return '#4ECDC4';
    return Colors.primary.textSecondary;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.voiceButtonActive,
            error && styles.voiceButtonError,
          ]}
          onPress={toggleVoiceControl}
          activeOpacity={0.8}
        >
          {isListening ? (
            <Mic size={32} color="white" strokeWidth={2.5} />
          ) : (
            <MicOff size={32} color="white" strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        
        {confidence > 0 && (
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { width: `${confidence * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.confidenceText}>
              {Math.round(confidence * 100)}%
            </Text>
          </View>
        )}
      </View>

      {commandFeedback && (
        <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
          <Text style={styles.feedbackText}>{commandFeedback}</Text>
        </Animated.View>
      )}

      {lastCommand && (
        <View style={styles.lastCommandContainer}>
          <Text style={styles.lastCommandLabel}>{t('last_command')}:</Text>
          <Text style={styles.lastCommandText}>{lastCommand}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  voiceButtonActive: {
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
  },
  voiceButtonError: {
    backgroundColor: Colors.primary.textSecondary,
    shadowColor: Colors.primary.textSecondary,
  },
  statusContainer: {
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  confidenceBar: {
    width: 100,
    height: 4,
    backgroundColor: Colors.card.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    fontWeight: '600' as const,
  },
  feedbackContainer: {
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  feedbackText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  lastCommandContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  lastCommandLabel: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    marginBottom: 4,
  },
  lastCommandText: {
    fontSize: 14,
    color: Colors.primary.text,
    fontWeight: '600' as const,
  },
});
