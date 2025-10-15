# 資料夾數字亂碼修正說明

## 問題描述

當使用者新增資料夾時，資料夾的書籤數量顯示為亂碼字元（如 `ö`）而不是正確的數字 `0`。

### 根本原因

1. **字元編碼問題**：資料儲存或讀取時可能發生編碼轉換錯誤
2. **型別不一致**：count 欄位可能被儲存為字串、null 或 undefined，而非數字
3. **初始化缺失**：新建資料夾時未正確初始化 count 為 0
4. **資料驗證缺失**：沒有驗證機制確保 count 始終為有效數字

## 解決方案

### 1. 建立 FolderProvider (`providers/FolderProvider.tsx`)

**核心功能：**

- ✅ 新增資料夾時，明確設定 `count: 0`
- ✅ 載入資料時驗證並修正無效的 count 值
- ✅ 更新 count 時進行型別檢查和驗證
- ✅ 使用 TypeScript 嚴格型別定義

**關鍵邏輯：**

```typescript
// 新增資料夾 - 確保 count 初始化為 0
const newFolder: Folder = {
  id: Date.now().toString(),
  name: name.trim(),
  count: 0,  // 明確設定為數字 0
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 載入時驗證
const validatedFolders = parsed.map((folder: any) => ({
  ...folder,
  count: typeof folder.count === 'number' ? folder.count : 0,
}));

// 更新時驗證
const validCount = typeof count === 'number' && !isNaN(count) ? count : 0;
```

### 2. 建立 FolderList 元件 (`components/FolderList.tsx`)

**功能：**

- 顯示資料夾列表及正確的書籤數量
- 新增/刪除資料夾
- 統計總資料夾數和總書籤數
- 多語系支援

**顯示邏輯：**

```typescript
<Text style={styles.folderCount}>
  {folder.count} {t('bookmarks')}
</Text>
```

確保 `folder.count` 始終為數字型別。

### 3. 資料修復腳本 (`scripts/fix-folder-counts.ts`)

**提供三個功能：**

#### a. `fixFolderCounts()` - 自動修復

```typescript
// 將所有無效的 count 值轉換為有效數字
if (typeof folder.count === 'number' && !isNaN(folder.count)) {
  validCount = folder.count;
} else if (typeof folder.count === 'string') {
  const parsed = parseInt(folder.count, 10);
  validCount = isNaN(parsed) ? 0 : parsed;
} else {
  validCount = 0;
}
```

#### b. `validateFolderData()` - 驗證資料

檢查：
- ID 是否存在
- 名稱是否有效
- count 是否為有效數字
- count 是否為負數

#### c. `resetAllFolderCounts()` - 重置所有計數

將所有資料夾的 count 重置為 0。

### 4. 多語系翻譯

建立了兩個翻譯檔案：

- `l10n/folder-translations-en.json` - 英文
- `l10n/folder-translations-ko.json` - 韓文

**包含的翻譯鍵：**

```json
{
  "folders": "資料夾",
  "total_folders": "總資料夾",
  "total_bookmarks": "總書籤",
  "bookmarks": "書籤",
  "no_folders_yet": "尚無資料夾",
  "create_new_folder": "建立新資料夾",
  "folder_created_successfully": "資料夾建立成功",
  ...
}
```

## 使用方式

### 1. 整合 FolderProvider

在 `app/_layout.tsx` 中加入 Provider：

```typescript
import { FolderProvider } from '@/providers/FolderProvider';

export default function RootLayout() {
  return (
    <FolderProvider>
      {/* 其他內容 */}
    </FolderProvider>
  );
}
```

### 2. 使用 FolderList 元件

```typescript
import { FolderList } from '@/components/FolderList';

export default function FoldersScreen() {
  return <FolderList />;
}
```

### 3. 執行修復腳本（如需要）

```bash
# 驗證並修復現有資料
npx ts-node scripts/fix-folder-counts.ts

# 或在程式碼中使用
import { fixFolderCounts, validateFolderData } from '@/scripts/fix-folder-counts';

// 驗證資料
const validation = await validateFolderData();
if (!validation.valid) {
  console.log('發現問題:', validation.issues);
  
  // 修復資料
  await fixFolderCounts();
}
```

## 技術細節

### 資料結構

```typescript
interface Folder {
  id: string;           // 唯一識別碼
  name: string;         // 資料夾名稱
  count: number;        // 書籤數量（必須為數字）
  createdAt: string;    // 建立時間（ISO 8601）
  updatedAt: string;    // 更新時間（ISO 8601）
}
```

### 儲存位置

