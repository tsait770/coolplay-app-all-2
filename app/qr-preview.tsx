import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Colors from '@/constants/colors';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function QRPreviewPage() {
  const [appUrl, setAppUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');

  useEffect(() => {
    // 獲取當前的網絡地址
    const getNetworkUrls = () => {
      if (Platform.OS === 'web') {
        // 網頁環境
        const currentUrl = window.location.origin;
        setWebUrl(currentUrl);
        setAppUrl(`exp://${window.location.hostname}:8081`);
      } else {
        // 移動設備環境
        const debuggerHost = Constants.expoConfig?.hostUri || 'localhost:8081';
        const host = debuggerHost.split(':')[0];
        setAppUrl(`exp://${debuggerHost}`);
        setWebUrl(`http://${host}:8081`);
      }
    };

    getNetworkUrls();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎵 CoolPlay 語音控制APP</Text>
        <Text style={styles.subtitle}>掃描QR Code體驗應用</Text>

        {/* 手機掃描QR Code */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>📱 手機掃描 (推薦)</Text>
          <View style={styles.qrContainer}>
            {appUrl && appUrl.trim().length > 0 ? (
              <QRCode
                value={appUrl}
                size={Math.min(width - 100, 250)}
                color={Colors.primary.text}
                backgroundColor="#ffffff"
              />
            ) : (
              <View style={[styles.qrPlaceholder, { width: Math.min(width - 100, 250), height: Math.min(width - 100, 250) }]}>
                <Text style={styles.loadingText}>正在生成QR碼...</Text>
              </View>
            )}
          </View>
          <Text style={styles.qrLabel}>Expo Go 應用掃描</Text>
          {appUrl && (
            <Text style={styles.urlText}>URL: {appUrl}</Text>
          )}
          <Text style={styles.instructions}>
            1. 下載 Expo Go 應用{'\n'}
            2. 掃描上方QR Code{'\n'}
            3. 在手機上體驗完整功能
          </Text>
        </View>

        {/* 網頁版QR Code */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>💻 網頁版本</Text>
          <View style={styles.qrContainer}>
            {webUrl && webUrl.trim().length > 0 ? (
              <QRCode
                value={webUrl}
                size={Math.min(width - 100, 200)}
                color={Colors.primary.text}
                backgroundColor="#ffffff"
              />
            ) : (
              <View style={[styles.qrPlaceholder, { width: Math.min(width - 100, 200), height: Math.min(width - 100, 200) }]}>
                <Text style={styles.loadingText}>正在生成QR碼...</Text>
              </View>
            )}
          </View>
          <Text style={styles.qrLabel}>網頁版訪問</Text>
          {webUrl && (
            <Text style={styles.urlText}>URL: {webUrl}</Text>
          )}
          <Text style={styles.instructions}>
            掃描此QR Code在瀏覽器中打開{'\n'}
            {webUrl ? `或直接訪問: ${webUrl}` : '正在獲取網址...'}
          </Text>
        </View>

        {/* 功能介紹 */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ 主要功能</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>🎵 音樂播放器</Text>
            <Text style={styles.featureItem}>🗣️ 語音控制</Text>
            <Text style={styles.featureItem}>❤️ 收藏管理</Text>
            <Text style={styles.featureItem}>👥 社區互動</Text>
            <Text style={styles.featureItem}>⚙️ 個人設置</Text>
            <Text style={styles.featureItem}>🌍 多語言支持</Text>
          </View>
        </View>

        {/* 下載鏈接 */}
        <View style={styles.downloadSection}>
          <Text style={styles.sectionTitle}>📲 下載 Expo Go</Text>
          <Text style={styles.downloadText}>
            Android: Google Play Store{'\n'}
            iOS: App Store{'\n'}
            搜索 "Expo Go" 即可下載
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🚀 開發服務器正在運行{'\n'}
            按 Ctrl+C 停止服務器
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  qrSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: Colors.card.bg,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.accent,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresSection: {
    width: '100%',
    backgroundColor: Colors.card.bg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 16,
    color: Colors.primary.text,
    marginBottom: 8,
    paddingLeft: 10,
  },
  downloadSection: {
    width: '100%',
    backgroundColor: Colors.card.bg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  downloadText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.primary.accent + '20',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  qrPlaceholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
  },
  urlText: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
});