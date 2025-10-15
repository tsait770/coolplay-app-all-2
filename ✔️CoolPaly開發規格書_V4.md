# CoolPlay 影片語音控制 App 產品開發規格書 - 整合版

> **版本**: 4.0.0  
> **最後更新**: 2025年10月13日  
> **作者**: Manus AI  
> **專案代號**: CoolPlay  

---

## 📖 文件概述

本文件是 **CoolPlay 影片語音控制應用程式** 的完整產品開發規格書。此整合版本匯集了《CoolPaly開發規格書_V4》、《（47）桌面（Web）開發者模式》以及《(48)後台管理與開發者模式規格書》的內容，形成一份統一、可供 AI 代理或開發團隊直接依循的開發藍圖。

CoolPlay 的核心定位是一款 **平台中立的影音播放工具**，其核心特色是透過強大的線上語音辨識技術，讓使用者能以自然語言控制由使用者自行提供的、來自多種來源的影片播放。本應用程式不內建、不推薦、不索引任何影音內容，僅作為技術載體，提供極致的播放控制體驗。

**本版本重點**：
- ✅ **全面整合開發者模式與後台管理**：將所有關於開發者模式、後台管理及其統計功能的詳細內容，完整併入一個專屬章節。
- ✅ **確立合規定位**：以「中立型技術載體」為核心法律定位，重寫相關章節，確保符合全球法令與平台上架政策。
- ✅ **強化安全機制**：整合開發者 2FA、使用者裝置綁定、防濫用機制等安全性要求。
- ✅ **重新編排章節**：以產品開發生命週期為順序，重新組織文件架構，使其更具可執行性，方便開發團隊分階段依序完成。
- ✅ **填入開發者資訊**：依照要求，將開發者聯繫資訊整合至文件中。

---

## 🗂️ 文件結構

本規格書按照產品定義、功能規格、技術實現、合規法律的順序進行編排，確保開發流程的邏輯性。

| 章節 | 內容概要 |
| :--- | :--- |
| **第一章：專案總覽與合規定位** | 專案願景、核心功能、技術棧，並確立「中立播放器」的法律定位。 |
| **第二章：系統架構** | 整體架構設計、組件職責與資料流，強調合規性。 |
| **第三章：核心功能規格** | 語音控制、影片播放、資料夾管理、會員系統等詳細規格。 |
| **第四章：使用者身份與安全策略** | 使用者登入、裝置識別、防濫用機制與會員裝置管理。 |
| **第五章：開發者模式、後台管理與統計功能** | 開發者專用後台功能、統計報表、金鑰管理與 Web 開發者模式。 |
| **第六章：技術實現** | 前後端（React Native + Supabase）的詳細開發指南。 |
| **第七章：資料庫設計** | PostgreSQL Schema、RLS 策略與觸發器。 |
| **第八章：API 規格** | RESTful API 端點定義與請求/回應範例。 |
| **第九章：UI/UX 設計** | CoolPlay 設計系統、動畫效果與互動回饋。 |
| **第十章：多國語言支援** | i18n 框架、語言包結構與錯誤訊息國際化。 |
| **第十一章：法律、合規與隱私** | 完整闡述著作權、個資保護、成人內容處理原則與免責聲明。 |
| **第十二章：測試與部署** | 開發行動計劃、測試策略與應用商店上架。 |
| **第十三章：支付模組：PayPal 整合與管理** | PayPal 技術整合、測試、收款與上線流程。 |
| **第十四章：附錄** | 語音指令、支援格式、URL 檢測邏輯等補充資料。 |
| **第十五章：Expo 專案自動啟動與預覽** | 說明如何自動啟動 Expo 專案並透過 QR Code 預覽。 |
| **第十六章：EAS 自動上架模板** | 提供 EAS 自動上架的配置與使用說明。 |

---

## 🔧 開發者資訊

以下資訊為專案聯絡與登入範例，實際金鑰與密碼應以安全方式管理。

- **開發者聯繫信箱**: `tsait770@gmail.com`
- **開發者登入範例**:
  - **帳號**: `tsait770@gmail.com`  
  - **密碼**: `680142` (此為範例，實際應使用環境變數或金鑰管理服務)

---

**祝開發順利！**





================================================================================
第一章：專案總覽與合規定位
================================================================================

## 1.1. 核心願景與法律定位

CoolPlay 旨在成為市場上最通用、最強大的 **中立型影音播放工具**。本應用的核心是解決使用者在操作來自不同來源的影片時，控制方式繁瑣、體驗不一的痛點。透過強大的語音控制功能，使用者將能實現「開口即播」的無縫體驗。

> **核心法律定位：中立技術載體**
> 本應用程式在法律上定位為「中立影音播放器」或「具備進階功能的瀏覽器」。它本身不提供、不內建、不推薦、不索引、不快取、不轉發任何影音內容。所有內容來源均由使用者自行輸入網址。應用程式僅提供播放技術與操作介面，其合法性等同於使用者在標準瀏覽器中訪問相同網址。

## 1.2. 主要功能亮點

| 功能分類 | 核心亮點 |
| :--- | :--- |
| **通用影片播放** | 支援使用者輸入的主流影片格式與串流協定網址，透過 WebView 或官方播放器嵌入方式顯示。 |
| **智慧語音控制** | 支援 12 種以上語言的自然語言指令，包含播放、進度、音量、速度等多維度控制。 |
| **會員與訂閱系統** | 提供分級會員方案，透過 PayPal 進行安全支付，並以 Supabase 管理使用者權益。 |
| **書籤與分類管理** | 強大的書籤管理功能，使用者可自訂資料夾、透過關鍵字自動分類，並與語音指令深度整合。 |
| **完全合規策略** | 嚴格遵守「中立技術載體」原則，不儲存、不轉發內容，將內容合法性責任歸於來源網站與使用者。 |
| **強化安全機制** | 透過 Google OAuth、裝置 ID 綁定、2FA 等機制，確保使用者帳戶安全並防止免費額度濫用。 |
| **開發者模式** | 內建功能完善的開發者後台，提供系統監控、數據分析與除錯工具。 |
| **跨平台支援** | 以 React Native (Expo) 框架開發，確保在 iOS 與 Android 雙平台提供一致的體驗。 |

## 1.3. 技術棧概覽

| 組件 | 技術選型 |
| :--- | :--- |
| **前端框架** | React Native (Expo) |
| **後端即服務 (BaaS)** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **支付平台** | PayPal |
| **語音辨識** | 平台原生線上語音辨識 API (Apple Speech, Google Speech) |
| **影片播放器** | WebView / 官方 SDK (YouTube IFrame API) / 原生播放器 (ExoPlayer, AVPlayer) |
| **DRM 支援** | Widevine DRM (Android), FairPlay Streaming (iOS) |
| **UI 設計系統** | CoolPlay Design System (深色主題、藍色系主色調) |

## 1.4. 合規核心原則

為確保應用程式符合全球法令、隱私規範與平台上架政策，開發必須嚴格遵守以下原則：

1.  **不內建內容**：不內建任何成人網站或有版權爭議網站的連結、推薦、圖示或搜尋功能。
2.  **不主動解析**：不主動解析、緩存或建立中介伺服器來處理串流資料。所有播放行為均在客戶端完成。
3.  **使用者提供來源**：所有內容來源皆由使用者自行輸入網址。
4.  **嵌入式播放**：App 僅以 WebView 或官方播放器 SDK 的嵌入方式顯示內容，不改變原始播放體驗。
5.  **不繞過驗證**：完整顯示來源網站的年齡警示、付費牆或登入畫面，不以任何技術手段繞過。
6.  **無內容索引**：不建立搜尋、推薦、快取或任何形式的影片索引功能。




================================================================================
第二章：系統架構
================================================================================

## 2.1. 架構概述

CoolPlay 應用程式採用現代化的客戶端-伺服器架構，並嚴格遵守「中立技術載體」原則。架構設計的核心是將所有與內容相關的處理（如播放、渲染）完全限制在使用者裝置端，而後端服務僅負責使用者身份、權益、書籤資料等與內容無關的管理。整體架構分為前端應用、後端服務和第三方整合三個主要部分。

## 2.2. 架構概覽圖

```mermaid
graph TD
    subgraph 用戶端 (Client-Side)
        A[React Native App] --> B{語音辨識};
        A --> C{影片播放器 (WebView/Native)};
        A --> D{UI/UX 介面};
        B --> E[指令解析器];
        E --> C;
    end

    subgraph 後端服務 (Backend - Supabase)
        F[API Gateway] --> G[Supabase];
        G --> H[(PostgreSQL DB)];
        G --> I[Auth];
        G --> J[Storage];
    end

    subgraph 第三方整合 (3rd Party)
        L[PayPal API];
        M[Apple/Google Speech API];
        N[影片來源網站 (由使用者輸入)];
    end

    A -- API 請求 (用戶資料/書籤) --> F;
    B -- 語音辨識請求 --> M;
    F -- 支付請求 --> L;
    C -- 直接訪問 --> N;
```

**架構關鍵變更**：與早期版本不同，此架構 **不包含** 後端「影片提取服務」。所有對影片來源的訪問都由客戶端直接發起，模擬瀏覽器行為，從而確保了應用的中立性。

## 2.3. 組件職責說明

| 組件 | 主要職責 | 技術實現/備註 |
| :--- | :--- | :--- |
| **React Native App** | - 提供使用者介面與互動邏輯。<br>- 整合原生模組（語音、播放器）。<br>- 管理本地狀態與使用者偏好設定。<br>- **直接向使用者輸入的 URL 發起請求**。 | 使用 Expo 框架加速開發與部署。 |
| **語音辨識模組** | - 呼叫平台原生的線上語音辨識服務。<br>- 將語音轉換為文字。 | iOS: `SFSpeechRecognizer`，Android: `SpeechRecognizer`。 |
| **指令解析器** | - 將辨識出的文字與內建及自定義指令進行匹配。<br>- 將文字指令轉換為具體的播放器動作。 | 處理多語言同義詞與模糊匹配。 |
| **影片播放器** | - **核心變更**：優先使用 **WebView** 來載入使用者提供的網頁 URL。<br>- 對於直接的媒體檔案連結（.mp4, .m3u8），則使用原生播放器（ExoPlayer/AVPlayer）。<br>- **不處理**任何需要特殊解析的串流。 | 嚴格區分 URL 類型，確保僅對標準媒體格式使用原生播放器。 |
| **API Gateway** | - 作為後端服務的統一入口。<br>- 處理與**使用者資料**相關的請求路由、驗證與速率限制。 | 使用 Supabase Functions 或內建的 PostgREST API。 |
| **Supabase** | - 提供後端即服務，管理**非內容相關**的資料：<br>  - 使用者帳戶、會員資格、裝置綁定。<br>  - 語音使用次數、書籤、資料夾、分類。 | 使用 PostgreSQL 作為核心資料庫，並以 RLS 保護資料安全。 |
| **PayPal API** | - 處理所有與支付相關的操作，包括訂閱、一次性付款、退款等。 | 採用 PayPal REST API (v2) 進行交易，透過後端建立訂單，前端使用 PayPal Checkout SDK 完成支付，並以 Webhook 驗證。 |

## 2.4. 資料流：一次合規的播放請求

