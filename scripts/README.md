# 管理員密碼同步腳本

## 概述
這個腳本用於確保所有 `AdminPanel.tsx` 文件中的管理員密碼保持同步，避免因為多個文件中密碼不一致而導致的問題。

## 使用方法

### 基本用法
```bash
# 使用預設密碼 (680142，來自開發規格書)
./scripts/sync-admin-password.sh

# 使用自定義密碼
./scripts/sync-admin-password.sh "your_new_password"
```

### 通過 npm 腳本使用
```bash
npm run sync-admin-password
```

## 功能特點

1. **自動發現**: 自動查找所有 `AdminPanel.tsx` 文件
2. **備份保護**: 修改前自動備份原始文件
3. **驗證確認**: 修改後驗證所有文件是否同步成功
4. **彩色輸出**: 清晰的狀態指示和錯誤提示
5. **錯誤處理**: 完整的錯誤檢查和回報

## 腳本執行流程

1. �� 搜索所有 `AdminPanel.tsx` 文件
2. 📦 建立備份文件（帶時間戳）
3. �� 更新所有文件中的密碼
4. ✅ 驗證同步結果
5. 💡 提供後續建議（清除緩存等）

## 建議的工作流程

1. 修改密碼後，立即執行同步腳本
2. 清除緩存並重新啟動服務器
3. 測試新密碼是否正常工作

```bash
# 完整的更新流程
./scripts/sync-admin-password.sh "new_password"
npx expo start --web --clear --reset-cache
```

## 注意事項

- 腳本會自動備份原始文件，備份文件名包含時間戳
- 如果發現同步失敗，請檢查文件權限和語法
- 建議在修改密碼後立即清除緩存
- 預設密碼來自開發規格書中的定義

## 故障排除

如果遇到問題：

1. 檢查文件權限：`chmod +x scripts/sync-admin-password.sh`
2. 確認在正確的目錄中執行
3. 檢查 AdminPanel.tsx 文件的語法是否正確
4. 查看備份文件以恢復原始狀態（如需要）

## 相關文件

- `components/AdminPanel.tsx` - 主要的管理員面板
- `CoolPlayPreview_AutoStart/components/AdminPanel.tsx` - 預覽版本的管理員面板
- `✔️CoolPaly開發規格書_V4.md` - 包含預設密碼的開發規格書
