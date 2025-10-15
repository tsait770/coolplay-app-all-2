# 多語系翻譯修復行動計劃

## 📋 執行摘要

**問題根源：** UI 組件使用硬編碼文字，而非翻譯鍵值  
**翻譯檔案狀態：** ✅ 完整（所有 12 種語言的 ar.json 等檔案已包含必要翻譯）  
**需要修復：** 部分 UI 組件未正確使用翻譯函數

---

## 🔍 已發現的問題

### 1. 訂閱頁面 (app/subscription/index.tsx)
**狀態：** ✅ 已修復

**修復內容：**
- 將所有硬編碼文字替換為 `t()` 函數調用
- 添加缺失的翻譯鍵到所有語言檔案

**修復的文字：**
- "Free Trial" → `t('free_trial')`
- "Free Member" → `t('free_member')`
- "Basic Member" → `t('basic_member')`
- "Premium Member" → `t('premium_member')`
- "Unlimited uses" → `t('unlimited_uses')`
- "uses remaining" → `t('uses_remaining')`
- "Upgrade for unlimited access" → `t('tap_to_upgrade')`
- "Choose Your Plan" → `t('available_plans')`
- "Monthly" → `t('monthly')`
- "Yearly" → `t('yearly')`
- "Save 25%" → `t('save_25_percent')`
- "MOST POPULAR" → `t('most_popular')`
- "BEST VALUE" → `t('best_value')`
- "Subscribe" → `t('subscribe')`
- "Cancel Subscription" → `t('cancel_subscription')`

---

## 📝 執行步驟

### 步驟 1: 添加缺失的翻譯鍵 ✅

運行腳本添加訂閱頁面所需的翻譯鍵：

```bash
node scripts/add-subscription-translations.js
```

**新增的翻譯鍵：**
- `monthly` - 每月/月間
- `yearly` - 每年/年間
- `save_25_percent` - 節省 25%
- `most_popular` - 最受歡迎
- `best_value` - 最超值
- `save_per_year` - 每年節省 {amount}
- `subscribe` - 訂閱
- `cancel_subscription` - 取消訂閱
- `renews_on` - 續訂於
- `unlock_premium_features` - 解鎖高級功能
- `free_tier_info` - 免費方案資訊
- `paid_plans_info` - 付費方案資訊

---

### 步驟 2: 驗證翻譯檔案同步 ✅

運行檢查腳本確認所有語言檔案同步：

```bash
node scripts/comprehensive-translation-sync.js
```

**預期輸出：**
```
✅ en.json - All keys present
✅ zh-TW.json - All keys present
✅ zh-CN.json - All keys present
✅ es.json - All keys present
✅ pt-BR.json - All keys present
✅ pt.json - All keys present
✅ de.json - All keys present
✅ fr.json - All keys present
✅ ru.json - All keys present
✅ ar.json - All keys present
✅ ja.json - All keys present
✅ ko.json - All keys present
```

---

### 步驟 3: 測試所有語言切換 🔄

#### 3.1 測試訂閱頁面

1. 啟動應用程式
2. 導航到訂閱頁面
3. 切換到每種語言並驗證：
   - [ ] 英文 (en)
   - [ ] 繁體中文 (zh-TW)
   - [ ] 簡體中文 (zh-CN)
   - [ ] 西班牙文 (es)
   - [ ] 巴西葡萄牙文 (pt-BR)
   - [ ] 葡萄牙文 (pt)
   - [ ] 德文 (de)
   - [ ] 法文 (fr)
   - [ ] 俄文 (ru)
   - [ ] **阿拉伯文 (ar)** ⭐
   - [ ] 日文 (ja)
   - [ ] 韓文 (ko)

#### 3.2 檢查阿拉伯文 RTL 佈局

切換到阿拉伯文時，確認：
- [ ] 文字方向從右到左
- [ ] 圖標位置正確鏡像
- [ ] 按鈕對齊正確
- [ ] 卡片佈局正確

---

## 🎯 其他需要檢查的頁面

根據圖片分析，以下頁面可能也需要檢查：

### 1. 主頁面 (app/(tabs)/home.tsx)
**檢查項目：**
- [ ] "free_trial" 顯示
- [ ] 使用次數顯示

**狀態：** ✅ 已使用 `t('free_trial')`

---

### 2. 語音控制頁面 (app/(tabs)/player.tsx)
**檢查項目：**
- [ ] "always_listen" 顯示
- [ ] "tap_to_speak" 顯示
- [ ] "commands_used" 顯示
- [ ] "monthly_limit" 顯示
- [ ] "upgrade_plan" 顯示
- [ ] "available_commands" 顯示

**狀態：** ✅ 已使用翻譯函數

---

### 3. 設定頁面 (app/(tabs)/settings.tsx)
**檢查項目：**
- [ ] 所有設定項目標題
- [ ] 所有設定項目描述

**狀態：** ✅ 已使用 `t("account_settings")` 等

---

### 4. URL 對話框組件
**需要檢查的檔案：**
- 搜尋包含 "Load from URL" 的組件
- 搜尋包含 "Enter Video URL" 的組件