1.  **使用者** 在 App 中輸入一個影片頁面的 URL，例如 `https://example.com/video-page`。
2.  **React Native App** 接收到 URL，判斷其為一個網頁而不是直接的媒體檔案。
3.  **App** 將此 URL 載入到一個 **WebView** 元件中。
4.  **WebView** 如同一個迷你瀏覽器，開始載入 `example.com` 的網頁內容，包括其 HTML、CSS、JavaScript，以及該網站自己的影片播放器和廣告。
5.  如果該網站需要登入或有年齡驗證，這些介面會**直接顯示在 WebView 中**，使用者需要自行操作，App 不會也無法繞過它們。
6.  影片開始在 WebView 中播放後，使用者說出語音指令：「暫停」。
7.  **語音辨識模組** 將語音轉為文字「暫停」。
8.  **指令解析器** 匹配到 `pause` 動作。
9.  **App** 執行一段 JavaScript 程式碼注入到 WebView 中，嘗試找到頁面上的 `<video>` 元素並呼叫其 `.pause()` 方法。
10. **App** 同時向 **Supabase** 後端發送 API 請求，記錄一次語音操作並扣除次數。

此流程確保了 CoolPlay App 始終作為一個外部控制工具，而不是內容的處理者或分發者。




================================================================================
第三章：核心功能規格
================================================================================

本章詳細定義應用程式的四大核心功能模組，所有設計均需嚴格遵守第一章和第二章確立的合規與架構原則。

---

### 3.1 語音控制

語音控制是 CoolPlay 的核心互動模式，旨在提供完全免持、高效率的影片操控體驗。

#### 3.1.1. 設計原則

- **線上優先**: 為保證最佳辨識效果，所有語音辨識均透過平台原生提供的線上服務（Apple Speech, Google Speech）完成。
- **高響應性**: 客戶端應在辨識到指令後立即執行 UI 反饋，無需等待後端確認。
- **高準確率**: 透過信心度分數過濾低品質的辨識結果（例如，低於 0.7 則提示重試）。
- **靈活性**: 支援豐富的內建指令與使用者自定義指令。

#### 3.1.2. 支援語言與指令

系統需支援至少 12 種語言的語音指令（英文、繁簡中文、西班牙文、葡萄牙文、法文、德文、俄文、日文、韓文、阿拉伯文）。詳細指令列表請參閱 **附錄 A**。

#### 3.1.3. 功能流程：從語音到動作

1.  **啟動聆聽**: 使用者點擊麥克風圖示，應用啟動平台原生語音辨識器。
2.  **語音轉文字**: 平台辨識器將語音轉換為文字，並返回帶有信心度分數的結果。
3.  **本地指令解析**: App 內的指令解析器對文字結果進行匹配，若成功，立即觸發對應的播放器動作（例如，向 WebView 注入 JavaScript 來控制播放）。
4.  **後端同步**: 在本地觸發動作的同時，App 非同步地向後端發送 API 請求，以記錄此次語音操作並扣除使用次數。

#### 3.1.4. 後端 API：語音動作記錄

- **端點**: `POST /rest/v1/voice_actions` (使用 Supabase PostgREST)
- **請求 Body**: `{"action": "forward10", "source_url": "https://example.com/video.mp4"}`
- **後端邏輯**: 透過 PostgreSQL 的預存程序 (Stored Procedure) 或觸發器 (Trigger) 實現：
    1.  驗證使用者身份。
    2.  查詢並扣除其剩餘語音指令次數。
    3.  若次數不足，則回傳錯誤。
    4.  記錄操作日誌。

---

### 3.2 影片播放

影片播放模組嚴格遵守「中立技術載體」原則，將自身定位為一個外部控制器，而非內容處理器。

#### 3.2.1. 播放方式

- **WebView 優先**: 對於使用者輸入的任何 `http/https` 網頁連結，一律使用 **WebView** 載入。這是確保合規性的核心機制。App 不對網頁內容做任何解析或修改，僅作為一個顯示容器。
- **原生播放器**: 僅在使用者輸入的 URL 明確指向一個直接的媒體檔案時（如結尾為 `.mp4`, `.m3u8`, `.mpd`），才使用原生播放器（ExoPlayer/AVPlayer）進行播放。這提供了更佳的性能和控制體驗。

#### 3.2.2. URL 處理邏輯

前端需實作一個 `detectUrlType` 函數，根據 URL 特徵決定播放方式。

> ```javascript
> function detectUrlType(url) {
>   const mediaExtensions = /\.(mp4|mkv|webm|m3u8|mpd)(\?.*)?$/i;
>   if (mediaExtensions.test(url)) {
>     return 'native_player';
>   }
>   if (/^https?:\/\//.test(url)) {
>     return 'webview';
>   }
>   return 'unsupported';
> }
> ```

#### 3.2.3. 廢除「影片提取服務」

為徹底貫徹中立原則，V3.0 **明確廢除**任何形式的後端「影片提取服務」或 `yt-dlp` 之類的工具。此舉的意義在於：
- **避免法律風險**: 避免構成「規避技術保護措施」或「中介、轉發」有版權內容的行為。
- **簡化架構**: 降低了後端複雜度和維護成本。
- **使用者責任**: 將內容能否播放的責任完全交還給來源網站本身和使用者。

---

### 3.3 資料夾與分類管理

此功能為使用者提供強大的書籤組織能力，所有資料均儲存在 Supabase 中，與使用者帳戶綁定。

#### 3.3.1. 核心概念

- **書籤 (Bookmark)**: 使用者儲存的每一個影片 URL 連結。
- **資料夾 (Folder)**: 用於存放書籤的容器。
- **分類 (Category)**: 用於對資料夾進行邏輯分組的標籤，每個分類包含一組**關鍵字**用於自動分類。

#### 3.3.2. 批次操作功能

為提升管理效率，需在資料夾和書籤列表頁面提供批次操作模式，支援：
- 批次選擇（全選、反選、範圍選擇）
- 批次刪除（書籤、資料夾）
- 批次移動（書籤至另一資料夾）
- 批次加入/移除最愛

#### 3.3.3. 首頁統計數字

應用程式首頁需顯示兩個核心統計數據：
- **總資料夾數**: 所有分類下的資料夾總數。
- **可見資料夾數**: 僅計算狀態為「可見」的分類下的資料夾總數。此數字會根據使用者在分類管理中的設定動態變化。

---

### 3.4 會員與支付系統

本模組是應用的商業化核心，所有設計均需考慮安全、合規與使用者體驗。

#### 3.4.1. 會員方案

| 會員類型 | 價格 (USD) | 語音指令次數 | 核心功能與限制 | 裝置綁定 |
| :--- | :--- | :--- | :--- | :--- |
| **免費會員** | 免費 | 首次登入 +2000，每日登入 +30。 | - 支援基本播放功能。<br>- **不支援**自定義語音指令。 | 1 台 |
| **基礎會員** | $19.9/月<br>$199/年 | 每月 +1500，每日登入 +40。 | - 支援所有播放功能。<br>- 支援自定義語音指令。 | 3 台 |
| **進階會員** | $39.9/月<br>$399/年 | **無限制** | - 享受所有基礎會員功能。<br>- 新功能優先體驗。 | 5 台 |

**註**：年付方案提供約 17% 折扣。裝置綁定數量已根據最新規格更新。

#### 3.4.2. 支付整合 (PayPal)

- **支付流程**: 採用 PayPal REST API (v2) 進行整合。透過後端（Supabase Edge Function）建立支付請求，回傳 `orderID` 後，前端調用 PayPal Checkout SDK 彈出付款視窗完成支付。
- **訂閱管理**: 使用 PayPal Subscriptions API 建立 recurring payments，並透過 Webhook (`BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`) 自動同步訂閱狀態到 Supabase 資料庫。

#### 3.4.3. 推薦與優惠碼系統

- **推薦獎勵**: 新使用者輸入推薦者的推薦碼後，**雙方各獲得 300 次**額外語音指令額度。
- **輸入介面**: 在首次登入後的彈窗和設定頁面提供輸入入口。

#### 3.4.4. 五星評價引導系統

- **觸發條件**: 僅對**付費會員**，在其**第三次**開啟應用程式時觸發。
- **互動流程**: 彈出對話框詢問「您喜歡 CoolPlay 嗎？」。若選擇「喜歡」，則引導至應用商店評分；若選擇「不喜歡」，則引導至內部意見回饋頁面。




================================================================================
第四章：使用者身份與安全策略
================================================================================

本章詳細闡述為確保系統安全、防止資源濫用並符合法規要求而設計的使用者身份驗證與安全管理機制。這些策略是基於《開發者模式與安全性》文件的核心要求整合而成。

---

### 4.1 使用者登入與驗證

#### 4.1.1 Google OAuth 2.0 整合

- **目的**: 提供安全、便捷的第三方登入方式，減少使用者註冊負擔。
- **流程**:  
  1.  使用者點擊「使用 Google 登入」。
  2.  App 導向 Google 授權頁面。
  3.  使用者授權後，Google 返回 `id_token` 和 `access_token` 給 App。
  4.  App 將 `id_token` 傳送至 Supabase Auth 進行驗證並建立使用者會話。
- **安全性**: 僅請求必要的 `profile` 和 `email` 權限。不儲存 Google 憑證。

#### 4.1.2 首次登入獎勵機制

- **目的**: 鼓勵新使用者體驗語音控制功能。
- **觸發條件**: 每個裝置首次成功登入時。
- **獎勵內容**: 首次登入贈送 2000 次語音指令額度。
- **實現**:  
  1.  前端在登入成功後，檢查本地儲存中是否有 `device_first_login_reward_claimed` 標記。
  2.  若無，則向後端 `POST /rest/v1/reward_claims` 發送請求，攜帶 `device_uid`。
  3.  後端檢查 `reward_claims` 表中是否已存在該 `device_uid` 的記錄。
  4.  若無，則為該使用者增加 2000 `voice_credits`，並在 `reward_claims` 表中記錄 `device_uid`。
  5.  前端設置 `device_first_login_reward_claimed` 標記為 `true`。

#### 4.1.3 每日登入獎勵機制

- **目的**: 提升使用者活躍度與黏性。
- **觸發條件**: 使用者每日首次登入時。
- **獎勵內容**: 每日登入贈送 30-40 次語音指令額度 (依會員等級而異)。
- **實現**:  
  1.  後端在使用者登入時，檢查 `users` 表中的 `last_login_at` 欄位。
  2.  若 `last_login_at` 與當前日期不同，則為使用者增加對應的 `voice_credits`，並更新 `last_login_at`。

---

### 4.2 裝置綁定與管理

#### 4.2.1 裝置唯一識別碼 (Device UID)

- **目的**: 識別使用者裝置，用於裝置綁定限制和防濫用。
- **獲取方式**:  
  - **iOS**: 使用 `UIDevice.current.identifierForVendor.uuidString`。
  - **Android**: 使用 `Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)`。
  - **Web**: 使用 `localStorage` 或 `IndexedDB` 生成並儲存一個 UUID。
- **注意事項**: 確保在 App 重新安裝後仍能盡可能保持一致性，或在重新安裝後重新綁定。

#### 4.2.2 裝置數量限制

- **目的**: 根據會員等級限制可同時登入的裝置數量，防止帳號共享。
- **限制規則**:  
  - **免費會員**: 1 台裝置。
  - **基礎會員**: 3 台裝置。
  - **進階會員**: 5 台裝置。
