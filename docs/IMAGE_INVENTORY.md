# KumustaHub IMAGE INVENTORY

更新日: 2026-05-23

画像の権利確認、Storage移行、LCP改善のための棚卸しメモ。正式リリース前に、本番公開店舗の画像は Supabase Storage 管理へ寄せる。

## 方針

- 本番公開店舗の主画像と店舗写真は、権利確認済み画像を `store-photos` bucket に保存する。
- OGP画像は店舗の primary photo を使うため、primary photo もStorage管理済み画像にする。
- Unsplashなどの外部URL直書き画像は、ローカルseed、fallback data、正式画像が未登録の暫定表示に限定する。
- Storage移行完了後、`next.config.mjs` の `images.unsplash.com` remote pattern と fallback URL を削除する。

## 現在の外部URL

| 場所 | 用途 | 状態 | 対応 |
| --- | --- | --- | --- |
| `prisma/seed.mjs` | seed店舗の `primaryPhotoUrl` 4件 | Unsplash直書き | 権利確認済み画像をStorageへアップロードし、seed URLを置き換える |
| `lib/data.ts` | DB未接続時のfallback店舗画像 4件 | Unsplash直書き | Storage移行後、fallbackもStorage URLまたはローカルplaceholderへ置き換える |
| `lib/db.ts` | 店舗写真がない場合のfallback画像 | Unsplash直書き | Storage管理のデフォルト画像、またはCSS placeholderへ置き換える |
| `next.config.mjs` | `images.unsplash.com` remote pattern | 外部画像表示許可 | 外部URL撤廃後に削除する |

## Storage管理済み経路

| 場所 | 用途 | 状態 |
| --- | --- | --- |
| `app/admin/actions.ts` | admin店舗写真アップロード | `store-photos` bucketへ保存し、`store_photos.storage_path` を保持 |
| `app/stores/[slug]/actions.ts` | 口コミ写真アップロード | `review-photos` bucketへ保存。ただし `review_photos.storage_path` は未実装 |
| `components/ImageFileInput.tsx` | 画像選択前処理 | 長辺1200px程度へ縮小し、WebP優先でフォーム送信 |

## 移行チェックリスト

- [ ] 初期公開店舗ごとに権利確認済み画像を用意する
- [ ] admin画面から各店舗画像を `store-photos` へアップロードする
- [ ] 各店舗の primary photo を設定する
- [ ] seedの `primaryPhotoUrl` をStorage URLまたは権利確認済みplaceholderへ置き換える
- [ ] fallback dataのUnsplash URLをStorage URLまたはローカルplaceholderへ置き換える
- [ ] `lib/db.ts` のUnsplash fallbackを削除する
- [ ] `next.config.mjs` から `images.unsplash.com` remote patternを削除する
- [ ] 店舗一覧、店舗詳細、OGP metadataでStorage画像だけが使われることを確認する

## Storage / egress 監視

確認頻度:

- β公開中: 週1回
- 正式リリース直後2週間: 週2回
- 画像投稿や流入が急増した場合: 当日中

見る場所:

- Supabase Dashboard > Usage
- Supabase Dashboard > Storage
- Vercel Dashboard > Usage
- Vercel Dashboard > Analytics / Observability を導入後は画像表示ページのLCPも確認

警戒ライン:

| 指標 | 警戒ライン | 初動 |
| --- | --- | --- |
| Supabase Storage size | Freeなら500MB、Proなら50GB到達 | 画像棚卸し、不要画像削除、移行/圧縮漏れ確認 |
| Supabase egress / cached egress | 月間枠の50%到達 | 画像サイズ、アクセス急増ページ、外部共有状況を確認 |
| Vercel Fast Data Transfer | 月間枠の50%到達 | 画像配信量、ページ別アクセス、キャッシュ状況を確認 |
| 画像アップロード失敗 | 1日複数件 | Storage policy、ファイルサイズ、変換失敗ログを確認 |
| 店舗一覧/詳細のLCP | p75で2.5秒超 | 画像サイズ、priority設定、一覧用サムネイル導入を検討 |

対応判断:

- egressが先に効く場合は、サムネイル生成と一覧用画像の分離を優先する。
- Storage sizeが先に効く場合は、孤児ファイル削除、重複画像削除、元画像保存漏れがないか確認する。
- 画像アップロード失敗が増えた場合は、クライアント側変換を無効化した直接POSTがないか、server actionのエラー種別を確認する。
- Free枠の50%を継続的に超える場合は、正式リリース前にSupabase Pro移行を検討する。

## 未決事項

- デフォルト画像をStorage上の共通placeholderにするか、CSS placeholderにするか。
- 口コミ写真の `storage_path` をschemaに追加するタイミング。
- サムネイル画像の保存先と命名規則。
