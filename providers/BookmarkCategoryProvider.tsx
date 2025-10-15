import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { useStorage, safeJsonParse } from "@/providers/StorageProvider";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  favorite: boolean;
  folderId?: string;
  addedOn: string;
  lastOpened?: string;
  description?: string;
  color?: string;
  category?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  icon: string;
  builtIn: boolean;
  bookmarks: Bookmark[];
  categoryId?: string;
  createdAt?: number;
}

export interface Category {
  id: string;
  key: string;
  name: string;
  icon: string;
  isDefault: boolean;
  isVisible: boolean;
  maxFolders: number;
  keywords: string[];
}

const STORAGE_KEYS = {
  BOOKMARKS: "@coolplay_bookmarks",
  FOLDERS: "@coolplay_folders",
  ORIGINAL_BOOKMARKS: "@coolplay_original_bookmarks",
  CATEGORIES: "bookmark_categories",
};

const defaultFolders: BookmarkFolder[] = [
  { id: "all", name: "all_bookmarks", icon: "bookmark", builtIn: true, bookmarks: [] },
  { id: "favorites", name: "favorites", icon: "star", builtIn: true, bookmarks: [] },
  { id: "ai", name: "ai", icon: "sparkles", builtIn: true, bookmarks: [] },
  { id: "work", name: "work", icon: "briefcase", builtIn: true, bookmarks: [] },
  { id: "study", name: "study", icon: "book-open", builtIn: true, bookmarks: [] },
  { id: "entertainment", name: "entertainment", icon: "gamepad-2", builtIn: true, bookmarks: [] },
  { id: "social", name: "social", icon: "users", builtIn: true, bookmarks: [] },
  { id: "news", name: "news", icon: "newspaper", builtIn: true, bookmarks: [] },
];

const defaultCategories: Category[] = [
  { 
    id: 'ai', 
    key: 'ai_folder', 
    name: 'AI', 
    icon: 'robot', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'chatgpt', 'gpt', 'openai']
  },
  { 
    id: 'work', 
    key: 'work_folder', 
    name: '工作', 
    icon: 'briefcase', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['work', 'office', 'business', 'job', 'career', 'professional']
  },
  { 
    id: 'study', 
    key: 'study_folder', 
    name: '學習', 
    icon: 'book', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['study', 'learn', 'education', 'course', 'tutorial', 'school']
  },
  { 
    id: 'entertainment', 
    key: 'entertainment_folder', 
    name: '娛樂', 
    icon: 'gamepad-2', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['entertainment', 'video', 'movie', 'film', 'music', 'game']
  },
  { 
    id: 'social', 
    key: 'social_folder', 
    name: '社交', 
    icon: 'users', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['social', 'facebook', 'twitter', 'instagram', 'tiktok']
  },
  { 
    id: 'news', 
    key: 'news_folder', 
    name: '新聞', 
    icon: 'newspaper', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['news', 'headline', 'update', 'breaking', 'report']
  },
];

const categoryKeywords: Record<string, string[]> = {
  ai: ['ai', 'artificial intelligence', 'machine learning', 'chatgpt'],
  work: ['work', 'office', 'business', 'job'],
  study: ['study', 'learn', 'education', 'course'],
  entertainment: ['entertainment', 'video', 'movie', 'music'],
  social: ['social', 'facebook', 'twitter', 'instagram'],
  news: ['news', 'headline', 'update', 'breaking'],
};

