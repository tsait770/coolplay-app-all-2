import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { transcribeAudio, isSpeechRecognitionSupported } from '../utils/speechRecognition';

export interface SpeechRecognitionError {
  type: 'permission' | 'network' | 'audio' | 'unknown';
  message: string;
}

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isMountedRef = useRef(true);

  const startRecording = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setError(null);
      setIsRecording(true);
      audioChunksRef.current = [];

      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
      } else {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        recordingRef.current = recording;
        await recording.startAsync();
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
      
      if (!isMountedRef.current) return;
      
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow microphone access and try again.');
      } else {
        setError('Failed to start recording. Please try again.');
      }
      
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setIsProcessing(true);

      if (Platform.OS === 'web') {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          
          // Wait for the recording to stop
          await new Promise<void>((resolve) => {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.onstop = () => resolve();
            }
          });

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Create a temporary blob URL for transcription
          const audioUrl = URL.createObjectURL(audioBlob);
          
          try {
            const result = await transcribeAudio(audioUrl);
            if (isMountedRef.current) {
              setTranscript(result.text);
            }
          } finally {
            // Always clean up the blob URL
            URL.revokeObjectURL(audioUrl);
          }
          
          // Clean up media recorder
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
          }
        }
      } else {
        if (recordingRef.current) {
          await recordingRef.current.stopAndUnloadAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
          });

          const uri = recordingRef.current.getURI();
          if (uri && isMountedRef.current) {
            const result = await transcribeAudio(uri);
            if (isMountedRef.current) {
              setTranscript(result.text);
            }
          }
          
          recordingRef.current = null;
        }
      }
      
      if (isMountedRef.current) {
        setIsRecording(false);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      
      if (!isMountedRef.current) return;
      
      const speechError = err as SpeechRecognitionError;
      if (speechError.type === 'network') {
        setError('Network error: Please check your internet connection and try again.');
      } else {
        setError('Failed to process audio. Please try again.');
      }
      
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    if (isMountedRef.current) {
      setError(null);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    if (isMountedRef.current) {
      setTranscript('');
    }
  }, []);

  // Cleanup function to be called when component unmounts
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
    
    if (Platform.OS === 'web' && mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(console.error);
      recordingRef.current = null;
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    error,
    transcript,
    startRecording,
    stopRecording,
    clearError,
    clearTranscript,
    cleanup,
    isSupported: isSpeechRecognitionSupported(),
  };
}
