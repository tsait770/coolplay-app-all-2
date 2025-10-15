# 跨平台語音控制系統 - 完整實作文件

## 📋 系統概述

本系統實現了一個完整的跨平台語音控制架構，支援 iOS、Android 和 Web 平台，並提供自訂語音指令功能。

### 核心特性

✅ **跨平台支援**
- iOS: Web Speech API (Expo Go 相容)
- Android: Web Speech API (Expo Go 相容)
- Web: Web Speech API (原生支援)

✅ **自訂指令系統**
- 使用者可自訂任意文字觸發特定動作
- 例如：「S」→ 播放、「X」→ 暫停
- 支援啟用/停用個別指令
- 持久化儲存至 AsyncStorage

✅ **內建指令庫**
- 播放控制：播放、暫停、停止、下一部、上一部、重播
- 進度控制：快轉/倒轉 10/20/30 秒
- 音量控制：最大、靜音、解除靜音、調高、調低
- 全螢幕控制：進入/離開全螢幕
- 播放速度：0.5x、1x、1.25x、1.5x、2x

✅ **多語系支援**
- 支援 12 種語言
- 所有 UI 文字透過翻譯檔呼叫
- 語言切換即時生效

✅ **信心分數機制**
- 可調整信心閾值 (0-1)
- 低信心分數時提示使用者重試
- 防止誤觸發

---

## 🏗️ 系統架構

### 1. Provider 層級結構

```
CustomCommandProvider (自訂指令管理)
  ↓
VoiceControlProvider (原有語音控制)
  ↓
UnifiedVoiceControlProvider (統一語音控制)
  ↓
SiriIntegrationProvider (Siri 整合)
```

### 2. 核心 Providers

#### CustomCommandProvider
**檔案**: `providers/CustomCommandProvider.tsx`

**功能**:
- 管理使用者自訂語音指令
- CRUD 操作 (新增、更新、刪除、切換啟用)
- 持久化儲存至 AsyncStorage
- 指令匹配邏輯

**API**:
```typescript
interface CustomCommand {
  id: string;
  text: string;              // 觸發文字
  intent: string;            // 意圖
  action?: string;           // 動作
  slot?: any;                // 參數
  enabled: boolean;          // 是否啟用
  createdAt: number;
  updatedAt: number;
}

// 使用方式
const { 
  commands,                  // 所有自訂指令
  addCommand,                // 新增指令
  updateCommand,             // 更新指令
  deleteCommand,             // 刪除指令
  toggleCommand,             // 切換啟用狀態
  findMatchingCustomCommand, // 尋找匹配指令
  clearAllCommands,          // 清除所有指令
  reload,                    // 重新載入
  isLoading                  // 載入狀態
} = useCustomCommands();
```

#### UnifiedVoiceControlProvider
**檔案**: `providers/UnifiedVoiceControlProvider.tsx`

**功能**:
- 統一管理內建與自訂指令
- 語音辨識引擎整合
- 指令解析與執行
- 信心分數判斷

**API**:
```typescript
const {
  isListening,              // 是否正在聆聽
  isProcessing,             // 是否正在處理
  transcript,               // 最終辨識文字
  interimTranscript,        // 即時辨識文字
  lastCommand,              // 最後執行的指令
  error,                    // 錯誤訊息
  confidenceThreshold,      // 信心閾值
  startListening,           // 開始聆聽
  stopListening,            // 停止聆聽
  setConfidenceThreshold,   // 設定信心閾值
} = useUnifiedVoiceControl();
```

### 3. UI 元件

#### CustomCommandManager
**檔案**: `components/CustomCommandManager.tsx`

**功能**:
- 自訂指令管理介面
- 新增/編輯/刪除指令
- 啟用/停用指令
- 選擇意圖與動作

**使用方式**:
```tsx
import { CustomCommandManager } from '@/components/CustomCommandManager';

<CustomCommandManager />
```

---

## 📝 指令映射系統

### 內建指令結構

**檔案**: `constants/voiceCommands.json`, `constants/voiceIntents.json`

```json
{
  "intent": "playback_control",
  "action": "play",
  "slot": null,
  "usage_count": 1,
  "utterances": {
    "en": ["play", "resume"],
    "zh-TW": ["播放", "繼續播放"],
    "zh-CN": ["播放", "继续播放"]
  }
}
```

