# KumustaHub TASKS

更新日: 2026-05-18

このファイルを実装タスク管理の正とする。完了したタスクは `[x]` に更新し、実装中に発見した追加タスクは `Backlog` に追加する。

## 現在地

MVP は本番URLで動作しており、Supabase 本番DB、Googleログイン、口コミ投稿、口コミ写真、店舗写真、店舗追加申請、管理画面からの店舗追加、お気に入り保存、都道府県ベースの検索まで実装済み。

現状は **「本番DB接続済みのβ版」から「正式リリース可能な運用版」へ上げる段階**。

## 完了済み

| 領域 | 状態 | 補足 |
| --- | --- | --- |
| Vercel 本番デプロイ | 完了 | `https://kumusta-hub.vercel.app` |
| GitHub 連携 / push運用 | 完了 | `main` へ反映済み |
| Supabase 本番DB接続 | 完了 | Prisma + Transaction pooler |
| Prisma migration | 完了 | 初期schema、store photos、RLS |
| Supabase RLS / Storage policy | 完了 | baseline policy 適用済み |
| Google OAuth | 完了 | Supabase Auth 経由 |
| admin allowlist | 完了 | `ADMIN_EMAILS` |
| DBデータ取得 | 完了 | 検索、店舗詳細、カテゴリ、都道府県、ブランド |
| 口コミ投稿 | 完了 | ログイン必須、評価、本文、集計更新 |
| 口コミ写真投稿 | 完了 | 最大3枚、Storage保存 |
| お気に入り | 完了 | 保存/解除、`/mypage/favorites` DB化 |
| 店舗写真管理 | 完了 | admin upload、primary photo |
| 店舗追加 | 完了 | user申請、admin承認/却下、admin Add/Edit/Archive Store + 写真管理、都道府県管理は実装済み |
| Location命名整理 | 完了 | アプリ層はLocation、DB/URLは互換性維持 |
| 通報 | 部分完了 | user通報、重複防止、admin status変更を実装済み |
| 口コミモデレーション | 部分完了 | admin一覧、非表示/再表示、評価再集計を実装済み |
| 容量試算 | 完了 | `docs/CAPACITY.md` |
| 認証フロー整理 | 完了 | `docs/AUTH_FLOW.md` |

## 未完了の大きな論点

正式リリース前に残っている重要領域は以下。

1. 店舗追加申請フロー
2. 管理画面の実運用化
3. 初期データ拡充と画像権利整理
4. 法務文面と問い合わせ送信
5. abuse対策 / rate limit
6. SEO / OGP / 本番ドメイン整理
7. CI / E2E / 監視
8. 画像最適化
9. 地図UI

## 推奨実施順

### Phase 1: 公開前に必須の安全対策

優先度: P0

目的: 投稿型サービスとして最低限安全に公開できる状態にする。

#### 1. 通報機能

状態: 部分完了

実装タスク:

- [x] 店舗詳細の `Report` ボタンを実動作化
- [x] 通報理由を選択式にする
- [x] `reports` にDB保存
- [x] 未ログイン時はログインへ誘導
- [x] 同一ユーザーによる連続通報を制限
- [x] admin画面で通報一覧をDB表示
- [x] adminが `open / in_review / resolved / rejected` を変更可能にする
- [x] adminが通報対象レビューをその場で非表示化できる
- [x] 通報件数が多いレビューを優先表示する

完了条件:

- [x] user が口コミを通報できる
- [x] admin が通報内容を確認し、対応ステータスを変更できる

#### 2. 口コミモデレーション

状態: 部分完了

実装タスク:

- [x] admin画面に口コミ一覧を追加
- [x] `is_hidden` の切り替え
- [x] 店舗平均評価と `review_count` の再集計
- [x] 非表示口コミが公開画面に出ないことを確認
- [x] 通報一覧から対象レビューを非表示/再表示できる
- [ ] 口コミ削除
- [x] 削除方針を決める
- [x] 通報ステータスと非表示操作の連動方針を決める