- **實現**:  
  1.  使用者嘗試在新的裝置上登入時，後端會檢查其 `membership_type` 和 `devices` 表中已綁定裝置的數量。
  2.  若超出限制，則拒絕登入，並提示使用者解除舊裝置綁定。
  3.  提供介面讓使用者在設定頁面管理已綁定裝置，可手動解除綁定。

#### 4.2.3 IP 位址與地理位置記錄

- **目的**: 輔助安全監控，識別異常登入行為。
- **記錄時機**: 每次登入或新裝置綁定時，記錄裝置的 IP 位址和大致地理位置。
- **安全性**: 僅用於內部安全分析，不對外公開，並遵守隱私政策。

---

### 4.3 防濫用機制

#### 4.3.1 語音指令頻率限制

- **目的**: 防止惡意程式或腳本快速消耗語音指令額度。
- **限制規則**:  
  - 每位使用者每秒最多發送 5 次語音指令請求。
  - 每位使用者每分鐘最多發送 100 次語音指令請求。
- **實現**: 在 `voice_actions` API 端點實作速率限制 (Rate Limiting)。

#### 4.3.2 異常行為監測

- **目的**: 識別並處理潛在的詐欺、機器人行為或惡意攻擊。
- **監測指標**:  
  - 短時間內大量登入失敗。
  - 來自異常地理位置的登入。
  - 語音指令使用模式異常 (例如，固定間隔、重複指令)。
- **處理方式**: 觸發警報通知管理員，或自動暫時鎖定帳號。

---

### 4.4 雙重認證 (2FA) (針對開發者)

#### 4.4.1 開發者帳號強制 2FA

- **目的**: 強化開發者後台的安全性，防止未經授權的訪問。
- **實現**:  
  1.  開發者登入後台時，除了帳號密碼外，還需輸入透過 Authenticator App (如 Google Authenticator) 生成的動態驗證碼。
  2.  Supabase Auth 支援整合 2FA，需在後台配置。




================================================================================
第五章：開發者模式、後台管理與統計功能
================================================================================

本章詳細定義 CoolPlay 應用程式的開發者模式、後台管理系統及其統計功能。這些功能旨在為開發團隊提供強大的工具，以便進行系統監控、數據分析、使用者管理和除錯，確保應用程式的穩定運行和持續優化。本章整合了《（47）桌面（Web）開發者模式》和《(48)後台管理與開發者模式規格書》的內容。

---

## 5.1 後台管理系統總覽

後台管理系統是一個基於 Web 的介面，僅供授權的開發者和營運人員使用。它提供對應用程式核心數據和功能的管理權限。

### 5.1.1 主要功能模組

- **使用者管理**: 查看、編輯、凍結使用者帳號，調整會員等級和語音額度。
- **內容管理**: 管理書籤、資料夾、分類，監控異常 URL。
- **支付與訂閱管理**: 查看訂閱狀態、處理退款、管理優惠碼。
- **系統監控**: 實時監控伺服器狀態、API 性能、錯誤日誌。
- **數據分析與報表**: 提供多維度的統計數據和視覺化報表。
- **安全管理**: 監控異常登入、管理開發者金鑰、日誌審計。

### 5.1.2 權限管理

- **角色基於存取控制 (RBAC)**: 根據不同的角色（例如：管理員、營運、開發者），分配不同的後台功能權限。
- **開發者帳號**: 必須強制啟用雙重認證 (2FA)。

---

## 5.2 使用者管理

- **使用者列表**: 顯示所有註冊使用者，可按 Email、會員類型、註冊時間等篩選和排序。
- **使用者詳情**: 查看單個使用者的詳細資訊，包括：
  - 基本資料 (Email, 顯示名稱, 頭像)
  - 會員類型與到期日
  - 剩餘語音額度 (可手動調整)
  - 已綁定裝置列表 (可手動解除綁定)
  - 語音操作歷史記錄
  - 支付與訂閱記錄
- **帳號操作**: 凍結/解凍帳號、重設密碼、調整會員等級。

---

## 5.3 內容管理

- **書籤與資料夾**: 查看所有使用者的書籤和資料夾，可進行審核、刪除異常內容。
- **分類管理**: 查看和編輯所有自定義分類及其關鍵字。
- **異常 URL 監控**: 自動標記並列出被使用者多次回報或系統檢測為惡意/違規的 URL，提供審核和封鎖功能。

---

## 5.4 支付與訂閱管理

- **訂閱列表**: 顯示所有使用者的訂閱狀態、方案、到期日。
- **退款處理**: 透過 PayPal API 處理退款請求。
- **優惠碼管理**: 生成、啟用、禁用優惠碼，追蹤使用情況。

---

## 5.5 系統監控與日誌

- **實時監控**: 儀表板顯示應用程式的關鍵性能指標 (KPIs)，如活躍使用者數、API 請求量、錯誤率。
- **錯誤日誌**: 集中記錄前端和後端的所有錯誤，提供搜尋、篩選和警報功能。
- **操作日誌**: 記錄所有開發者在後台進行的操作，包括時間、操作者、操作內容、IP 位址。

---

## 5.6 桌面 (Web) 開發者模式

本節詳細說明 CoolPlay 應用程式的桌面 (Web) 開發者模式，旨在提供一個便捷的開發、測試與除錯環境，特別是針對語音控制與影片播放功能的快速迭代。此模式將允許開發者在桌面瀏覽器上模擬 App 行為，而無需頻繁部署到實體裝置。

### 5.6.1 模式概述

桌面開發者模式是一個特殊的 Web 介面，它模擬了 CoolPlay App 的核心功能，包括影片播放、語音控制介面、書籤管理等。它透過瀏覽器環境運行，並可與後端服務進行交互，方便開發者進行功能測試和除錯。

### 5.6.2 啟動方式

- **觸發入口**: 在 App 的「設定」頁面，連續點擊版本號 7 次，將彈出開發者登入模態框。
- **登入驗證**: 開發者需輸入預設的開發者帳號 (`tsait770@gmail.com`) 和密碼 (`680142`)。成功登入後，App 將導向一個特殊的 Web URL (例如 `https://web-dev.coolplay.com`)，並自動帶入開發者 JWT。

### 5.6.3 核心功能

- **模擬 App 介面**: 桌面版將呈現與原生 App 高度一致的 UI/UX，包括首頁、播放頁、書籤頁等。
- **語音控制測試**: 開發者可直接在桌面版上使用麥克風進行語音指令測試，模擬語音辨識和指令解析流程。
- **影片播放測試**: 可輸入各種 URL 進行播放測試，包括 WebView 和原生播放器模擬。
- **後端數據交互**: 桌面版將透過開發者 JWT 與 Supabase 後端進行數據交互，例如讀取/寫入書籤、語音指令記錄等。
- **除錯工具**: 瀏覽器內建的開發者工具 (Console, Network, Elements) 可用於實時監控和除錯。

```javascript
// 點擊版本號7次觸發事件
let clickCount = 0;
document.getElementById("version").addEventListener("click", () => {
  clickCount++;
  if (clickCount >= 7) {
    openDeveloperLoginModal();
    clickCount = 0;
  }
});
```

### 5.6.4 安全措施
- 僅限開發者帳號登入後可使用。  
- 觸發事件僅作用於 HTTPS 安全連線環境。  
- 登入與使用行為皆會記錄於 `web_dev_logs`。

---

### 5.6.5 結語

> 桌面版開發者模式旨在讓開發者能以與 App 一致的體驗快速除錯、測試與整合新模組。  
> 所有操作皆受安全控管，確保測試環境與正式環境的隔離性。

---

## 5.7 開發者模式統計功能規格

本節旨在為 **CoolPlay 影片語音控制應用程式** 規劃並定義其開發者模式下的統計功能。此規格書參考了《CoolPaly開發規格書_V4》中關於開發者模式的基礎框架，並深入整合了《(48)整合後的後台管理與開發者模式規格書》中詳細的數據分析需求。本文件的目標是提供一套全面、精確且可操作的統計指標與報表，以支援產品營運、性能監控及使用者行為分析，進而優化 CoolPlay 的使用者體驗與商業策略。所有統計功能將獨立於核心應用邏輯，確保不對現有 CoolPaly 開發規格造成修改。

### 5.7.1 統計功能總覽

開發者模式下的統計功能旨在提供多維度的數據洞察，涵蓋使用者行為、營運收入、系統性能及社交互動等方面。以下為主要統計模組及其核心指標：

| 模組分類 | 核心統計指標 |
| :--- | :--- |
| **營運收入統計** | 每日/每週/月度收益、成長率、收入來源分類、退款金額、收入趨勢圖表 |
| **會員與用戶統計** | 總用戶數、付費會員數、付費比例、留存率、會員等級分層與轉換率、用戶地理分佈 |
| **語音控制使用統計** | 語音指令總數、識別成功率、最常用指令、語言分佈、平均每位活躍使用者的日均指令數 |
| **影片播放分析** | WebView 播放次數 vs. 原生播放器播放次數、平均觀看時長、完播率、熱門類別、各來源影片播放成功率 |
| **系統性能分析** | App 載入時間、頁面載入速度、API 回應時間與錯誤率、語音辨識延遲時間、崩潰率 |
| **社交互動統計** | 分享次數、評論數量、推薦碼使用情況、分享行為分析、外部導流成效 |
| **內容偏好分析** | 用戶喜好標籤、觀看歷史模式、搜尋關鍵字統計 |
| **綜合洞察** | 語音控制 vs 觀看率、設備 vs 留存率、地理區域 vs 類別偏好、高價值會員行為模式 |

### 5.7.2 詳細統計功能規格

#### 5.7.2.1 營運收入統計

此模組提供全面的財務數據，以評估 CoolPlay 的商業表現與成長趨勢。

- **每日/每週/月度收益統計**: 追蹤不同時間維度下的總收入 (Gross Revenue)。
- **收入成長率**: 計算指定週期內的收入增長百分比。
- **收入來源分類**: 細分收入來源，例如訂閱、升級、單次購買、退款等，以了解各項業務貢獻。
- **退款金額**: 監控退款總額與退款率，分析潛在問題。
- **收入趨勢圖表**: 以折線圖形式視覺化月度淨收入趨勢。
- **數據匯出**: 支援將所有收入數據匯出為 CSV 或 Excel 格式，便於進一步分析。

#### 5.7.2.2 會員與用戶統計

此模組聚焦於使用者群體的規模、活躍度、付費行為及留存情況。

- **總用戶數**: 記錄應用程式的總註冊用戶數量。
- **付費會員數與付費比例**: 追蹤付費會員的數量及其佔總用戶的比例。
- **留存率**: 分析新用戶在不同時間點（例如 1 週、1 個月）的留存情況。
- **會員等級分層與轉換率**: 顯示不同會員等級（免費、基礎、進階）的分佈，並分析從免費到付費的轉換率。
- **用戶地理分佈**: 透過地圖或列表展示用戶的國家/城市分佈及時區分佈，有助於本地化策略。
- **最活躍時段分析**: 識別每日、每週、每月的用戶登入、播放與互動高峰時段。
- **新用戶留存漏斗**: 分析從註冊到首次觀看、二次使用、一週後留存、一個月後留存的用戶流失情況。
- **用戶生命周期價值 (LTV)**: 計算每個活躍會員平均帶來的收入。
- **流失預測指標**: 監測用戶活躍度下降（如最近 7 天使用次數下降率、觀看時長變化率）以預測潛在流失。

#### 5.7.2.3 語音控制使用統計

作為 CoolPlay 的核心功能，語音控制的使用數據至關重要。

