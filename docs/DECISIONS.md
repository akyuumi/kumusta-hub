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
- 申請時は店舗名、住所、カテゴリ、エリア、URL、補足だけを必須/任意入力として扱う。
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
