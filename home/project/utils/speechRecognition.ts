import { Platform } from 'react-native';

// Note: This API endpoint is currently not available (returns 404)
// Consider using a different speech-to-text service or implementing a fallback
const STT_API_URL = 'https://toolkit.rork.com/stt/transcribe/';

export interface TranscriptionResult {
  text: string;
  confidence?: number;
}

export async function transcribeAudio(audioUri: string): Promise<TranscriptionResult> {
  try {
    // Check if we're in a development environment and provide a mock response
    if (__DEV__) {
      console.warn('Speech recognition API is not available in development mode. Using mock response.');
      return {
        text: 'Mock transcription result - API not available',
        confidence: 0.5
      };
    }

    const formData = new FormData();
    
    if (Platform.OS === 'web') {
      // For web, we need to handle blob URLs carefully
      if (audioUri.startsWith('blob:')) {
        try {
          const response = await fetch(audioUri);
          const blob = await response.blob();
          formData.append('audio', blob, 'recording.wav');
        } catch (blobError) {
          console.error('Failed to process blob URL:', blobError);
          throw new Error('Failed to process audio recording. Please try again.');
        }
      } else {
        throw new Error('Invalid audio format for web platform');
      }
    } else {
      // For mobile platforms
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/wav',
        name: 'recording.wav',
      } as any);
    }

    const response = await fetch(STT_API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Speech recognition service is currently unavailable. Please try again later.');
      }
      throw new Error(`Speech recognition failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      text: result.text || '',
      confidence: result.confidence || 0
    };
  } catch (error) {
    console.error('Speech recognition error:', error);
    
    // Provide user-friendly error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Speech recognition failed. Please try again.');
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (Platform.OS === 'web') {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
  // For mobile platforms, assume it's supported if the necessary permissions are granted
  return true;
}
