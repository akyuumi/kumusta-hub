# KumustaHub OPERATIONS

更新日: 2026-05-23

正式リリース前後の基本運用手順。外部サービスの画面操作を含むため、実施後は `docs/TASKS.md` の該当チェックも更新する。

## 管理者追加/削除

管理者判定はDBロールではなく、環境変数 `ADMIN_EMAILS` の allowlist で行う。複数管理者はカンマ区切りで指定する。

例:

```text
ADMIN_EMAILS=owner@example.com,ops@example.com
```

追加手順:

1. 対象者にGoogleログインで一度KumustaHubへログインしてもらう。
2. 対象者のメールアドレスを確認する。
3. Vercel Dashboard の Project Settings > Environment Variables で `ADMIN_EMAILS` にメールアドレスを追加する。
4. Production / Preview で必要な環境を選ぶ。
5. 再デプロイする。
6. 対象者が `/admin` に入れることを確認する。

削除手順:

1. Vercel Dashboard の `ADMIN_EMAILS` から対象メールアドレスを削除する。
2. 再デプロイする。
3. 対象者が `/admin` から `/mypage?error=admin_required` へ誘導されることを確認する。

注意:

- メールアドレスは小文字化して比較される。
- `ADMIN_EMAILS` を空にすると管理画面へ入れるユーザーがいなくなる。
- 管理者の追加/削除履歴は、当面このファイルではなくVercelの環境変数変更履歴とGitHub/Vercelのデプロイ履歴で追う。
- 権限差分が必要になったら、DB role 管理へ移行する。

## Supabase usage / DB metrics 確認

確認頻度:

- β公開中: 週1回
- 正式リリース直後2週間: 週2回
- 店舗追加、画像投稿、検索流入が急増した場合: 当日中

見る場所:

- Supabase Dashboard > Usage
- Supabase Dashboard > Reports / Metrics
- Supabase Dashboard > Logs
- Supabase Dashboard > Storage

確認項目:

| 指標 | 見る場所 | 警戒ライン | 初動 |
| --- | --- | --- | --- |
| Database size | Usage | Freeなら300MB、Proなら5GB到達 | 不要データ、ログ、画像URL重複を確認 |
| Storage size | Usage / Storage | Freeなら500MB、Proなら50GB到達 | 画像棚卸し、孤児ファイル、圧縮漏れを確認 |
| Egress / cached egress | Usage | 月間枠の50%到達 | 画像サイズ、流入急増ページ、共有状況を確認 |
| DB query latency | Reports / Metrics | p95が500ms超 | 遅いページ、検索query、index不足を確認 |
| Connections | Reports / Metrics | 上限接近または急増 | Vercel同時実行、pooler設定、不要なDB取得を確認 |
| Auth errors / 429 | Logs | 連続発生 | OAuth設定、botアクセス、rate limitを確認 |
| Storage errors | Logs / App logs | 1日複数件 | bucket policy、ファイルサイズ、画像変換失敗を確認 |

対応判断:

- Storage/egressが先に効く場合は、サムネイル生成と一覧用画像の分離を優先する。
- DB latencyが先に効く場合は、検索index、一覧query軽量化、ISR化を優先する。
- Connectionsが先に効く場合は、Prisma接続、Transaction pooler、Vercel function regionを確認する。
- Free枠の50%を継続的に超える場合は、Supabase Pro移行を検討する。

## 容量警戒ライン

容量・利用量の基準は `docs/CAPACITY.md` を正とする。更新が必要になった場合は、先に `docs/CAPACITY.md` を更新し、この手順書には運用上の確認場所と初動だけを残す。
