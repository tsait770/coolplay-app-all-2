#!/bin/bash

# 自動化 GitHub 同步腳本
# Auto GitHub Sync Script
# 
# 使用方法 / Usage:
# ./sync-to-github.sh "commit message"
# 或者 / or: ./sync-to-github.sh (使用默認提交訊息 / use default commit message)

# 設定顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函數：打印彩色訊息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 函數：檢查命令是否成功執行
check_command() {
    if [ $? -eq 0 ]; then
        print_message $GREEN "✅ $1 成功"
        print_message $GREEN "✅ $1 successful"
    else
        print_message $RED "❌ $1 失敗"
        print_message $RED "❌ $1 failed"
        exit 1
    fi
}

# 開始同步流程
print_message $BLUE "🚀 開始 GitHub 自動同步流程..."
print_message $BLUE "🚀 Starting GitHub auto-sync process..."
echo ""

# 檢查是否在 Git 倉庫中
if [ ! -d ".git" ]; then
    # 如果不在根目錄，嘗試切換到上一層
    if [ -d "../.git" ]; then
        cd ..
        print_message $YELLOW "📁 切換到 Git 根目錄"
        print_message $YELLOW "📁 Switched to Git root directory"
    else
        print_message $RED "❌ 未找到 Git 倉庫"
        print_message $RED "❌ Git repository not found"
        exit 1
    fi
fi

# 顯示當前目錄
print_message $BLUE "📍 當前工作目錄: $(pwd)"
print_message $BLUE "📍 Current working directory: $(pwd)"
echo ""

# 獲取提交訊息
if [ -z "$1" ]; then
    COMMIT_MESSAGE="Auto sync: $(date '+%Y-%m-%d %H:%M:%S')"
    print_message $YELLOW "💬 使用默認提交訊息: $COMMIT_MESSAGE"
    print_message $YELLOW "💬 Using default commit message: $COMMIT_MESSAGE"
else
    COMMIT_MESSAGE="$1"
    print_message $YELLOW "💬 使用自定義提交訊息: $COMMIT_MESSAGE"
    print_message $YELLOW "💬 Using custom commit message: $COMMIT_MESSAGE"
fi
echo ""

# 檢查 Git 狀態
print_message $BLUE "🔍 檢查 Git 狀態..."
print_message $BLUE "🔍 Checking Git status..."
git status --porcelain

# 檢查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    print_message $GREEN "✨ 沒有需要提交的更改"
    print_message $GREEN "✨ No changes to commit"
    
    # 檢查是否需要推送
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u} 2>/dev/null)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        print_message $YELLOW "📤 發現本地提交需要推送到遠程倉庫"
        print_message $YELLOW "📤 Found local commits that need to be pushed"
        
        print_message $BLUE "📤 推送到 GitHub..."
        print_message $BLUE "📤 Pushing to GitHub..."
        git push origin main
        check_command "推送 / Push"
    else
        print_message $GREEN "✅ 本地和遠程倉庫已同步"
        print_message $GREEN "✅ Local and remote repositories are in sync"
    fi
    exit 0
fi

# 清理備份文件（可選）
print_message $BLUE "🧹 清理備份文件..."
print_message $BLUE "🧹 Cleaning backup files..."
find . -name "*.backup*" -type f -delete 2>/dev/null
print_message $GREEN "✅ 備份文件清理完成"
print_message $GREEN "✅ Backup files cleaned"
echo ""

# 添加所有更改
print_message $BLUE "📦 添加所有更改到暫存區..."
print_message $BLUE "📦 Adding all changes to staging area..."
git add .
check_command "添加文件 / Add files"
echo ""

# 顯示將要提交的更改
print_message $BLUE "📋 將要提交的更改:"
print_message $BLUE "📋 Changes to be committed:"
git diff --cached --name-status
echo ""

# 提交更改
print_message $BLUE "💾 提交更改..."
print_message $BLUE "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"
check_command "提交 / Commit"
echo ""

# 拉取最新更改（避免衝突）
print_message $BLUE "⬇️ 拉取遠程最新更改..."
print_message $BLUE "⬇️ Pulling latest remote changes..."
git pull origin main --rebase
if [ $? -eq 0 ]; then
    print_message $GREEN "✅ 拉取成功"
    print_message $GREEN "✅ Pull successful"
else
    print_message $YELLOW "⚠️ 拉取時可能有衝突，請手動解決"
    print_message $YELLOW "⚠️ Possible conflicts during pull, please resolve manually"
    print_message $BLUE "🔧 衝突解決後，請運行: git rebase --continue"
    print_message $BLUE "🔧 After resolving conflicts, run: git rebase --continue"
    exit 1
fi
echo ""

# 推送到 GitHub
print_message $BLUE "📤 推送到 GitHub..."
print_message $BLUE "📤 Pushing to GitHub..."
git push origin main
check_command "推送 / Push"
echo ""

# 顯示最終狀態
print_message $GREEN "🎉 GitHub 同步完成！"
print_message $GREEN "🎉 GitHub sync completed!"
echo ""

print_message $BLUE "📊 最終狀態:"
print_message $BLUE "📊 Final status:"
git status
echo ""

print_message $GREEN "🔗 遠程倉庫: $(git remote get-url origin)"
print_message $GREEN "🔗 Remote repository: $(git remote get-url origin)"

# 顯示最近的提交
print_message $BLUE "📝 最近的提交:"
print_message $BLUE "📝 Recent commits:"
git log --oneline -5

print_message $GREEN "✨ 所有更新已成功同步到 GitHub！"
print_message $GREEN "✨ All updates have been successfully synced to GitHub!"