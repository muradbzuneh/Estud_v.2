import { createHttpClient, categories, products, productImages, users, institutions, campuses, eq } from "@estud/db";

async function seedMarketplace() {
  const db = createHttpClient();
  console.log("Seeding marketplace categories and initial campus listings...");

  // 1. Get or create admin user to act as author
  let admin = await db.query.users.findFirst({
    where: eq(users.email, "murad@gmail.com"),
  });

  if (!admin) {
    console.error("Admin user murad@gmail.com not found. Please run seed-admin first.");
    process.exit(1);
  }

  // 2. Seed Categories
  const categoryDefs = [
    { name: "Electronics & Computing", slug: "electronics", description: "Laptops, phones, audio gear, and tech accessories", iconName: "Laptop" },
    { name: "Books & Textbooks", slug: "books", description: "University textbooks, courseware, and lecture packs", iconName: "BookOpen" },
    { name: "Fashion & Campus Wear", slug: "fashion", description: "Shoes, backpacks, jackets, and student apparel", iconName: "Shirt" },
    { name: "Dorm Essentials", slug: "dorm", description: "Room lamps, kettles, bedsheets, and dorm storage", iconName: "Home" },
    { name: "Stationery & Tools", slug: "stationery", description: "Calculators, drafting boards, and lab gear", iconName: "PenTool" },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoryDefs) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, cat.slug),
    });
    if (existing) {
      categoryMap.set(cat.slug, existing.id);
    } else {
      const [created] = await db.insert(categories).values(cat).returning();
      categoryMap.set(cat.slug, created.id);
      console.log(`Created category: ${cat.name}`);
    }
  }

  // 3. Seed Institutions & Campuses if needed
  let aau = await db.query.institutions.findFirst({
    where: eq(institutions.shortCode, "AAU"),
  });
  if (!aau) {
    [aau] = await db
      .insert(institutions)
      .values({
        name: "Addis Ababa University",
        shortCode: "AAU",
        city: "Addis Ababa",
        region: "Addis Ababa",
      })
      .returning();
  }

  let fourKilo = await db.query.campuses.findFirst({
    where: eq(campuses.name, "4 Kilo Science Campus"),
  });
  if (!fourKilo && aau) {
    [fourKilo] = await db
      .insert(campuses)
      .values({
        institutionId: aau.id,
        name: "4 Kilo Science Campus",
        details: "Gate 1 Main Entrance",
      })
      .returning();
  }

  // 4. Seed Products
  const sampleProducts = [
    {
      title: "HP Laptop 15 Core i5 (16GB RAM, 512GB SSD)",
      description: "Fast 11th Gen Intel Core i5 laptop with 16GB RAM and pristine battery life (5+ hours). Ideal for coding and engineering software. Includes original charger.",
      categorySlug: "electronics",
      condition: "LIKE_NEW" as const,
      price: "18000.00",
      status: "APPROVED" as const,
      imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205480/estud/products/i1rk4m8ywq8mccyfzuv1.jpg",
    },
    {
      title: "Calculus Early Transcendentals (8th Edition)",
      description: "Hardcover university calculus textbook by Stewart. Minimal highlighting, all pages and exercises intact. Used for AAU and ASTU Math 101/102.",
      categorySlug: "books",
      condition: "GOOD" as const,
      price: "600.00",
      status: "APPROVED" as const,
      imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205482/estud/products/gm1mw2kvp0cdxfh0e6ib.jpg",
    },
    {
      title: "Sony WH-1000XM4 Noise Canceling Headphones",
      description: "Industry leading noise canceling wireless headphones. Comes with original hardshell case, aux cord, and USB-C cable. Perfect for library study sessions.",
      categorySlug: "electronics",
      condition: "LIKE_NEW" as const,
      price: "2500.00",
      status: "APPROVED" as const,
      imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205483/estud/products/vmgc9gbcyr8x8w2sej01.jpg",
    },
    {
      title: "Waterproof Campus Laptop Backpack (Grey)",
      description: "Ergonomic multi-compartment student backpack with padded laptop sleeve, USB charging pass-through, and anti-theft back pocket.",
      categorySlug: "fashion",
      condition: "NEW" as const,
      price: "1200.00",
      status: "APPROVED" as const,
      imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205485/estud/products/epqmnjm8x3mmsx90yx6f.jpg",
    },
    {
      title: "Nike Air Max Campus Running Shoes (Size 42)",
      description: "Comfortable campus sneaker, worn only a few times. Clean tread, no odors, genuine Nike packaging.",
      categorySlug: "fashion",
      condition: "LIKE_NEW" as const,
      price: "3000.00",
      status: "APPROVED" as const,
      imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205486/estud/products/rxwxchigrz0dw3njh8ig.jpg",
    },
    {
      title: "Casio FX-991EX ClassWiz Advanced Scientific Calculator",
      description: "High-resolution natural textbook display with 552 functions. Allowed on all university engineering exams. Solar + battery dual power.",
      categorySlug: "stationery",
      condition: "LIKE_NEW" as const,
      price: "1850.00",
      status: "PENDING_VALUATION" as const,
      imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
    },
  ];

  for (const item of sampleProducts) {
    const catId = categoryMap.get(item.categorySlug);
    if (!catId) continue;

    const existingProd = await db.query.products.findFirst({
      where: eq(products.title, item.title),
    });

    if (!existingProd) {
      const [prod] = await db
        .insert(products)
        .values({
          sellerId: admin.id,
          categoryId: catId,
          title: item.title,
          description: item.description,
          condition: item.condition,
          proposedPrice: item.price,
          approvedItemValue: item.price,
          status: item.status,
          institutionId: aau?.id,
          campusId: fourKilo?.id,
          isExchangeEligible: true,
        })
        .returning();

      await db.insert(productImages).values({
        productId: prod.id,
        imageUrl: item.imageUrl,
        isPrimary: true,
        displayOrder: 0,
      });

      console.log(`Created product listing: ${item.title}`);
    }
  }

  console.log("Marketplace seeding complete!");
  process.exit(0);
}

seedMarketplace().catch((err) => {
  console.error("Error seeding marketplace:", err);
  process.exit(1);
});
