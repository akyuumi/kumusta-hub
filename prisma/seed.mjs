import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const prefectures = [
  { slug: "tokyo", nameJa: "東京都", nameEn: "Tokyo" },
  { slug: "kanagawa", nameJa: "神奈川県", nameEn: "Kanagawa" },
  { slug: "osaka", nameJa: "大阪府", nameEn: "Osaka" }
];

const categories = [
  { slug: "filipino-restaurant", nameJa: "フィリピン料理", nameEn: "Filipino Restaurant" },
  { slug: "filipino-grocery", nameJa: "フィリピン食材店", nameEn: "Filipino Grocery" },
  { slug: "remittance-service", nameJa: "送金サービス", nameEn: "Remittance Service" },
  { slug: "international-delivery-service", nameJa: "国際配送", nameEn: "International Delivery Service" }
];

const areas = [
  { slug: "tokyo", prefectureSlug: "tokyo", nameJa: "東京都", nameEn: "Tokyo" },
  { slug: "kanagawa", prefectureSlug: "kanagawa", nameJa: "神奈川県", nameEn: "Kanagawa" },
  { slug: "osaka", prefectureSlug: "osaka", nameJa: "大阪府", nameEn: "Osaka" }
];

const brands = [
  {
    slug: "bayanihan-kitchen",
    nameJa: "バヤニハンキッチン",
    nameEn: "Bayanihan Kitchen",
    description: "Home-style Filipino meals for workers, families, and weekend meetups."
  },
  {
    slug: "sari-sari-mart",
    nameJa: "サリサリマート",
    nameEn: "Sari-Sari Mart",
    description: "Groceries, snacks, frozen goods, and community essentials."
  },
  {
    slug: "padala-link",
    nameJa: "パダラリンク",
    nameEn: "Padala Link",
    description: "Remittance and parcel support for Filipinos living in Japan."
  }
];

const stores = [
  {
    slug: "bayanihan-kitchen-ikebukuro",
    brandSlug: "bayanihan-kitchen",
    categorySlug: "filipino-restaurant",
    areaSlug: "tokyo",
    name: "Bayanihan Kitchen Ikebukuro",
    description: "A casual spot near Ikebukuro with adobo, sisig, sinigang, and weekend boodle fight platters.",
    address: "Tokyo, Toshima City, Ikebukuro 2-12-8",
    lat: 35.7306,
    lng: 139.7112,
    phone: "03-0000-1122",
    websiteUrl: "https://example.com/bayanihan",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Mon-Sun 11:00-22:00",
    averageRating: 4.6,
    reviewCount: 38,
    tagalogSupport: true,
    gcashSupport: true,
    filipinoProducts: false,
    remittanceSupport: false,
    priceRange: "¥¥",
    featuredMenu: "Pork Sisig, Chicken Adobo, Halo-Halo",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    isPublished: true
  },
  {
    slug: "sari-sari-mart-kawasaki",
    brandSlug: "sari-sari-mart",
    categorySlug: "filipino-grocery",
    areaSlug: "kanagawa",
    name: "Sari-Sari Mart Kawasaki",
    description: "Filipino pantry staples, frozen seafood, sauces, snacks, and prepaid mobile cards.",
    address: "Kanagawa, Kawasaki City, Kawasaki-ku 7-3",
    lat: 35.5308,
    lng: 139.703,
    phone: "044-000-2211",
    websiteUrl: "https://example.com/sari-sari",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Tue-Sun 10:00-20:00",
    averageRating: 4.4,
    reviewCount: 24,
    tagalogSupport: true,
    gcashSupport: false,
    filipinoProducts: true,
    remittanceSupport: false,
    priceRange: "¥",
    featuredMenu: "Lucky Me, Datu Puti, Frozen Bangus",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
    isPublished: true
  },
  {
    slug: "padala-link-yokohama",
    brandSlug: "padala-link",
    categorySlug: "remittance-service",
    areaSlug: "kanagawa",
    name: "Padala Link Yokohama",
    description: "Remittance counter with parcel advice and English support for first-time users.",
    address: "Kanagawa, Yokohama City, Naka-ku 1-9-4",
    lat: 35.4437,
    lng: 139.638,
    phone: "045-000-3344",
    websiteUrl: "https://example.com/padala",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Mon-Sat 10:30-19:00",
    averageRating: 4.1,
    reviewCount: 17,
    tagalogSupport: true,
    gcashSupport: true,
    filipinoProducts: false,
    remittanceSupport: true,
    priceRange: "Service fee varies",
    featuredMenu: "Bank transfer, Cash pickup, Parcel consultation",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1200&q=80",
    isPublished: true
  },
  {
    slug: "bayanihan-kitchen-namba",
    brandSlug: "bayanihan-kitchen",
    categorySlug: "filipino-restaurant",
    areaSlug: "osaka",
    name: "Bayanihan Kitchen Namba",
    description: "Late-night Filipino comfort food in Namba with karaoke-friendly group seating.",
    address: "Osaka, Chuo Ward, Namba 4-2-6",
    lat: 34.6649,
    lng: 135.501,
    phone: "06-0000-4455",
    websiteUrl: "https://example.com/bayanihan-namba",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Wed-Mon 12:00-23:30",
    averageRating: 4.7,
    reviewCount: 42,
    tagalogSupport: true,
    gcashSupport: false,
    filipinoProducts: false,
    remittanceSupport: false,
    priceRange: "¥¥",
    featuredMenu: "Lechon Kawali, Kare-Kare, Ube Cake",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    isPublished: true
  }
];

