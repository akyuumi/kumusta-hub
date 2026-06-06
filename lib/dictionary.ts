import type { Locale } from "@/lib/types";

export const dictionary = {
  en: {
    nav: {
      search: "Search",
      addStore: "Add store",
      favorites: "Favorites",
      myPage: "My page",
      logout: "Logout",
      login: "Login",
      admin: "Admin"
    },
    footer: {
      description: "Filipino community store discovery for restaurants, groceries, remittance, and delivery services in Japan.",
      terms: "Terms",
      privacy: "Privacy",
      contact: "Contact"
    },
    searchForm: {
      keyword: "Keyword",
      keywordPlaceholder: "sisig, grocery, remittance...",
      prefecture: "Prefecture",
      allPrefectures: "All prefectures",
      category: "Category",
      allCategories: "All categories",
      submit: "Search"
    },
    home: {
      eyebrow: "Filipino Community in Japan",
      headline: "Find Filipino restaurants, groceries, and services near you.",
      lead: "Search trusted places for food, remittance, delivery, groceries, Tagalog support, and community essentials across Japan.",
      communityReviewed: "Community reviewed",
      realExperiences: "Real experiences from locals",
      featuredStores: "Featured stores",
      featuredDescription: "Initial focus prefectures with high Filipino community demand.",
      viewAll: "View all",
      values: [
        {
          title: "Search by prefecture",
          body: "Tokyo, Kanagawa, and Osaka are seeded for MVP discovery."
        },
        {
          title: "Review-first",
          body: "Store pages prioritize ratings, helpful reviews, and photos to build community trust."
        },
        {
          title: "Moderation-ready",
          body: "Reports, admin status, and future RLS controls are reflected in the data model."
        }
      ],
      browseCategories: "Browse categories"
    },
    searchResults: {
      title: "Search results",
      count: "{count} published stores found",
      tagalogSupport: "Tagalog support",
      anyRating: "Any rating",
      apply: "Apply",
      list: "List",
      map: "Map",
      emptyTitle: "No stores match your filters.",
      emptyBody: "Try another prefecture, category, or keyword.",
      emptyMap: "No store locations to show"
    },
    storeCard: {
      saveStore: "Save store",
      reviews: "{count} reviews",
      published: "Published",
      tags: {
        tagalog: "Tagalog",
        gcash: "GCash",
        products: "Products",
        remittance: "Remittance"
      }
    },
    locale: {
      label: "Language",
      en: "English",
      ja: "日本語"
    }
  },
  ja: {
    nav: {
      search: "検索",
      addStore: "店舗追加",
      favorites: "お気に入り",
      myPage: "マイページ",
      logout: "ログアウト",
      login: "ログイン",
      admin: "管理"
    },
    footer: {
      description: "日本のフィリピン料理店、食材店、送金、配送サービスを探せるコミュニティ向け店舗検索です。",
      terms: "利用規約",
      privacy: "プライバシー",
      contact: "問い合わせ"
    },
    searchForm: {
      keyword: "キーワード",
      keywordPlaceholder: "sisig、食材、送金など",
      prefecture: "都道府県",
      allPrefectures: "すべての都道府県",
      category: "カテゴリ",
      allCategories: "すべてのカテゴリ",
      submit: "検索"
    },
    home: {
      eyebrow: "日本のフィリピンコミュニティ",
      headline: "近くのフィリピン料理店、食材店、サービスを探す。",
      lead: "食事、送金、配送、食材、タガログ語対応など、日本での暮らしに役立つ場所を検索できます。",
      communityReviewed: "コミュニティの口コミ",
      realExperiences: "地域の実体験に基づく情報",
      featuredStores: "注目の店舗",
      featuredDescription: "フィリピンコミュニティの需要が高い重点都道府県から掲載しています。",
      viewAll: "すべて見る",
      values: [
        {
          title: "都道府県で検索",
          body: "MVPでは東京、神奈川、大阪を中心に店舗を整備しています。"
        },
        {
          title: "口コミ重視",
          body: "評価、役立つ口コミ、写真を通じて信頼できる店舗探しを支えます。"
        },
        {
          title: "モデレーション対応",
          body: "通報、adminステータス、RLS方針をデータモデルに反映しています。"
        }
      ],
      browseCategories: "カテゴリから探す"
    },
    searchResults: {
      title: "検索結果",
      count: "{count}件の公開店舗",
      tagalogSupport: "タガログ語対応",
      anyRating: "評価を指定しない",
      apply: "適用",
      list: "一覧",
      map: "地図",
      emptyTitle: "条件に合う店舗がありません。",
      emptyBody: "都道府県、カテゴリ、キーワードを変えて検索してください。",
      emptyMap: "表示できる店舗位置がありません"
    },
    storeCard: {
      saveStore: "店舗を保存",
      reviews: "{count}件の口コミ",
      published: "公開中",
      tags: {
        tagalog: "タガログ語",
        gcash: "GCash",
        products: "商品",
        remittance: "送金"
      }
    },
    locale: {
      label: "表示言語",
      en: "English",
      ja: "日本語"
    }
  }
} as const;

export type Dictionary = (typeof dictionary)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale];
}

export function formatMessage(message: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((formatted, [key, value]) => formatted.replaceAll(`{${key}}`, String(value)), message);
}