- **語音指令總數**: 記錄所有用戶發出的語音指令總次數。
- **識別成功率**: 監測語音辨識的準確性，以評估其性能。
- **最常用指令**: 統計並列出使用頻率最高的語音指令 Top 10，例如「暫停」、「快轉 10 秒」等。
- **語言分佈**: 分析不同語言語音指令的使用比例，支援多國語言優化。
- **平均每位活躍使用者的日均指令數**: 衡量語音控制功能的用戶黏性。
- **語音辨識延遲時間**: 監控從語音輸入到指令執行之間的平均延遲時間。

#### 5.7.2.4 影片播放分析

此模組提供關於影片內容消費模式和播放性能的洞察。

- **WebView 播放次數 vs. 原生播放器播放次數**: 比較兩種播放方式的使用頻率，以評估其各自的適用場景和用戶偏好。
- **平均觀看時長 (Session Duration)**: 統計用戶單次觀看影片的平均時長。
- **完播率**: 衡量影片被完整觀看的比例。
- **熱門類別分析**: 根據用戶觀看、收藏行為，識別最受歡迎的影片內容類別。
- **各來源影片播放成功率**: 監測來自不同網站（如 YouTube, Vimeo, Twitch）的影片播放成功率，識別潛在的兼容性問題。
- **平均緩衝次數與時間**: 監控影片播放過程中的緩衝頻率和時長，評估播放流暢度。

#### 5.7.2.5 系統性能分析

此模組用於監控應用程式的穩定性、響應速度和錯誤情況。

- **App 載入時間**: 追蹤應用程式的啟動速度。
- **頁面載入速度**: 監測各頁面內容的載入時間。
- **API 回應時間與錯誤率**: 監控後端 API 的響應速度和錯誤發生率，識別性能瓶頸。
- **崩潰率**: 追蹤應用程式的崩潰頻率，確保穩定性。
- **錯誤代碼分佈**: 分析不同錯誤代碼的出現頻率，協助除錯。
- **網路品質分佈**: 統計用戶的平均網速、網路中斷比例及地區差異。

#### 5.7.2.6 社交互動統計

此模組量化 CoolPlay 在社交傳播和用戶互動方面的影響力。

- **分享次數**: 記錄用戶分享影片或應用程式的總次數。
- **評論數量**: 追蹤應用程式內或外部平台的評論數量。
- **推薦碼使用情況**: 監測推薦碼的生成、分發和兌換情況，評估推薦系統的有效性。
- **分享行為分析**: 分析分享平台分佈（LINE, IG, FB, X, Messenger 等）、分享來源（App 內按鈕/系統選單）及分享轉換率。
- **外部導流成效**: 追蹤分享連結的回流比例（App re-open / deep link）及外部流量來源。
- **用戶影響力指標**: 識別平均分享數、新用戶轉換率，並可建立「Top Sharer 排行榜」。

#### 5.7.2.7 內容偏好分析

此模組深入洞察用戶的觀看習慣與興趣，為個人化推薦提供數據基礎。

- **用戶喜好標籤**: 根據用戶的觀看、收藏、分享行為自動生成其內容偏好標籤。
- **觀看歷史模式**: 分析用戶的觀看時長、重播次數及連續觀看行為 (binge-watching)。
- **搜尋關鍵字統計**: 記錄熱門搜尋關鍵字、無結果搜尋比例及搜尋轉換率，以優化內容推薦和搜尋功能。

#### 5.7.2.8 綜合洞察與建議

此模組旨在提供跨維度的數據交叉分析，以支持更深層次的產品決策。

- **語音控制 vs 觀看率**: 比較語音播放與手動播放的平均觀看時長與完播率，評估語音控制對用戶參與度的影響。
- **設備 vs 留存率**: 分析不同設備類型（iOS/Android、平板/手機）對用戶留存率的影響。
- **地理區域 vs 類別偏好**: 探究不同城市或地區用戶的熱門影片類別與使用時段差異。
- **高價值會員行為模式**: 分析高付費或高活躍度會員的語音控制使用率、互動頻率等行為模式，以識別其特徵並制定精準的營銷策略。

---

### 5.7.3 數據導出與視覺呈現

所有統計數據應提供靈活的導出與視覺化選項，以便開發者和營運團隊進行深入分析。

- **數據導出**: 支援將所有統計報表數據導出為 CSV 或 Excel 格式。
- **自訂時間範圍篩選器**: 允許用戶選擇特定的時間範圍（例如日、週、月、季度、自訂日期範圍）來篩選和查看數據。
- **實時數據刷新**: 確保數據能夠實時或近實時刷新，提供最新的營運洞察。
- **圖表化視覺呈現**: 關鍵指標應以直觀的圖表形式（如折線圖、柱狀圖、圓餅圖）呈現，例如：
  - 月度淨收入趨勢折線圖。
  - 會員等級分佈圓餅圖。
  - 每日語音指令總量柱狀圖。
  - 播放方式佔比圓餅圖。

---

### 5.7.4 總結與邏輯架構建議

開發者模式下的統計功能應按照邏輯層級進行組織，以提供清晰且易於導航的介面。

| 層級 | 模組分類 | 說明 |
| :--- | :--- | :--- |
| **① 營運概覽** | 收入統計、會員與用戶統計 | 提供高層次的業務表現與用戶群體概況 |
| **② 核心功能分析** | 語音控制使用統計、影片播放分析 | 深入分析 CoolPlay 核心功能的表現與用戶互動 |
| **③ 性能與穩定性** | 系統性能分析 | 監控應用程式的技術健康狀況與用戶體驗質量 |
| **④ 用戶行為洞察** | 社交互動統計、內容偏好分析 | 揭示用戶的社交傳播行為與內容消費偏好 |
| **⑤ 綜合決策支持** | 綜合洞察與建議 | 提供跨模組的數據交叉分析，支持戰略決策 |




================================================================================
第六章：技術實現
================================================================================

本章將詳細闡述 CoolPlay 應用程式的技術實現細節，涵蓋前端、後端、資料庫與第三方服務的整合，確保開發團隊能高效、一致地進行開發工作。

---

## 6.1 前端實現 (React Native with Expo)

### 6.1.1 開發環境與工具

- **框架**: React Native (使用 Expo Managed Workflow)
- **語言**: TypeScript
- **狀態管理**: Zustand / React Context API
- **UI 庫**: React Native Paper / NativeBase (根據設計系統選定)
- **導航**: React Navigation
- **語音辨識**: Expo Speech / 平台原生 API (SFSpeechRecognizer for iOS, SpeechRecognizer for Android)
- **影片播放**: Expo Video / React Native WebView / react-native-video

### 6.1.2 模組化設計

應用程式應採用高度模組化的設計，將各功能區塊拆分為獨立的組件和服務，以提高可維護性和可擴展性。

- **組件 (Components)**: 可重用的 UI 元素，如按鈕、輸入框、播放器控制條。
- **畫面 (Screens)**: 應用程式的各個主要頁面，如首頁、設定頁、播放頁。
- **服務 (Services)**: 處理業務邏輯和數據交互，如 `AuthService`, `VideoService`, `VoiceControlService`。
- **工具 (Utils)**: 提供通用工具函數，如 `formatTime`, `urlValidator`。

### 6.1.3 語音控制前端邏輯

- **語音輸入觸發**: 點擊麥克風圖示後，調用 `Expo Speech.startSpeechRecognitionAsync()` 或平台原生 API。
- **指令解析**: 接收到文字結果後，使用本地的指令解析器（可基於正則表達式或簡單的關鍵字匹配）將文字轉換為預定義的動作 ID (例如 `pause`, `forward10`, `setVolume50`)。
- **播放器控制**: 根據動作 ID，向 `WebView` 注入 JavaScript 程式碼（例如 `webViewRef.current.injectJavaScript('document.querySelector("video").pause();')`）以控制播放器。
- **後端同步**: 非同步地向後端 API (`POST /rest/v1/voice_actions`) 發送語音操作記錄，扣除使用次數。

### 6.1.4 影片播放前端邏輯

- **URL 類型判斷**: 使用 `detectUrlType(url)` 函數判斷 URL 類型。
- **WebView 播放**: 若為 `webview` 類型，則使用 `WebView` 元件載入 URL。WebView 應配置為允許 JavaScript 執行，以便語音控制注入指令。
- **原生播放器播放**: 若為 `native_player` 類型，則使用 `Expo Video` 或 `react-native-video` 元件播放。需處理 DRM 內容（Widevine, FairPlay Streaming）。
- **錯誤處理**: 播放失敗時，顯示友善的錯誤訊息，並提供重試或回報選項。

### 6.1.5 裝置綁定前端邏輯

- **獲取裝置 ID**: 在應用啟動時，使用 `Expo Device.getDeviceUId()` 或平台原生 API 獲取唯一的裝置 ID。
- **登入時傳送**: 在 Google OAuth 登入成功後，將裝置 ID、OS 類型、版本等資訊隨同使用者憑證一併傳送至後端。
- **裝置管理介面**: 在設定頁面提供 UI，顯示綁定裝置列表，並允許使用者解除綁定。

---

## 6.2 後端實現 (Supabase)

### 6.2.1 Supabase 服務概覽

- **資料庫**: PostgreSQL (用於儲存使用者資料、書籤、裝置、訂閱狀態、開發者日誌等)
- **認證**: Supabase Auth (整合 Google OAuth)
- **邊緣函數**: Supabase Edge Functions (用於處理 PayPal Webhook、API Gateway 邏輯、推薦碼生成等)
- **儲存**: Supabase Storage (用於儲存用戶頭像、應用程式配置等)

### 6.2.2 資料庫 Schema 設計 (PostgreSQL)

#### 6.2.2.1 `users` 表

- `id` (UUID, PK): 使用者唯一 ID (由 Supabase Auth 自動生成)
- `email` (TEXT, UNIQUE): Google 帳號 Email
- `display_name` (TEXT): 使用者顯示名稱
- `avatar_url` (TEXT): 使用者頭像 URL
- `membership_type` (ENUM: 'free', 'basic', 'premium'): 會員類型
- `voice_credits` (INT): 剩餘語音指令次數
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.2 `devices` 表

- `id` (UUID, PK): 裝置記錄 ID
- `user_id` (UUID, FK -> users.id): 綁定使用者 ID
- `device_uid` (TEXT, UNIQUE): 裝置唯一識別碼
- `os_type` (TEXT): 作業系統 (iOS/Android/Web)
- `ip_address` (INET): 最後登入 IP 位址
- `last_login_at` (TIMESTAMP WITH TIME ZONE)
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.3 `reward_claims` 表

- `id` (UUID, PK)
- `device_uid` (TEXT, UNIQUE): 已領取首次登入獎勵的裝置 ID
- `claimed_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.4 `voice_actions` 表

- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `action_type` (TEXT): 語音指令類型 (e.g., 'pause', 'forward10')
- `source_url` (TEXT): 影片來源 URL
- `executed_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.5 `folders` 表

- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `name` (TEXT)
- `is_visible` (BOOLEAN)
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.6 `bookmarks` 表

- `id` (UUID, PK)
- `folder_id` (UUID, FK -> folders.id)
- `url` (TEXT)
- `title` (TEXT)
- `is_favorite` (BOOLEAN)
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.7 `categories` 表

- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `name` (TEXT)
- `keywords` (TEXT[]): 關鍵字陣列
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.8 `paypal_subscriptions` 表

- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `paypal_subscription_id` (TEXT, UNIQUE)
- `status` (TEXT): 訂閱狀態 (e.g., 'ACTIVE', 'CANCELLED')
- `plan_id` (TEXT): PayPal 方案 ID
- `start_date` (TIMESTAMP WITH TIME ZONE)
- `end_date` (TIMESTAMP WITH TIME ZONE, NULLABLE)
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.9 `developer_logs` 表

- `id` (UUID, PK)
- `developer_email` (TEXT)
- `login_time` (TIMESTAMP WITH TIME ZONE)
- `ip_address` (INET)
- `device_id` (TEXT)
- `action_module` (TEXT)
- `action_details` (JSONB)
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 6.2.2.10 `web_dev_logs` 表

- `id` (UUID, PK)
- `developer_email` (TEXT)
- `login_time` (TIMESTAMP WITH TIME ZONE)
- `ip_address` (INET)
- `action_details` (JSONB)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### 6.2.3 行級安全 (RLS) 策略

- **`users` 表**: 允許使用者讀取自己的資料，不允許修改 `membership_type` 和 `voice_credits` (由後端邏輯控制)。
- **`devices` 表**: 允許使用者讀取和管理（解除綁定）與自己 `user_id` 相關聯的裝置。
- **`reward_claims` 表**: 僅允許後端服務寫入和讀取。
- **`voice_actions` 表**: 允許使用者寫入自己的語音操作記錄，允許讀取自己的記錄。
- **`folders`, `bookmarks`, `categories` 表**: 允許使用者讀取、寫入、更新、刪除與自己 `user_id` 相關聯的資料。
- **`paypal_subscriptions` 表**: 僅允許後端服務寫入和更新，允許使用者讀取自己的訂閱狀態。
- **`developer_logs`, `web_dev_logs` 表**: 僅允許後端服務寫入，僅允許授權的開發者讀取。

### 6.2.4 觸發器 (Triggers) 與預存程序 (Stored Procedures)

- **`update_voice_credits` 觸發器**: 在 `voice_actions` 表插入新記錄時，自動扣除 `users` 表中的 `voice_credits`。若 `voice_credits` 不足，則阻止插入並返回錯誤。
- **`check_device_limit` 預存程序**: 在新裝置綁定時，檢查 `devices` 表中該使用者已綁定裝置數量是否超過 `membership_type` 允許的上限。




================================================================================
第七章：資料庫設計
================================================================================

本章詳細闡述 CoolPlay 應用程式的資料庫設計，主要基於 PostgreSQL，並利用 Supabase 提供的功能，包括資料表 Schema、行級安全 (RLS) 策略、觸發器 (Triggers) 和預存程序 (Stored Procedures)。

---

## 7.1 資料表 Schema (詳見 6.2.2)

請參閱 **6.2.2 資料庫 Schema 設計 (PostgreSQL)**，該節已詳細定義了所有資料表的結構。

---

## 7.2 行級安全 (RLS) 策略 (詳見 6.2.3)

請參閱 **6.2.3 行級安全 (RLS) 策略**，該節已詳細定義了所有資料表的 RLS 策略。

---

## 7.3 RLS 策略範例

以下為幾個關鍵資料表的 RLS 策略範例：

- **`users` 表**:
  - `Policy`: `Enable read access for all users.`
  - `USING`: `(true)`
  - `Policy`: `Allow authenticated users to update their own profile.`
  - `USING`: `(auth.uid() = id)`
  - `WITH CHECK`: `(auth.uid() = id)`
- **`devices` 表**:
  - `Policy`: `Enable full access for authenticated users to their own devices.`
  - `USING`: `(auth.uid() = user_id)`
  - `WITH CHECK`: `(auth.uid() = user_id)`
- **`reward_claims` 表**:
  - `Policy`: `Allow backend service to insert and read reward claims.`
  - `USING`: `(current_user_is_service_role())` (假設有 service_role 權限)
- **`voice_actions` 表**:
  - `Policy`: `Enable full access for authenticated users to their own voice actions.`
  - `USING`: `(auth.uid() = user_id)`
  - `WITH CHECK`: `(auth.uid() = user_id)`
- **`folders`, `bookmarks`, `categories` 表**:
  - `Policy`: `Enable full access for authenticated users to their own data.`
  - `USING`: `(auth.uid() = user_id)`
  - `WITH CHECK`: `(auth.uid() = user_id)`
- **`paypal_subscriptions` 表**:
  - `Policy`: `Allow backend service to insert and update subscriptions.`
  - `USING`: `(current_user_is_service_role())`
  - `Policy`: `Enable read access for authenticated users to their own subscriptions.`
  - `USING`: `(auth.uid() = user_id)`
- **`developer_logs`, `web_dev_logs` 表**:
  - `Policy`: `Allow backend service to insert logs.`
  - `USING`: `(current_user_is_service_role())`
  - `Policy`: `Enable read access for authorized developers.`
  - `USING`: `(auth.email() IN ('tsait770@gmail.com', 'another_dev@example.com'))` (需配置開發者 Email 列表)

---

## 7.4 觸發器 (Triggers) 與預存程序 (Stored Procedures)

### 7.4.1 `update_voice_credits` 觸發器

- **目的**: 在每次語音指令成功執行後，自動從使用者的 `voice_credits` 中扣除一次。
- **觸發時機**: `AFTER INSERT ON voice_actions`
- **觸發函數**:  
  ```sql
  CREATE OR REPLACE FUNCTION decrement_voice_credits()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE users
    SET voice_credits = voice_credits - 1
    WHERE id = NEW.user_id AND voice_credits > 0;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient voice credits or user not found.';
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER update_voice_credits
  AFTER INSERT ON voice_actions
  FOR EACH ROW EXECUTE FUNCTION decrement_voice_credits();
  ```

### 7.4.2 `check_device_limit` 預存程序

- **目的**: 在使用者嘗試綁定新裝置時，檢查是否超出其會員等級允許的裝置數量上限。
- **呼叫時機**: 由後端服務在處理新裝置登入時調用。
- **程序定義**:  
  ```sql
  CREATE OR REPLACE FUNCTION check_device_limit(p_user_id UUID, p_membership_type ENUM, OUT p_can_bind BOOLEAN)
  AS $$
  DECLARE
    current_device_count INTEGER;
    max_devices INTEGER;
  BEGIN
    SELECT COUNT(*) INTO current_device_count FROM devices WHERE user_id = p_user_id;

    CASE p_membership_type
      WHEN 'free' THEN max_devices := 1;
      WHEN 'basic' THEN max_devices := 3;
      WHEN 'premium' THEN max_devices := 5;
      ELSE max_devices := 0; -- 預設或錯誤情況
    END CASE;

    IF current_device_count < max_devices THEN
      p_can_bind := TRUE;
    ELSE
      p_can_bind := FALSE;
    END IF;
  END;
  $$ LANGUAGE plpgsql;
  ```

### 7.4.3 `handle_paypal_webhook` 邊緣函數 (Supabase Edge Function)

- **目的**: 接收 PayPal 的 Webhook 通知，自動更新使用者的訂閱狀態和語音額度。
- **實現方式**: 部署為 Supabase Edge Function，接收 PayPal 發送的 `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `PAYMENT.SALE.COMPLETED` 等事件。
- **邏輯概要**:  
  1. 驗證 Webhook 簽名以確保請求來源合法。
  2. 根據事件類型，更新 `paypal_subscriptions` 表中的訂閱狀態。
  3. 若為 `ACTIVATED` 事件，則更新 `users` 表的 `membership_type` 和 `voice_credits`。
  4. 若為 `CANCELLED` 事件，則將 `membership_type` 降級為 'free'，並調整 `voice_credits`。




================================================================================
第八章：API 規格
================================================================================

本章定義了 CoolPlay 應用程式後端服務的 RESTful API 規格，主要基於 Supabase 的 PostgREST 自動生成 API，並輔以 Edge Functions 處理複雜業務邏輯。所有 API 請求均需通過 Supabase Auth 進行身份驗證。

---

## 8.1 認證與授權

- **認證機制**: 使用 JWT (JSON Web Token)。使用者透過 Google OAuth 登入後，Supabase Auth 會返回一個 JWT。所有後續 API 請求都必須在 `Authorization` 頭部攜帶此 JWT (`Bearer <token>`)。
- **授權機制**: 透過 PostgreSQL 的行級安全 (RLS) 策略和 Supabase 的 Policy 進行細粒度控制，確保使用者只能訪問和修改其有權限的數據。

---

## 8.2 使用者相關 API

### 8.2.1 獲取使用者資訊

- **端點**: `GET /rest/v1/users?id=eq.{user_id}`
- **描述**: 獲取指定使用者的公開資訊，或當前登入使用者的資訊。
- **請求範例**:  
  ```http
  GET /rest/v1/users?id=eq.YOUR_USER_ID
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **回應範例**:  
  ```json
  [
    {
      "id": "YOUR_USER_ID",
      "email": "user@example.com",
      "display_name": "CoolPlay User",
      "avatar_url": "https://example.com/avatar.png",
      "membership_type": "basic",
      "voice_credits": 1200,
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
  ```

### 8.2.2 更新使用者資訊

- **端點**: `PATCH /rest/v1/users?id=eq.{user_id}`
- **描述**: 更新當前登入使用者的顯示名稱或頭像 URL。
- **請求範例**:  
  ```http
  PATCH /rest/v1/users?id=eq.YOUR_USER_ID
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "display_name": "New CoolPlay Name"
  }
  ```
- **回應**: `204 No Content` 或更新後的資源。

---

## 8.3 裝置管理 API

### 8.3.1 綁定新裝置

- **端點**: `POST /rest/v1/devices`
- **描述**: 記錄並綁定使用者的新裝置。後端會檢查裝置數量限制。
- **請求範例**:  
  ```http
  POST /rest/v1/devices
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "device_uid": "UNIQUE_DEVICE_ID_FROM_APP",
    "os_type": "Android",
    "ip_address": "192.168.1.1"
  }
  ```
- **回應範例**:  
  ```json
  {
    "id": "NEW_DEVICE_ID",
    "user_id": "YOUR_USER_ID",
    "device_uid": "UNIQUE_DEVICE_ID_FROM_APP",
    "os_type": "Android",
    "ip_address": "192.168.1.1",
    "last_login_at": "2025-10-13T15:30:00Z"
  }
  ```
  - 若超出裝置數量限制，應返回 `403 Forbidden` 或自定義錯誤訊息。

### 8.3.2 獲取已綁定裝置列表

- **端點**: `GET /rest/v1/devices?user_id=eq.{user_id}`
- **描述**: 獲取當前登入使用者所有已綁定的裝置列表。
- **請求範例**:  
  ```http
  GET /rest/v1/devices?user_id=eq.YOUR_USER_ID
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **回應範例**:  
  ```json
  [
    {
      "id": "DEVICE_ID_1",
      "device_uid": "UID_1",
      "os_type": "iOS",
      "last_login_at": "2025-10-10T10:00:00Z"
    },
    {
      "id": "DEVICE_ID_2",
      "device_uid": "UID_2",
      "os_type": "Web",
      "last_login_at": "2025-10-13T15:30:00Z"
    }
  ]
  ```

### 8.3.3 解除裝置綁定

- **端點**: `DELETE /rest/v1/devices?id=eq.{device_id}`
- **描述**: 解除指定裝置的綁定。使用者只能解除自己裝置的綁定。
- **請求範例**:  
  ```http
  DELETE /rest/v1/devices?id=eq.DEVICE_ID_TO_UNBIND
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **回應**: `204 No Content`。