### 自訂指令結構

```typescript
{
  id: "custom_1234567890_abc123",
  text: "s",                    // 使用者說的文字
  intent: "playback_control",   // 對應的意圖
  action: "play",               // 對應的動作
  slot: null,                   // 參數 (可選)
  enabled: true,                // 是否啟用
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

### 指令優先權

1. **自訂指令** (優先)
2. **內建指令** (次要)

當語音辨識結果同時匹配自訂與內建指令時，優先執行自訂指令。

---

## 🎯 指令執行流程

```
1. 使用者說話
   ↓
2. 語音辨識 (Web Speech API)
   ↓
3. 取得文字結果 + 信心分數
   ↓
4. 指令解析
   ├─ 檢查自訂指令
   └─ 檢查內建指令
   ↓
5. 信心分數判斷
   ├─ >= 閾值 → 執行指令
   └─ < 閾值 → 提示重試
   ↓
6. 發送 voiceCommand 事件
   ↓
7. 影片播放器接收並執行
```

---

## 🌍 多語系實作

### 翻譯檔結構

**檔案**: `l10n/{language}.json`

```json
{
  "custom_voice_commands": "Custom Voice Commands",
  "add_custom_command": "Add Custom Command",
  "command_text": "Command Text",
  "intent": "Intent",
  "action": "Action"
}
```

### 新增翻譯鍵

執行腳本:
```bash
node scripts/add-custom-command-translations.js
```

### 使用翻譯

```tsx
import { useTranslation } from '@/hooks/useTranslation';

const { t } = useTranslation();

<Text>{t('custom_voice_commands')}</Text>
```

---

## 🔧 整合指南

### 1. 在 App 中使用

```tsx
import { useUnifiedVoiceControl } from '@/providers/UnifiedVoiceControlProvider';
import { useCustomCommands } from '@/providers/CustomCommandProvider';

function MyComponent() {
  const voice = useUnifiedVoiceControl();
  const { commands } = useCustomCommands();

  const handleStartListening = async () => {
    await voice.startListening();
  };

  return (
    <View>
      <Button onPress={handleStartListening}>
        {voice.isListening ? '聆聽中...' : '開始語音控制'}
      </Button>
      
      {voice.transcript && (
        <Text>辨識結果: {voice.transcript}</Text>
      )}
      
      {voice.lastCommand && (
        <Text>
          執行指令: {voice.lastCommand.intent}
          {voice.lastCommand.action && `.${voice.lastCommand.action}`}
        </Text>
      )}
    </View>
  );
}
```

### 2. 監聽語音指令事件

```tsx
useEffect(() => {
  const handleVoiceCommand = (event: CustomEvent) => {
    const { intent, action, slot, source, confidence } = event.detail;
    
    console.log(`指令來源: ${source}`); // 'builtin' 或 'custom'
    console.log(`信心分數: ${confidence}`);
    
    // 執行對應動作
    switch (intent) {
      case 'playback_control':
        if (action === 'play') {
          videoPlayer.play();
        } else if (action === 'pause') {
          videoPlayer.pause();
        }
        break;
      
      case 'seek_control':
        if (action === 'forward' && slot?.seconds) {
          videoPlayer.seek(videoPlayer.currentTime + slot.seconds);
        }
        break;
    }
  };

  window.addEventListener('voiceCommand', handleVoiceCommand);
  
  return () => {
    window.removeEventListener('voiceCommand', handleVoiceCommand);
  };
}, []);
```

### 3. 管理自訂指令

```tsx
import { CustomCommandManager } from '@/components/CustomCommandManager';

function SettingsScreen() {
  return (
    <View>
      <CustomCommandManager />
    </View>
  );
}
```

---

## 📱 平台特定實作

### iOS (Expo Go)

目前使用 Web Speech API 作為 fallback，因為 Expo Go 不支援原生 Speech Framework。

**未來原生實作**:
- 需要建立 Custom Native Module
- 使用 `SFSpeechRecognizer`
- 支援離線辨識
- 更高準確度

### Android (Expo Go)

目前使用 Web Speech API 作為 fallback。

**未來原生實作**:
- 使用 `SpeechRecognizer`
- 支援離線辨識

### Web

使用原生 Web Speech API:
- `webkitSpeechRecognition` (Chrome, Safari)
- `SpeechRecognition` (Firefox)

---

## 🔒 隱私與安全

### 資料處理

✅ **完全本地處理**
- 語音辨識在裝置上進行
- 自訂指令儲存在本地 AsyncStorage
- 不傳送任何資料至伺服器

✅ **權限管理**
- 麥克風權限請求
- 語音辨識權限請求 (iOS)
- 清楚的權限說明

---

## 🧪 測試指南

### 1. 測試內建指令

```typescript
// 播放控制
"播放" → 應觸發 playback_control.play
"暫停" → 應觸發 playback_control.pause

