# 安全分支策略

## 分支結構

### 主要分支
- `main`: 主分支，包含穩定的代碼
- `feature/safe-development`: 安全開發分支，用於日常開發

### 安全原則
1. **敏感信息管理**
   - 所有敏感信息存放在 `.env.local` 文件中
   - `.env.local` 已加入 `.gitignore`，不會被提交
   - 文檔中的敏感信息已替換為佔位符

2. **開發流程**
   - 在 `feature/safe-development` 分支進行開發
   - 定期將更改合併回 `main` 分支
   - 推送前檢查是否有敏感信息洩露

3. **與Fork同步**
   - 使用 `main` 分支與Fork同步
   - 確保Fork也遵循相同的安全原則

## 使用指南

### 開始開發
```bash
git checkout feature/safe-development
# 進行開發工作
```

### 提交更改
```bash
git add .
git commit -m "描述更改"
```

### 合併到主分支
```bash
git checkout main
git merge feature/safe-development
```

### 推送到遠程倉庫
```bash
# 檢查敏感信息
grep -r "sk_test_" . --include="*.md" --include="*.js" | grep -v "sk_test_YOUR_STRIPE_SECRET_KEY_HERE"
# 如果沒有輸出，則安全推送
git push origin main
```

## 環境變數設置

請在 `.env.local` 文件中設置以下變數：
- STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
