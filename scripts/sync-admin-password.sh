#!/bin/bash

# 自動化腳本：同步所有 AdminPanel 文件中的管理員密碼
# 使用方法: ./scripts/sync-admin-password.sh [新密碼]

# 設定顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 預設密碼（從開發規格書）
DEFAULT_PASSWORD="680142"

# 如果提供了參數，使用提供的密碼，否則使用預設密碼
NEW_PASSWORD=${1:-$DEFAULT_PASSWORD}

echo -e "${YELLOW}🔄 開始同步管理員密碼...${NC}"
echo -e "${YELLOW}新密碼: ${NEW_PASSWORD}${NC}"

# 查找所有 AdminPanel.tsx 文件
ADMIN_PANEL_FILES=$(find . -name "AdminPanel.tsx" -type f)

if [ -z "$ADMIN_PANEL_FILES" ]; then
    echo -e "${RED}❌ 沒有找到 AdminPanel.tsx 文件${NC}"
    exit 1
fi

echo -e "${YELLOW}找到以下 AdminPanel 文件:${NC}"
echo "$ADMIN_PANEL_FILES"

# 備份原始文件
echo -e "${YELLOW}📦 建立備份...${NC}"
for file in $ADMIN_PANEL_FILES; do
    cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ 已備份: $file"
done

# 更新密碼
echo -e "${YELLOW}🔧 更新密碼...${NC}"
for file in $ADMIN_PANEL_FILES; do
    # 查找當前密碼
    CURRENT_PASSWORD=$(grep -o "ADMIN_PASSWORD = '[^']*'" "$file" | sed "s/ADMIN_PASSWORD = '//g" | sed "s/'//g")
    
    if [ -n "$CURRENT_PASSWORD" ]; then
        echo "📝 在 $file 中找到密碼: $CURRENT_PASSWORD"
        
        # 替換密碼
        sed -i '' "s/ADMIN_PASSWORD = '[^']*'/ADMIN_PASSWORD = '$NEW_PASSWORD'/g" "$file"
        
        # 驗證更新
        NEW_FOUND=$(grep -o "ADMIN_PASSWORD = '[^']*'" "$file" | sed "s/ADMIN_PASSWORD = '//g" | sed "s/'//g")
        
        if [ "$NEW_FOUND" = "$NEW_PASSWORD" ]; then
            echo -e "${GREEN}✅ 成功更新 $file${NC}"
        else
            echo -e "${RED}❌ 更新失敗 $file${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  在 $file 中沒有找到 ADMIN_PASSWORD${NC}"
    fi
done

# 驗證所有文件
echo -e "${YELLOW}🔍 驗證同步結果...${NC}"
ALL_SYNCED=true

for file in $ADMIN_PANEL_FILES; do
    FOUND_PASSWORD=$(grep -o "ADMIN_PASSWORD = '[^']*'" "$file" | sed "s/ADMIN_PASSWORD = '//g" | sed "s/'//g")
    
    if [ "$FOUND_PASSWORD" = "$NEW_PASSWORD" ]; then
        echo -e "${GREEN}✅ $file: $FOUND_PASSWORD${NC}"
    else
        echo -e "${RED}❌ $file: $FOUND_PASSWORD (期望: $NEW_PASSWORD)${NC}"
        ALL_SYNCED=false
    fi
done

if [ "$ALL_SYNCED" = true ]; then
    echo -e "${GREEN}🎉 所有密碼已成功同步！${NC}"
    echo -e "${YELLOW}💡 建議清除緩存並重新啟動服務器:${NC}"
    echo -e "${YELLOW}   npx expo start --web --clear --reset-cache${NC}"
else
    echo -e "${RED}❌ 密碼同步失敗，請檢查錯誤訊息${NC}"
    exit 1
fi
