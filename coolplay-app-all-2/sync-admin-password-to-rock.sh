#!/bin/bash

# 同步所有 AdminPanel.tsx 文件的密碼為 ROCK
# Sync all AdminPanel.tsx files password to ROCK

echo "🚀 開始同步所有 AdminPanel 密碼到 ROCK..."
echo "🚀 Starting to sync all AdminPanel passwords to ROCK..."

# 設定新密碼
NEW_PASSWORD="ROCK"

# 查找所有 AdminPanel.tsx 文件
ADMIN_FILES=$(find . -name "AdminPanel.tsx" -not -path "./node_modules/*" -not -path "./.git/*")

if [ -z "$ADMIN_FILES" ]; then
    echo "❌ 沒有找到 AdminPanel.tsx 文件"
    echo "❌ No AdminPanel.tsx files found"
    exit 1
fi

echo "📁 找到以下 AdminPanel 文件："
echo "📁 Found the following AdminPanel files:"
echo "$ADMIN_FILES"
echo ""

# 備份和更新每個文件
for file in $ADMIN_FILES; do
    echo "🔄 處理文件: $file"
    echo "🔄 Processing file: $file"
    
    # 創建備份
    backup_file="${file}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$file" "$backup_file"
    echo "💾 已備份到: $backup_file"
    echo "💾 Backed up to: $backup_file"
    
    # 更新密碼
    # 替換 ADMIN_PASSWORD 的值
    sed -i.tmp "s/const ADMIN_PASSWORD = '[^']*';/const ADMIN_PASSWORD = '$NEW_PASSWORD';/g" "$file"
    
    # 替換錯誤訊息中的密碼
    sed -i.tmp "s/Expected: [^']*'/Expected: $NEW_PASSWORD'/g" "$file"
    sed -i.tmp "s/Expected: [0-9]*/Expected: $NEW_PASSWORD/g" "$file"
    
    # 刪除臨時文件
    rm -f "${file}.tmp"
    
    echo "✅ 已更新密碼為: $NEW_PASSWORD"
    echo "✅ Updated password to: $NEW_PASSWORD"
    echo ""
done

# 驗證更新
echo "🔍 驗證更新結果..."
echo "🔍 Verifying update results..."

for file in $ADMIN_FILES; do
    echo "📄 檢查文件: $file"
    echo "📄 Checking file: $file"
    
    # 檢查密碼是否正確更新
    if grep -q "const ADMIN_PASSWORD = '$NEW_PASSWORD';" "$file"; then
        echo "✅ 密碼已正確更新為: $NEW_PASSWORD"
        echo "✅ Password correctly updated to: $NEW_PASSWORD"
    else
        echo "❌ 密碼更新失敗"
        echo "❌ Password update failed"
    fi
    echo ""
done

echo "🎉 所有 AdminPanel 文件已同步完成！"
echo "🎉 All AdminPanel files have been synchronized!"
echo ""
echo "💡 建議接下來的步驟："
echo "💡 Recommended next steps:"
echo "1. 清除緩存: npx expo start --web --clear --reset-cache"
echo "1. Clear cache: npx expo start --web --clear --reset-cache"
echo "2. 測試新密碼: $NEW_PASSWORD"
echo "2. Test new password: $NEW_PASSWORD"