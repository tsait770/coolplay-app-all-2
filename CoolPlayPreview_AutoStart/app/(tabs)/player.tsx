import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  Animated,
  Modal,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import * as DocumentPicker from "expo-document-picker";
import {
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Mic,
  Upload,
  Link as LinkIcon,
  Play,
  SkipForward,
  Volume2,
  Monitor,
  Gauge,
  Cog,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { useVoiceControl } from "@/providers/VoiceControlProvider";
import { useMembership } from "@/providers/MembershipProvider";

interface VoiceCommand {
  id: string;
  name: string;
  triggers: string[];
  action: string;
}

interface VideoSource {
  uri: string;
  type: "local" | "url" | "gdrive" | "youtube" | "vimeo" | "stream";
  name?: string;
  headers?: Record<string, string>;
}

type VideoSourceType = "supported" | "extended" | "unsupported" | "unknown";

export default function PlayerScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const voiceControl = useVoiceControl();
  const membership = useMembership();
  const voiceState = voiceControl || { usageCount: 0 };
  const {
    isListening: isVoiceListening = false,
    startListening: startVoiceListening = () => Promise.resolve(),
    stopListening: stopVoiceListening = () => Promise.resolve(),
    lastCommand = null,
    isProcessing: isVoiceProcessing = false,
    alwaysListening = false,
    toggleAlwaysListening = () => Promise.resolve()
  } = voiceControl || {};
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;
  
  // Responsive sizing
  const getResponsiveSize = (mobile: number, tablet: number, desktop: number) => {
    if (isDesktop) return desktop;
    if (isTablet) return tablet;
    return mobile;
  };
  
  // Siri Integration State
  const [siriEnabled, setSiriEnabled] = useState(false);
  const [showSiriSetup, setShowSiriSetup] = useState(false);
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const videoPlayer = useVideoPlayer(videoSource?.uri && videoSource.uri.trim() !== '' ? videoSource.uri : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', (player) => {
    player.loop = false;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const TEST_STREAM_URL = "https://www.youtube.com/live/H3KnMyojEQU?si=JCkwI15nOPXHdaL-" as const;
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const [voiceStatus, setVoiceStatus] = useState("");
  const [showCommandList, setShowCommandList] = useState(false);
  const [showProgressControl, setShowProgressControl] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showScreenControl, setShowScreenControl] = useState(false);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [showCustomCommandActions, setShowCustomCommandActions] = useState(false);
  const [customCommands, setCustomCommands] = useState<VoiceCommand[]>([]);
  const [recording, setRecording] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [showCustomCommandModal, setShowCustomCommandModal] = useState(false);
  const [editingCommand, setEditingCommand] = useState<VoiceCommand | null>(null);
  const [commandName, setCommandName] = useState("");
  const [showUrlModal, setShowUrlModal] = useState(false);

  const [commandAction, setCommandAction] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Define callback functions first
  const skipForward = useCallback(async (seconds: number = 10) => {
    if (!videoPlayer) return;
    try {
      const currentTime = videoPlayer.currentTime || 0;
      const duration = videoPlayer.duration || 0;
      const newPosition = Math.min(currentTime + seconds, duration);
      videoPlayer.currentTime = newPosition;
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  }, [videoPlayer]);

  const skipBackward = useCallback(async (seconds: number = 10) => {
    if (!videoPlayer) return;
    try {
      const currentTime = videoPlayer.currentTime || 0;
      const newPosition = Math.max(currentTime - seconds, 0);
      videoPlayer.currentTime = newPosition;
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  }, [videoPlayer]);

  const setVideoVolume = useCallback(async (newVolume: number) => {
    if (!videoPlayer) return;
    try {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      videoPlayer.volume = clampedVolume;
      setVolume(clampedVolume);
    } catch (error) {
      console.error('Error setting video volume:', error);
    }
  }, [videoPlayer]);

  const setVideoSpeed = useCallback(async (rate: number) => {
    if (!videoPlayer) return;
    try {
      videoPlayer.playbackRate = rate;
      setPlaybackRate(rate);
    } catch (error) {
      console.error('Error setting video speed:', error);
    }
  }, [videoPlayer]);

  // Initialize permissions and Siri integration
  useEffect(() => {
    const initializeVoiceControl = async () => {
      try {
        // Initialize voice control
        console.log('Voice control initialized');
      } catch (error) {
        console.error('Error initializing voice control:', error);
      }
    };
    
    initializeVoiceControl();
    
    // Cleanup on unmount
    return () => {
      if (isVoiceListening && stopVoiceListening && typeof stopVoiceListening === 'function') {
        stopVoiceListening().catch(error => {
          console.error('Error stopping voice control on cleanup:', error);
        });
      }
    };
  }, [isVoiceListening, stopVoiceListening]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }, 3000);
      return () => clearTimeout(timer);
    } else if (showControls) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showControls, isPlaying, fadeAnim]);

  // Pulse animation for voice button
  useEffect(() => {
    if (isVoiceActive || isVoiceListening) {
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
  }, [isVoiceActive, isVoiceListening, pulseAnim]);

  // Listen for voice commands from Siri integration
  useEffect(() => {
    const handleVoiceCommand = (event: CustomEvent) => {
      try {
        const { command } = event.detail || {};
        if (!command) return;
        
        // Map Siri intent to player actions
        switch (command) {
          case 'PlayVideoIntent':
            if (videoPlayer && typeof videoPlayer.play === 'function') {
              videoPlayer.play();
            }
            break;
          case 'PauseVideoIntent':
            if (videoPlayer && typeof videoPlayer.pause === 'function') {
              videoPlayer.pause();
            }
            break;
          case 'StopVideoIntent':
            if (videoPlayer && typeof videoPlayer.pause === 'function') {
              videoPlayer.pause();
              videoPlayer.currentTime = 0;
            }
            break;
          case 'NextVideoIntent':
            // Handle next video logic
            console.log('Next video command');
            break;
          case 'PreviousVideoIntent':
            // Handle previous video logic
            console.log('Previous video command');
            break;
          case 'ReplayVideoIntent':
            if (videoPlayer) {
              videoPlayer.currentTime = 0;
              if (typeof videoPlayer.play === 'function') {
                videoPlayer.play();
              }
            }
            break;
          case 'Forward10Intent':
            skipForward(10);
            break;
          case 'Forward20Intent':
            skipForward(20);
            break;
          case 'Forward30Intent':
            skipForward(30);
            break;
          case 'Rewind10Intent':
            skipBackward(10);
            break;
          case 'Rewind20Intent':
            skipBackward(20);
            break;
          case 'Rewind30Intent':
            skipBackward(30);
            break;
          case 'VolumeMaxIntent':
            setVideoVolume(1.0);
            break;
          case 'MuteIntent':
            if (videoPlayer) {
              videoPlayer.muted = true;
              setIsMuted(true);
            }
            break;
          case 'UnmuteIntent':
            if (videoPlayer) {
              videoPlayer.muted = false;
              setIsMuted(false);
            }
            break;
          case 'VolumeUpIntent':
            setVideoVolume(Math.min(1.0, volume + 0.2));
            break;
          case 'VolumeDownIntent':
            setVideoVolume(Math.max(0, volume - 0.2));
            break;
          case 'EnterFullscreenIntent':
            setIsFullscreen(true);
            break;
          case 'ExitFullscreenIntent':
            setIsFullscreen(false);
            break;
          case 'SpeedHalfIntent':
            setVideoSpeed(0.5);
            break;
          case 'SpeedNormalIntent':
            setVideoSpeed(1.0);
            break;
          case 'Speed125Intent':
            setVideoSpeed(1.25);
            break;
          case 'Speed150Intent':
            setVideoSpeed(1.5);
            break;
          case 'Speed200Intent':
            setVideoSpeed(2.0);
            break;
          default:
            console.log('Unknown command:', command);
        }
        
        setVoiceStatus(`${t('command_executed')}: ${command.replace('Intent', '')}`);
        setTimeout(() => setVoiceStatus(''), 2000);
      } catch (error) {
        console.error('Error handling voice command:', error);
      }
    };

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('voiceCommand', handleVoiceCommand as EventListener);
      return () => {
        if (typeof window.removeEventListener === 'function') {
          window.removeEventListener('voiceCommand', handleVoiceCommand as EventListener);
        }
      };
    }
  }, [videoPlayer, volume, skipForward, skipBackward, setVideoVolume, setVideoSpeed, t]);

  // Update video player state
  useEffect(() => {
    if (videoPlayer) {
      const updateStatus = () => {
        try {
          setIsPlaying(videoPlayer.playing || false);
          setDuration((videoPlayer.duration || 0) * 1000);
          setPosition((videoPlayer.currentTime || 0) * 1000);
          setIsMuted(videoPlayer.muted || false);
          setVolume(videoPlayer.volume || 1.0);
          setPlaybackRate(videoPlayer.playbackRate || 1.0);
        } catch (error) {
          console.error('Error updating video status:', error);
        }
      };
      
      const interval = setInterval(updateStatus, 100);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [videoPlayer]);

  const togglePlayPause = async () => {
    if (!videoPlayer) return;
    try {
      if (isPlaying) {
        if (videoPlayer.pause && typeof videoPlayer.pause === 'function') {
          videoPlayer.pause();
        }
      } else {
        if (videoPlayer.play && typeof videoPlayer.play === 'function') {
          videoPlayer.play();
        }
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const toggleMute = async () => {
    if (!videoPlayer) return;
    try {
      if (typeof videoPlayer.muted !== 'undefined') {
        videoPlayer.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const toggleFullscreen = async () => {
    // Note: expo-video fullscreen API may differ
    // This is a placeholder - check expo-video docs for actual implementation
    setIsFullscreen(!isFullscreen);
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.uri && asset.uri.trim() !== '') {
          setVideoSource({
            uri: asset.uri,
            type: "local",
            name: asset.name || "Local Video",
          });
        } else {
          Alert.alert(t("error"), t("invalid_video_file"));
        }
      }
    } catch {
      Alert.alert(t("error"), t("failed_to_load_video"));
    }
  };

  const detectVideoSource = (url: string): VideoSourceType => {
    const supportedRegex = [
      /youtube\.com\/watch\?v=[\w-]+/,
      /youtu\.be\/[\w-]+/,
      /vimeo\.com\/\d+/,
      /twitch\.tv\/\w+/,
      /facebook\.com\/watch\/\?v=\d+/,
      /drive\.google\.com\/file\/d\//,
      /dropbox\.com\/s\//,
      /.*\.(mp4|webm|ogg|ogv)$/,
      /.*\.m3u8$/,
      /.*\.mpd$/,
      /^rtmp:\/\/.*/
    ];

    const extendedRegex = [
      /pornhub\.com\/view_video\.php\?viewkey=/,
      /xvideos\.com\/\d+/,
      /twitter\.com\/.*\/status\/\d+/,
      /instagram\.com\/(reel|p|tv)\//,
      /tiktok\.com\/@[\w.-]+\/video\/\d+/,
      /bilibili\.com\/video\/[A-Za-z0-9]+/
    ];

    const unsupportedRegex = [
      /netflix\.com/,
      /disneyplus\.com/,
      /hbomax\.com/,
      /primevideo\.com/,
      /apple\.com\/tv/,
      /iqiyi\.com/
    ];

    if (supportedRegex.some(r => r.test(url))) return "supported";
    if (extendedRegex.some(r => r.test(url))) return "extended";
    if (unsupportedRegex.some(r => r.test(url))) return "unsupported";
    return "unknown";
  };

  const processVideoUrl = (url: string): VideoSource | null => {
    const sourceType = detectVideoSource(url);
    
    if (sourceType === "unsupported") {
      Alert.alert(
        t("unsupported_source"),
        t("drm_protected_content"),
        [{ text: t("ok") }]
      );
      return null;
    }

    // Process Google Drive links
    if (url.includes("drive.google.com")) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return {
          uri: `https://drive.google.com/uc?export=download&id=${fileId}`,
          type: "gdrive",
          name: "Google Drive Video",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://drive.google.com/"
          }
        };
      }
    }

    // Process YouTube links (with warning)
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Return YouTube source directly
      return {
        uri: url,
        type: "youtube" as const,
        name: "YouTube Video",
      };
    }

    // Process Vimeo links
    if (url.includes("vimeo.com")) {
      const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
      if (videoIdMatch) {
        return {
          uri: url,
          type: "vimeo",
          name: "Vimeo Video",
        };
      }
    }

    // Process HLS streams
    if (url.includes(".m3u8")) {
      return {
        uri: url,
        type: "stream",
        name: "HLS Stream",
      };
    }

    // Process DASH streams
    if (url.includes(".mpd")) {
      return {
        uri: url,
        type: "stream",
        name: "DASH Stream",
      };
    }

    // Process direct video URLs
    if (
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".ogg") ||
      url.endsWith(".ogv") ||
      url.includes(".mp4?") ||
      url.includes(".webm?")
    ) {
      return {
        uri: url,
        type: "url",
        name: "Direct Video",
      };
    }

    // Extended sources (with warning)
    if (sourceType === "extended") {
      Alert.alert(
        t("extended_source"),
        t("extended_source_warning"),
        [
          {
            text: t("continue"),
            onPress: () => {
              console.log("Extended source:", url);
            }
          },
          { text: t("cancel"), style: "cancel" }
        ]
      );
      return null;
    }

    // Default: try as direct URL only if URL is not empty
    if (url && url.trim() !== '') {
      return {
        uri: url,
        type: "url",
        name: "Video URL",
      };
    }
    
    // Return null if no valid URL
    return null;
  };

  const loadVideoFromUrl = () => {
    if (!videoUrl.trim()) {
      Alert.alert(t("error"), t("please_enter_url"));
      return;
    }

    const trimmedUrl = videoUrl.trim();
    const sourceType = detectVideoSource(trimmedUrl);
    
    // Check if it's YouTube and show confirmation
    if (trimmedUrl.includes("youtube.com") || trimmedUrl.includes("youtu.be")) {
      Alert.alert(
        t("youtube_support"),
        t("youtube_processing"),
        [
          {
            text: t("continue"),
            onPress: () => {
              const source = processVideoUrl(trimmedUrl);
              if (source && source.uri && source.uri.trim() !== '') {
                setVideoSource(source);
                setVideoUrl("");
                setVoiceStatus(t("video_loaded_successfully"));
                setTimeout(() => setVoiceStatus(""), 3000);
              }
            }
          },
          { text: t("cancel"), style: "cancel" }
        ]
      );
      return;
    }

    const source = processVideoUrl(trimmedUrl);
    if (source && source.uri && source.uri.trim() !== '') {
      setVideoSource(source);
      setVideoUrl("");
      setVoiceStatus(t("video_loaded_successfully"));
      setTimeout(() => setVoiceStatus(""), 3000);
    } else {
      Alert.alert(t("error"), t("invalid_url"));
    }
  };



  const saveCustomCommand = () => {
    if (!commandName.trim() || !commandAction.trim()) {
      Alert.alert(t("error"), t("fill_all_fields"));
      return;
    }

    // Check if command name already exists (for new commands)
    if (!editingCommand && customCommands.some(cmd => cmd.name.toLowerCase() === commandName.toLowerCase())) {
      Alert.alert(t("error"), t("command_name_exists"));
      return;
    }

    const newCommand: VoiceCommand = {
      id: editingCommand?.id || Date.now().toString(),
      name: commandName,
      triggers: [commandName.toLowerCase()], // Use command name as trigger
      action: commandAction,
    };

    if (editingCommand) {
      setCustomCommands(prev => 
        prev.map(cmd => cmd.id === editingCommand.id ? newCommand : cmd)
      );
      Alert.alert(t("success"), t("command_updated_successfully"));
    } else {
      setCustomCommands(prev => [...prev, newCommand]);
      Alert.alert(t("success"), t("command_added_successfully"));
    }

    // Reset form
    setCommandName("");
    setCommandAction("");
    setEditingCommand(null);
    setShowCustomCommandModal(false);
  };

  const deleteCustomCommand = (commandId: string) => {
    Alert.alert(
      t("delete_command"),
      t("delete_command_confirm"),
      [
        {
          text: t("cancel"),
          style: "cancel"
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => {
            setCustomCommands(prev => prev.filter(cmd => cmd.id !== commandId));
            Alert.alert(t("success"), t("command_deleted_successfully"));
          }
        }
      ]
    );
  };

  const startVoiceRecording = async () => {
    try {
      if (startVoiceListening && typeof startVoiceListening === 'function') {
        await startVoiceListening();
        setIsVoiceActive(true);
        setVoiceStatus(t("listening"));
      } else {
        console.error('startVoiceListening is not available or not a function');
        Alert.alert(t("error"), "Voice control not available");
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert(t("error"), t("failed_to_start_recording") + ": " + (error as Error).message);
    }
  };

  const stopVoiceRecording = async () => {
    try {
      if (stopVoiceListening && typeof stopVoiceListening === 'function') {
        await stopVoiceListening();
      }
      setIsVoiceActive(false);
      setVoiceStatus("");
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setVoiceStatus("");
      setIsVoiceActive(false);
    }
  };

  const processVoiceCommand = async (audioData: string | Blob) => {
    try {
      // Send audio to speech-to-text API
      const formData = new FormData();
      
      if (audioData instanceof Blob) {
        formData.append("audio", audioData, "recording.webm");
      } else if (typeof audioData === 'string') {
        // Handle URI case for mobile
        const response = await fetch(audioData);
        const blob = await response.blob();
        formData.append("audio", blob, "recording.webm");
      }
      
      formData.append("language", language);

      const response = await fetch("https://toolkit.rork.com/stt/transcribe/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const command = result.text.toLowerCase();
        executeVoiceCommand(command);
        setVoiceStatus(`${t("command_executed")}: ${command}`);
      } else {
        setVoiceStatus(t("failed_to_process_command"));
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      setVoiceStatus(t("error_processing_voice"));
    }

    setTimeout(() => setVoiceStatus(""), 3000);
  };

  const executeVoiceCommand = (command: string) => {
    // Play/Pause commands
    if (command.includes(t("play")) || command.includes("play")) {
      try {
        if (videoPlayer && typeof videoPlayer.play === 'function') {
          videoPlayer.play();
        }
      } catch (error) {
        console.error('Error playing video:', error);
      }
    } else if (command.includes(t("pause")) || command.includes("pause")) {
      try {
        if (videoPlayer && typeof videoPlayer.pause === 'function') {
          videoPlayer.pause();
        }
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    } else if (command.includes(t("stop")) || command.includes("stop")) {
      try {
        if (videoPlayer && typeof videoPlayer.pause === 'function') {
          videoPlayer.pause();
        }
      } catch (error) {
        console.error('Error stopping video:', error);
      }
    }
    // Skip commands
    else if (command.includes(t("forward_30")) || command.includes("forward 30")) {
      skipForward(30);
    } else if (command.includes(t("forward_20")) || command.includes("forward 20")) {
      skipForward(20);
    } else if (command.includes(t("forward_10")) || command.includes("forward 10")) {
      skipForward(10);
    } else if (command.includes(t("backward_30")) || command.includes("backward 30")) {
      skipBackward(30);
    } else if (command.includes(t("backward_20")) || command.includes("backward 20")) {
      skipBackward(20);
    } else if (command.includes(t("backward_10")) || command.includes("backward 10")) {
      skipBackward(10);
    }
    // Volume commands
    else if (command.includes(t("mute")) || command.includes("mute")) {
      try {
        if (videoPlayer) {
          videoPlayer.muted = true;
          setIsMuted(true);
        }
      } catch (error) {
        console.error('Error muting video:', error);
      }
    } else if (command.includes(t("unmute")) || command.includes("unmute")) {
      try {
        if (videoPlayer) {
          videoPlayer.muted = false;
          setIsMuted(false);
        }
      } catch (error) {
        console.error('Error unmuting video:', error);
      }
    } else if (command.includes(t("volume_up")) || command.includes("volume up")) {
      setVideoVolume(volume + 0.2);
    } else if (command.includes(t("volume_down")) || command.includes("volume down")) {
      setVideoVolume(volume - 0.2);
    } else if (command.includes(t("max_volume")) || command.includes("max volume")) {
      setVideoVolume(1.0);
    }
    // Speed commands
    else if (command.includes("0.5") || command.includes(t("half_speed"))) {
      setVideoSpeed(0.5);
    } else if (command.includes("1.25")) {
      setVideoSpeed(1.25);
    } else if (command.includes("1.5")) {
      setVideoSpeed(1.5);
    } else if (command.includes("2") || command.includes(t("double_speed"))) {
      setVideoSpeed(2.0);
    } else if (command.includes(t("normal_speed")) || command.includes("normal")) {
      setVideoSpeed(1.0);
    }
    // Fullscreen commands
    else if (command.includes(t("fullscreen")) || command.includes("fullscreen")) {
      toggleFullscreen();
    } else if (command.includes(t("exit_fullscreen")) || command.includes("exit fullscreen")) {
      if (isFullscreen) toggleFullscreen();
    }

    // Check custom commands
    customCommands.forEach((cmd) => {
      cmd.triggers.forEach((trigger) => {
        if (command.includes(trigger.toLowerCase())) {
          executeCustomAction(cmd.action);
        }
      });
    });
  };

  const getActionLabel = (actionKey: string): string => {
    const actionLabels: Record<string, string> = {
      play: t('play'),
      pause: t('pause'),
      stop: t('stop'),
      next: t('next_video'),
      previous: t('previous_video'),
      restart: t('replay'),
      forward_10: t('forward_10s'),
      forward_20: t('forward_20s'),
      forward_30: t('forward_30s'),
      rewind_10: t('rewind_10s'),
      rewind_20: t('rewind_20s'),
      rewind_30: t('rewind_30s'),
      volume_max: t('max_volume'),
      mute: t('mute'),
      unmute: t('unmute'),
      volume_up: t('volume_up'),
      volume_down: t('volume_down'),
      fullscreen: t('fullscreen'),
      exit_fullscreen: t('exit_fullscreen'),
      speed_0_5: t('speed_0_5'),
      speed_normal: t('normal_speed'),
      speed_1_25: t('speed_1_25'),
      speed_1_5: t('speed_1_5'),
      speed_2_0: t('speed_2_0'),
    };
    return actionLabels[actionKey] || actionKey;
  };

  const executeCustomAction = (action: string) => {
    switch (action) {
      case "play":
        if (videoPlayer && typeof videoPlayer.play === 'function') {
          videoPlayer.play();
        }
        break;
      case "pause":
        if (videoPlayer && typeof videoPlayer.pause === 'function') {
          videoPlayer.pause();
        }
        break;
      case "stop":
        if (videoPlayer && typeof videoPlayer.pause === 'function') {
          videoPlayer.pause();
        }
        break;
      case "forward_10":
        skipForward(10);
        break;
      case "forward_20":
        skipForward(20);
        break;
      case "forward_30":
        skipForward(30);
        break;
      case "rewind_10":
        skipBackward(10);
        break;
      case "rewind_20":
        skipBackward(20);
        break;
      case "rewind_30":
        skipBackward(30);
        break;
      case "volume_max":
        setVideoVolume(1.0);
        break;
      case "mute":
        if (videoPlayer) {
          videoPlayer.muted = true;
          setIsMuted(true);
        }
        break;
      case "unmute":
        if (videoPlayer) {
          videoPlayer.muted = false;
          setIsMuted(false);
        }
        break;
      case "volume_up":
        setVideoVolume(volume + 0.2);
        break;
      case "volume_down":
        setVideoVolume(volume - 0.2);
        break;
      case "fullscreen":
        setIsFullscreen(true);
        break;
      case "exit_fullscreen":
        setIsFullscreen(false);
        break;
      case "speed_0_5":
        setVideoSpeed(0.5);
        break;
      case "speed_normal":
        setVideoSpeed(1.0);
        break;
      case "speed_1_25":
        setVideoSpeed(1.25);
        break;
      case "speed_1_5":
        setVideoSpeed(1.5);
        break;
      case "speed_2_0":
        setVideoSpeed(2.0);
        break;
      default:
        break;
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    return (position / duration) * 100;
  };

  const handleProgressBarPress = async (event: any) => {
    if (!videoPlayer || duration === 0) return;
    try {
      const { locationX } = event.nativeEvent;
      const progressBarWidth = Dimensions.get("window").width - 32;
      const percentage = locationX / progressBarWidth;
      const newPosition = (percentage * duration) / 1000; // Convert to seconds
      videoPlayer.currentTime = newPosition;
    } catch (error) {
      console.error('Error seeking video:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.content, { paddingTop: 16 + insets.top }]}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Mic size={32} color={Colors.accent.primary} />
          </View>
          <Text style={styles.heroTitle}>{t('voice_control')}</Text>
          <Text style={styles.heroSubtitle}>{t('voice_control_subtitle')}</Text>
        </View>

        {/* Video Player - Moved to Top */}
        {videoSource && videoSource.uri && videoSource.uri.trim() !== '' ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowControls(!showControls)}
            style={styles.videoContainer}
          >
            <VideoView
              style={styles.video}
              player={videoPlayer}
              allowsFullscreen
              allowsPictureInPicture
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.videoSelectionCard}>
            <View style={styles.videoSelectionIcon}>
              <Play size={48} color={Colors.accent.primary} />
            </View>
            <Text style={styles.videoSelectionTitle}>{t('select_video')}</Text>
            <Text style={styles.videoSelectionSubtitle}>{t('select_video_subtitle')}</Text>
            
            <TouchableOpacity style={styles.selectVideoButton} onPress={pickVideo}>
              <Upload size={20} color="white" />
              <Text style={styles.selectVideoButtonText}>{t('select_video')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loadUrlButton} onPress={() => setShowUrlModal(true)}>
              <LinkIcon size={20} color={Colors.accent.primary} />
              <Text style={styles.loadUrlButtonText}>{t('load_from_url')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Voice Control Center */}
        <View style={styles.voiceControlCenter}>
          {/* Status Bar */}
          {voiceStatus ? (
            <View style={styles.statusBar}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{voiceStatus}</Text>
            </View>
          ) : null}

          {/* Main Voice Button */}
          <Animated.View
            style={[
              styles.voiceButtonWrapper,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.voiceButton,
                (isVoiceActive || isVoiceListening) && styles.voiceButtonActive,
              ]}
              onPress={(isVoiceActive || isVoiceListening) ? stopVoiceRecording : startVoiceRecording}
              activeOpacity={0.8}
            >
              <View style={styles.voiceButtonInnerCircle}>
                <Mic size={40} color="white" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Voice Status Text */}
          <Text style={styles.voiceStatusLabel}>
            {(isVoiceActive || isVoiceListening) ? t('listening') : t('tap_to_speak')}
          </Text>
        </View>

        {/* Always Listen Card */}
        <View style={styles.alwaysListenCard}>
          <View style={styles.alwaysListenContent}>
            <View style={styles.alwaysListenIcon}>
              <Mic size={20} color={alwaysListening ? Colors.accent.primary : Colors.primary.textSecondary} />
            </View>
            <View style={styles.alwaysListenText}>
              <Text style={styles.alwaysListenTitle}>{t('always_listen')}</Text>
            </View>
          </View>
          <Switch
            value={alwaysListening}
            onValueChange={toggleAlwaysListening}
            trackColor={{ false: Colors.card.border, true: Colors.accent.primary }}
            thumbColor="white"
            ios_backgroundColor={Colors.card.border}
          />
        </View>



        {/* Quick Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{voiceState.usageCount || 0}</Text>
              <Text style={styles.statLabel}>{t('commands_used')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2000</Text>
              <Text style={styles.statLabel}>{t('monthly_limit')}</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(((voiceState.usageCount || 0) / 2000) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>{t('upgrade_plan')}</Text>
            <ChevronUp size={16} color={Colors.accent.primary} style={{ transform: [{ rotate: '90deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Commands Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('available_commands')}</Text>
          <TouchableOpacity 
            style={styles.addCommandButton}
            onPress={() => setShowCustomCommandModal(true)}
          >
            <Plus size={18} color={Colors.accent.primary} />
            <Text style={styles.addCommandText}>{t('custom')}</Text>
          </TouchableOpacity>
        </View>

        {/* Playback Control Section */}
        <TouchableOpacity
          style={styles.commandCard}
          onPress={() => setShowCommandList(!showCommandList)}
          activeOpacity={0.7}
        >
          <View style={styles.commandCardHeader}>
            <View style={styles.commandIconWrapper}>
              <Play size={22} color={Colors.accent.primary} fill={Colors.accent.primary + '20'} />
            </View>
            <View style={styles.commandCardContent}>
              <Text style={styles.commandCardTitle}>{t('playback_control')}</Text>
              <Text style={styles.commandCardSubtitle}>6 {t('commands')}</Text>
            </View>
            <View style={styles.commandCardArrow}>
              {showCommandList ? (
                <ChevronUp size={20} color={Colors.primary.textSecondary} />
              ) : (
                <ChevronDown size={20} color={Colors.primary.textSecondary} />
              )}
            </View>
          </View>

          {showCommandList && (
            <View style={styles.commandCardExpanded}>
              {[
                { action: t('play'), example: t('play_example') },
                { action: t('pause'), example: t('pause_example') },
                { action: t('stop'), example: t('stop_example') },
                { action: t('next_video'), example: t('next_example') },
                { action: t('previous_video'), example: t('previous_example') },
                { action: t('replay'), example: t('replay_example') },
              ].map((cmd, index) => (
                <View key={index} style={styles.commandRow}>
                  <View style={styles.commandDot} />
                  <Text style={styles.commandText}>{cmd.action}</Text>
                  <Text style={styles.commandBadge}>{cmd.example}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Progress Control Section */}
        <TouchableOpacity
          style={styles.commandCard}
          onPress={() => setShowProgressControl(!showProgressControl)}
          activeOpacity={0.7}
        >
          <View style={styles.commandCardHeader}>
            <View style={styles.commandIconWrapper}>
              <SkipForward size={22} color={Colors.accent.primary} />
            </View>
            <View style={styles.commandCardContent}>
              <Text style={styles.commandCardTitle}>{t('progress_control')}</Text>
              <Text style={styles.commandCardSubtitle}>6 {t('commands')}</Text>
            </View>
            <View style={styles.commandCardArrow}>
              {showProgressControl ? (
                <ChevronUp size={20} color={Colors.primary.textSecondary} />
              ) : (
                <ChevronDown size={20} color={Colors.primary.textSecondary} />
              )}
            </View>
          </View>
          
          {showProgressControl && (
            <View style={styles.commandCardExpanded}>
              {[
                { action: t('forward_10s'), example: t('forward_10s_example') },
                { action: t('forward_20s'), example: t('forward_20s_example') },
                { action: t('forward_30s'), example: t('forward_30s_example') },
                { action: t('rewind_10s'), example: t('rewind_10s_example') },
                { action: t('rewind_20s'), example: t('rewind_20s_example') },
                { action: t('rewind_30s'), example: t('rewind_30s_example') },
              ].map((cmd, index) => (
                <View key={index} style={styles.commandRow}>
                  <View style={styles.commandDot} />
                  <Text style={styles.commandText}>{cmd.action}</Text>
                  <Text style={styles.commandBadge}>{cmd.example}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Volume Control Section */}
        <TouchableOpacity
          style={styles.commandCard}
          onPress={() => setShowVolumeControl(!showVolumeControl)}
          activeOpacity={0.7}
        >
          <View style={styles.commandCardHeader}>
            <View style={styles.commandIconWrapper}>
              <Volume2 size={22} color={Colors.accent.primary} />
            </View>
            <View style={styles.commandCardContent}>
              <Text style={styles.commandCardTitle}>{t('volume_control')}</Text>
              <Text style={styles.commandCardSubtitle}>5 {t('commands')}</Text>
            </View>
            <View style={styles.commandCardArrow}>
              {showVolumeControl ? (
                <ChevronUp size={20} color={Colors.primary.textSecondary} />
              ) : (
                <ChevronDown size={20} color={Colors.primary.textSecondary} />
              )}
            </View>
          </View>
          
          {showVolumeControl && (
            <View style={styles.commandCardExpanded}>
              {[
                { action: t('max_volume'), example: t('max_volume_example') },
                { action: t('mute'), example: t('mute_example') },
                { action: t('unmute'), example: t('unmute_example') },
                { action: t('volume_up'), example: t('volume_up_example') },
                { action: t('volume_down'), example: t('volume_down_example') },
              ].map((cmd, index) => (
                <View key={index} style={styles.commandRow}>
                  <View style={styles.commandDot} />
                  <Text style={styles.commandText}>{cmd.action}</Text>
                  <Text style={styles.commandBadge}>{cmd.example}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Screen Control Section */}
        <TouchableOpacity
          style={styles.commandCard}
          onPress={() => setShowScreenControl(!showScreenControl)}
          activeOpacity={0.7}
        >
          <View style={styles.commandCardHeader}>
            <View style={styles.commandIconWrapper}>
              <Monitor size={22} color={Colors.accent.primary} />
            </View>
            <View style={styles.commandCardContent}>
              <Text style={styles.commandCardTitle}>{t('screen_control')}</Text>
              <Text style={styles.commandCardSubtitle}>2 {t('commands')}</Text>
            </View>
            <View style={styles.commandCardArrow}>
              {showScreenControl ? (
                <ChevronUp size={20} color={Colors.primary.textSecondary} />
              ) : (
                <ChevronDown size={20} color={Colors.primary.textSecondary} />
              )}
            </View>
          </View>
          
          {showScreenControl && (
            <View style={styles.commandCardExpanded}>
              {[
                { action: t('fullscreen'), example: t('fullscreen_example') },
                { action: t('exit_fullscreen'), example: t('exit_fullscreen_example') },
              ].map((cmd, index) => (
                <View key={index} style={styles.commandRow}>
                  <View style={styles.commandDot} />
                  <Text style={styles.commandText}>{cmd.action}</Text>
                  <Text style={styles.commandBadge}>{cmd.example}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Playback Speed Section */}
        <TouchableOpacity
          style={styles.commandCard}
          onPress={() => setShowSpeedControl(!showSpeedControl)}
          activeOpacity={0.7}
        >
          <View style={styles.commandCardHeader}>
            <View style={styles.commandIconWrapper}>
              <Gauge size={22} color={Colors.accent.primary} />
            </View>
            <View style={styles.commandCardContent}>
              <Text style={styles.commandCardTitle}>{t('playback_speed')}</Text>
              <Text style={styles.commandCardSubtitle}>5 {t('commands')}</Text>
            </View>
            <View style={styles.commandCardArrow}>
              {showSpeedControl ? (
                <ChevronUp size={20} color={Colors.primary.textSecondary} />
              ) : (
                <ChevronDown size={20} color={Colors.primary.textSecondary} />
              )}
            </View>
          </View>
          
          {showSpeedControl && (
            <View style={styles.commandCardExpanded}>
              {[
                { action: t('speed_0_5'), example: t('speed_0_5_example') },
                { action: t('normal_speed'), example: t('normal_speed_example') },
                { action: t('speed_1_25'), example: t('speed_1_25_example') },
                { action: t('speed_1_5'), example: t('speed_1_5_example') },
                { action: t('speed_2_0'), example: t('speed_2_0_example') },
              ].map((cmd, index) => (
                <View key={index} style={styles.commandRow}>
                  <View style={styles.commandDot} />
                  <Text style={styles.commandText}>{cmd.action}</Text>
                  <Text style={styles.commandBadge}>{cmd.example}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
        
        {/* Siri Setup Modal */}
        <Modal
          visible={showSiriSetup}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSiriSetup(false)}
        >
          <View style={styles.siriSetupModal}>
            <View style={styles.siriSetupHeader}>
              <Text style={styles.siriSetupTitle}>{t('siri_shortcuts_setup')}</Text>
              <TouchableOpacity
                onPress={() => setShowSiriSetup(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.primary.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.siriSetupContent}>
              <View style={styles.siriSetupSection}>
                <View style={styles.siriFeatureCard}>
                  <View style={styles.siriFeatureIcon}>
                    <Mic size={32} color={Colors.accent.primary} />
                  </View>
                  <Text style={styles.siriFeatureTitle}>{t('dual_voice_control_system')}</Text>
                  <Text style={styles.siriFeatureDescription}>
                    {t('dual_voice_control_description')}
                  </Text>
                </View>
                
                <View style={styles.siriInstructions}>
                  <Text style={styles.siriInstructionsTitle}>{t('supported_voice_commands')}</Text>
                  <View style={styles.siriStep}>
                    <Text style={styles.siriStepNumber}>🎬</Text>
                    <Text style={styles.siriStepText}>{t('siri_playback_commands')}</Text>
                  </View>
                  <View style={styles.siriStep}>
                    <Text style={styles.siriStepNumber}>⏩</Text>
                    <Text style={styles.siriStepText}>{t('siri_progress_commands')}</Text>
                  </View>
                  <View style={styles.siriStep}>
                    <Text style={styles.siriStepNumber}>🔊</Text>
                    <Text style={styles.siriStepText}>{t('siri_volume_commands')}</Text>
                  </View>
                  <View style={styles.siriStep}>
                    <Text style={styles.siriStepNumber}>🖥️</Text>
                    <Text style={styles.siriStepText}>{t('siri_screen_commands')}</Text>
                  </View>
                  <View style={styles.siriStep}>
                    <Text style={styles.siriStepNumber}>⚡</Text>
                    <Text style={styles.siriStepText}>{t('siri_speed_commands')}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.siriEnableButton}
                  onPress={() => {
                    setSiriEnabled(true);
                    setVoiceStatus('Siri 語音控制已啟用');
                    setShowSiriSetup(false);
                    setTimeout(() => setVoiceStatus(''), 3000);
                  }}
                >
                  <Text style={styles.siriEnableButtonText}>{t('enable_siri_voice_control')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* URL Input Modal */}
        <Modal
          visible={showUrlModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowUrlModal(false)}
        >
          <View style={styles.urlModalContainer}>
            <View style={styles.urlModalHeader}>
              <Text style={styles.urlModalTitle}>{t('load_from_url')}</Text>
              <TouchableOpacity
                onPress={() => setShowUrlModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.primary.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.urlModalContent}>
              <Text style={styles.urlModalSubtitle}>{t('enter_video_url')}</Text>
              
              <View style={styles.urlModalInputGroup}>
                <Text style={styles.urlModalInputLabel}>{t('video_url')}</Text>
                <TextInput
                  style={styles.urlModalInput}
                  placeholder={t('video_url_placeholder')}
                  placeholderTextColor={Colors.primary.textSecondary}
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>

              <View style={styles.urlModalExamples}>
                <Text style={styles.urlModalExamplesTitle}>{t('example_formats')}</Text>
                <Text style={styles.urlModalExampleItem}>{t('example_direct_mp4')}</Text>
                <Text style={styles.urlModalExampleItem}>{t('example_hls_stream')}</Text>
                <Text style={styles.urlModalExampleItem}>{t('example_youtube')}</Text>
                <Text style={styles.urlModalExampleItem}>{t('example_vimeo')}</Text>
                <Text style={styles.urlModalExampleItem}>{t('example_adult_sites')}</Text>
                <Text style={styles.urlModalExampleItem}>{t('example_social_media')}</Text>
              </View>

              <View style={styles.urlModalButtons}>
                <TouchableOpacity
                  style={styles.urlModalCancelButton}
                  onPress={() => {
                    setShowUrlModal(false);
                    setVideoUrl("");
                  }}
                >
                  <Text style={styles.urlModalCancelButtonText}>{t('cancel')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.urlModalLoadButton,
                    !videoUrl.trim() && styles.urlModalLoadButtonDisabled
                  ]}
                  onPress={() => {
                    loadVideoFromUrl();
                    setShowUrlModal(false);
                  }}
                  disabled={!videoUrl.trim()}
                >
                  <Text style={styles.urlModalLoadButtonText}>{t('load_video')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Command Modal */}
        <Modal
          visible={showCustomCommandModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCustomCommandModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('custom_voice_commands')}</Text>
              <TouchableOpacity
                onPress={() => setShowCustomCommandModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.primary.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Add New Command Form */}
              <View style={styles.addCommandSection}>
                <Text style={styles.sectionTitle}>{t('custom_voice_commands')}</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('custom_command')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('custom_command_placeholder')}
                    placeholderTextColor={Colors.primary.textSecondary}
                    value={commandName}
                    onChangeText={setCommandName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('corresponding_action')}</Text>
                  <TouchableOpacity
                    style={styles.actionSelectorButton}
                    onPress={() => setShowCustomCommandActions(!showCustomCommandActions)}
                  >
                    <Text style={styles.actionSelectorText}>
                      {commandAction ? getActionLabel(commandAction) : t('select_action')}
                    </Text>
                    {showCustomCommandActions ? (
                      <ChevronUp size={16} color={Colors.primary.textSecondary} />
                    ) : (
                      <ChevronDown size={16} color={Colors.primary.textSecondary} />
                    )}
                  </TouchableOpacity>
                  
                  {showCustomCommandActions && (
                    <ScrollView style={styles.actionScrollView} nestedScrollEnabled={true}>
                      <View style={styles.actionCategory}>
                        <Text style={styles.actionCategoryTitle}>{t('playback_control')}</Text>
                        {[
                          { key: "play", label: t('play') },
                          { key: "pause", label: t('pause') },
                          { key: "stop", label: t('stop') },
                          { key: "next", label: t('next_video') },
                          { key: "previous", label: t('previous_video') },
                          { key: "restart", label: t('replay') },
                        ].map((action) => (
                          <TouchableOpacity
                            key={action.key}
                            style={[
                              styles.actionItem,
                              commandAction === action.key && styles.actionItemSelected,
                            ]}
                            onPress={() => {
                              setCommandAction(action.key);
                              setShowCustomCommandActions(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.actionItemText,
                                commandAction === action.key && styles.actionItemTextSelected,
                              ]}
                            >
                              {action.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <View style={styles.actionCategory}>
                        <Text style={styles.actionCategoryTitle}>{t('progress_control')}</Text>
                        {[
                          { key: "forward_10", label: t('forward_10s') },
                          { key: "forward_20", label: t('forward_20s') },
                          { key: "forward_30", label: t('forward_30s') },
                          { key: "rewind_10", label: t('rewind_10s') },
                          { key: "rewind_20", label: t('rewind_20s') },
                          { key: "rewind_30", label: t('rewind_30s') },
                        ].map((action) => (
                          <TouchableOpacity
                            key={action.key}
                            style={[
                              styles.actionItem,
                              commandAction === action.key && styles.actionItemSelected,
                            ]}
                            onPress={() => {
                              setCommandAction(action.key);
                              setShowCustomCommandActions(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.actionItemText,
                                commandAction === action.key && styles.actionItemTextSelected,
                              ]}
                            >
                              {action.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <View style={styles.actionCategory}>
                        <Text style={styles.actionCategoryTitle}>{t('volume_control')}</Text>
                        {[
                          { key: "volume_max", label: t('max_volume') },
                          { key: "mute", label: t('mute') },
                          { key: "unmute", label: t('unmute') },
                          { key: "volume_up", label: t('volume_up') },
                          { key: "volume_down", label: t('volume_down') },
                        ].map((action) => (
                          <TouchableOpacity
                            key={action.key}
                            style={[
                              styles.actionItem,
                              commandAction === action.key && styles.actionItemSelected,
                            ]}
                            onPress={() => {
                              setCommandAction(action.key);
                              setShowCustomCommandActions(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.actionItemText,
                                commandAction === action.key && styles.actionItemTextSelected,
                              ]}
                            >
                              {action.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <View style={styles.actionCategory}>
                        <Text style={styles.actionCategoryTitle}>{t('screen_control')}</Text>
                        {[
                          { key: "fullscreen", label: t('fullscreen') },
                          { key: "exit_fullscreen", label: t('exit_fullscreen') },
                        ].map((action) => (
                          <TouchableOpacity
                            key={action.key}
                            style={[
                              styles.actionItem,
                              commandAction === action.key && styles.actionItemSelected,
                            ]}
                            onPress={() => {
                              setCommandAction(action.key);
                              setShowCustomCommandActions(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.actionItemText,
                                commandAction === action.key && styles.actionItemTextSelected,
                              ]}
                            >
                              {action.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <View style={styles.actionCategory}>
                        <Text style={styles.actionCategoryTitle}>{t('playback_speed')}</Text>
                        {[
                          { key: "speed_0_5", label: t('speed_0_5') },
                          { key: "speed_normal", label: t('normal_speed') },
                          { key: "speed_1_25", label: t('speed_1_25') },
                          { key: "speed_1_5", label: t('speed_1_5') },
                          { key: "speed_2_0", label: t('speed_2_0') },
                        ].map((action) => (
                          <TouchableOpacity
                            key={action.key}
                            style={[
                              styles.actionItem,
                              commandAction === action.key && styles.actionItemSelected,
                            ]}
                            onPress={() => {
                              setCommandAction(action.key);
                              setShowCustomCommandActions(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.actionItemText,
                                commandAction === action.key && styles.actionItemTextSelected,
                              ]}
                            >
                              {action.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    (!commandName.trim() || !commandAction) && styles.addButtonDisabled,
                  ]}
                  onPress={saveCustomCommand}
                  disabled={!commandName.trim() || !commandAction}
                >
                  <Plus size={20} color="white" />
                  <Text style={styles.addButtonText}>{t('add')}</Text>
                </TouchableOpacity>
              </View>

              {/* Saved Commands */}
              <View style={styles.savedCommandsSection}>
                <Text style={styles.sectionTitle}>{t('saved_commands')}</Text>
                {customCommands.length === 0 ? (
                  <Text style={styles.noCommandsText}>{t('no_custom_commands')}</Text>
                ) : (
                  <View style={styles.savedCommandsList}>
                    {customCommands.map((command) => (
                      <View key={command.id} style={styles.savedCommandItem}>
                        <View style={styles.savedCommandInfo}>
                          <Text style={styles.savedCommandName}>{command.name}</Text>
                          <Text style={styles.savedCommandAction}>{getActionLabel(command.action)}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteCommandButton}
                          onPress={() => deleteCustomCommand(command.id)}
                        >
                          <X size={16} color={Colors.danger} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

const createStyles = () => {
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;
  
  const getResponsiveSize = (mobile: number, tablet: number, desktop: number) => {
    if (isDesktop) return desktop;
    if (isTablet) return tablet;
    return mobile;
  };
  
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  content: {
    paddingHorizontal: getResponsiveSize(16, 24, 32),
    paddingBottom: 40,
    maxWidth: getResponsiveSize(400, 600, 800),
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: "center",
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: getResponsiveSize(12, 16, 20),
    overflow: "hidden",
    marginBottom: getResponsiveSize(20, 24, 28),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minHeight: getResponsiveSize(180, 220, 260),
    maxHeight: getResponsiveSize(220, 280, 340),
  },
  video: {
    width: "100%",
    height: "100%",
  },

  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "space-between",
    padding: 16,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600" as const,
    flex: 1,
    marginRight: 12,
  },
  centerControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 40,
    padding: 12,
  },
  bottomControls: {
    gap: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent.primary,
    borderRadius: 2,
  },
  bottomButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  speedSelector: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  speedText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  placeholderContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: Colors.secondary.bg,
    borderRadius: getResponsiveSize(12, 16, 20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: getResponsiveSize(20, 24, 28),
    borderWidth: 2,
    borderColor: Colors.card.border,
    borderStyle: "dashed",
    minHeight: getResponsiveSize(180, 220, 260),
    maxHeight: getResponsiveSize(220, 280, 340),
  },

  voiceControlSection: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
  },
  voiceButtonContainer: {
    marginBottom: 16,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  voiceButtonActive: {
    backgroundColor: Colors.danger,
  },
  voiceStatusSection: {
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.textSecondary,
  },
  statusDotActive: {
    backgroundColor: Colors.accent.primary,
  },
  voiceHint: {
    color: Colors.primary.text,
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 6,
  },
  supportedCommands: {
    color: Colors.primary.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  speedIcon: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  successMessage: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    color: Colors.primary.text,
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  successSubtitle: {
    color: Colors.primary.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  voiceStatusContainer: {
    backgroundColor: Colors.secondary.bg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: "center",
  },
  voiceStatusText: {
    color: Colors.accent.primary,
    fontSize: 14,
  },
  uploadSection: {
    marginBottom: 32,
    marginHorizontal: 4,
  },
  uploadContainer: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.card.border,
    borderStyle: "dashed",
  },
  uploadTitle: {
    color: Colors.primary.text,
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: "600" as const,
    marginTop: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  uploadSubtitle: {
    color: Colors.primary.textSecondary,
    fontSize: getResponsiveSize(13, 14, 15),
    textAlign: "center",
  },
  urlSection: {
    marginBottom: 32,
    marginHorizontal: 4,
  },
  urlInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.card.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urlIcon: {
    marginRight: 12,
  },
  urlInput: {
    flex: 1,
    paddingVertical: getResponsiveSize(12, 14, 16),
    color: Colors.primary.text,
    fontSize: getResponsiveSize(13, 14, 15),
  },
  loadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#4ECDC4",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadButtonDisabled: {
    backgroundColor: Colors.primary.textSecondary,
    opacity: 0.5,
  },
  loadButtonText: {
    color: "white",
    fontSize: getResponsiveSize(13, 14, 15),
    fontWeight: "600" as const,
  },
  loadButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  supportedFormats: {
    color: Colors.primary.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  commandsSection: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: getResponsiveSize(12, 16, 20),
    marginBottom: getResponsiveSize(12, 16, 20),
    marginHorizontal: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  commandsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: getResponsiveSize(15, 18, 20),
    backgroundColor: Colors.card.bg,
  },
  commandsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  commandsTitle: {
    color: Colors.primary.text,
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: "600" as const,
  },
  commandsList: {
    padding: 16,
  },
  commandCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    color: Colors.accent.primary,
    fontSize: getResponsiveSize(13, 14, 15),
    fontWeight: "600" as const,
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  commandItems: {
    gap: 8,
  },
  commandItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  commandAction: {
    color: Colors.primary.text,
    fontSize: getResponsiveSize(13, 14, 15),
  },
  commandExample: {
    color: Colors.primary.textSecondary,
    fontSize: getResponsiveSize(11, 12, 13),
    backgroundColor: Colors.card.bg,
    paddingHorizontal: getResponsiveSize(6, 8, 10),
    paddingVertical: getResponsiveSize(2, 3, 4),
    borderRadius: getResponsiveSize(4, 6, 8),
  },
  customCommandItem: {
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
    backgroundColor: Colors.secondary.bg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  addCommandSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.primary.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.primary.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  actionSelector: {
    marginBottom: 8,
    maxHeight: 50,
  },
  actionScrollContent: {
    paddingHorizontal: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  actionButton: {
    backgroundColor: Colors.secondary.bg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  actionButtonSelected: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primary,
  },
  actionButtonText: {
    color: Colors.primary.text,
    fontSize: 14,
    fontWeight: "500" as const,
  },
  actionButtonTextSelected: {
    color: "white",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.primary.textSecondary,
    opacity: 0.5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  savedCommandsSection: {
    marginBottom: 32,
  },
  noCommandsText: {
    color: Colors.primary.textSecondary,
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 16,
  },
  savedCommandsList: {
    gap: 12,
  },
  savedCommandItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.secondary.bg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  savedCommandInfo: {
    flex: 1,
  },
  savedCommandName: {
    color: Colors.primary.text,
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  savedCommandAction: {
    color: Colors.primary.textSecondary,
    fontSize: 14,
  },
  deleteCommandButton: {
    padding: 8,
  },
  actionSelectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
    marginBottom: 8,
  },
  actionSelectorText: {
    color: Colors.primary.text,
    fontSize: 16,
  },
  actionScrollView: {
    maxHeight: 300,
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
    marginBottom: 8,
  },
  actionCategory: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  actionCategoryTitle: {
    color: Colors.accent.primary,
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  actionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  actionItemSelected: {
    backgroundColor: Colors.accent.primary,
  },
  actionItemText: {
    color: Colors.primary.text,
    fontSize: 14,
  },
  actionItemTextSelected: {
    color: "white",
  },
  
  // Modern Header Styles
  modernHeader: {
    marginBottom: 32,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  modernTitle: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: "600" as const,
    color: Colors.primary.text,
    textAlign: "center",
    marginBottom: 6,
  },
  modernSubtitle: {
    fontSize: getResponsiveSize(13, 14, 15),
    color: Colors.primary.textSecondary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  
  // Dual Voice Hub Styles
  dualVoiceHub: {
    marginBottom: getResponsiveSize(24, 28, 32),
    gap: getResponsiveSize(16, 20, 24),
  },
  
  // Siri Card Styles
  siriCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: getResponsiveSize(16, 20, 24),
    padding: getResponsiveSize(20, 24, 28),
    borderWidth: 1,
    borderColor: Colors.card.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  siriCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  siriIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  siriCardContent: {
    flex: 1,
  },
  siriCardTitle: {
    fontSize: getResponsiveSize(15, 16, 17),
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  siriCardStatus: {
    fontSize: getResponsiveSize(13, 14, 15),
    color: Colors.accent.primary,
    fontWeight: "500" as const,
  },
  siriStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent.primary,
  },
  siriQuickActions: {
    flexDirection: "row",
    gap: 12,
  },
  siriQuickAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.accent.primary + '10',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent.primary + '20',
  },
  siriQuickActionText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.accent.primary,
  },
  
  // App Voice Card Styles
  appVoiceCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: getResponsiveSize(16, 20, 24),
    padding: getResponsiveSize(20, 24, 28),
    borderWidth: 1,
    borderColor: Colors.card.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  appVoiceHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  appVoiceTitle: {
    fontSize: getResponsiveSize(15, 16, 17),
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 6,
    textAlign: "center",
  },
  appVoiceSubtitle: {
    fontSize: getResponsiveSize(13, 14, 15),
    color: Colors.primary.textSecondary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  voiceControlCenter: {
    alignItems: "center",
    marginBottom: 24,
  },
  voiceControlInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  statusIndicators: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  voiceControlStatus: {
    fontSize: getResponsiveSize(13, 14, 15),
    fontWeight: "600" as const,
    color: Colors.primary.text,
    textAlign: "center",
  },
  quickVoiceActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  quickVoiceAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card.bg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  quickVoiceActionActive: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primary,
  },
  quickVoiceActionText: {
    fontSize: getResponsiveSize(13, 14, 15),
    fontWeight: "600" as const,
    color: Colors.primary.textSecondary,
  },
  quickVoiceActionTextActive: {
    color: "white",
  },
  
  modernVoiceButton: {
    width: getResponsiveSize(56, 64, 72),
    height: getResponsiveSize(56, 64, 72),
    borderRadius: getResponsiveSize(28, 32, 36),
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  modernVoiceButtonActive: {
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
  },
  voiceButtonInner: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  
  // Quick Actions Styles
  quickActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card.bg,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  quickActionButtonActive: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primary,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.primary.textSecondary,
  },
  quickActionTextActive: {
    color: "white",
  },
  
  // Siri Setup Modal Styles
  siriSetupModal: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  siriSetupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
    backgroundColor: Colors.secondary.bg,
  },
  siriSetupTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.primary.text,
  },
  siriSetupContent: {
    flex: 1,
    padding: 20,
  },
  siriSetupSection: {
    flex: 1,
  },
  siriFeatureCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  siriFeatureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent.primary + '20',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  siriFeatureTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginBottom: 12,
    textAlign: "center",
  },
  siriFeatureDescription: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  siriInstructions: {
    marginBottom: 32,
  },
  siriInstructionsTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 16,
  },
  siriStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  siriStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent.primary,
    color: "white",
    fontSize: 16,
    fontWeight: "700" as const,
    textAlign: "center",
    lineHeight: 32,
    marginRight: 16,
  },
  siriStepText: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary.text,
    lineHeight: 22,
  },
  siriEnableButton: {
    backgroundColor: Colors.accent.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  siriEnableButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "white",
  },
  
  // New Styles for Redesigned Components
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  alwaysListenCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  alwaysListenContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  alwaysListenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card.bg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alwaysListenText: {
    flex: 1,
  },
  alwaysListenTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 2,
  },
  alwaysListenSubtitle: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
  },
  voiceButtonSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  mainVoiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  mainVoiceButtonActive: {
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
  },
  voiceButtonHint: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.primary.text,
    marginTop: 16,
    textAlign: "center",
  },
  membershipCard: {
    backgroundColor: "#E0F7F4",
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.accent.primary + '20',
  },
  membershipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  membershipBadgeIcon: {
    fontSize: 20,
  },
  membershipBadgeText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  trialBadge: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "white",
  },
  usageSection: {
    marginBottom: 16,
  },
  usageLabel: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.primary.text,
  },
  upgradeText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginBottom: 12,
    textAlign: "center",
  },
  planButtons: {
    flexDirection: "row",
    gap: 12,
  },
  basicButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF9F0A",
    paddingVertical: 12,
    borderRadius: 12,
  },
  basicButtonIcon: {
    fontSize: 16,
  },
  basicButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "white",
  },
  premiumButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#BF5AF2",
    paddingVertical: 12,
    borderRadius: 12,
  },
  premiumButtonIcon: {
    fontSize: 16,
  },
  premiumButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "white",
  },
  customCommandsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  customCommandsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  customCommandsTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  videoSelectionCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: Colors.card.border,
    borderStyle: "dashed",
  },
  videoSelectionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  videoSelectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 8,
    textAlign: "center",
  },
  videoSelectionSubtitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  selectVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4ECDC4",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectVideoButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "white",
  },
  loadUrlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card.bg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  loadUrlButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.accent.primary,
  },
  
  // New Redesigned Styles
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.primary.textSecondary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.accent.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.accent.primary,
  },
  voiceButtonWrapper: {
    marginBottom: 16,
  },
  voiceButtonInnerCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  voiceStatusLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 20,
    textAlign: "center",
  },
  alwaysListenToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.card.border,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card.bg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toggleIconActive: {
    backgroundColor: Colors.accent.primary + '15',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  
  // URL Modal Styles
  urlModalContainer: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  urlModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
    backgroundColor: Colors.secondary.bg,
  },
  urlModalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.primary.text,
  },
  urlModalContent: {
    flex: 1,
    padding: 24,
  },
  urlModalSubtitle: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  urlModalInputGroup: {
    marginBottom: 24,
  },
  urlModalInputLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 12,
  },
  urlModalInput: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.primary.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  urlModalExamples: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  urlModalExamplesTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 12,
  },
  urlModalExampleItem: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  urlModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  urlModalCancelButton: {
    flex: 1,
    backgroundColor: Colors.secondary.bg,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  urlModalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  urlModalLoadButton: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  urlModalLoadButtonDisabled: {
    backgroundColor: Colors.primary.textSecondary,
    opacity: 0.5,
  },
  urlModalLoadButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "white",
  },
  statsCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.card.border,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.card.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accent.primary,
    borderRadius: 4,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card.bg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent.primary,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.accent.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  addCommandButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accent.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addCommandText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.accent.primary,
  },
  commandCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commandCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  commandIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  commandCardContent: {
    flex: 1,
  },
  commandCardTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 2,
  },
  commandCardSubtitle: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
  },
  commandCardArrow: {
    marginLeft: 8,
  },
  commandCardExpanded: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.card.border,
  },
  commandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  commandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent.primary,
  },
  commandText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.text,
    fontWeight: "500" as const,
  },
  commandBadge: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    backgroundColor: Colors.card.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: "500" as const,
  },
  });
};

const styles = createStyles();