# 📌 Folder Count Fix - Quick Reference Card

## 🚨 The Problem
```
❌ Folder count shows: ö (garbled)
✅ Should show: 0 (number)
```

## 🔧 Quick Fix (3 Steps)

### 1️⃣ Wrap App with Provider
```typescript
// app/_layout.tsx
import { FolderProvider } from '@/providers/FolderProvider';

<FolderProvider>
  <YourApp />
</FolderProvider>
```

### 2️⃣ Use the Component
```typescript
// Any screen
import { FolderList } from '@/components/FolderList';

<FolderList />
```

### 3️⃣ Fix Existing Data (if needed)
```bash
npx ts-node scripts/fix-folder-counts.ts
```

## 📦 What's Included

| File | Purpose |
|------|---------|
| `providers/FolderProvider.tsx` | State management + validation |
| `components/FolderList.tsx` | UI component |
| `scripts/fix-folder-counts.ts` | Data repair tool |
| `l10n/folder-translations-*.json` | Translations |

## 🎯 Core Logic

### Creating Folder
```typescript
const newFolder = {
  id: Date.now().toString(),
  name: name.trim(),
  count: 0,  // ← Always initialize to 0
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Validating Count
```typescript
// Ensure count is always a valid number
const validCount = typeof count === 'number' && !isNaN(count) 
  ? count 
  : 0;
```

### Loading Data
```typescript
// Auto-fix on load
const validatedFolders = folders.map(folder => ({
  ...folder,
  count: typeof folder.count === 'number' ? folder.count : 0,
}));
```

## 🔌 API Usage

### Hook: `useFolders()`
```typescript
const {
  folders,           // Folder[]
  addFolder,         // (name: string) => Promise<void>
  deleteFolder,      // (id: string) => Promise<void>
  updateFolderCount, // (id: string, count: number) => Promise<void>
  getFolderById,     // (id: string) => Folder | undefined
  isLoading,         // boolean
} = useFolders();
```

### Examples
```typescript
// Create folder
await addFolder('My Folder');

// Update count
await updateFolderCount(folderId, 5);

// Delete folder
await deleteFolder(folderId);

// Get folder
const folder = getFolderById(folderId);
```

## 🧪 Testing Checklist

- [ ] Create folder → shows "0 bookmarks"
- [ ] Count is a number, not string
- [ ] Works in all languages
- [ ] Handles Unicode names (中文, emoji)
- [ ] No console errors
- [ ] Data persists after reload

## 🛠️ Repair Tools

### Validate Data
```typescript
import { validateFolderData } from '@/scripts/fix-folder-counts';

const { valid, issues } = await validateFolderData();
if (!valid) {
  console.log('Issues:', issues);
}
```

### Fix Data
```typescript
import { fixFolderCounts } from '@/scripts/fix-folder-counts';

await fixFolderCounts();
```

### Reset All Counts
```typescript
import { resetAllFolderCounts } from '@/scripts/fix-folder-counts';

await resetAllFolderCounts();
```

## 🌐 Translation Keys

```json
{
  "folders": "Folders / 폴더 / 資料夾",
  "total_folders": "Total Folders / 총 폴더 / 總資料夾",
  "bookmarks": "bookmarks / 북마크 / 書籤",
  "create_new_folder": "Create New Folder / 새 폴더 만들기 / 建立新資料夾"
}
```

## 🐛 Common Issues

### Issue: Import error
```
Cannot find module '@/providers/FolderProvider'
```
**Fix:** Check tsconfig.json has `"@/*": ["*"]` in paths

### Issue: Count still garbled
```
Folder shows: ö instead of 0
```
**Fix:** Run `npx ts-node scripts/fix-folder-counts.ts`

### Issue: Provider not working
```
Error: useFolders must be used within a FolderProvider
```
**Fix:** Wrap app with `<FolderProvider>` in _layout.tsx

## 📊 Data Structure

```typescript
interface Folder {
  id: string;        // "1234567890"
  name: string;      // "My Folder"
  count: number;     // 0, 1, 2, ... (always number!)
  createdAt: string; // "2025-01-01T00:00:00.000Z"
  updatedAt: string; // "2025-01-01T00:00:00.000Z"
}
```

**Storage:** AsyncStorage key `@folders`  
**Format:** JSON string  
**Encoding:** UTF-8

## ⚡ Performance Tips

1. **Batch updates** - Update multiple folders at once
2. **Memoization** - Provider uses `useMemo` and `useCallback`
3. **Lazy loading** - Load folders only when needed
4. **Debounce** - Debounce search/filter operations

## 🔒 Type Safety

```typescript
// ✅ Good
const count: number = 0;
folder.count = 5;

// ❌ Bad
const count = "0";  // string!
folder.count = "5"; // will be auto-fixed to 0
```

## 📝 Code Snippets

### Add Folder with Error Handling
```typescript
try {
  await addFolder(folderName);
  Alert.alert('Success', 'Folder created');
} catch (error) {
  console.error('Error:', error);
  Alert.alert('Error', 'Failed to create folder');
}
```

### Display Folder Count
```typescript
<Text>
  {folder.count} {t('bookmarks')}
</Text>
```

### Update Count After Bookmark Action
```typescript
// After adding bookmark
await updateFolderCount(folderId, folder.count + 1);

// After deleting bookmark
await updateFolderCount(folderId, Math.max(0, folder.count - 1));
```

## 🎨 UI Components

### Folder Item
```typescript
<View style={styles.folderItem}>
  <FolderIcon size={24} color="#007AFF" />
  <View>
    <Text>{folder.name}</Text>
    <Text>{folder.count} bookmarks</Text>
  </View>
</View>
```

### Stats Display
```typescript
<View>
  <Text>Total Folders: {folders.length}</Text>
  <Text>Total Bookmarks: {totalBookmarks}</Text>
</View>
```

## 🚀 Deployment Checklist

- [ ] FolderProvider added to root layout
- [ ] All imports resolved
- [ ] Translation files added
- [ ] Existing data repaired
- [ ] Tests passing
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Tested on iOS and Android
- [ ] Tested in multiple languages

## 📚 Documentation

- **Full Guide:** `FOLDER_COUNT_FIX.md`
- **Summary:** `FOLDER_FIX_SUMMARY.md`
- **This Card:** `FOLDER_FIX_QUICK_REFERENCE.md`

## 💡 Pro Tips

1. **Always validate** - Never trust external data
2. **Use TypeScript** - Catch errors at compile time
3. **Log everything** - Makes debugging easier
4. **Test edge cases** - Empty strings, special chars, etc.
5. **Keep it simple** - Don't over-engineer

## 🎯 Success Criteria

✅ Count displays as `0` not `ö`  
✅ Type is `number` not `string`  
✅ Works in all languages  
✅ No console errors  
✅ Data persists correctly  
✅ UI updates immediately  

---

**Need Help?** Check the full documentation in `FOLDER_COUNT_FIX.md`

**Status:** ✅ Ready to use  
**Version:** 1.0.0  
**Last Updated:** 2025-01-04
