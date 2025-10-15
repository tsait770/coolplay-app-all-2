# CoolPlayPreview 快速開始

## 🚀 一鍵啟動

```bash
bash start.sh
```

## 📱 手機預覽步驟

1. **下載 Expo Go**
   - iOS: App Store 搜索 "Expo Go"
   - Android: Google Play Store 搜索 "Expo Go"

2. **連接同一網路**
   - 確保手機和電腦連接到同一個 WiFi

3. **掃描 QR Code**
   - 打開 Expo Go App
   - 點擊 "Scan QR Code"
   - 掃描終端顯示的 QR Code

4. **開始預覽**
   - 等待應用載入（首次可能需要 1-3 分鐘）
   - 🎉 開始體驗 CoolPlay App！

## 🔧 故障排除

### 如果隧道連接失敗：
```bash
bash start-simple.sh
```

### 如果權限錯誤：
```bash
chmod +x start.sh start-simple.sh
```

### 如果依賴安裝失敗：
```bash
# 手動安裝 Bun
curl -fsSL https://bun.sh/install | bash
source ~/.zshrc

# 重新執行
bash start.sh
```