完了条件:

- [x] 問題口コミをadminが非表示または再表示できる
- [x] 非表示/再表示後に評価集計が破綻しない

#### 3. 投稿・画像アップロードの abuse 対策

状態: 基本的な user単位 rate limit は完了。Captchaと画像UX改善は継続課題。

実装タスク:

- [x] 口コミ投稿の user単位 rate limit
- [x] 口コミ写真アップロードの user単位 rate limit
- [x] 店舗追加申請の user単位 rate limit
- [x] Turnstile または reCAPTCHA 導入方針決定
- [x] 画像アップロードサイズのUX改善

完了条件:

- [x] botや連投でDB/Storageが簡単に膨らまない
- [x] 投稿失敗時のエラーメッセージがユーザーに分かる

### Phase 2: 運営フローの完成

優先度: P0-P1

目的: コード変更なしで店舗DBとユーザー投稿を運用できる状態にする。

#### 4. 店舗追加申請

状態: 写真申請以外は完了。

実装タスク:

- [x] 店舗追加申請テーブルを追加
- [x] `/store-request` のフォームを server action 化
- [x] 申請内容をDB保存
- [x] 申請者 user id を保存
- [x] admin画面に申請一覧を追加
- [x] adminが承認/却下できるようにする
- [x] 承認時に `stores` へ反映
- [ ] 必要なら申請写真もStorageへ保存

完了条件:

- [x] user が店舗追加申請できる
- [x] admin が申請を承認し、公開/非公開店舗として登録できる

#### 5. 店舗管理CRUD

状態: 完了。物理削除ではなく archived 状態で運用する。

実装タスク:

- [x] 店舗編集画面または編集フォーム
- [x] 店舗の公開/非公開切り替え
- [x] 店舗基本情報の更新
- [x] primary photo の変更
- [x] 店舗写真の削除
- [x] 店舗削除または archived 状態の設計

完了条件:

- [x] 運営が店舗登録から修正、公開停止まで管理画面で完結できる

#### 6. taxonomy 管理

状態: 完了。

実装タスク:

- [x] ブランドCRUD
- [x] カテゴリCRUD
- [x] 都道府県単位のlocation CRUD
- [x] slug重複チェック
- [x] 公開中店舗が紐づくtaxonomyの削除制御

完了条件:

- [x] 新しい都道府県単位location、カテゴリ、ブランドをコード変更なしで追加できる

### Phase 3: リリース品質

優先度: P0-P1

目的: 公開時の信頼性、検索流入、法務リスクを整える。

#### 7. 法務・問い合わせ

状態: 基本完了。運営者情報の公開範囲は正式リリース前に最終確認する。

実装タスク:

- [x] 利用規約を正式文面へ更新
- [x] プライバシーポリシーを正式文面へ更新
- [x] 削除依頼窓口を明記
- [x] 問い合わせフォームの送信処理を実装
- [x] 送信先メールまたはDB保存方式を決定
- [x] 運営者情報の公開範囲を決定

完了条件:

- [x] 問い合わせ、削除依頼、通報から運営対応までの導線が成立する
- [x] 法務ページがMVP仮文面ではない

#### 8. SEO / OGP

状態: 基本完了。OGP専用画像制作と外部URL画像の完全撤廃は継続課題。

実装タスク:

- [x] sitemap / robots の base URL を正式ドメインへ固定
- [x] canonical URL 追加
- [x] OGP画像方針を決定
- [x] 店舗詳細の JSON-LD
  - `LocalBusiness`
  - `Restaurant`
  - `AggregateRating`
- [x] エリア/カテゴリ/ブランドページの説明文改善
- [x] 外部URL画像の撤廃方針を反映

完了条件:

- [x] 主要ページの title/meta/OGP/canonical が本番値
- [x] sitemap が正式URLで生成される