---

## 8.4 語音控制 API

### 8.4.1 記錄語音操作

- **端點**: `POST /rest/v1/voice_actions`
- **描述**: 記錄使用者執行的語音指令，並扣除語音額度。
- **請求範例**:  
  ```http
  POST /rest/v1/voice_actions
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "action_type": "forward10",
    "source_url": "https://example.com/video-page"
  }
  ```
- **回應範例**:  
  ```json
  {
    "id": "NEW_ACTION_ID",
    "user_id": "YOUR_USER_ID",
    "action_type": "forward10",
    "source_url": "https://example.com/video-page",
    "executed_at": "2025-10-13T15:35:00Z"
  }
  ```
  - 若語音額度不足，應返回 `403 Forbidden` 或自定義錯誤訊息。

---

## 8.5 書籤與資料夾 API

### 8.5.1 創建資料夾

- **端點**: `POST /rest/v1/folders`
- **描述**: 為當前使用者創建一個新的資料夾。
- **請求範例**:  
  ```http
  POST /rest/v1/folders
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "name": "我的最愛影片",
    "is_visible": true
  }
  ```
- **回應範例**:  
  ```json
  {
    "id": "NEW_FOLDER_ID",
    "user_id": "YOUR_USER_ID",
    "name": "我的最愛影片",
    "is_visible": true,
    "created_at": "2025-10-13T15:40:00Z"
  }
  ```

### 8.5.2 獲取資料夾列表

- **端點**: `GET /rest/v1/folders?user_id=eq.{user_id}`
- **描述**: 獲取當前使用者所有資料夾列表。
- **請求範例**:  
  ```http
  GET /rest/v1/folders?user_id=eq.YOUR_USER_ID
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **回應範例**:  
  ```json
  [
    {
      "id": "FOLDER_ID_1",
      "name": "我的最愛影片",
      "is_visible": true
    },
    {
      "id": "FOLDER_ID_2",
      "name": "學習資料",
      "is_visible": false
    }
  ]
  ```

### 8.5.3 創建書籤

- **端點**: `POST /rest/v1/bookmarks`
- **描述**: 在指定資料夾下創建一個新的書籤。
- **請求範例**:  
  ```http
  POST /rest/v1/bookmarks
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "folder_id": "EXISTING_FOLDER_ID",
    "url": "https://www.youtube.com/watch?v=example",
    "title": "有趣的貓咪影片",
    "is_favorite": true
  }
  ```
- **回應範例**:  
  ```json
  {
    "id": "NEW_BOOKMARK_ID",
    "folder_id": "EXISTING_FOLDER_ID",
    "url": "https://www.youtube.com/watch?v=example",
    "title": "有趣的貓咪影片",
    "is_favorite": true,
    "created_at": "2025-10-13T15:45:00Z"
  }
  ```

### 8.5.4 獲取書籤列表 (按資料夾)

- **端點**: `GET /rest/v1/bookmarks?folder_id=eq.{folder_id}`
- **描述**: 獲取指定資料夾下的所有書籤。
- **請求範例**:  
  ```http
  GET /rest/v1/bookmarks?folder_id=eq.EXISTING_FOLDER_ID
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **回應範例**:  
  ```json
  [
    {
      "id": "BOOKMARK_ID_1",
      "url": "https://www.youtube.com/watch?v=example1",
      "title": "影片標題1",
      "is_favorite": true
    },
    {
      "id": "BOOKMARK_ID_2",
      "url": "https://vimeo.com/example2",
      "title": "影片標題2",
      "is_favorite": false
    }
  ]
  ```

---

## 8.6 支付與訂閱 API (透過 Edge Functions)

### 8.6.1 創建 PayPal 訂單

- **端點**: `POST /functions/v1/create-paypal-order`
- **描述**: 後端 Edge Function 處理創建 PayPal 訂單的邏輯，返回 `orderID` 給前端。
- **請求範例**:  
  ```http
  POST /functions/v1/create-paypal-order
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "plan_id": "BASIC_MONTHLY_PLAN_ID"
  }
  ```
- **回應範例**:  
  ```json
  {
    "orderID": "PAYPAL_ORDER_ID"
  }
  ```

### 8.6.2 捕獲 PayPal 訂單

- **端點**: `POST /functions/v1/capture-paypal-order`
- **描述**: 後端 Edge Function 處理捕獲 PayPal 訂單的邏輯，完成支付並更新使用者會員狀態。
- **請求範例**:  
  ```http
  POST /functions/v1/capture-paypal-order
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

  {
    "orderID": "PAYPAL_ORDER_ID"
  }
  ```
- **回應範例**:  
  ```json
  {
    "status": "COMPLETED",
    "membership_type": "basic",
    "voice_credits": 1500
  }
  ```

---

## 8.7 開發者模式 API (僅限授權開發者)

### 8.7.1 獲取系統監控數據

- **端點**: `GET /functions/v1/dev-monitor`
- **描述**: 獲取應用程式的實時運作狀態、伺服器健康度、API 延遲等數據。
- **請求範例**:  
  ```http
  GET /functions/v1/dev-monitor
  Authorization: Bearer DEVELOPER_JWT_TOKEN
  ```
- **回應範例**:  
  ```json
  {
    "app_status": "healthy",
    "server_load": "25%",
    "api_latency_ms": 50,
    "error_rate": "0.1%"
  }
  ```

### 8.7.2 獲取數據分析報表

- **端點**: `GET /functions/v1/dev-analytics?report_type=revenue`
- **描述**: 獲取各類數據分析報表，如營運收入、用戶統計等。
- **請求範例**:  
  ```http
  GET /functions/v1/dev-analytics?report_type=revenue&start_date=2025-09-01&end_date=2025-09-30
  Authorization: Bearer DEVELOPER_JWT_TOKEN
  ```
- **回應範例**:  
  ```json
  {
    "report_type": "revenue",
    "data": [
      {"date": "2025-09-01", "gross_revenue": 1500, "refunds": 50},
      // ... more data
    ]
  }
  ```

### 8.7.3 記錄開發者操作日誌

- **端點**: `POST /rest/v1/developer_logs`
- **描述**: 記錄開發者在後台進行的各項操作。
- **請求範例**:  
  ```http
  POST /rest/v1/developer_logs
  Authorization: Bearer DEVELOPER_JWT_TOKEN
  Content-Type: application/json

  {
    "developer_email": "tsait770@gmail.com",
    "ip_address": "10.0.0.1",
    "device_id": "DEV_DEVICE_ID",
    "action_module": "Security Management",
    "action_details": {"action": "block_user", "user_id": "BLOCKED_USER_ID"}
  }
  ```
- **回應**: `201 Created`。




================================================================================
第九章：UI/UX 設計
================================================================================

本章將闡述 CoolPlay 應用程式的 UI/UX 設計原則、設計系統、主要介面佈局以及互動回饋機制，旨在提供一致、直觀且高效的使用者體驗。

---

## 9.1 設計原則

- **簡潔直觀**: 介面設計應保持簡潔，減少不必要的元素，讓使用者能快速理解和操作。
- **語音優先**: 介面設計應輔助語音控制，而非與之競爭。語音指令應是主要互動方式，視覺介面提供輔助和確認。
- **一致性**: 在 iOS、Android 和 Web 平台之間保持視覺和互動的一致性，減少學習成本。
- **無障礙**: 考慮不同使用者的需求，提供足夠的對比度、可調整的字體大小和語音回饋。
- **美觀現代**: 採用現代化的設計風格，深色主題為主，搭配品牌色調，提供舒適的視覺體驗。

---

## 9.2 CoolPlay 設計系統

### 9.2.1 色彩規範

- **主色調**: 藍色系 (e.g., `#007AFF` for iOS, `#2196F3` for Android, 統一為 `#3498DB`)
- **輔助色**: 灰色系 (用於背景、文字、邊框)
- **警示色**: 紅色 (錯誤、危險操作)
- **成功色**: 綠色 (成功、完成)
- **背景色**: 深色主題 (e.g., `#121212`)
- **文字顏色**: 白色/淺灰色 (確保在深色背景下有足夠對比度)

### 9.2.2 字體規範

- **主要字體**: 系統預設字體 (San Francisco for iOS, Roboto for Android, Noto Sans CJK for Web)
- **字體大小**: 定義 H1-H6, Body, Caption 等不同層級的字體大小和行高。
- **字重**: Regular, Medium, Bold

### 9.2.3 圖標規範

- **圖標庫**: Material Icons / Font Awesome (或自定義 SVG 圖標)
- **風格**: 線性或填充，保持一致性。
- **尺寸**: 24x24px, 32x32px, 48x48px

---

## 9.3 主要介面佈局

### 9.3.1 首頁

- **頂部**: 搜尋欄、麥克風圖標 (語音控制入口)、使用者頭像 (個人中心入口)。
- **中部**: 最近播放列表、推薦書籤、資料夾快速入口。
- **底部**: 導航欄 (首頁、書籤、設定)。
- **統計數字**: 顯示「總資料夾數」和「可見資料夾數」。

### 9.3.2 影片播放頁

- **全屏播放器**: 優先佔據大部分螢幕空間，提供沉浸式體驗。
- **控制條**: 播放/暫停、進度條、音量控制、全屏切換、設定按鈕。
- **語音控制提示**: 輕微的動畫或圖標提示語音控制正在聆聽或已辨識指令。
- **URL 顯示**: 簡潔顯示當前播放影片的來源 URL。

### 9.3.3 書籤與資料夾管理頁

- **頂部**: 搜尋欄、新增資料夾/書籤按鈕、批次操作模式切換。
- **左側/頂部**: 資料夾列表 (可展開/收合)。
- **右側/中部**: 選定資料夾下的書籤列表 (可排序、篩選)。
- **批次操作**: 選擇多個書籤後，底部彈出操作欄 (刪除、移動、加入最愛)。

### 9.3.4 設定頁

- **帳號資訊**: 顯示使用者 Email、會員類型、剩餘語音額度。
- **裝置管理**: 列表顯示已綁定裝置，提供解除綁定功能。
- **語言設定**: 語音辨識語言、應用程式介面語言。
- **推薦碼**: 輸入推薦碼入口。
- **版本資訊**: 應用程式版本號 (觸發開發者模式入口)。
- **意見回饋/幫助中心**。

---

## 9.4 互動回饋

- **語音回饋**: 語音指令成功執行後，提供簡短的語音提示 (e.g., 「已暫停」)。
- **視覺回饋**: 按鈕點擊、列表選擇等操作應有明顯的視覺動畫或狀態變化。
- **觸覺回饋**: 關鍵操作可搭配輕微的震動回饋 (Haptic Feedback)。
- **載入狀態**: 數據載入時顯示載入指示器，避免介面卡頓。
- **錯誤提示**: 錯誤訊息應清晰、具體，並提供解決方案或引導。




================================================================================
第十章：多國語言支援
================================================================================

本章將詳細闡述 CoolPlay 應用程式的多國語言 (i18n) 支援策略，確保應用程式能夠在全球範圍內提供一致且本地化的使用者體驗。

---

## 10.1 設計原則