async function main() {
  for (const prefecture of prefectures) {
    await prisma.prefecture.upsert({
      where: { slug: prefecture.slug },
      update: prefecture,
      create: prefecture
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand
    });
  }

  for (const area of areas) {
    const prefecture = await prisma.prefecture.findUniqueOrThrow({
      where: { slug: area.prefectureSlug }
    });

    await prisma.area.upsert({
      where: { slug: area.slug },
      update: {
        prefectureId: prefecture.id,
        nameJa: area.nameJa,
        nameEn: area.nameEn
      },
      create: {
        slug: area.slug,
        prefectureId: prefecture.id,
        nameJa: area.nameJa,
        nameEn: area.nameEn
      }
    });
  }

  for (const store of stores) {
    const [brand, category, area] = await Promise.all([
      prisma.brand.findUniqueOrThrow({ where: { slug: store.brandSlug } }),
      prisma.category.findUniqueOrThrow({ where: { slug: store.categorySlug } }),
      prisma.area.findUniqueOrThrow({ where: { slug: store.areaSlug } })
    ]);

    const searchText = [
      store.name,
      store.description,
      store.address,
      store.featuredMenu,
      brand.nameEn,
      category.nameEn,
      area.nameEn
    ].join(" ");

    const upsertedStore = await prisma.store.upsert({
      where: { slug: store.slug },
      update: {
        brandId: brand.id,
        categoryId: category.id,
        areaId: area.id,
        name: store.name,
        description: store.description,
        address: store.address,
        lat: store.lat,
        lng: store.lng,
        phone: store.phone,
        websiteUrl: store.websiteUrl,
        facebookUrl: store.facebookUrl,
        openingHours: store.openingHours,
        averageRating: store.averageRating,
        reviewCount: store.reviewCount,
        tagalogSupport: store.tagalogSupport,
        gcashSupport: store.gcashSupport,
        filipinoProducts: store.filipinoProducts,
        remittanceSupport: store.remittanceSupport,
        priceRange: store.priceRange,
        featuredMenu: store.featuredMenu,
        photoUrl: store.primaryPhotoUrl,
        isPublished: store.isPublished,
        searchText
      },
      create: {
        slug: store.slug,
        brandId: brand.id,
        categoryId: category.id,
        areaId: area.id,
        name: store.name,
        description: store.description,
        address: store.address,
        lat: store.lat,
        lng: store.lng,
        phone: store.phone,
        websiteUrl: store.websiteUrl,
        facebookUrl: store.facebookUrl,
        openingHours: store.openingHours,
        averageRating: store.averageRating,
        reviewCount: store.reviewCount,
        tagalogSupport: store.tagalogSupport,
        gcashSupport: store.gcashSupport,
        filipinoProducts: store.filipinoProducts,
        remittanceSupport: store.remittanceSupport,
        priceRange: store.priceRange,
        featuredMenu: store.featuredMenu,
        photoUrl: store.primaryPhotoUrl,
        isPublished: store.isPublished,
        searchText
      }
    });

    const existingPrimaryPhoto = await prisma.storePhoto.findFirst({
      where: {
        storeId: upsertedStore.id,
        isPrimary: true
      }
    });

    if (existingPrimaryPhoto) {
      await prisma.storePhoto.update({
        where: {
          id: existingPrimaryPhoto.id
        },
        data: {
          imageUrl: store.primaryPhotoUrl,
          altText: store.name,
          sortOrder: 0,
          isPrimary: true
        }
      });
    } else {
      await prisma.storePhoto.create({
        data: {
          storeId: upsertedStore.id,
          imageUrl: store.primaryPhotoUrl,
          altText: store.name,
          sortOrder: 0,
          isPrimary: true
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
