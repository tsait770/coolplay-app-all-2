#!/bin/bash

# CoolPlay 簡化啟動腳本
# 用於快速測試和本地開發

set -e

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 CoolPlay 簡化啟動腳本${NC}"
echo "=================================="

# 檢查是否在正確目錄
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}❌ 請在 CoolPlay 專案根目錄中執行此腳本${NC}"
    exit 1
fi

# 檢查 Bun
if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bun 未安裝，請先執行 start.sh 進行完整安裝${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 環境檢查完成${NC}"

# 安裝依賴（如果需要）
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 安裝依賴...${NC}"
    bun install
fi

echo -e "${GREEN}✅ 依賴檢查完成${NC}"

# 啟動開發服務器（本地模式）
echo -e "${BLUE}🌐 啟動本地開發服務器...${NC}"
echo ""
echo "📱 使用說明："
echo "1. 確保手機和電腦連接到同一個 WiFi 網路"
echo "2. 在手機上打開 Expo Go App"
echo "3. 掃描下方顯示的 QR Code"
echo ""

# 使用本地網路模式啟動
expo start --clear --lan