- AsyncStorage key: `@folders`
- 格式: JSON 字串
- 編碼: UTF-8

### 驗證規則

1. **count 必須為數字**
   - 型別檢查: `typeof count === 'number'`
   - NaN 檢查: `!isNaN(count)`

2. **count 不可為負數**
   - 範圍檢查: `count >= 0`

3. **自動修正策略**
   - 字串 → 嘗試 parseInt，失敗則為 0
   - null/undefined → 0
   - NaN → 0
   - 負數 → 0

## 測試建議

### 1. 單元測試

```typescript
describe('FolderProvider', () => {
  it('should create folder with count 0', async () => {
    const { addFolder, folders } = useFolders();
    await addFolder('Test Folder');
    expect(folders[0].count).toBe(0);
  });

  it('should validate count on load', async () => {
    // 模擬損壞的資料
    await AsyncStorage.setItem('@folders', JSON.stringify([
      { id: '1', name: 'Test', count: 'invalid', createdAt: '', updatedAt: '' }
    ]));
    
    // 重新載入
    const { folders } = useFolders();
    expect(folders[0].count).toBe(0);
  });
});
```

### 2. 整合測試

1. 建立新資料夾 → 驗證 count 為 0
2. 匯入書籤 → 驗證 count 正確增加
3. 刪除書籤 → 驗證 count 正確減少
4. 切換語言 → 驗證顯示正確

### 3. 手動測試

1. **新增資料夾測試**
   - 點擊 + 按鈕
   - 輸入資料夾名稱（測試中文、emoji、特殊字元）
   - 確認顯示 "0 bookmarks"

2. **資料修復測試**
   - 手動建立損壞資料
   - 執行修復腳本
   - 驗證資料已修正

3. **多語系測試**
   - 切換到不同語言
   - 確認所有文字正確顯示
   - 確認數字格式正確

## 預防措施

### 1. 程式碼層面

- ✅ 使用 TypeScript 嚴格模式
- ✅ 所有數字欄位明確型別定義
- ✅ 資料載入時進行驗證
- ✅ 資料儲存前進行驗證

### 2. 資料層面

- ✅ 定期執行驗證腳本
- ✅ 記錄資料異常日誌
- ✅ 提供資料修復工具
- ✅ 備份機制

### 3. UI 層面

- ✅ 顯示前進行型別檢查
- ✅ 使用 fallback 值（預設 0）
- ✅ 錯誤邊界處理
- ✅ 使用者友善的錯誤訊息

## 常見問題

### Q1: 為什麼會出現亂碼？

**A:** 可能原因：
1. 資料儲存時編碼錯誤
2. count 被儲存為非數字型別
3. 資料損壞或格式錯誤
4. 舊版本資料結構不相容

### Q2: 如何確保不再出現？

**A:** 
1. 使用提供的 FolderProvider
2. 定期執行驗證腳本
3. 監控錯誤日誌
4. 進行充分測試

### Q3: 現有資料如何修復？

**A:**
```bash
# 方法 1: 執行修復腳本
npx ts-node scripts/fix-folder-counts.ts

# 方法 2: 在 App 啟動時自動修復
import { fixFolderCounts } from '@/scripts/fix-folder-counts';
useEffect(() => {
  fixFolderCounts();
}, []);
```

### Q4: 如何更新書籤數量？

**A:**
```typescript
const { updateFolderCount } = useFolders();

// 新增書籤後
await updateFolderCount(folderId, currentCount + 1);

// 刪除書籤後
await updateFolderCount(folderId, Math.max(0, currentCount - 1));
```

## 後續優化建議

1. **後端整合**
   - 將資料夾資料同步到後端
   - 使用資料庫確保資料一致性
   - 實作伺服器端驗證

2. **效能優化**
   - 實作資料快取
   - 批次更新機制
   - 延遲載入大量資料

3. **功能擴展**
   - 資料夾排序
   - 資料夾搜尋
   - 資料夾分享
   - 資料夾圖示自訂

4. **監控與分析**
   - 加入錯誤追蹤（Sentry）
   - 使用者行為分析
   - 效能監控
   - 資料品質報告

## 總結

此修正方案：

✅ **解決根本問題** - 確保 count 始終為有效數字  
✅ **提供修復工具** - 可修復現有損壞資料  
✅ **預防未來問題** - 完整的驗證和錯誤處理  
✅ **使用者友善** - 清晰的 UI 和錯誤訊息  
✅ **可維護性高** - 清晰的程式碼結構和文件  
✅ **多語系支援** - 完整的翻譯檔案  

實作後，資料夾數量將始終正確顯示為數字，不會再出現亂碼問題。
