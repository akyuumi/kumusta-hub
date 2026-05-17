# KumustaHub RATE LIMIT

更新日: 2026-05-17

このドキュメントは、KumustaHub の投稿系 rate limit の実現方式を説明する。

## 目的

投稿型サービスとして、正式リリース前に以下を防ぐ。

- 口コミの短時間大量投稿
- 口コミ写真アップロードによるStorage急増
- 店舗追加申請の連投

現時点では user単位の最小対策を先行している。IP単位制限や Turnstile / reCAPTCHA は未導入。

## 対象アクション

| action | 対象 | 上限 |
| --- | --- | --- |
| `review:create` | 口コミ投稿 | 5件 / 1時間 |
| `review_photo:upload` | 口コミ写真アップロード | 12枚 / 1時間 |
| `store_request:create` | 店舗追加申請 | 3件 / 24時間 |

## データモデル

Rate limit は `rate_limit_events` にイベントを記録して実現する。

```mermaid
erDiagram
    rate_limit_events {
        uuid id PK
        uuid user_id
        text action
        int quantity
        timestamp created_at
    }
```

主なindex:

```sql
CREATE INDEX rate_limit_events_user_id_action_created_at_idx
ON rate_limit_events(user_id, action, created_at);
```

## 処理フロー

```mermaid
sequenceDiagram
    participant User as User
    participant Form as Next.js Form
    participant Action as Server Action
    participant Auth as Supabase Auth
    participant RL as consumeUserRateLimit()
    participant DB as Supabase PostgreSQL
    participant Storage as Supabase Storage

    User->>Form: 口コミ投稿 / 写真投稿 / 店舗追加申請
    Form->>Action: FormData submit
    Action->>Auth: requireUser()
    Auth-->>Action: user.id

    Action->>RL: userId, action, limit, windowSeconds, quantity
    RL->>DB: rate_limit_events を集計
    Note over RL,DB: user_id + action + created_at >= windowStart

    alt 上限以内
        RL->>DB: 今回分を rate_limit_events に記録
        RL-->>Action: true
        Action->>DB: 口コミ / 店舗申請を保存
        opt 写真あり
            Action->>Storage: 画像アップロード
            Action->>DB: 写真URLを保存
        end
        Action-->>User: 成功
    else 上限超過
        RL-->>Action: false
        Action-->>User: rate limit error
        Note over Action,Storage: DB保存やStorage uploadは実行しない
    end
```

## 判定ロジック

```mermaid
flowchart TD
    A[Server Action開始] --> B[requireUserでuser.id取得]
    B --> C{action種別}

    C -->|review:create| D[5件 / 1時間]
    C -->|review_photo:upload| E[12枚 / 1時間]
    C -->|store_request:create| F[3件 / 24時間]

    D --> G[rate_limit_eventsを集計]
    E --> G
    F --> G

    G --> H{既存数量 + 今回数量 <= limit?}
    H -->|Yes| I[rate_limit_eventsへ記録]
    I --> J[本処理を実行]
    H -->|No| K[エラー表示して中断]
```

実装箇所:

- `lib/rate-limit.ts`
- `app/stores/[slug]/actions.ts`
- `app/store-request/actions.ts`

## 採用理由

Vercel の serverless 環境では、メモリ上のカウンタはインスタンス間で共有されない。そのため Supabase PostgreSQL にイベントを記録し、どのserver action実行環境からも同じ制限状態を参照できるようにしている。

## 現在の制約

- user単位の制限なので、IP単位の匿名bot対策にはならない。
- 厳密な同時実行制御ではないため、同時連打を完全には防げない。
- 古い `rate_limit_events` は server action 実行時に7日超過分を削除する簡易運用。
- Turnstile / reCAPTCHA は、実運用でbotや連投が確認された段階で追加検討する。