#### 9. 初期データ投入

状態: seed は4店舗。正式リリースには不足。

実装タスク:

- [x] 重点都道府県ごとの最低登録件数を決める
  - Tokyo: 最低5件、正式リリース目標10件
  - Kanagawa: 最低5件、正式リリース目標8件
  - Osaka: 最低5件、正式リリース目標7件
- [ ] 各重点都道府県5件以上、合計15件以上を登録
- [ ] 住所、座標、営業時間、電話、URLを確認
- [ ] 店舗写真の利用権利を確認
- [ ] 外部URL直書き画像をSupabase Storage管理へ移行
- [x] 初期口コミを運営が捏造しない方針を明文化

完了条件:

- [ ] 合計25件以上の公開店舗がある
- [ ] 権利上問題のない画像だけを使用
- [ ] 住所と地図座標が一致

#### 10. 画像最適化

状態: 最大5MB制限のみ。リサイズ/圧縮なし。

実装タスク:

- [x] アップロード前リサイズ方針を決める
- [x] 1200px程度の表示用画像を生成
- [ ] サムネイル画像を生成
- [x] WebP/AVIF 変換を検討
- [x] 既存画像の棚卸し
- [x] Storage容量とegress監視

完了条件:

- [ ] 投稿写真でStorage/egressが急増しにくい
- [ ] 店舗一覧と詳細のLCPが悪化しにくい

### Phase 4: 品質保証・監視

優先度: P0-P1

目的: 本番運用で壊れた時に検知・復旧できる状態にする。

#### 11. CI

状態: GitHub Actions で `lint / typecheck / build` は定義済み。PR必須チェック設定はGitHub repository settingsでの手動作業。

実装タスク:

- [x] GitHub Actions で `npm run lint`
- [x] GitHub Actions で `npm run typecheck`
- [x] GitHub Actions で `npm run build`
- [ ] PR必須チェック設定

完了条件:

- [ ] main へ壊れたコードが入りにくい

#### 12. E2E / 手動QA

状態: 未着手

実装タスク:

- [ ] Playwright 導入
- [ ] 検索
- [ ] 店舗詳細閲覧
- [ ] ログイン必須導線
- [ ] 口コミ投稿
- [ ] お気に入り保存/解除
- [ ] 店舗追加
- [ ] adminアクセス制御
- [ ] モバイル表示確認

完了条件:

- [ ] 主要導線がリリース前に再現性を持って確認できる

#### 13. 監視・分析

状態: 未着手

実装タスク:

- [ ] Vercel Analytics
- [ ] Google Search Console
- [ ] GA4 または代替アクセス解析
- [ ] エラー監視
- [x] Supabase usage / DB metrics の確認手順
- [x] 容量試算に基づく警戒ライン設定
- [x] 管理者追加/削除手順

完了条件:

- [ ] 障害、エラー、利用量増加を運営が把握できる

#### 14. 性能改善

状態: 体感として遅さを感じるが、喫緊ではないため後回し。2026-05-23 時点の原因候補と改善順を記録済み。

原因候補:

- Vercel Functions の cold start
- Supabase Free plan の Nano compute（shared CPU、最大0.5GB memory）によるDB応答のばらつき
- Vercel実行リージョンとSupabase DBリージョンの距離
- 公開ページでもリクエストごとに Prisma でDB取得している
- 店舗詳細で `generateMetadata()` とページ本体が店舗データを重複取得しやすい
- 一覧ページでカード表示に不要な reviews/photos を含めて取得している
- 外部URL/Supabase Storage画像の読み込みと最適化

実装タスク:

- [ ] Vercel Observability で cold start、function duration、外部API/DB latency を確認
- [ ] Supabase Dashboard で CPU、Disk IO、DB query performance、connection pooler を確認
- [ ] Vercel function region と Supabase DB region を揃える
- [ ] トップ、カテゴリ、ブランド、都道府県、店舗詳細を ISR 化する
- [x] 一覧用の軽量 Store query / StoreCard DTO を作る
- [x] 店舗詳細の metadata と本文での店舗取得重複を減らす
- [ ] 検索 query の `contains` 多用を見直し、必要なら全文検索/indexを整備する
- [ ] 画像のサイズ最適化、Storage移行、LCP改善を画像最適化タスクと連動して進める
- [ ] それでも遅い場合は Supabase Pro/Micro 以上への移行を検討する

完了条件:

- [ ] 主要公開ページの初回表示と再訪表示のボトルネックを説明できる
- [ ] トップ、検索、店舗詳細の体感速度が正式リリースに耐える

### Phase 5: 体験改善

優先度: P1-P2

目的: リリース後の使いやすさと検索体験を上げる。

#### 15. 地図UI

状態: 外部OpenStreetMapリンクのみ。Leaflet採用方針とOSM tile利用時の注意点は整理済み。

実装タスク:

- [x] Leaflet 採用可否を決める
- [x] 検索結果に marker 表示
- [x] 店舗詳細に地図表示
- [x] モバイルで一覧/地図切替
- [x] OSM tile 利用ポリシー確認

完了条件:

- [x] 店舗位置をアプリ内で把握できる

#### 16. 多言語

状態: 既存URLを維持し、cookie / `?lang=ja|en` で公開主要導線の日本語/英語UI切替が可能。admin、法務ページ、詳細なフォームエラーの全文辞書化は後続。

実装タスク:

- [x] i18n方式を決める
- [x] UI文言の辞書化
- [x] 日本語/英語切替
- [x] 口コミ本文は翻訳しない方針を整理

完了条件:

- [x] 最低限の日本語/英語UI切替ができる

## 次に着手すべきタスク

現在の進捗から見ると、次は **初期データ拡充と本番外部サービス設定** が最優先。

理由:

- 店舗追加申請、admin承認/却下、店舗編集、問い合わせ、法務ページは実装済み
- seed は4店舗で、正式リリース最低ラインの各重点都道府県5件以上に届いていない
- 本番公開画像の権利確認とStorage移行が残っている
- Search Console、エラー監視、PR必須チェックなど外部サービス設定はローカル実装だけでは完了できない

推奨実装順:

1. Tokyo / Kanagawa / Osaka の初期公開店舗候補を調査
2. 住所、座標、営業時間、電話、URLを確認
3. 権利確認済み店舗写真を用意し、Supabase Storageへ登録
4. admin画面から店舗を追加し、primary photoを設定
5. Search Console、エラー監視、Vercel Analytics / GA4相当を設定
6. GitHub repository settingsでPR必須チェックを設定

## 正式リリース判定チェックリスト

- [x] Production URL が稼働している
- [x] Supabase 本番DBに接続している
- [x] Google OAuth が動作している
- [x] admin 以外が管理画面に入れない
- [x] Supabase RLS が有効
- [x] 口コミ投稿が成功する
- [x] 口コミ写真投稿が最大3枚に制限されている
- [x] お気に入り保存/解除が成功する
- [x] admin が店舗と店舗写真を追加できる
- [ ] Facebook OAuth が本番URLで成功する
- [x] 通報が作成できる
- [x] admin が通報ステータスを変更できる
- [x] admin が口コミを非表示/再表示できる
- [x] admin が口コミを非表示/削除相当対応できる
- [x] 店舗追加申請がDB保存される
- [x] admin が申請を承認/却下できる
- [x] admin が店舗を編集/非公開化できる
- [x] 問い合わせが運営に届く
- [x] 利用規約が正式文面
- [x] プライバシーポリシーが正式文面
- [x] sitemap と robots が正式ドメインを指している
- [ ] Search Console 設定済み
- [ ] エラー監視設定済み
- [ ] 画像最適化済み
- [ ] スマホ表示確認済み
- [ ] 主要導線E2Eテスト成功