- **全面本地化**: 不僅限於介面文字，包括日期、時間、數字格式、貨幣符號等都應進行本地化。
- **動態切換**: 支援應用程式內動態切換語言，無需重啟應用。
- **語音與介面分離**: 語音辨識語言和應用程式介面語言可獨立設定。
- **可擴展性**: 採用易於管理和擴展的語言包結構，方便未來新增語言。

---

## 10.2 i18n 框架與實現

- **前端框架**: 推薦使用 `i18next` 或 `react-i18next` (針對 React Native)。
- **語言包格式**: 採用 JSON 格式儲存翻譯鍵值對，每個語言一個文件 (e.g., `en.json`, `zh-TW.json`, `es.json`)。
- **文件結構**:  
  ```
  locales/
  ├── en/
  │   └── translation.json
  ├── zh-TW/
  │   └── translation.json
  └── es/
      └── translation.json
  ```

### 10.2.1 `translation.json` 範例

```json
{
  "common": {
    "ok": "確定",
    "cancel": "取消",
    "save": "儲存",
    "delete": "刪除"
  },
  "home": {
    "welcome": "歡迎回來，{{name}}！",
    "total_folders": "總資料夾數：{{count}}",
    "visible_folders": "可見資料夾數：{{count}}"
  },
  "voice_control": {
    "listening": "正在聆聽...",
    "command_executed": "指令已執行",
    "insufficient_credits": "語音額度不足，請升級會員。"
  },
  "errors": {
    "network_error": "網路錯誤，請檢查您的連線。",
    "unknown_error": "發生未知錯誤，請稍後再試。"
  }
}
```

---

## 10.3 語音指令本地化

- **指令映射**: 語音指令的文字表達應針對不同語言進行本地化。例如，英文的 `"pause"` 對應中文的 `"暫停"`。這需要在 App 內部維護一個多語言指令映射表。
- **辨識器語言設定**: 應用程式應允許使用者選擇語音辨識器使用的語言，以確保最佳辨識效果。




================================================================================
第十一章：法律、合規與隱私
================================================================================

本章詳細闡述 CoolPlay 應用程式在法律、合規與隱私保護方面的策略，以確保應用程式在全球範圍內的合法運營，並建立使用者信任。所有原則均基於「中立技術載體」的核心定位。

---

## 11.1 著作權與內容責任

- **中立技術載體原則**: CoolPlay 嚴格遵守「中立技術載體」原則，不儲存、不快取、不轉發任何影片內容。所有影片內容均由使用者自行提供 URL，並在使用者裝置上直接從第三方來源播放。
- **免責聲明**: 應用程式內將包含明確的免責聲明，告知使用者：
  - CoolPlay 不對任何第三方內容的合法性、準確性、完整性負責。
  - 使用者應自行確保其觀看或分享的內容符合當地法律法規及著作權規定。
  - 若第三方內容涉及侵權，應直接向內容來源網站報告。
- **不提供非法內容入口**: 應用程式不內建、不推薦、不索引任何已知涉及非法內容（如盜版、色情、暴力）的網站或連結。

---

## 11.2 個人資料保護 (GDPR, CCPA 等)

- **最小化數據收集**: 僅收集應用程式運行和提供服務所必需的最小化個人資料，例如：
  - Google 帳號 Email (用於登入和識別使用者)
  - 裝置 ID (用於裝置綁定和防濫用)
  - 語音指令記錄 (用於計費和功能優化)
  - IP 位址 (用於安全監控)
- **數據加密**: 所有傳輸中的數據 (in transit) 和靜態數據 (at rest) 均採用行業標準加密技術保護。
- **使用者權利**: 支援使用者行使 GDPR 和 CCPA 等法規賦予的權利，包括：
  - **訪問權**: 允許使用者訪問其儲存在應用程式中的個人資料。
  - **更正權**: 允許使用者更正不準確的個人資料。
  - **刪除權 (被遺忘權)**: 允許使用者請求刪除其個人資料。
  - **數據可攜權**: 允許使用者以常用格式獲取其個人資料。
- **隱私政策**: 提供清晰、易懂的隱私政策，詳細說明數據收集、使用、儲存和保護方式，並在應用程式內和官方網站上公開。

---

## 11.3 成人內容處理原則

- **不主動篩選或審查**: 由於 CoolPlay 的中立技術載體定位，應用程式本身不對使用者輸入的 URL 進行主動的內容篩選或審查。
- **尊重來源網站驗證**: 若使用者輸入的 URL 導向的網站包含成人內容並設有年齡驗證機制，WebView 將完整顯示該驗證流程，App 不會也無法繞過。
- **使用者責任**: 再次強調使用者應遵守當地法律法規，並對其觀看內容負責。
- **舉報機制**: 提供使用者舉報機制，若發現應用程式被用於傳播非法內容，將會進行調查並採取適當行動 (例如封鎖惡意 URL 或使用者帳號)。

---

## 11.4 免責聲明範本

> **CoolPlay 免責聲明**
> 
> CoolPlay 應用程式（以下簡稱「本應用」）是一款中立的影音播放工具，旨在提供使用者透過語音指令控制影片播放的技術介面。本應用本身不提供、不內建、不推薦、不索引、不快取、不轉發任何影音內容。所有影片內容的來源均由使用者自行輸入 URL 連結，並在使用者裝置上直接從第三方網站進行播放。
> 
> **內容合法性與著作權**：本應用不對任何第三方網站所提供的內容之合法性、準確性、完整性、安全性或著作權歸屬負責。使用者應自行判斷並確保其觀看、分享或使用的任何內容均符合所有適用的當地法律法規、國際公約以及著作權所有者的權利。若您發現任何內容涉及侵權，請直接向該內容的原始來源網站報告。
> 
> **使用者行為責任**：使用者需對其在本應用中的所有行為負責，包括但不限於輸入的 URL 連結、語音指令的使用以及任何互動行為。本應用不承擔因使用者行為導致的任何法律責任。
> 
> **服務中斷與數據損失**：本應用將盡力確保服務的穩定性，但不保證服務永不中斷或完全無錯誤。對於因服務中斷、數據損失或任何技術故障所造成的損失，本應用概不負責。
> 
> **隱私政策**：本應用將嚴格遵守相關隱私法規，並依據我們的隱私政策收集和使用您的個人資料。請參閱我們的完整隱私政策以了解更多詳情。
> 
> 使用本應用即表示您已閱讀、理解並同意本免責聲明的所有條款。若您不同意，請勿使用本應用。




================================================================================
第十二章：測試與部署
================================================================================

本章將詳細闡述 CoolPlay 應用程式的測試策略、部署流程以及應用商店上架的相關要求，確保應用程式的品質、穩定性與順利發布。

---

## 12.1 測試策略

### 12.1.1 單元測試 (Unit Testing)

- **目的**: 驗證程式碼中最小可測試單元（函數、組件）的正確性。
- **工具**: Jest (React Native), React Testing Library。
- **覆蓋率目標**: 核心業務邏輯 (如指令解析器、URL 類型判斷函數) 應達到 80% 以上的程式碼覆蓋率。

### 12.1.2 整合測試 (Integration Testing)

- **目的**: 驗證不同模組或服務之間協同工作的正確性。
- **工具**: Detox (React Native E2E), Cypress (Web 開發者模式)。
- **測試場景**:  
  - 使用者登入與註冊流程。
  - 語音指令控制影片播放的端到端流程。
  - 書籤的增刪改查與資料夾管理。
  - 支付流程與會員狀態更新。
  - 裝置綁定與解除綁定。

### 12.1.3 性能測試 (Performance Testing)

- **目的**: 評估應用程式在不同負載下的響應速度、穩定性和資源消耗。
- **工具**: Artillery.io (API 負載測試), React Native Performance Monitor。
- **測試指標**:  
  - App 啟動時間。
  - 頁面載入時間。
  - API 響應時間。
  - 語音辨識延遲。
  - 記憶體和 CPU 使用率。

### 12.1.4 安全測試 (Security Testing)

- **目的**: 識別應用程式中的安全漏洞，如 SQL 注入、XSS、未經授權的數據訪問。
- **方法**:  
  - 程式碼審查 (Code Review)。
  - 滲透測試 (Penetration Testing)。
  - 漏洞掃描工具。
- **重點關注**: 認證、授權、數據加密、API 安全。

### 12.1.5 使用者驗收測試 (UAT)

- **目的**: 確保應用程式符合使用者需求和預期。
- **參與者**: 產品經理、部分目標使用者。
- **流程**: 根據預設的使用者場景和測試用例進行測試，收集回饋並修復問題。

---

## 12.2 部署流程

### 12.2.1 前端部署 (Expo EAS)

- **工具**: Expo Application Services (EAS)。
- **流程**:  
  1.  **程式碼提交**: 開發者將程式碼提交到版本控制系統 (如 Git)。
  2.  **EAS Build**: 使用 `eas build` 命令為 iOS 和 Android 平台構建原生應用程式二進制文件 (.ipa, .apk)。
  3.  **EAS Submit**: 使用 `eas submit` 命令將構建好的二進制文件自動提交到 Apple App Store Connect 和 Google Play Console。
  4.  **OTA 更新**: 利用 Expo 的 OTA (Over-the-Air) 更新功能，無需重新提交應用商店即可發布 JavaScript 程式碼更新。

### 12.2.2 後端部署 (Supabase)

- **工具**: Supabase CLI, Git。
- **流程**:  
  1.  **資料庫遷移**: 使用 Supabase CLI 管理資料庫 Schema 變更 (`supabase migration`)
  2.  **Edge Functions 部署**: 將 Edge Functions 程式碼部署到 Supabase (`supabase functions deploy`)
  3.  **RLS 策略配置**: 在 Supabase 後台或透過 SQL 腳本配置行級安全策略。

---

## 12.3 應用商店上架

### 12.3.1 Apple App Store

- **必要資料**:  
  - App 名稱、副標題、描述。
  - 應用程式圖標、預覽截圖。
  - 隱私政策 URL。
  - 支援 URL、行銷 URL。
  - 分級資訊、版權資訊。
  - **App Store Connect 帳號**。
- **審核注意事項**:  
  - 嚴格遵守 Apple 的 App Store 審核指南，特別是關於內容、隱私和使用者體驗的規定。
  - 明確說明 CoolPlay 的「中立技術載體」定位，避免被誤認為提供非法內容。
  - 確保所有功能正常運作，無崩潰或明顯 Bug。

### 12.3.2 Google Play Store

- **必要資料**:  
  - App 名稱、簡短描述、完整描述。
  - 應用程式圖標、功能圖形、螢幕截圖。
  - 隱私政策 URL。
  - 分級資訊、類別。
  - **Google Play Console 帳號**。
- **審核注意事項**:  
  - 遵守 Google Play 的開發者政策，特別是關於內容、廣告和使用者數據的規定。
  - 強調應用程式的「中立性」，避免內容違規。
  - 確保在各種 Android 裝置上都能良好運行。




================================================================================
第十三章：支付模組：PayPal 整合與管理
================================================================================

本章將詳細闡述 CoolPlay 應用程式中 PayPal 支付模組的整合與管理，涵蓋技術實現、測試、收款流程及上線注意事項，確保支付系統的安全、穩定與合規。

---

## 13.1 PayPal 技術整合

### 13.1.1 PayPal REST API (v2)

- **核心 API**: 使用 PayPal Checkout SDK 進行前端支付流程，後端則使用 PayPal REST API (v2) 處理訂單創建、捕獲和訂閱管理。
- **認證**: 透過 Client ID 和 Client Secret 獲取 Access Token 進行 API 呼叫。