export const [BookmarkCategoryProvider, useBookmarkCategory] = createContextHook(() => {
  console.log('[BookmarkCategoryProvider] Initializing...');
  
  const { getItem, setItem } = useStorage();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>(defaultFolders);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [originalBookmarks, setOriginalBookmarks] = useState<Bookmark[]>([]);
  const [currentFolder, setCurrentFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<{ bookmarks: Bookmark[], folders: BookmarkFolder[] } | null>(null);
  const isSavingRef = useRef(false);
  const lastSaveRef = useRef({ bookmarks: '', folders: '', categories: '' });

  const ORDER: Record<string, number> = useMemo(() => ({
    all: 1,
    favorites: 2,
    ai: 3,
    work: 4,
    study: 5,
    entertainment: 6,
    social: 7,
    news: 8,
  }), []);

  const sortFolders = useCallback((arr: BookmarkFolder[]) => {
    return [...arr].sort((a, b) => (ORDER[a.id] ?? 9999) - (ORDER[b.id] ?? 9999));
  }, [ORDER]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [storedBookmarks, storedFolders, storedOriginal, storedCategories] = await Promise.all([
        getItem(STORAGE_KEYS.BOOKMARKS),
        getItem(STORAGE_KEYS.FOLDERS),
        getItem(STORAGE_KEYS.ORIGINAL_BOOKMARKS),
        getItem(STORAGE_KEYS.CATEGORIES),
      ]);

      if (storedBookmarks) {
        const parsed = safeJsonParse(storedBookmarks, []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookmarks(parsed);
        }
      }
      
      if (storedFolders) {
        const parsed = safeJsonParse(storedFolders, []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sorted = [...parsed].sort((a, b) => (ORDER[a.id] ?? 9999) - (ORDER[b.id] ?? 9999));
          setFolders(sorted);
        }
      }
      
      if (storedOriginal) {
        const parsed = safeJsonParse(storedOriginal, []);
        if (Array.isArray(parsed)) {
          setOriginalBookmarks(parsed);
        }
      }

      if (storedCategories) {
        const parsed = safeJsonParse(storedCategories, []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedCategories = defaultCategories.map(defaultCat => {
            const storedCat = parsed.find((c: Category) => c.id === defaultCat.id);
            return storedCat ? { ...defaultCat, ...storedCat } : defaultCat;
          });
          const customCategories = parsed.filter((c: Category) => !c.isDefault);
          setCategories([...mergedCategories, ...customCategories]);
        }
      }
    } catch (error) {
      console.error("[BookmarkCategoryProvider] Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = useCallback(async (newBookmarks: Bookmark[], newFolders: BookmarkFolder[], newCategories?: Category[]) => {
    pendingSaveRef.current = { bookmarks: newBookmarks, folders: newFolders };
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;
      
      const toSave = pendingSaveRef.current;
      if (!toSave) return;
      
      isSavingRef.current = true;
      
      try {
        const bookmarksJson = JSON.stringify(toSave.bookmarks);
        const foldersJson = JSON.stringify(toSave.folders);
        const categoriesToSave = newCategories || lastSaveRef.current.categories ? JSON.parse(lastSaveRef.current.categories) : defaultCategories;
        const categoriesJson = JSON.stringify(categoriesToSave);
        
        await Promise.all([
          setItem(STORAGE_KEYS.BOOKMARKS, bookmarksJson),
          setItem(STORAGE_KEYS.FOLDERS, foldersJson),
          setItem(STORAGE_KEYS.CATEGORIES, categoriesJson),
        ]);
        
        pendingSaveRef.current = null;
      } catch (error) {
        console.error("[BookmarkCategoryProvider] Error saving data:", error);
      } finally {
        isSavingRef.current = false;
      }
    }, 500);
  }, [setItem]);

  useEffect(() => {
    loadData();
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    const bookmarksStr = JSON.stringify(bookmarks);
    const foldersStr = JSON.stringify(folders);
    const categoriesStr = JSON.stringify(categories);
    
    if (lastSaveRef.current.bookmarks === bookmarksStr && 
        lastSaveRef.current.folders === foldersStr &&
        lastSaveRef.current.categories === categoriesStr) {
      return;
    }
    
    lastSaveRef.current = { bookmarks: bookmarksStr, folders: foldersStr, categories: categoriesStr };
    saveData(bookmarks, folders, categories);
  }, [bookmarks, folders, categories, isLoading]);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, "id" | "addedOn">) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      addedOn: new Date().toISOString(),
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
    return newBookmark;
  }, []);

  const deleteBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prev => prev.filter((b) => b.id !== bookmarkId));
    setFolders(prev => prev.map((folder) => ({
      ...folder,
      bookmarks: folder.bookmarks.filter((b) => b.id !== bookmarkId),
    })));
  }, []);

  const toggleFavorite = useCallback((bookmarkId: string) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.map((b) =>
        b.id === bookmarkId ? { ...b, favorite: !b.favorite } : b
      )
    );
  }, []);

  const addFolder = useCallback((categoryId: string, name: string, maxFolders: number = 5) => {
    let newFolderId: string | null = null;
    
    setFolders(prev => {
      const categoryFolders = prev.filter(f => f.categoryId === categoryId);
      if (categoryFolders.length >= maxFolders) {
        return prev;
      }
      
      const newFolder: BookmarkFolder = {
        id: `folder_${Date.now()}`,
        name: name.trim(),
        icon: "folder",
        builtIn: false,
        bookmarks: [],
        categoryId,
        createdAt: Date.now(),
      };
      newFolderId = newFolder.id;
      return [...prev, newFolder];
    });
    
    return newFolderId;
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.filter((f) => f.id !== folderId || f.builtIn));
    setBookmarks(prev => prev.filter(b => b.folderId !== folderId));
  }, []);

  const editFolder = useCallback((folderId: string, newName: string) => {
    setFolders(prev => prev.map((f) =>
      f.id === folderId && !f.builtIn ? { ...f, name: newName } : f
    ));
  }, []);

  const getFilteredBookmarks = useCallback((): Bookmark[] => {
    let displayBookmarks: Bookmark[] = [];

    if (currentFolder === "all") {
      displayBookmarks = bookmarks;
    } else if (currentFolder === "favorites") {
      displayBookmarks = bookmarks.filter((b) => b.favorite);
    } else {
      const folder = folders.find((f) => f.id === currentFolder);
      displayBookmarks = folder ? folder.bookmarks : [];
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      displayBookmarks = displayBookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          (b.description && b.description.toLowerCase().includes(query))
      );
    }

    return displayBookmarks;
  }, [bookmarks, folders, currentFolder, searchQuery]);

  const getStats = useCallback(() => {
    return {
      totalBookmarks: bookmarks.length,
      totalFolders: folders.length,
      totalFavorites: bookmarks.filter((b) => b.favorite).length,
      duplicates: 0,
    };
  }, [bookmarks, folders]);

  const toggleCategoryVisibility = useCallback((categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, isVisible: !cat.isVisible } : cat
    ));
  }, []);

  const addCategory = useCallback((name: string, icon: string, keywords: string[] = []) => {
    const newCategory: Category = {
      id: `custom_${Date.now()}`,
      key: `${name.toLowerCase()}_folder`,
      name: name.trim(),
      icon: icon.trim(),
      isDefault: false,
      isVisible: true,
      maxFolders: 5,
      keywords: keywords.length > 0 ? keywords : [name.toLowerCase()],
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  }, []);

  const getVisibleCategories = useCallback(() => {
    return categories.filter(c => c.isVisible);
  }, [categories]);

  const getFoldersByCategory = useCallback((categoryId: string): BookmarkFolder[] => {
    return folders.filter(f => f.categoryId === categoryId);
  }, [folders]);

  const getBookmarksByFolder = useCallback((folderId: string): Bookmark[] => {
    return bookmarks.filter(b => b.folderId === folderId);
  }, [bookmarks]);

  const importBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    setOriginalBookmarks([...bookmarks]);
    setBookmarks(prev => [...prev, ...newBookmarks]);
  }, [bookmarks]);

  const exportBookmarks = useCallback((format: "html" | "json" = "html"): string => {
    if (format === "json") {
      return JSON.stringify(bookmarks, null, 2);
    }
    let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n';
    bookmarks.forEach((bookmark) => {
      html += `<DT><A HREF="${bookmark.url}" ADD_DATE="${Date.now()}">${bookmark.title}</A>\n`;
    });
    html += '</DL><p>\n';
    return html;
  }, [bookmarks]);

  const smartCategorize = useCallback(() => {
    setOriginalBookmarks([...bookmarks]);
  }, [bookmarks]);

  const restoreOriginalBookmarks = useCallback(() => {
    if (originalBookmarks.length > 0) {
      setBookmarks([...originalBookmarks]);
      setOriginalBookmarks([]);
    }
  }, [originalBookmarks]);

  const cleanupBookmarks = useCallback(() => {
    return 0;
  }, []);

  const exportFolderBookmarks = useCallback((folderId: string, format: "html" | "json" = "html"): string => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return "";
    const list = folderId === "all" ? bookmarks : folderId === "favorites" ? bookmarks.filter(b => b.favorite) : folder.bookmarks;
    if (format === "json") {
      return JSON.stringify(list, null, 2);
    }
    let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
    html += `<TITLE>Bookmarks - ${folder.name}</TITLE>\n<H1>Bookmarks - ${folder.name}</H1>\n<DL><p>\n`;
    list.forEach((bookmark) => {
      html += `<DT><A HREF="${bookmark.url}">${bookmark.title}</A>\n`;
    });
    html += '</DL><p>\n';
    return html;
  }, [folders, bookmarks]);

  return useMemo(() => ({
    bookmarks,
    folders,
    categories,
    originalBookmarks,
    currentFolder,
    searchQuery,
    isLoading,
    setCurrentFolder,
    setSearchQuery,
    addBookmark,
    deleteBookmark,
    toggleFavorite,
    addFolder,
    deleteFolder,
    editFolder,
    getFilteredBookmarks,
    getStats,
    toggleCategoryVisibility,
    addCategory,
    deleteCategory,
    getVisibleCategories,
    getFoldersByCategory,
    getBookmarksByFolder,
    importBookmarks,
    exportBookmarks,
    smartCategorize,
    restoreOriginalBookmarks,
    cleanupBookmarks,
    exportFolderBookmarks,
    moveBookmarkToFolder: () => {},
    findDuplicates: () => [],
    deleteFoldersByCategory: () => {},
    deleteAllFolders: () => {},
    updateCategory: () => {},
    updateCategoryKeywords: () => {},
    getCategoryCount: () => categories.length,
    resetToDefaults: () => setCategories(defaultCategories),
  }), [
    bookmarks,
    folders,
    categories,
    originalBookmarks,
    currentFolder,
    searchQuery,
    isLoading,
    addBookmark,
    deleteBookmark,
    toggleFavorite,
    addFolder,
    deleteFolder,
    editFolder,
    getFilteredBookmarks,
    getStats,
    toggleCategoryVisibility,
    addCategory,
    deleteCategory,
    getVisibleCategories,
    getFoldersByCategory,
    getBookmarksByFolder,
    importBookmarks,
    exportBookmarks,
    smartCategorize,
    restoreOriginalBookmarks,
    cleanupBookmarks,
    exportFolderBookmarks,
  ]);
});