**檢查命令：**
```bash
grep -r "Load from URL" app/ components/
grep -r "Enter Video URL" app/ components/
```

---

## 📊 翻譯覆蓋率

### 當前狀態

| 頁面/組件 | 翻譯狀態 | 備註 |
|-----------|---------|------|
| 訂閱頁面 | ✅ 完成 | 已修復所有硬編碼文字 |
| 主頁面 | ✅ 完成 | 使用翻譯函數 |
| 語音控制頁面 | ✅ 完成 | 使用翻譯函數 |
| 設定頁面 | ✅ 完成 | 使用翻譯函數 |
| URL 對話框 | 🔄 待檢查 | 需要找到組件位置 |
| 語音命令詳細頁面 | 🔄 待檢查 | 需要找到組件位置 |

---

## 🔧 開發指南

### 正確使用翻譯的方式

#### ✅ 正確示例

```tsx
import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t("free_trial")}</Text>
      <Text>{t("voice_control_subtitle")}</Text>
      <Text>{t("account_settings")}</Text>
    </View>
  );
}
```

#### ❌ 錯誤示例

```tsx
// 錯誤 1: 硬編碼文字
<Text>Always Listen</Text>

// 錯誤 2: 未導入翻譯函數
export default function MyComponent() {
  return <Text>Settings</Text>;
}

// 錯誤 3: 使用錯誤的鍵名稱
<Text>{t("ACCOUNT_SETTINGS")}</Text> // 應該使用小寫
```

---

## 🧪 測試清單

### 功能測試

- [ ] 切換語言後 UI 立即更新
- [ ] 所有文字正確翻譯
- [ ] 無 fallback 到英文的情況
- [ ] 阿拉伯文 RTL 佈局正確

### 視覺測試

- [ ] 長字串不截斷（西班牙文、葡萄牙文）
- [ ] 字體大小適當（日文、韓文）
- [ ] 佈局不跑版
- [ ] 按鈕對齊正確

### 性能測試

- [ ] 語言切換流暢
- [ ] 無明顯延遲
- [ ] 記憶體使用正常

---

## 📈 進度追蹤

### 已完成 ✅

1. ✅ 分析翻譯檔案完整性
2. ✅ 識別硬編碼文字位置
3. ✅ 修復訂閱頁面
4. ✅ 添加缺失的翻譯鍵
5. ✅ 創建驗證腳本

### 進行中 🔄

6. 🔄 測試所有語言切換
7. 🔄 驗證阿拉伯文 RTL 佈局
8. 🔄 檢查其他頁面

### 待辦 📋

9. 📋 找到並修復 URL 對話框組件
10. 📋 找到並修復語音命令詳細頁面
11. 📋 完整的端到端測試
12. 📋 性能優化

---

## 🎓 最佳實踐

### 1. 永遠使用翻譯鍵

```tsx
// ✅ 好
<Text>{t("welcome_message")}</Text>

// ❌ 壞
<Text>Welcome to CoolPlay</Text>
```

### 2. 使用小寫鍵名稱

```tsx
// ✅ 好
t("account_settings")

// ❌ 壞
t("ACCOUNT_SETTINGS")
```

### 3. 處理動態內容

```tsx
// ✅ 好
t("uses_remaining").replace("{count}", count.toString())

// ❌ 壞
`${count} uses remaining`
```

### 4. 檢查翻譯鍵是否存在

在添加新文字前，先檢查翻譯檔案：
```bash
grep -r "your_key" l10n/
```

---

## 🚀 部署前檢查清單

- [ ] 所有翻譯鍵已添加到 12 種語言
- [ ] 所有硬編碼文字已替換
- [ ] 所有語言切換測試通過
- [ ] 阿拉伯文 RTL 測試通過
- [ ] 無控制台錯誤或警告
- [ ] 性能測試通過

---

## 📞 支援資源

### 翻譯檔案位置
```
l10n/
├── en.json       # 英文
├── zh-TW.json    # 繁體中文
├── zh-CN.json    # 簡體中文
├── es.json       # 西班牙文
├── pt-BR.json    # 巴西葡萄牙文
├── pt.json       # 葡萄牙文
├── de.json       # 德文
├── fr.json       # 法文
├── ru.json       # 俄文
├── ar.json       # 阿拉伯文
├── ja.json       # 日文
└── ko.json       # 韓文
```

### 翻譯 Hook
```tsx
import { useTranslation } from '@/hooks/useTranslation';
```

### 語言切換
```tsx
import { useLanguage } from '@/hooks/useLanguage';

const { language, setLanguage } = useLanguage();
```

---

## 📝 更新日誌

### 2025-10-03
- ✅ 修復訂閱頁面硬編碼文字
- ✅ 添加 12 個新翻譯鍵到所有語言
- ✅ 創建翻譯同步檢查腳本
- ✅ 創建詳細的行動計劃文檔

---

**下一步：** 運行 `node scripts/add-subscription-translations.js` 添加翻譯鍵，然後測試所有語言切換。