### 13.1.2 支付流程 (前端與後端協同)

1.  **使用者選擇方案**: 使用者在 App 中選擇會員方案 (例如：基礎會員月付)。
2.  **前端請求後端創建訂單**: App 向後端 Edge Function (`/functions/v1/create-paypal-order`) 發送請求，包含所選方案 ID。
3.  **後端創建 PayPal 訂單**: Edge Function 調用 PayPal API 創建一個訂單，並將 `orderID` 返回給前端。
4.  **前端調用 PayPal Checkout SDK**: App 使用返回的 `orderID` 調用 `PayPalCheckout.render()`，彈出 PayPal 支付介面。
5.  **使用者完成支付**: 使用者在 PayPal 介面中完成支付。
6.  **前端請求後端捕獲訂單**: 支付成功後，前端將 `orderID` 傳送給後端 Edge Function (`/functions/v1/capture-paypal-order`)。
7.  **後端捕獲 PayPal 訂單**: Edge Function 調用 PayPal API 捕獲訂單，確認支付成功。
8.  **後端更新使用者狀態**: Edge Function 更新 Supabase 資料庫中該使用者的 `membership_type` 和 `voice_credits`。

### 13.1.3 PayPal Subscriptions API

- **訂閱計畫**: 在 PayPal 後台配置不同的訂閱計畫 (Plan ID)，例如月付、年付。
- **Webhook 監聽**: 配置 PayPal Webhook，監聽關鍵事件，如 `BILLING.SUBSCRIPTION.ACTIVATED` (訂閱啟用)、`BILLING.SUBSCRIPTION.CANCELLED` (訂閱取消)、`PAYMENT.SALE.COMPLETED` (定期付款成功)。
- **Webhook 處理**: Supabase Edge Function (`handle_paypal_webhook`) 接收並驗證 Webhook 通知，自動更新 `paypal_subscriptions` 表和 `users` 表中的會員狀態和語音額度。

---

## 13.2 測試與收款流程

### 13.2.1 Sandbox 環境測試

- **開發者帳號**: 在 PayPal Developer Dashboard 創建 Sandbox 帳號 (Business 和 Personal)，用於測試支付流程。
- **測試信用卡**: 使用 PayPal 提供的測試信用卡資訊進行支付模擬。
- **Webhook 測試**: 使用 ngrok 或其他工具將本地開發環境暴露給公網，接收 PayPal Sandbox 的 Webhook 通知進行測試。

### 13.2.2 收款流程

- **商業帳號**: 確保擁有一個已驗證的 PayPal 商業帳號。
- **提款**: 定期從 PayPal 帳戶提款至銀行帳戶。
- **報表**: 利用 PayPal 提供的交易報表進行財務對帳。

---

## 13.3 上線注意事項

- **API 憑證**: 將 Sandbox 憑證替換為 Live 憑證，並確保安全儲存 (例如使用環境變數或 Supabase Secrets)。
- **Webhook URL**: 將 PayPal Webhook URL 更新為生產環境的 Edge Function URL。
- **監控**: 實時監控支付系統的運行狀況，包括交易成功率、Webhook 接收情況和錯誤日誌。
- **客戶支援**: 準備好處理支付相關的客戶查詢和退款請求的流程。




================================================================================
第十四章：附錄
================================================================================

本章提供 CoolPlay 應用程式的補充資料，包括語音指令列表、支援的影片格式以及 URL 檢測邏輯的詳細說明。

---

## 14.1 語音指令列表 (附錄 A)

以下為 CoolPlay 應用程式支援的語音指令列表。這些指令旨在提供直觀且全面的影片控制能力。

| 指令類別 | 英文指令範例 | 中文指令範例 | 說明 |
| :--- | :--- | :--- | :--- |
| **播放控制** | `Play`, `Pause`, `Resume` | `播放`, `暫停`, `繼續` | 控制影片的播放狀態。 |
| **時間跳轉** | `Forward 10 seconds`, `Rewind 30 seconds`, `Go to 1 minute 20 seconds` | `快轉 10 秒`, `倒轉 30 秒`, `跳到 1 分 20 秒` | 精確控制影片播放進度。 |
| **音量控制** | `Volume up`, `Volume down`, `Set volume to 50`, `Mute`, `Unmute` | `調高音量`, `調低音量`, `音量設為 50`, `靜音`, `取消靜音` | 調整影片音量。 |
| **播放速度** | `Speed up`, `Slow down`, `Set speed to 1.5x`, `Normal speed` | `加快速度`, `減慢速度`, `速度設為 1.5 倍`, `正常速度` | 調整影片播放速度。 |
| **全屏模式** | `Full screen`, `Exit full screen` | `全螢幕`, `退出全螢幕` | 切換全螢幕顯示模式。 |
| **書籤管理** | `Add to favorites`, `Remove from favorites`, `Open folder [folder name]` | `加入最愛`, `從最愛移除`, `打開資料夾 [資料夾名稱]` | 管理影片書籤。 |
| **應用程式導航** | `Go home`, `Go to settings`, `Open bookmarks` | `回首頁`, `前往設定`, `打開書籤` | 導航至應用程式內不同頁面。 |
| **自定義指令** | `[User defined phrase]` | `[使用者自定義短語]` | 允許使用者設定特定短語觸發特定動作。 |

**註**: 實際支援的語言和指令可能因平台原生語音辨識服務的更新而有所調整。

---

## 14.2 支援的影片格式與串流協定

CoolPlay 應用程式透過 WebView 和原生播放器支援多種影片格式和串流協定。以下為主要支援類型：

### 14.2.1 WebView 支援

- **所有標準網頁內嵌影片**: 只要網頁瀏覽器能播放，WebView 就能播放。這包括但不限於：
  - YouTube, Vimeo, Twitch 等主流影音平台的內嵌播放器。
  - 任何使用 HTML5 `<video>` 標籤嵌入的影片。
- **串流協定**: HLS (HTTP Live Streaming), DASH (Dynamic Adaptive Streaming over HTTP) (透過網頁播放器支持)。

### 14.2.2 原生播放器支援

- **影片容器格式**: MP4, MKV, WebM, MOV, AVI (部分編解碼器可能需要額外支援)。
- **音訊編解碼器**: AAC, MP3, Vorbis, Opus。
- **影片編解碼器**: H.264, H.265 (HEVC), VP8, VP9。
- **串流協定**: HLS (.m3u8), DASH (.mpd), Progressive Download (直接的 MP4 連結)。
- **DRM**: Widevine (Android), FairPlay Streaming (iOS)。

---

## 14.3 URL 檢測邏輯 (詳見 3.2.2)

請參閱 **3.2.2 URL 處理邏輯**，該節已詳細定義了 `detectUrlType` 函數的實現細節。




================================================================================
第十五章：Expo 專案自動啟動與預覽
================================================================================

本章將說明如何使用 `CoolPlayPreview 自動化啟動包` 來快速啟動 Expo 專案並透過 QR Code 在手機上進行預覽，這對於開發和測試階段非常有用。

---

## 15.1 自動化啟動包說明

`CoolPlayPreview 自動化啟動包` 是一個為 macOS / Linux 環境設計的腳本，旨在簡化 Expo 專案的啟動流程，讓開發者能夠快速在手機上預覽應用程式。

### 15.1.1 使用說明

1.  **Step 1：解壓縮**  
    將整個 `CoolPlayPreview_AutoStart.zip` 解壓到 AI 代理可操作的資料夾中。
2.  **Step 2：讓 AI 代理執行**  
    ```bash
    bash start.sh
    ```
3.  **Step 3：等待啟動完成**  
    啟動完成後終端機會顯示：
    ```
    Tunnel ready.
    Scan the QR code below with Expo Go:
    ```
4.  **Step 4：手機預覽**  
    1.  打開 iPhone 上的 **Expo Go App**  
    2.  掃描 QR Code  
    3.  🎉 即可預覽你的 CoolPlayPreview App！




================================================================================
第十六章：EAS 自動上架模板
================================================================================

本章提供 `CoolPlayPreview EAS 上架模板` 的使用說明，幫助開發者自動化應用程式的構建和上架流程到 Apple App Store 和 Google Play Store。

---

## 16.1 EAS 上架模板說明

`CoolPlayPreview EAS 上架模板` 是一個用於 Expo Application Services (EAS) 的配置模板，旨在簡化應用程式的構建和提交過程。

### 16.1.1 使用說明

1.  將此模板放入你的專案資料夾。
2.  替換以下必要欄位:
    -   iOS: bundleIdentifier
    -   Android: package
    -   icons / splash / favicon 圖片
    -   隱私權政策 URL (privacyPolicyUrl)
    -   App Store / Play Store 上架描述與截圖
3.  安裝 Expo CLI & EAS CLI:
    ```bash
    npm install -g expo-cli eas-cli
    ```
4.  登入 Apple / Google 帳號:
    ```bash
    eas login
    ```
5.  構建 App:
    ```bash
    eas build -p ios
    eas build -p android
    ```
6.  上架後請在 App Store Connect / Google Play Console 補充截圖與 metadata。





================================================================================
第十五章：Expo 專案自動啟動與預覽
================================================================================

本章將說明如何使用 `CoolPlayPreview 自動化啟動包` 來快速啟動 Expo 專案並透過 QR Code 在手機上進行預覽，這對於開發和測試階段非常有用。

---

## 15.1 自動化啟動包說明

`CoolPlayPreview 自動化啟動包` 是一個為 macOS / Linux 環境設計的腳本，旨在簡化 Expo 專案的啟動流程，讓開發者能夠快速在手機上預覽應用程式。

### 15.1.1 使用說明

1.  **Step 1：解壓縮**  
    將整個 `CoolPlayPreview_AutoStart.zip` 解壓到 AI 代理可操作的資料夾中。
2.  **Step 2：讓 AI 代理執行**  
    ```bash
    bash start.sh
    ```
3.  **Step 3：等待啟動完成**  
    啟動完成後終端機會顯示：
    ```
    Tunnel ready.
    Scan the QR code below with Expo Go:
    ```
4.  **Step 4：手機預覽**  
    1.  打開 iPhone 上的 **Expo Go App**  
    2.  掃描 QR Code  
    3.  🎉 即可預覽你的 CoolPlayPreview App！





================================================================================
第十六章：EAS 自動上架模板
================================================================================

本章提供 `CoolPlayPreview EAS 上架模板` 的使用說明，幫助開發者自動化應用程式的構建和上架流程到 Apple App Store 和 Google Play Store。

---

## 16.1 EAS 上架模板說明

`CoolPlayPreview EAS 上架模板` 是一個用於 Expo Application Services (EAS) 的配置模板，旨在簡化應用程式的構建和提交過程。

### 16.1.1 使用說明

1.  將此模板放入你的專案資料夾。
2.  替換以下必要欄位:
    -   iOS: bundleIdentifier
    -   Android: package
    -   icons / splash / favicon 圖片
    -   隱私權政策 URL (privacyPolicyUrl)
    -   App Store / Play Store 上架描述與截圖
3.  安裝 Expo CLI & EAS CLI:
    ```bash
    npm install -g expo-cli eas-cli
    ```
4.  登入 Apple / Google 帳號:
    ```bash
    eas login
    ```
5.  構建 App:
    ```bash
    eas build -p ios
    eas build -p android
    ```
6.  上架後請在 App Store Connect / Google Play Console 補充截圖與 metadata。

