# Chen Research website

[研究工作站](https://research.tarwick.com) · [GitHub](https://github.com/MarkJiang-maji/chen-research-site)

本專案是研究工作站的公開網站來源。頁面由 Cloudflare Workers Builds 建置；推送 `main` 後自動更新。密碼、登入 session、研究進度、上傳檔案與歷史版本沿用既有雲端後端，不在 Git 中，不會隨頁面部署重設。

## 雲端修改

在 GitHub 或 Codespaces 編輯：

- `website/src/app.js` / `style.css`：功能及設計。
- `website/data/content.json`：研究主線、課程、論文與文獻。
- `website/data/reports.json`：meeting 投影片與講稿。

提交並推送 `main`，Cloudflare 執行 `npm run build` → `npx wrangler deploy`。`/release.json` 顯示實際部署的 Git commit。電腦不必開機。

網頁的「登入編輯」仍即時存進原雲端後端，不會自動提交 GitHub。Git 內容與雲端編輯採三方合併，保留雲端新增報告、筆記與進度；同欄位衝突優先保留雲端內容。

## 驗證與建置

```sh
npm ci
npm test
npm run build
```

完整資料與實驗封存另存於原私人 `chen-liquidity-research` repo。這裡不包含密碼、API token、資料庫匯出或原始錄音／PDF大檔。研究說明的來源見網站文獻頁；原始作者權利不轉移。

部署設定與回復方式見 `website/DEPLOYMENT.md`。
