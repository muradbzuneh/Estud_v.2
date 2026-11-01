"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "am";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Top Banner
    "banner.text": "Estud New Semester Student Promo: 0% Seller Fees on Textbooks, Laptops & Dorm Essentials across all Ethiopian Campuses!",
    "banner.button": "Start Selling (0% Fee)",

    // Navbar
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.categories": "Categories",
    "nav.deals": "Deals",
    "nav.howItWorks": "How it Works",
    "nav.activity": "Activity",
    "nav.sell": "Sell (0% Fee)",
    "nav.mobileApp": "Mobile App",
    "nav.searchPlaceholder": "Search for books, laptops, phones...",
    "nav.notifications": "Notifications",
    "nav.wishlist": "Wishlist",
    "nav.signIn": "Sign In",
    "nav.catElectronics": "Electronics & Computing",
    "nav.catBooks": "Books & Study Materials",
    "nav.catPhones": "Phones & Accessories",
    "nav.catFashion": "Campus Fashion & Dorm",

    // Hero Section
    "hero.badge": "Student Marketplace",
    "hero.title1": "Buy, Sell and",
    "hero.title2": "Exchange with",
    "hero.title3": "Confidence.",
    "hero.subtitle": "A trusted marketplace for students to find great deals on educational and everyday items across Ethiopian universities.",
    "hero.btnExplore": "Explore Marketplace",
    "hero.btnSell": "Start Selling",
    "hero.trustVerified": "Verified Listings",
    "hero.trustFee": "5% Service Fee",
    "hero.trustCommunity": "Student Community",
    "hero.floatDeals": "Great Deals",
    "hero.floatDealsSub": "for Students",
    "hero.floatSafe": "Buy • Sell",
    "hero.floatSafeSub": "Safe Exchange",
    "hero.floatBooks": "Books & Gadgets",
    "hero.floatBooksSub": "Campus Verified",

    // Categories
    "cat.all": "All Categories",
    "cat.books": "Books & Study",
    "cat.laptops": "Laptops & Computers",
    "cat.phones": "Phones & Accessories",
    "cat.fashion": "Fashion",
    "cat.furniture": "Furniture",
    "cat.sports": "Sports & Fitness",
    "cat.more": "More",

    // Featured Products
    "products.sectionTag": "Verified Student Listings",
    "products.title": "Featured for Students",
    "products.viewAll": "View All Products",
    "products.showLess": "Show Less",
    "products.noResults": "No student listings matched your criteria.",
    "products.clearFilters": "Clear filters & view all products",
    "products.orderEscrow": "Order with SafeTrade Escrow",
    "products.saveFavorite": "Save to favorites",
    "products.currency": "ETB",
    "products.promoTitle": "Sell Your Items",
    "products.promoDesc": "Turn your unused books, tech, and dorm essentials into cash. 0% seller fee promo.",
    "products.promoBtn": "Start Selling",

    // How it works
    "hiw.tag": "Managed SafeTrade Escrow",
    "hiw.title": "Why Students in Ethiopia Trust Estud",
    "hiw.subtitle": "No meeting strangers with cash. No scam risks. Estud holds payment safely in escrow until you inspect and approve your item.",
    "hiw.step1Title": "List & Valuation",
    "hiw.step1Desc": "Upload your item photos and proposed price. Estud reviews condition and sets the verified value.",
    "hiw.step2Title": "Escrow Payment",
    "hiw.step2Desc": "Buyer transfers funds via Telebirr or CBE Birr to Estud escrow. Admin verifies receipt before release.",
    "hiw.step3Title": "Campus Gate Delivery",
    "hiw.step3Desc": "A campus representative coordinates physical handover. The buyer inspects the item and provides a 4-digit PIN.",
    "hiw.step4Title": "100% Seller Payout",
    "hiw.step4Desc": "Upon PIN confirmation, the seller immediately receives 100% of their approved item value with zero hidden deductions.",

    // Footer
    "footer.desc": "The premier student-to-student marketplace in Ethiopia. Buy, sell, and exchange educational materials, electronics, and campus living goods with managed escrow security.",
    "footer.supported": "Supported: Telebirr • CBE Birr • Commercial Bank of Ethiopia",
    "footer.copyright": "Estud Technologies PLC. Built for Ethiopian University Students.",
  },
  am: {
    // Top Banner
    "banner.text": "የEstud አዲስ ሴሚስተር ልዩ ቅናሽ፡ በመላው የኢትዮጵያ ዩኒቨርሲቲዎች ለመጽሐፍት፣ ላፕቶፖች እና የዶርም ዕቃዎች የ0% የሻጭ ክፍያ!",
    "banner.button": "መሸጥ ጀምር (0% ክፍያ)",

    // Navbar
    "nav.home": "ዋና ገጽ",
    "nav.explore": "አስስ",
    "nav.categories": "ምድቦች",
    "nav.deals": "ልዩ ቅናሾች",
    "nav.howItWorks": "አሰራር",
    "nav.activity": "እንቅስቃሴ",
    "nav.sell": "ሽጥ (0% ክፍያ)",
    "nav.mobileApp": "የስልክ መተግበሪያ",
    "nav.searchPlaceholder": "መጽሐፍት፣ ላፕቶፖች፣ ስልኮችን ይፈልጉ...",
    "nav.notifications": "ማሳወቂያዎች",
    "nav.wishlist": "የተወደዱ",
    "nav.signIn": "ግባ",
    "nav.catElectronics": "ኤሌክትሮኒክስ እና ኮምፒውተር",
    "nav.catBooks": "መጽሐፍት እና የጥናት ዕቃዎች",
    "nav.catPhones": "ስልኮች እና መለዋወጫዎች",
    "nav.catFashion": "የካምፓስ ፋሽን እና ዶርም",

    // Hero Section
    "hero.badge": "የተማሪዎች የገበያ ቦታ",
    "hero.title1": "በሙሉ እምነት",
    "hero.title2": "ይግዙ፣ ይሽጡ እና",
    "hero.title3": "ይለዋወጡ።",
    "hero.subtitle": "በኢትዮጵያ ዩኒቨርሲቲዎች ውስጥ ተማሪዎች የትምህርት እና የዕለት ተዕለት ዕቃዎችን በጥሩ ዋጋ የሚያገኙበት የታመነ የገበያ ቦታ።",
    "hero.btnExplore": "ገበያውን አስስ",
    "hero.btnSell": "መሸጥ ጀምር",
    "hero.trustVerified": "የተረጋገጡ ዕቃዎች",
    "hero.trustFee": "5% የአገልግሎት ክፍያ",
    "hero.trustCommunity": "የተማሪዎች ማህበረሰብ",
    "hero.floatDeals": "ምርጥ ቅናሾች",
    "hero.floatDealsSub": "ለተማሪዎች",
    "hero.floatSafe": "ግዢ እና ሽያጭ",
    "hero.floatSafeSub": "አስተማማኝ ልውውጥ",
    "hero.floatBooks": "መጽሐፍት እና መሣሪያዎች",
    "hero.floatBooksSub": "በካምፓስ የተረጋገጠ",

    // Categories
    "cat.all": "ሁሉም ምድቦች",
    "cat.books": "መጽሐፍት እና ጥናት",
    "cat.laptops": "ላፕቶፖች እና ኮምፒውተሮች",
    "cat.phones": "ስልኮች እና መለዋወጫዎች",
    "cat.fashion": "ፋሽን",
    "cat.furniture": "የዶርም ፈርኒቸር",
    "cat.sports": "ስፖርት እና ጤና",
    "cat.more": "ተጨማሪ",

    // Featured Products
    "products.sectionTag": "የተረጋገጡ የተማሪዎች ዕቃዎች",
    "products.title": "ለተማሪዎች የቀረቡ ምርቶች",
    "products.viewAll": "ሁሉንም ምርቶች እይ",
    "products.showLess": "ያነሰ አሳይ",
    "products.noResults": "የፈለጉትን መስፈርት የሚያሟላ ዕቃ አልተገኘም።",
    "products.clearFilters": "ሁሉንም ምርቶች አሳይ",
    "products.orderEscrow": "በEstud ኤስክሮው እዘዝ",
    "products.saveFavorite": "ወደ ተወዳጆች ጨምር",
    "products.currency": "ብር",
    "products.promoTitle": "የማይጠቀሙትን ዕቃ ይሽጡ",
    "products.promoDesc": "መጽሐፍት፣ ኤሌክትሮኒክስ እና የዶርም ዕቃዎችዎን ወደ ጥሬ ገንዘብ ይለውጡ። 0% የሻጭ ክፍያ።",
    "products.promoBtn": "መሸጥ ጀምር",

    // How it works
    "hiw.tag": "የተማሪዎች የታመነ የኤስክሮው ጥበቃ",
    "hiw.title": "ተማሪዎች ለምን Estudን ይመርጣሉ?",
    "hiw.subtitle": "የማያውቁትን ሰው በጥሬ ገንዘብ ማግኘት የለም። የማጭበርበር ስጋት የለም። እቃዎን አይተው እስኪያረጋግጡ ድረስ ክፍያዎ በአስተማማኝ ሁኔታ በኤስክሮው ይጠበቃል።",
    "hiw.step1Title": "ዕቃ መመዝገብ እና ዋጋ መወሰን",
    "hiw.step1Desc": "የዕቃዎን ፎቶ እና ዋጋ ይለጥፉ። Estud ሁኔታውን ገምግሞ ትክክለኛውን ዋጋ ያረጋግጣል።",
    "hiw.step2Title": "የኤስክሮው ክፍያ",
    "hiw.step2Desc": "ገዢው በቴሌብር ወይም በሲቢኢ ብር ወደ Estud ኤስክሮው ያስተላልፋል።",
    "hiw.step3Title": "የካምፓስ ዴስክ ርክክብ",
    "hiw.step3Desc": "በካምፓስ ተወካይ አማካኝነት እቃው ይደርሳል። ገዢው እቃውን ፈትሾ የ4-ዲጂት ፒን ይሰጣል።",
    "hiw.step4Title": "100% ለሻጩ የሚከፈል",
    "hiw.step4Desc": "ፒኑ ሲረጋገጥ፣ ሻጩ ያለምንም ቅናሽ 100% የተስማማበትን ገንዘብ ወዲያውኑ ይቀበላል።",

    // Footer
    "footer.desc": "በኢትዮጵያ ቀዳሚው የተማሪ ለተማሪ የገበያ ቦታ። የትምህርት መሣሪያዎችን፣ ኤሌክትሮኒክስ እና የካምፓስ ዕቃዎችን በአስተማማኝ ኤስክሮው ይግዙ፣ ይሽጡ እና ይለዋወጡ።",
    "footer.supported": "የሚደገፉ፡ ቴሌብር • ሲቢኢ ብር • የኢትዮጵያ ንግድ ባንክ",
    "footer.copyright": "ኢስቱድ ቴክኖሎጂስ ኃ/የተ/የግ/ማህበር። ለኢትዮጵያ ዩኒቨርሲቲ ተማሪዎች የተዘጋጀ።",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("estud_language") as Language;
    if (saved === "en" || saved === "am") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("estud_language", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "am" : "en";
    setLanguage(next);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
