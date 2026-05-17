# KumustaHub DECISIONS

設計判断記録。重要な技術判断はこのファイルへ残す。

## 2026-05-10: 認証基盤は Supabase Auth を採用

決定事項:

- 独自認証ではなく Supabase Auth を使う。
- Google OAuth は KumustaHub が直接処理せず、Supabase Auth 経由で扱う。
- 管理者判定は `ADMIN_EMAILS` のallowlistで行う。

理由:

- MVP開発速度を優先する。
- Supabase PostgreSQL / RLS / Storage と統合しやすい。
- OAuth callback とセッション管理の実装負荷を下げる。

影響:

- Supabase Auth への依存が増える。
- Google/Facebook provider 設定は Supabase Dashboard と各OAuth provider側の両方で必要。

制約:

- 管理者ロールはDBロールではなく環境変数ベース。
- 将来的に複数管理者や権限差分が増える場合はDB role管理へ移行を検討する。

## 2026-05-10: DBアクセスは server-side Prisma を主経路にする

決定事項:

- 画面表示と投稿処理は Next.js server component / server action から Prisma でDBアクセスする。
- Vercel本番では Supabase Transaction pooler の `DATABASE_URL` を使う。
- migration/admin用途には `DIRECT_URL` を保持する。

理由:

- Next.js App Router と相性がよく、型安全に実装できる。
- Vercel serverless 環境でDB接続数を抑えやすい。
- Supabase client 直叩きよりアプリ側の権限制御をまとめやすい。

影響:

- Prisma経由のDBアクセスはRLSの主な保護対象ではない。
- RLSは将来のdirect Supabase client accessとStorage保護の意味が強い。

制約:

- server action 側の認証/認可チェックを必ず実装する。
- DB負荷が増えたらindex、pagination、cache方針を見直す。

## 2026-05-10: 店舗画像と口コミ画像は Supabase Storage に保存

決定事項:

- 店舗画像は `store-photos` bucket に保存し、メタデータは `store_photos` に保存する。
- 口コミ画像は `review-photos` bucket に保存し、メタデータは `review_photos` に保存する。
- 画像本体はDBに保存しない。

理由:

- DB容量を画像で圧迫しない。
- public URL を使って Next.js Image から表示しやすい。
- 店舗写真のprimary管理や口コミ写真の複数枚管理をDBで扱える。

影響:

- Storage容量とegressが運用上の主要ボトルネックになる。
- 画像の権利確認、圧縮、リサイズが正式リリース前の重要課題になる。

制約:

- 現状は最大5MB制限のみで、リサイズ/圧縮は未実装。
- 外部URL直書き画像は順次Storage管理へ移行する。

## 2026-05-17: プロジェクト管理ドキュメントは docs 配下の英名ファイルに統一

決定事項:

- プロジェクト管理ドキュメントは `docs/` 配下に配置する。
- 必須ファイルは `SPEC.md`, `TASKS.md`, `DECISIONS.md`, `CHANGELOG.md` とする。
- 補助ドキュメントは英名で追加する。

理由:

- `docs/RULES.md` のプロジェクト推進ルールに合わせる。
- Codexが作業前に参照すべきドキュメントを固定する。
- ファイル名の言語差による探索コストを下げる。

影響:

- 既存の日本語ファイル名は英名へ変更する。
- 今後の作業完了時は `TASKS.md` と `CHANGELOG.md` を更新する。

制約:

- 重要な判断はチャットだけに残さず `DECISIONS.md` へ記録する。
- 大きな仕様変更は `SPEC.md` も更新する。

## 2026-05-17: 店舗追加申請は admin 承認時に位置情報を補完する

決定事項:

- user の店舗追加申請は `store_requests` に保存する。
- 申請時は店舗名、住所、カテゴリ、都道府県、URL、補足だけを必須/任意入力として扱う。
- `stores` に必要な slug、緯度、経度、公開状態は admin 承認時に補完する。
- 却下時は `store_requests.status` と `rejection_reason` に記録する。

理由:

- 一般ユーザーに緯度経度入力を求めると申請ハードルが高い。
- 店舗公開前に運営が住所、重複、URL、カテゴリを確認する必要がある。
- `stores` の既存必須項目を崩さず、公開データの品質を保てる。

影響:

- 店舗申請から公開までは admin 作業が必須になる。
- 承認時の緯度経度入力ミスは地図表示に影響する。

制約:

- 現時点では申請写真のアップロードは未実装。
- 位置情報の自動ジオコーディングは未実装。

## 2026-05-17: 投稿abuse対策はDBイベントベースの user rate limit を先行する

決定事項:

- `rate_limit_events` に user id、action、quantity、created_at を記録する。
- server action の入口で直近ウィンドウ内の投稿量を集計し、上限超過時は保存やStorage uploadを行わない。
- 初期上限は以下とする。
  - 口コミ投稿: 5件 / 1時間
  - 口コミ写真アップロード: 12枚 / 1時間
  - 店舗追加申請: 3件 / 24時間
- Turnstile / reCAPTCHA は現時点では導入せず、連投やbotアクセスが実運用で確認されたら追加する。

理由:

- MVPではログイン必須投稿が中心のため、まず user単位の制限でDB/Storageの急増を抑える。
- CaptchaはUXと設定コストが増えるため、正式リリース前の最小対策としては後回しにする。
- DBイベント方式ならVercel serverless環境でも共有状態を持てる。

影響:

- 上限に達したユーザーは一定時間投稿できない。
- IP単位や匿名botの制御はまだ弱い。

制約:

