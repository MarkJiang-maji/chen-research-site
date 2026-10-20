# 網站內容與持續研究

- `src/app.js`、`src/style.css`：頁面與互動設計。
- `data/content.json`：首頁、8堂入門課、兩篇論文導讀與文獻。
- `data/reports.json`：逐頁meeting報告與講稿。
- `data/*-base.json`：首次接線時的共同基準，用來保留後續雲端編輯；不要任意重設。
- `src/content-merge.mjs`：GitHub內容與現有雲端編輯的三方合併；衝突時保留雲端較新修改。
- `src/worker.mjs`：提供網站，將資料、登入及檔案API轉到既有後端，不建立或清空資料庫。

Cloudflare原生Git建置已接上本repo的main。推送後自動執行`npm run build`（含測試與語法檢查）及`npx wrangler deploy`，更新research.tarwick.com；不依賴本機。GitHub App只授權這個repo。GitHub編輯與網站雲端編輯不同：前者觸發建置，後者即時保存進度。網站雲端編輯不會自行提交GitHub。網頁新增報告、講稿、原始檔及密碼均沿用原有雲端後端。GitHub與雲端同時改同一欄位時，先保留雲端內容；需要統一版本時再人工合併。

原始錄音、PDF與完整實驗封存仍在原私人研究repo與雲端檔案區；這個public repo只負責網站程式及已公開的研究說明。不要加入密碼、OAuth token、私鑰或資料庫匯出。
