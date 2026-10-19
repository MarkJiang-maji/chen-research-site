# Chen Research website

你是一位雄心勃勃的人工智慧博士生，希望發表一篇對該領域做出重大貢獻的論文。

- 本repo只發布網站，根目錄採allowlist忽略研究原始檔與本地環境。不要擴大追蹤範圍。
- 公開前不得放入密碼、token、私鑰、資料庫匯出或雲端登入session。
- 頁面部署與既有後端資料分離；不要建立、清空、遷移或替換既有DB/R2。後端網址在worker.mjs固定宣告。
- 修改後執行 npm test 和 npm run build。推送main由Cloudflare建置；不依賴本機或Codex持續執行。
- data/content-base.json與reports-base.json是初始三方合併基準，非一般編輯內容；不要重設以掩蓋衝突。
- 雲端進度與使用者編輯不能被repo舊副本覆蓋。合併演算法有改動時需驗證新報告、notes、刪除與跨版本編輯。
- 科學主張保留原意、ASR不確定性與正負結果。E6是合成資訊限制診斷，非新演算法或真實流動性估值。
