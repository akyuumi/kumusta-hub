# KumustaHub CHANGELOG

人間が読める変更履歴。Git履歴を補完する。

## 2026-05-17

### Added

- admin画面で店舗基本情報を編集できるようにした。
- admin画面で店舗の公開/非公開を切り替えられるようにした。
- admin画面で店舗写真のprimary切替と削除をできるようにした。
- 店舗追加申請をDB保存する `store_requests` テーブルを追加。
- `/store-request` の申請フォームを server action 化。
- admin画面に店舗追加申請一覧、承認、却下を追加。
- 店舗追加申請の承認時に `stores` へ店舗を作成できるようにした。
- user単位の rate limit を口コミ投稿、口コミ写真アップロード、店舗追加申請へ追加。
- rate limit 到達時のユーザー向けエラーメッセージを追加。
- rate limit の実現方式を `docs/RATE_LIMIT.md` に整理。
- admin画面に口コミモデレーション機能を追加。
- adminが口コミを非表示/再表示できるようにした。
- 非表示/再表示時に店舗の平均評価とレビュー数を再集計するようにした。
- プロジェクト推進ルールに合わせて `docs/` 配下のドキュメント構成を整備。
- `docs/DECISIONS.md` を追加。

### Changed

- 既存ドキュメントを英名ファイルへリネーム。
- 残タスク管理の正を `docs/TASKS.md` に変更。

## 2026-05-16

### Added

- レビュー通報フローを追加。
- 同一ユーザーの同一レビュー重複通報をDB制約で防止。
- admin画面で通報一覧表示とstatus更新を実装。
- インフラ容量試算を追加。

### Changed

- 正式リリース残タスクを現状に合わせて整理。

## 2026-05-13

### Fixed

- `Bayanihan Kitchen Namba` の壊れていた画像URLを修正。

## 2026-05-12

### Added

- お気に入り保存/解除を実装。
- `/mypage/favorites` をDB化。

## 2026-05-11

### Added

- adminのAdd Storeでメイン写真を同時登録できるようにした。

## 2026-05-10

### Added

- Supabase RLS / Storage policy を追加。
- 口コミ写真アップロードを追加。
- adminの店舗写真アップロードを追加。
- 店舗画像を `store_photos` 管理へ移行。
- 認証フローのドキュメントを追加。

## 2026-05-09

### Added

- Supabase OAuth認証を追加。
- Supabase DBデータ取得層を追加。
- 認証済みユーザーの口コミ投稿を追加。
- MVP初期実装を追加。
