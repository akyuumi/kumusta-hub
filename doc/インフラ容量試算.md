# KumustaHub インフラ容量試算

作成日: 2026-05-16

## 結論

現状の Vercel + Supabase 構成では、プラン未確認のため断定はできないが、正式リリース前の安全な運用目安は以下。

| 想定プラン | 安全運用の目安 | 条件 |
| --- | ---: | --- |
| Vercel Hobby + Supabase Free 相当 | 月間 1,000-3,000 MAU | 画像アップロード量を抑え、初期βとして運用する |
| Vercel Hobby + Supabase Free 相当、画像を外部URL/強キャッシュ中心 | 月間 5,000-10,000 MAU | 投稿写真が少なく、Supabase Storage egress をほぼ使わない |
| Vercel Pro + Supabase Pro Micro 相当 | 月間 30,000-80,000 MAU | 画像最適化、監視、rate limit を入れる |
| Vercel Pro + Supabase Pro Small/Medium 以上 | 月間 80,000-200,000 MAU | DB index、画像CDN、負荷試験、運用監視が前提 |

正式リリース直後は、**月間 1,000-3,000 MAU を初期上限として観測し、5,000 MAU を超える前に Pro 化と監視整備を行う**のが現実的。

## 現在の構成

| レイヤー | 現状 |
| --- | --- |
| Hosting | Vercel |
| App | Next.js App Router |
| DB | Supabase PostgreSQL + Prisma |
| DB接続 | Vercel から Supabase Transaction pooler |
| Auth | Supabase Auth + Google OAuth |
| Storage | Supabase Storage: `store-photos`, `review-photos` |
| 画像配信 | Next.js Image + Supabase public Storage / 一部外部URL |
| 管理画面 | `/admin`、`ADMIN_EMAILS` allowlist |

## 公式クォータの前提

2026-05-16 時点の公式情報を参照。

### Vercel

Vercel の Limits では Hobby の included usage として、Invocations 1 million、Fast Data Transfer 100 GB、Build Execution 6,000 mins、Image Optimization Source Images 1,000 が示されている。Pro は Fast Data Transfer 1 TB が含まれ、追加利用は on-demand 課金できる。

また、Vercel Pricing では Hobby は usage caps に制限され追加購入できず、Pro は pay-as-you-go が可能と説明されている。

出典:

- https://vercel.com/docs/limits
- https://vercel.com/pricing
- https://vercel.com/docs/pricing

### Supabase

Supabase Pricing では Free が 50,000 MAU、500 MB database、5 GB egress、5 GB cached egress、1 GB file storage。Pro は 100,000 MAU、8 GB database、250 GB egress、250 GB cached egress、100 GB file storage、Daily backups 7 days。

Compute は Pro の Micro が 1 GB RAM / 2-core ARM / Pooler 200 connections、Small が 2 GB RAM / Pooler 400 connections、Medium が 4 GB RAM / Pooler 600 connections。

Supabase Auth は認証エンドポイントに rate limit があり、超過時は 429 を返す。OAuth中心ならメール送信制限の影響は小さいが、token refresh や verify にはIPベース制限がある。

出典:

- https://supabase.com/pricing
- https://supabase.com/docs/guides/auth/rate-limits

## 試算モデル

KumustaHub は検索・店舗詳細・口コミ投稿が中心のため、月間ユーザー数だけでなく、PV、画像転送量、投稿量で見る。

### ユーザー行動の仮定

| 指標 | 軽め | 標準 | 重め |
| --- | ---: | ---: | ---: |
| 1 MAU あたり月間PV | 3 PV | 5 PV | 10 PV |
| 1 PVあたりDB/HTML/APIデータ | 50 KB | 100 KB | 200 KB |
| 1 PVあたり画像転送量 | 300 KB | 800 KB | 1.5 MB |
| 口コミ投稿率 | 1% | 3% | 10% |
| 投稿1件あたり写真 | 0-1枚 | 1枚 | 3枚 |
| 写真1枚の保存サイズ | 300 KB | 800 KB | 2 MB |

現状は写真のリサイズ/圧縮パイプラインがないため、ユーザーが大きな画像を投稿すると Storage と egress が先に効く。アプリ側では5MB制限を入れているが、安定運用にはクライアント側圧縮またはサーバー側変換が必要。

## ボトルネック別の見積もり

### 1. Supabase Free の egress

Free は egress 5 GB、cached egress 5 GB が目安。

画像を Supabase Storage から配信する場合、実質的な上限は Storage/CDN egress になる。

| 1PVあたりSupabase転送量 | 月間PV目安 | 5PV/MAU換算 |
| ---: | ---: | ---: |
| 100 KB | 約 50,000 PV | 約 10,000 MAU |
| 300 KB | 約 16,000 PV | 約 3,200 MAU |
| 800 KB | 約 6,400 PV | 約 1,280 MAU |
| 1.5 MB | 約 3,400 PV | 約 680 MAU |

したがって、Supabase Free で画像を多く配信するなら、**安定目安は 1,000-3,000 MAU**。画像が外部URL中心、または強くキャッシュされるなら 5,000-10,000 MAU まで見られる。

### 2. Vercel Hobby の転送量

Hobby の Fast Data Transfer 100 GB を前提にすると、Vercel側のHTML/JS/CSS転送は以下。

| 1PVあたりVercel転送量 | 月間PV目安 | 5PV/MAU換算 |
| ---: | ---: | ---: |
| 500 KB | 約 200,000 PV | 約 40,000 MAU |
| 1 MB | 約 100,000 PV | 約 20,000 MAU |
| 2 MB | 約 50,000 PV | 約 10,000 MAU |

