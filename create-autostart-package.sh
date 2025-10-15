#!/bin/bash

# 創建 CoolPlayPreview 自動化啟動包
# 此腳本會創建一個包含所有必要文件的啟動包

set -e

PACKAGE_NAME="CoolPlayPreview_AutoStart"
PACKAGE_DIR="./${PACKAGE_NAME}"

echo "🚀 創建 CoolPlayPreview 自動化啟動包..."

# 創建包目錄
if [ -d "$PACKAGE_DIR" ]; then
    echo "⚠️  目錄已存在，正在清理..."
    rm -rf "$PACKAGE_DIR"
fi

mkdir -p "$PACKAGE_DIR"

echo "📁 創建目錄結構..."

# 複製必要的文件
echo "📋 複製核心文件..."

# 複製啟動腳本
cp start.sh "$PACKAGE_DIR/"
cp start-simple.sh "$PACKAGE_DIR/"

# 複製說明文件
cp CoolPlayPreview_AutoStart_README.md "$PACKAGE_DIR/README.md"

# 複製專案配置文件
cp package.json "$PACKAGE_DIR/"
cp app.json "$PACKAGE_DIR/"
cp tsconfig.json "$PACKAGE_DIR/"
cp eslint.config.js "$PACKAGE_DIR/"

# 複製環境配置
if [ -f ".env.example" ]; then
    cp .env.example "$PACKAGE_DIR/"
fi

# 複製應用程式源碼
echo "📱 複製應用程式源碼..."
cp -r app "$PACKAGE_DIR/"
cp -r components "$PACKAGE_DIR/"
cp -r hooks "$PACKAGE_DIR/"
cp -r providers "$PACKAGE_DIR/"
cp -r utils "$PACKAGE_DIR/"
cp -r constants "$PACKAGE_DIR/"
cp -r lib "$PACKAGE_DIR/"
cp -r l10n "$PACKAGE_DIR/"

# 複製資源文件
if [ -d "assets" ]; then
    cp -r assets "$PACKAGE_DIR/"
fi

# 複製後端文件（如果存在）
if [ -d "backend" ]; then
    cp -r backend "$PACKAGE_DIR/"
fi

# 創建快速開始指南
cat > "$PACKAGE_DIR/QUICK_START.md" << 'EOF'
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
EOF

# 創建版本信息文件
cat > "$PACKAGE_DIR/VERSION.txt" << EOF
CoolPlayPreview 自動化啟動包
版本: 1.0.0
創建日期: $(date)
相容性: Expo SDK 50+, Node.js 16+
支援平台: macOS, Linux
EOF

# 創建 .gitignore
cat > "$PACKAGE_DIR/.gitignore" << 'EOF'
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.env.local
.env.production
*.log
.DS_Store
EOF

echo "✅ 自動化啟動包創建完成！"
echo ""
echo "📦 包位置: $PACKAGE_DIR"
echo "📋 包含文件:"
echo "   ├── start.sh              # 主要啟動腳本"
echo "   ├── start-simple.sh       # 簡化啟動腳本"
echo "   ├── README.md             # 詳細使用說明"
echo "   ├── QUICK_START.md        # 快速開始指南"
echo "   ├── VERSION.txt           # 版本信息"
echo "   ├── package.json          # 專案配置"
echo "   ├── .env.example          # 環境變數範例"
echo "   └── app/                  # 應用程式源碼"
echo ""
echo "🎯 使用方法:"
echo "   1. 將整個 $PACKAGE_NAME 資料夾提供給用戶"
echo "   2. 用戶解壓後執行: bash start.sh"
echo "   3. 按照終端提示進行操作"
echo ""
echo "🎉 自動化啟動包已準備就緒！"