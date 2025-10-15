# 🏗️ Translation System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Home    │  │ Settings │  │  Player  │  │Community │       │
│  │  Screen  │  │  Screen  │  │  Screen  │  │  Screen  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                         │                                        │
│                         ▼                                        │
│              ┌──────────────────────┐                           │
│              │  useTranslation()    │                           │
│              │  const { t } = ...   │                           │
│              └──────────┬───────────┘                           │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Translation Layer                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              useTranslation Hook                         │  │
│  │  • Receives translation key                             │  │
│  │  • Gets current language from useLanguage()             │  │
│  │  • Looks up translation in language file               │  │
│  │  • Returns translated text                              │  │
│  │  • Falls back to English if not found                   │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              useLanguage Hook                            │  │
│  │  • Manages current language state                       │  │
│  │  • Provides setLanguage() function                      │  │
│  │  • Persists language choice                             │  │
│  │  • Triggers UI re-render on change                      │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Storage Layer                                │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │   Web Platform   │              │ Native Platform  │        │
│  │                  │              │                  │        │
│  │  localStorage    │              │  AsyncStorage    │        │
│  │  • Synchronous   │              │  • Asynchronous  │        │
│  │  • Browser API   │              │  • React Native  │        │
│  └──────────────────┘              └──────────────────┘        │
│                                                                 │
│  Stores: "app_language" → "en" | "zh-TW" | "zh-CN" | ...      │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Translation Files (l10n/)                      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ en.json  │  │zh-TW.json│  │zh-CN.json│  │ es.json  │      │
│  │ 541 keys │  │ 541 keys │  │ 541 keys │  │ 541 keys │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │pt-BR.json│  │ pt.json  │  │ de.json  │  │ fr.json  │      │
│  │ 541 keys │  │ 541 keys │  │ 541 keys │  │ 541 keys │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ ru.json  │  │ ar.json  │  │ ja.json  │  │ ko.json  │      │
│  │ 541 keys │  │ 541 keys │  │ 541 keys │  │ 541 keys │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App Root (_layout.tsx)
│
├── SafeAreaProvider
│   └── QueryClientProvider
│       └── StorageProvider
│           └── LanguageProvider ◄─── Translation System Entry Point
│               ├── AuthProvider
│               ├── StripeProvider
│               ├── MembershipProvider
│               └── ... other providers
│                   └── RootLayoutNav
│                       └── Stack Navigator
│                           ├── (tabs)
│                           │   ├── home.tsx ◄─── Uses useTranslation()
│                           │   ├── settings.tsx ◄─── Uses useTranslation()
│                           │   ├── player.tsx ◄─── Uses useTranslation()
│                           │   ├── community.tsx ◄─── Uses useTranslation()
│                           │   └── favorites.tsx ◄─── Uses useTranslation()
│                           ├── auth/
│                           └── subscription/
```

---

## Data Flow: Language Change

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User Action                                             │
│                                                                 │
│  User taps language in Settings                                │
│  ┌──────────────────────────────────────┐                      │
│  │ <Button onPress={() =>               │                      │
│  │   setLanguage("zh-TW")               │                      │
│  │ />                                   │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: State Update                                            │
│                                                                 │
│  useLanguage hook updates state                                │
│  ┌──────────────────────────────────────┐                      │
│  │ setLanguage("zh-TW")                 │                      │
│  │   ↓                                  │                      │
│  │ setLanguageState("zh-TW")            │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Persist to Storage                                      │
│                                                                 │
│  Save to AsyncStorage/localStorage                             │
│  ┌──────────────────────────────────────┐                      │
│  │ AsyncStorage.setItem(                │                      │
│  │   "app_language",                    │                      │
│  │   "zh-TW"                            │                      │
│  │ )                                    │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Context Update                                          │
│                                                                 │
│  LanguageProvider notifies all consumers                       │
│  ┌──────────────────────────────────────┐                      │
│  │ Context value changes                │                      │
│  │   ↓                                  │                      │
│  │ All useLanguage() hooks receive      │                      │
│  │ new language value                   │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Component Re-render                                     │
│                                                                 │
│  All components using useTranslation() re-render               │
│  ┌──────────────────────────────────────┐                      │
│  │ const { t } = useTranslation()       │                      │
│  │   ↓                                  │                      │
│  │ t() now returns Chinese text         │                      │
│  │   ↓                                  │                      │
│  │ UI displays Chinese                  │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Translation Lookup Process

```
┌─────────────────────────────────────────────────────────────────┐
│ Component calls t("welcome")                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ useTranslation hook receives key                                │
│ • Key: "welcome"                                                │
│ • Current language: "zh-TW"                                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Look up in translations object                                  │
│                                                                 │
│  translations = {                                               │
│    "en": { "welcome": "Welcome" },                             │
│    "zh-TW": { "welcome": "歡迎" },                             │
│    "zh-CN": { "welcome": "欢迎" },                             │
│    ...                                                          │
│  }                                                              │
│                                                                 │
│  translation = translations["zh-TW"]["welcome"]                │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Check if translation exists                                     │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │ Found?          │                                           │
│  └────┬────────┬───┘                                           │
│       │ Yes    │ No                                            │
│       ▼        ▼                                               │
│  ┌─────────┐  ┌──────────────────┐                            │
│  │ Return  │  │ Fallback to      │                            │
│  │ "歡迎"  │  │ English          │                            │
│  └─────────┘  │ translations["en"]│                            │
│               │ ["welcome"]       │                            │
│               │ → "Welcome"       │                            │
│               └──────────┬────────┘                            │
│                          │                                      │
│                          ▼                                      │
│                    ┌──────────────┐                            │
│                    │ Still not    │                            │
│                    │ found?       │                            │
│                    │ Return key   │                            │
│                    │ → "welcome"  │                            │
│                    └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure & Dependencies

