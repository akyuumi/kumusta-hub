# KumustaHub SPEC

在日フィリピン人向け店舗口コミサイト 要件定義書（MVP）

このファイルをシステム仕様の正とする。

関連ドキュメント:

- `docs/TASKS.md`: タスク管理
- `docs/DECISIONS.md`: 設計判断記録
- `docs/CHANGELOG.md`: 変更履歴
- `docs/AUTH_FLOW.md`: 認証フロー詳細
- `docs/CAPACITY.md`: インフラ容量試算

1. サービス概要

サービス目的

日本国内にあるフィリピン関連店舗を、在日フィリピン人向けに検索・比較・評価できる口コミサイトを提供する。

コンセプト

Google Maps × 食べログ × Filipino Community

ターゲット

在日フィリピン人：

- 日本在住フィリピン人
- 技能実習生
- 永住者
- 国際結婚世帯
- 英語利用可能層

MVPの目的

- 初期店舗DB構築
- 検索導線構築
- 口コミ蓄積
- SEO資産形成

⸻

2. MVP対象カテゴリ

店舗カテゴリ

- Filipino Restaurant
- Filipino Grocery
- Remittance Service
- International Delivery Service

⸻

3. ユーザーロール

ロール 権限
guest 閲覧のみ
user 口コミ投稿、写真投稿、お気に入り、通報、店舗追加申請
admin 管理機能全般

⸻

4. 技術スタック

項目 技術
Frontend Next.js App Router
UI Tailwind CSS + shadcn/ui
Hosting Vercel
DB Supabase PostgreSQL
Auth Supabase Auth
Storage Supabase Storage
Map OpenStreetMap
Map UI Leaflet
Search PostgreSQL Full Text Search
ORM Prisma 推奨
Language TypeScript

⸻

5. 多言語対応

対応言語

- 日本語
- 英語

非対応

- タガログ語UI

方針

- UIのみi18n
- 口コミ本文は自由言語
- 将来的にAI翻訳対応可能

⸻

6. 画面一覧

画面 パス
トップ /
検索結果 /search
店舗詳細 /stores/[slug]
ブランド詳細 /brands/[slug]
都道府県詳細 /areas/[slug]
カテゴリ詳細 /categories/[slug]
ログイン /login
マイページ /mypage
お気に入り一覧 /mypage/favorites
店舗追加申請 /store-request
管理画面 /admin
利用規約 /terms
プライバシーポリシー /privacy
お問い合わせ /contact

⸻

7. 機能要件

7.1 店舗検索

検索条件

- キーワード
- 都道府県
- カテゴリ
- 星評価
- タガログ語対応

表示形式

- 地図 + 店舗一覧（Airbnb型）

⸻

7.2 店舗詳細

基本情報

- 店名
- ブランド
- カテゴリ
- 住所
- 地図
- 営業時間
- 電話番号
- Website
- Facebook
- 写真

フィリピン特化情報

- タガログ語対応
- GCash対応
- Filipino products
- Remittance対応

飲食情報

- 人気メニュー
- 価格帯

⸻

7.3 口コミ

投稿条件

- ログイン必須

投稿内容

項目 必須
星評価 必須
本文 任意
写真 任意

写真制限

- 最大3枚

口コミ機能

- Helpful（いいね）
- 通報
- 管理者削除

⸻

7.4 お気に入り

機能

- 店舗保存
- 保存解除
- お気に入り一覧

⸻

7.5 店舗追加申請

ユーザー可能操作

- 新店舗追加申請

管理者操作

- 承認
- 却下

⸻

7.6 認証

ログイン方法

- Google OAuth
- Facebook OAuth

閲覧制御

機能 ログイン
閲覧 不要
投稿 必須

⸻

8. 管理画面要件

店舗管理

- CRUD
- 公開/非公開

ブランド管理

- CRUD

カテゴリ管理

- CRUD

都道府県管理

- CRUD

口コミ管理

- 非表示
- 削除

通報管理

- 一覧
- 対応状態変更

ユーザー管理

- BAN

⸻

9. DB設計

brands

カラム 型
id uuid
slug text unique
name_ja text
name_en text
description text

⸻

categories

カラム 型
id uuid
parent_category_id uuid nullable
slug text unique
name_ja text
name_en text

⸻

prefectures

カラム 型
id uuid
slug text unique
name_ja text
name_en text

⸻

areas

注記: 2026-05-18以降、公開仕様上の「エリア」は市区町村・駅単位ではなく都道府県単位とする。DB互換性のためテーブル名は `areas` のまま維持する。

カラム 型
id uuid
prefecture_id uuid
slug text unique
name_ja text
name_en text

⸻

stores

カラム 型
id uuid
brand_id uuid
category_id uuid
area_id uuid
slug text unique
name text
description text
address text
lat decimal
lng decimal
phone text
website_url text
facebook_url text
opening_hours jsonb
average_rating decimal
review_count int
tagalog_support boolean
gcash_support boolean
filipino_products boolean
remittance_support boolean
price_range text
featured_menu text
is_published boolean
search_text text

⸻

reviews

カラム 型
id uuid
user_id uuid
store_id uuid
rating int
body text
helpful_count int
is_hidden boolean
created_at timestamp

⸻

review_photos

カラム 型
id uuid
review_id uuid
image_url text

⸻

favorites

カラム 型
id uuid
user_id uuid
store_id uuid

⸻

reports

カラム 型
id uuid
review_id uuid
user_id uuid
reason text

⸻

10. SEO要件

SEO対象ページ

- 店舗ページ
- ブランドページ
- 都道府県ページ
- カテゴリページ

URL設計

/stores/{slug}
/brands/{slug}
/areas/{slug}
/categories/{slug}

SEO方針

- SSR / SSG活用
- title/meta動的生成
- OGP対応
- sitemap生成
- robots.txt

⸻

11. モデレーション要件

必須対策

- reCAPTCHA
- レート制限
- 通報機能
- 管理者削除
- BAN

法務対応

- 利用規約
- プライバシーポリシー
- 削除依頼窓口

⸻

12. UI/UX方針

デザイン方向

Airbnb寄り。

特徴

- 写真重視
- カードUI
- モバイル優先
- 地図 + 一覧
- 余白多め

⸻

13. 初期データ投入戦略

方針

- 運営による手動登録

初期重点都道府県

- Tokyo
- Kanagawa
- Osaka

戦略

全国薄く
ではなく
局所高密度

⸻

14. 非機能要件

項目 内容
モバイル対応 必須
レスポンシブ 必須
SEO 必須
ページ表示速度 Core Web Vitals意識
セキュリティ Supabase RLS
バックアップ Supabase依存
可用性 Vercel/Supabase依存

⸻

15. 開発優先順

Phase1

- 認証
- DB
- 店舗CRUD
- 店舗一覧
- 店舗詳細

⸻

Phase2

- 検索
- 地図
- 口コミ
- 写真投稿

⸻

Phase3

- お気に入り
- 通報
- 管理画面強化

⸻

Phase4

- SEO最適化
- OGP
- sitemap
- 多言語UI

⸻

16. 将来拡張

- AI翻訳
- PR店舗
- アフィリエイト
- 店舗オーナー権限
- Push通知
- PWA
- レコメンド
- AIモデレーション
- 信頼スコア
- Meilisearch移行
- PostGIS導入
