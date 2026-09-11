# 胸訴 — 胸腔科門診問診（wanfang-chest）

架構比照 `wanfang-aphasia`（語圖）：單一 `index.html`、無外部相依、資料只存本機、GitHub Pages 直接部署。

## 部署
1. 建 repo `wanfang-chest`，把本資料夾全部推上去。
2. Settings → Pages → Branch: `main` / root。
3. 網址：`https://maguro631023.github.io/wanfang-chest/`

## 檔案
| 檔案 | 用途 |
|---|---|
| `index.html` | 全部程式與題庫（第 1 段 `Q` 陣列就是問診題庫） |
| `manifest.json`、`sw.js` | 可加到主畫面、離線使用；改版時把 `sw.js` 的 `VERSION` 加一 |
| `assets/audio/nan/` | 台語預錄音檔（選用） |

## 改題目
只改 `index.html` 裡的 `Q` 陣列與 `GROUPS`（醫師補問清單），介面不用動。
每題的 `lq` 欄位對應 LQQOPERA，醫師摘要會自動算出哪個維度還沒問。

## 台語錄音命名
- 題目：`assets/audio/nan/{題目id}.mp3`，例如 `cough_dur.mp3`
- 選項：`assets/audio/nan/{題目id}__{選項值}.mp3`，例如 `cough_dur__lt2.mp3`
- 紅旗提醒：`assets/audio/nan/alert.mp3`
沒有錄音的會自動改用華語合成語音。

## 需要定期檢查的規則
- 結核病七分篩檢（疾管署）
- LDCT 公費肺癌篩檢資格（國健署，程式內為 2025/1/1 起條件）
兩者都寫在 `insights()` 函式裡，條件改版時修改該處。

研發測試中，非醫療器材。
