# CoolPlayPreview 自動化啟動包

`CoolPlayPreview 自動化啟動包` 是一個為 macOS / Linux 環境設計的腳本，旨在簡化 Expo 專案的啟動流程，讓開發者能夠快速在手機上預覽應用程式。

## 📋 系統需求

- **作業系統**: macOS 或 Linux
- **Node.js**: 版本 16 或更高
- **網路連接**: 用於下載依賴和建立隧道連接
- **手機**: 安裝了 Expo Go App 的 iOS 或 Android 設備

## 🚀 快速開始

### Step 1：解壓縮
將整個 `CoolPlayPreview_AutoStart.zip` 解壓到 AI 代理可操作的資料夾中。

### Step 2：讓 AI 代理執行
```bash
bash start.sh
```

### Step 3：等待啟動完成
啟動完成後終端機會顯示：
```
Tunnel ready.
Scan the QR code below with Expo Go:
```

### Step 4：手機預覽
1. 打開 iPhone 上的 **Expo Go App**
2. 掃描 QR Code
3. 🎉 即可預覽你的 CoolPlayPreview App！

## 📁 包含文件

```
CoolPlayPreview_AutoStart/
├── start.sh                    # 主要啟動腳本
├── README.md                   # 使用說明文件
├── package.json               # 專案依賴配置
├── .env.example               # 環境變數範例
└── app/                       # 應用程式源碼
    ├── (tabs)/
    ├── auth/
    ├── settings/
    └── ...
```

## 🔧 腳本功能

### 自動檢查與安裝
- ✅ 檢查 Node.js 是否已安裝
- ✅ 自動安裝 Bun（如果未安裝）
- ✅ 安裝專案依賴
- ✅ 檢查並配置環境變數

### 智能啟動
- 🧹 清理舊的進程
- 🚀 啟動 Expo 開發服務器
- 🌐 建立隧道連接
- 📱 顯示 QR Code 供手機掃描

### 用戶友好
- 🎨 彩色輸出，清晰易讀
- 📝 詳細的進度提示
- ⚠️ 錯誤處理和警告提示
- 🛑 優雅的中斷處理

## 📱 手機端設置

### iOS 設備
1. 從 App Store 下載 **Expo Go**
2. 確保手機和電腦連接到同一個 WiFi 網路
3. 打開 Expo Go，點擊 "Scan QR Code"
4. 掃描終端顯示的 QR Code

### Android 設備
1. 從 Google Play Store 下載 **Expo Go**
2. 確保手機和電腦連接到同一個 WiFi 網路
3. 打開 Expo Go，點擊 "Scan QR Code"
4. 掃描終端顯示的 QR Code

## 🔍 故障排除

### 常見問題

**Q: 腳本執行時提示權限錯誤**
```bash
chmod +x start.sh
```

**Q: Bun 安裝失敗**
```bash
# 手動安裝 Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # 或 source ~/.zshrc
```

**Q: QR Code 掃描失敗**
- 確保手機和電腦在同一個 WiFi 網路
- 嘗試手動輸入顯示的 URL
- 檢查防火牆設置

**Q: 應用載入緩慢**
- 這是正常現象，首次載入需要下載和編譯代碼
- 請耐心等待，通常需要 1-3 分鐘

### 日誌查看
如果遇到問題，可以查看詳細的啟動日誌：
```bash
bash start.sh 2>&1 | tee startup.log
```

## 🛠️ 進階配置

### 環境變數
複製 `.env.example` 到 `.env` 並根據需要修改：
```bash
cp .env.example .env
```

### 自定義端口
如果需要使用特定端口，可以修改 `package.json` 中的啟動腳本。

### 網路配置
如果在企業網路環境中，可能需要配置代理設置。

## 📞 技術支援

如果您遇到任何問題：

1. **檢查系統需求**: 確保滿足所有系統需求
2. **查看錯誤日誌**: 注意終端中的錯誤訊息
3. **重新啟動**: 嘗試重新執行腳本
4. **清理緩存**: 刪除 `node_modules` 資料夾後重新執行

## 🎯 功能特色

- **一鍵啟動**: 無需複雜配置，一個命令搞定
- **智能檢測**: 自動檢測並安裝缺失的依賴
- **跨平台**: 支援 macOS 和 Linux
- **用戶友好**: 清晰的進度提示和錯誤處理
- **快速預覽**: 通過隧道技術實現快速手機預覽

## 📄 版本資訊

- **版本**: 1.0.0
- **更新日期**: 2024年
- **相容性**: Expo SDK 50+, Node.js 16+

---

🎉 **享受您的 CoolPlay 開發體驗！**