- 厳密な同時実行制御ではないため、完全なスパム防止ではない。
- `rate_limit_events` は7日より古いイベントをserver action実行時に削除する。

## 2026-05-17: 店舗削除は物理削除ではなく archived 状態で扱う

決定事項:

- `stores.archived_at` を追加し、店舗の削除相当操作は archived 状態として扱う。
- archived 店舗は `is_published=false` にし、公開検索、店舗詳細、お気に入り一覧、投稿系操作から除外する。
- admin画面では archived 店舗も表示し、必要なら restore できる。

理由:

- 店舗に紐づく口コミ、通報、写真、お気に入りの参照を壊さない。
- 誤操作時に復旧できる。
- 法務・運用上、過去投稿の監査証跡を残しやすい。

影響:

- 公開側の店舗取得クエリでは `archived_at IS NULL` を必ず条件に含める。
- archive済み店舗は restore するまで publish できない。

制約:

- Storage内の写真本体はarchiveでは削除しない。
- 完全削除が必要な場合は、別途データ削除手順を設計する。

## 2026-05-18: Taxonomy削除は参照がない場合だけ許可する

決定事項:

- admin画面で `brands`, `categories`, `areas` を追加/編集/削除できるようにする。
- slugはtaxonomy種別ごとに一意とし、重複時は保存しない。
- 店舗、店舗追加申請、子カテゴリに参照されているtaxonomyは削除しない。
- `prefectures` は初期データ扱いとし、今回のCRUD対象外にする。

理由:

- 検索フィルタや店舗詳細URLにtaxonomy slugが使われるため、slug重複は公開導線を壊す。
- 参照中taxonomyを削除すると店舗登録、申請、検索フィルタの整合性が崩れる。
- 都道府県はMVPでは低頻度変更で、location追加時の親として選べれば十分。

影響:

- 都道府県単位location、カテゴリ、ブランドはコード変更なしで追加できる。
- 参照中taxonomyを消したい場合は、先に紐づく店舗や申請を移し替える必要がある。

制約:

- taxonomy自体のarchived状態は未実装。
- prefecture追加が必要になった場合は別途admin機能を追加する。

## 2026-05-18: 問い合わせはメール送信ではなくDB保存を先行する

決定事項:

- `/contact` から送信された問い合わせは `contacts` に保存する。
- 問い合わせ種別は `general`, `store_correction`, `deletion_request`, `moderation`, `partnership` とする。
- admin画面で問い合わせ一覧を表示し、`open / in_review / resolved / rejected` を更新できるようにする。
- メール送信はMVPでは導入せず、運用状況を見て必要になったら外部メールサービスを追加する。

理由:

- メール送信サービスの選定、送信ドメイン認証、到達率管理を後回しにできる。
- DB保存なら削除依頼、修正依頼、モデレーション相談の監査証跡を残せる。
- 既存admin運用と同じ画面で対応状況を管理できる。

影響:

- adminは定期的に問い合わせ一覧を確認する必要がある。
- ユーザーへの自動返信は現時点ではない。

制約:

- 返信は `mailto:` リンクなどを使った手動対応。
- 返信履歴や担当者メモは未実装。

## 2026-05-18: SEO base URL は環境変数で差し替え可能にする

決定事項:

- SEO用のbase URLは `NEXT_PUBLIC_SITE_URL` を優先し、未設定時は `https://kumusta-hub.vercel.app` を使う。
- `metadataBase`, canonical URL, sitemap, robots sitemap URL は同じbase URLから生成する。
- 店舗詳細には `LocalBusiness` または `Restaurant` のJSON-LDを出力し、口コミがある場合は `AggregateRating` を含める。
- OGP画像は当面、各店舗のprimary photoを使う。専用OGP画像制作は後続タスクに残す。

理由:

- 独自ドメイン確定前でも本番URLでSEO情報を破綻させない。
- 独自ドメイン移行時に環境変数だけでURLを切り替えられる。
- 店舗詳細ページは検索流入の中心になるため、構造化データを優先する。

影響:

- Vercel環境では `NEXT_PUBLIC_SITE_URL` を設定すればsitemap/robots/canonicalが差し替わる。
- OGP画像の品質は店舗写真の品質に依存する。

制約:

- 専用OGP画像は未実装。
- 外部URL画像の完全撤廃は初期データ/画像権利整理タスクで扱う。

## 2026-05-18: Location粒度は市区町村/駅単位ではなく都道府県単位にする

決定事項:

- 公開検索、店舗追加申請、admin店舗管理で選ぶlocationは都道府県単位にする。
- 既存DB互換性のため、テーブル名と内部型名は当面 `areas` / `Area` のまま維持する。
- 既存の細かいエリアレコードは都道府県レコードへ集約し、店舗と店舗追加申請の `area_id` を付け替える。
- URLは互換性を優先し、当面 `/areas/{slug}` を維持する。

理由:

- MVPの初期店舗数では Shinjuku / Ikebukuro などの細かい単位にすると検索結果が薄くなる。
- 都道府県単位の方が店舗追加時の運用判断が簡単で、ユーザーにも分かりやすい。
- 既存schemaを大きく壊さずに仕様変更できる。

影響:

- 旧 `ikebukuro`, `shinjuku-okubo`, `osaka-namba` などのエリアslugは使わなくなる。
- 検索フィルタ表示は `Tokyo`, `Kanagawa`, `Osaka` などの都道府県になる。
- 将来的に市区町村単位へ再拡張する場合は、別途location階層を設計する。

制約:

- 内部名に `area` が残るため、コード上の命名と画面仕様に一部差分がある。
- `/prefectures/{slug}` へのURL変更は未実施。