```
Project Root
│
├── l10n/                           # Translation files
│   ├── en.json                     # Base language
│   ├── zh-TW.json                  # Imported by useTranslation
│   ├── zh-CN.json                  # Imported by useTranslation
│   ├── es.json                     # Imported by useTranslation
│   ├── pt-BR.json                  # Imported by useTranslation
│   ├── pt.json                     # Imported by useTranslation
│   ├── de.json                     # Imported by useTranslation
│   ├── fr.json                     # Imported by useTranslation
│   ├── ru.json                     # Imported by useTranslation
│   ├── ar.json                     # Imported by useTranslation
│   ├── ja.json                     # Imported by useTranslation
│   └── ko.json                     # Imported by useTranslation
│
├── hooks/
│   ├── useLanguage.tsx             # Language state management
│   │   ├── Exports: LanguageProvider
│   │   ├── Exports: useLanguage()
│   │   ├── Uses: AsyncStorage
│   │   └── Uses: createContextHook
│   │
│   └── useTranslation.tsx          # Translation function
│       ├── Exports: useTranslation()
│       ├── Uses: useLanguage()
│       └── Imports: All l10n/*.json files
│
├── app/
│   ├── _layout.tsx                 # Root layout
│   │   └── Wraps app with LanguageProvider
│   │
│   └── (tabs)/
│       ├── home.tsx                # Uses useTranslation()
│       ├── settings.tsx            # Uses useTranslation() + useLanguage()
│       ├── player.tsx              # Uses useTranslation()
│       ├── community.tsx           # Uses useTranslation()
│       └── favorites.tsx           # Uses useTranslation()
│
├── components/
│   ├── ReferralCodeModal.tsx      # Uses useTranslation()
│   ├── VoiceOnboardingModal.tsx   # Uses useTranslation()
│   ├── CategoryManagement.tsx     # Uses useTranslation()
│   └── ... (all use useTranslation())
│
└── scripts/
    └── validate-translation-keys.js # Validation utility
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LanguageProvider                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ State:                                                   │  │
│  │  • language: Language = "en"                            │  │
│  │  • isLoading: boolean = false                           │  │
│  │                                                          │  │
│  │ Methods:                                                 │  │
│  │  • setLanguage(lang: Language): Promise<void>           │  │
│  │  • loadLanguage(): Promise<void>                        │  │
│  │                                                          │  │
│  │ Effects:                                                 │  │
│  │  • Load language on mount                               │  │
│  │  • Persist language on change                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Context Value:                                                │
│  { language, setLanguage, isLoading }                          │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ Consumed by
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    useLanguage() Hook                           │
│                                                                 │
│  Returns: { language, setLanguage, isLoading }                 │
│                                                                 │
│  Used by:                                                       │
│  • useTranslation() - to get current language                  │
│  • Settings screen - to display/change language                │
│  • Any component needing language info                         │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Used by
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useTranslation() Hook                         │
│                                                                 │
│  const { language } = useLanguage();                           │
│                                                                 │
│  const t = useCallback((key: string) => {                      │
│    const translation = translations[language];                 │
│    return translation[key] || fallback[key] || key;            │
│  }, [language]);                                               │
│                                                                 │
│  Returns: { t }                                                │
│                                                                 │
│  Used by:                                                       │
│  • All screens                                                  │
│  • All components                                               │
│  • All modals                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│ Optimization Strategy                                           │
│                                                                 │
│ 1. Static Imports                                               │
│    • All translation files imported at build time              │
│    • No runtime file loading                                    │
│    • Bundled with app                                           │
│                                                                 │
│ 2. Memoization                                                  │
│    • useCallback for t() function                              │
│    • useMemo for context value                                 │
│    • Prevents unnecessary re-renders                            │
│                                                                 │
│ 3. Lazy Loading (Future)                                        │
│    • Could implement dynamic imports                            │
│    • Load only current language                                 │
│    • Reduce initial bundle size                                 │
│                                                                 │
│ 4. Caching                                                      │
│    • Language choice cached in storage                          │
│    • No repeated lookups                                        │
│    • Fast app startup                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

```
┌─────────────────────────────────────────────────────────────────┐
│ Error Scenarios & Handling                                      │
│                                                                 │
│ 1. Translation Key Not Found                                    │
│    ┌──────────────────────────────────────┐                    │
│    │ t("non_existent_key")                │                    │
│    │   ↓                                  │                    │
│    │ Check current language → Not found   │                    │
│    │   ↓                                  │                    │
│    │ Fallback to English → Not found      │                    │
│    │   ↓                                  │                    │
│    │ Return key name: "non_existent_key"  │                    │
│    └──────────────────────────────────────┘                    │
│                                                                 │
│ 2. Storage Error                                                │
│    ┌──────────────────────────────────────┐                    │
│    │ AsyncStorage.getItem() fails         │                    │
│    │   ↓                                  │                    │
│    │ Catch error                          │                    │
│    │   ↓                                  │                    │
│    │ Log error                            │                    │
│    │   ↓                                  │                    │
│    │ Use default language (English)       │                    │
│    └──────────────────────────────────────┘                    │
│                                                                 │
│ 3. Invalid Language Code                                        │
│    ┌──────────────────────────────────────┐                    │
│    │ setLanguage("invalid")               │                    │
│    │   ↓                                  │                    │
│    │ Validate against allowed languages   │                    │
│    │   ↓                                  │                    │
│    │ Reject if invalid                    │                    │
│    │   ↓                                  │                    │
│    │ Keep current language                │                    │
│    └──────────────────────────────────────┘                    │
│                                                                 │
│ 4. Corrupted Storage Data                                       │
│    ┌──────────────────────────────────────┐                    │
│    │ Load corrupted language value        │                    │
│    │   ↓                                  │                    │
│    │ Validation fails                     │                    │
│    │   ↓                                  │                    │
│    │ Clear corrupted data                 │                    │
│    │   ↓                                  │                    │
│    │ Reset to default (English)           │                    │
│    └──────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│ Testing Layers                                                  │
│                                                                 │
│ 1. Unit Tests                                                   │
│    • Test useTranslation() hook                                │
│    • Test useLanguage() hook                                   │
│    • Test translation lookup logic                             │
│    • Test fallback mechanism                                    │
│                                                                 │
│ 2. Integration Tests                                            │
│    • Test language switching flow                              │
│    • Test storage persistence                                   │
│    • Test context provider                                      │
│    • Test component re-rendering                               │
│                                                                 │
│ 3. E2E Tests                                                    │
│    • Test full user flow                                        │
│    • Test language selector UI                                  │
│    • Test all screens in all languages                         │
│    • Test app restart with saved language                      │
│                                                                 │
│ 4. Validation Tests                                             │
│    • Run validate-translation-keys.js                          │
│    • Check all languages have same keys                        │
│    • Check no empty values                                      │
│    • Check no missing translations                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

This architecture provides:

✅ **Scalability** - Easy to add new languages  
✅ **Performance** - Optimized with memoization  
✅ **Reliability** - Comprehensive error handling  
✅ **Maintainability** - Clear separation of concerns  
✅ **Type Safety** - TypeScript throughout  
✅ **Testability** - Well-structured for testing  
✅ **User Experience** - Real-time language switching  
✅ **Developer Experience** - Simple API (just use `t()`)  

---

**Architecture Version:** 2.0  
**Last Updated:** 2025-10-02  
**Status:** ✅ Production Ready