Vercelより先に、Supabase Storage egress またはDB負荷が問題になりやすい。

### 3. Supabase Auth MAU

Free の MAU は 50,000、Pro は 100,000 が含まれる。KumustaHub は閲覧をguest許可しているため、全訪問者が Auth MAU に入るわけではない。

仮にログイン率を20%とすると、50,000 Auth MAU は総MAU 250,000 相当。ただし実際には egress/DB/画像/運用の方が先に制約になる。

### 4. DB容量

初期データが小さいうちは DB 500 MB でも足りる。概算では、店舗・口コミ・お気に入り・通報のテキストデータだけなら数万-十数万レコード規模まで入る可能性が高い。

ただし、DBに画像本体は入れず、Storage URLのみを保存する前提。画像をDBに保存しない方針は維持する。

### 5. DB compute / 接続数

Vercel serverless から Prisma でDBアクセスしているため、接続プールは Supabase Transaction pooler 前提。Pro Micro なら Pooler 200 connections が目安。

ただし「接続数 = 同時ユーザー数」ではない。1リクエストあたりのDB処理時間が短ければ、数百-数千人の同時閲覧でもさばける可能性はある。一方で、検索や店舗詳細が毎回SSRでDBを読むため、以下が未対応だと早めに詰まる。

- 検索用 index / Full Text Search
- 人気ページのキャッシュ戦略
- 画像のリサイズ/圧縮
- 投稿系の rate limit
- 本番監視とアラート

## 現状実装での実用レンジ

### Free相当でのβ運用

| 項目 | 目安 |
| --- | ---: |
| 月間MAU | 1,000-3,000 |
| 月間PV | 5,000-15,000 |
| 登録ユーザー | 200-1,000 |
| 月間口コミ投稿 | 30-300 |
| 月間写真投稿 | 30-500枚 |
| 運用判断 | 可能。ただし正式リリースの上限としては低い |

Free相当では「初期β」「知人・コミュニティ内公開」「小規模SEO流入」までが妥当。

### Pro相当での初期正式リリース

| 項目 | 目安 |
| --- | ---: |
| 月間MAU | 30,000-80,000 |
| 月間PV | 150,000-400,000 |
| 登録ユーザー | 5,000-30,000 |
| 月間口コミ投稿 | 1,000-5,000 |
| 月間写真投稿 | 1,000-10,000枚 |
| 運用判断 | 初期正式リリースとして現実的 |

Pro相当では、Supabase egress 250 GB、Storage 100 GB、Vercel transfer 1 TB の範囲に収まりやすい。ただしDB computeは実測で判断する。

## リスク

### 画像が最大リスク

現在は店舗写真・口コミ写真を Supabase Storage に保存できる。写真1枚が5MBのまま大量投稿されると、Storage と egress が急速に増える。

対策:

- アップロード前に画像を 1200px 程度へ縮小
- WebP/AVIF 変換
- 口コミ写真はサムネイル生成
- 店舗一覧では小さい画像だけ使う
- 外部URL直書きはやめ、権利確認済み画像をStorage管理に寄せる

### SSR DBアクセスが多い

検索・店舗詳細・カテゴリ/エリア/ブランドページが server-side でDBを読む。データ量が増えると検索が重くなる。

対策:

- `stores.search_text` の Full Text Search index
- `stores(area_id, category_id, is_published, average_rating)` 周辺のindex整理
- 検索結果のページネーション
- 人気ページの `revalidate` / cache 検討

### 投稿系の abuse 対策が未完成

口コミ、写真、お気に入り、通報、店舗追加申請は、正式リリース前に rate limit / bot対策が必要。

対策:

- Turnstile または reCAPTCHA
- IP/user単位の投稿頻度制限
- 画像アップロード回数制限
- 管理画面での非表示/BAN

## 推奨実施順

1. Vercel / Supabase の現在プランを確定する
2. Supabase Pro へ上げる判断基準を決める
3. 画像圧縮・リサイズを入れる
4. 検索indexとページネーションを入れる
5. Vercel Analytics / Supabase metrics / error monitoring を入れる
6. k6 などで簡易負荷試験を行う
7. 5,000 MAU、30,000 MAU、100,000 MAU の段階的な運用基準を作る

## 監視すべき指標

| 指標 | 見る場所 | 警戒ライン |
| --- | --- | --- |
| Vercel Fast Data Transfer | Vercel Usage | 月50%到達 |
| Vercel Function Invocations | Vercel Usage | 急増、またはHobby上限接近 |
| Supabase egress / cached egress | Supabase Usage | 月50%到達 |
| Supabase Storage size | Supabase Usage | Freeなら500MB、Proなら50GB到達 |
| Supabase DB size | Supabase Usage | Freeなら300MB、Proなら5GB到達 |
| DB query latency | Supabase Logs / Metrics | p95が500ms超 |
| Auth rate limit / 429 | Supabase Auth logs | 連続発生 |
| 画像アップロード失敗 | App logs | 1日複数件 |

## 判断

今の構成は MVP/β としては十分だが、正式リリースで安定供給を掲げるなら Free 相当のままでは弱い。

正式リリース前の推奨は以下。

- Vercel は Pro 化を検討
- Supabase は Pro 化を検討
- 初期公式目標は 3,000 MAU
- 5,000 MAU 到達前に画像最適化と監視を完了
- 30,000 MAU 到達前に負荷試験とDB indexを完了
- 100,000 MAU を狙う場合は Supabase compute を Small/Medium 以上へ上げる前提で再試算