// 進度控制
"快轉 10 秒" → 應觸發 seek_control.forward (seconds: 10)

// 音量控制
"音量最大" → 應觸發 volume_control.max
```

### 2. 測試自訂指令

```typescript
// 新增自訂指令
addCommand("s", "playback_control", "play");

// 測試
說 "s" → 應觸發 playback_control.play
```

### 3. 測試信心分數

```typescript
// 設定高閾值
setConfidenceThreshold(0.8);

// 測試低信心辨識
說不清楚的話 → 應顯示「信心分數過低，請重試」
```

---

## 🐛 常見問題

### Q: 為什麼語音辨識不工作？

A: 檢查以下項目:
1. 麥克風權限是否授予
2. 瀏覽器是否支援 Web Speech API
3. 是否在 HTTPS 環境 (Web)
4. 檢查 Console 錯誤訊息

### Q: 自訂指令沒有觸發？

A: 檢查:
1. 指令是否已啟用 (enabled: true)
2. 說的文字是否與指令文字完全匹配
3. 檢查 Console 日誌確認匹配結果

### Q: 如何調整辨識靈敏度？

A:
```typescript
const { setConfidenceThreshold } = useUnifiedVoiceControl();

// 降低閾值 (更容易觸發，但可能誤觸發)
setConfidenceThreshold(0.3);

// 提高閾值 (更準確，但可能漏觸發)
setConfidenceThreshold(0.8);
```

---

## 📊 效能優化

### 1. 指令匹配優化

- 使用 `toLowerCase()` 統一大小寫
- 使用 `trim()` 移除空白
- 優先匹配完全相符
- 次要匹配包含關係

### 2. 儲存優化

- 批次寫入 AsyncStorage
- 避免頻繁讀寫
- 使用記憶體快取

### 3. UI 優化

- 使用 `React.memo()` 避免不必要的重渲染
- 使用 `useCallback()` 穩定函式參考
- 使用 `useMemo()` 快取計算結果

---

## 🚀 未來擴展

### 短期目標

- [ ] 支援語音指令匯入/匯出
- [ ] 支援指令分組管理
- [ ] 支援指令使用統計
- [ ] 支援語音回饋 (TTS)

### 中期目標

- [ ] 原生 iOS Speech Framework 整合
- [ ] 原生 Android SpeechRecognizer 整合
- [ ] 支援離線辨識
- [ ] 支援自訂喚醒詞

### 長期目標

- [ ] AI 語音助手整合
- [ ] 自然語言理解 (NLU)
- [ ] 多輪對話支援
- [ ] 語音訓練與個人化

---

## 📚 參考資源

### 官方文件

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [iOS Speech Framework](https://developer.apple.com/documentation/speech)
- [Android SpeechRecognizer](https://developer.android.com/reference/android/speech/SpeechRecognizer)

### 相關專案

- [react-speech-recognition](https://github.com/JamesBrill/react-speech-recognition)
- [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/)

---

## 👥 貢獻指南

### 新增內建指令

1. 編輯 `constants/voiceCommands.json`
2. 新增指令定義與多語系 utterances
3. 執行翻譯腳本更新 UI 文字
4. 測試所有語言

### 新增自訂指令功能

1. 修改 `CustomCommandProvider.tsx`
2. 更新 `CustomCommandManager.tsx` UI
3. 新增對應翻譯鍵
4. 撰寫測試

---

## 📄 授權

本專案採用 MIT 授權。

---

## 📞 聯絡方式

如有問題或建議，請透過以下方式聯絡:

- GitHub Issues
- Email: support@coolplay.app

---

**最後更新**: 2025-10-04
**版本**: 1.0.0
