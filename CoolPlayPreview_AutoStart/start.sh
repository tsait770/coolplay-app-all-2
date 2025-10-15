#!/bin/bash

# CoolPlayPreview 自動化啟動腳本
# 適用於 macOS / Linux 環境

set -e  # 遇到錯誤時停止執行

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 輸出函數
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "    CoolPlayPreview 自動化啟動包"
    echo "    為 macOS / Linux 環境設計"
    echo "=================================================="
    echo -e "${NC}"
}

# 檢查必要工具
check_requirements() {
    print_info "檢查系統需求..."
    
    # 檢查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安裝。請先安裝 Node.js (https://nodejs.org/)"
        exit 1
    fi
    
    # 檢查 Bun
    if ! command -v bun &> /dev/null; then
        print_warning "Bun 未安裝，正在安裝..."
        curl -fsSL https://bun.sh/install | bash
        
        # 手動設置 Bun 路徑
        export BUN_INSTALL="$HOME/.bun"
        export PATH="$BUN_INSTALL/bin:$PATH"
        
        # 再次檢查 Bun 是否可用
        if ! command -v bun &> /dev/null; then
            print_error "Bun 安裝失敗。請手動安裝 Bun (https://bun.sh/)"
            print_info "或者手動執行以下命令："
            print_info "export BUN_INSTALL=\"\$HOME/.bun\""
            print_info "export PATH=\"\$BUN_INSTALL/bin:\$PATH\""
            exit 1
        fi
    fi
    
    print_success "系統需求檢查完成"
}

# 檢查專案依賴
check_dependencies() {
    print_info "檢查專案依賴..."
    
    if [ ! -f "package.json" ]; then
        print_error "找不到 package.json 文件。請確保在正確的專案目錄中執行此腳本。"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_info "正在安裝專案依賴..."
        bun install
    else
        print_info "檢查依賴更新..."
        bun install
    fi
    
    print_success "專案依賴檢查完成"
}

# 檢查環境變數
check_environment() {
    print_info "檢查環境配置..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_warning "未找到 .env 文件，正在從 .env.example 創建..."
            cp .env.example .env
            print_warning "請檢查並配置 .env 文件中的環境變數"
        else
            print_warning "未找到環境配置文件"
        fi
    fi
    
    print_success "環境配置檢查完成"
}

# 清理舊的進程
cleanup_processes() {
    print_info "清理舊的進程..."
    
    # 殺死可能存在的 Expo 進程
    pkill -f "expo" 2>/dev/null || true
    pkill -f "rork" 2>/dev/null || true
    
    # 等待進程完全結束
    sleep 2
    
    print_success "進程清理完成"
}

# 啟動 Expo 開發服務器
start_expo() {
    print_info "正在啟動 CoolPlayPreview..."
    print_info "這可能需要幾分鐘時間，請耐心等待..."
    
    # 首先嘗試使用隧道模式
    print_info "嘗試使用隧道模式啟動..."
    if ! timeout 60 bun run start; then
        print_warning "隧道模式啟動失敗，嘗試使用本地網路模式..."
        
        # 備用方案：使用本地網路模式
        print_info "使用本地網路模式啟動（確保手機和電腦在同一 WiFi 網路）..."
        bun run start-web || {
            print_warning "自定義啟動腳本失敗，使用標準 Expo 啟動..."
            expo start --clear
        }
    fi
}

# 主函數
main() {
    print_header
    
    # 檢查當前目錄
    if [ ! -f "package.json" ]; then
        print_error "請在 CoolPlay 專案根目錄中執行此腳本"
        exit 1
    fi
    
    # 執行檢查和啟動流程
    check_requirements
    check_dependencies
    check_environment
    cleanup_processes
    
    print_success "準備工作完成，正在啟動應用..."
    echo ""
    print_info "啟動完成後，您將看到："
    print_info "  - Tunnel ready."
    print_info "  - Scan the QR code below with Expo Go:"
    echo ""
    print_info "然後您可以："
    print_info "  1. 在 iPhone 上打開 Expo Go App"
    print_info "  2. 掃描顯示的 QR Code"
    print_info "  3. 🎉 開始預覽您的 CoolPlayPreview App！"
    echo ""
    
    start_expo
}

# 捕獲中斷信號
trap 'print_warning "啟動被中斷"; exit 1' INT TERM

# 執行主函數
main "$@"