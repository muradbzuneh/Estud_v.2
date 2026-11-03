export type Language = "en" | "am";

export interface Translations {
  // Navigation
  tabHome: string;
  tabExplore: string;
  tabSell: string;
  tabActivity: string;
  tabProfile: string;

  // Header
  campusLabel: string;
  signIn: string;
  signOut: string;
  notifications: string;

  // Hero Section
  heroBadge: string;
  heroLiveCampus: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroExploreBtn: string;
  heroSellBtn: string;
  heroFeature1: string;
  heroFeature2: string;
  heroFeature3: string;

  // Search & Categories
  searchPlaceholder: string;
  catAll: string;
  catLaptops: string;
  catPhones: string;
  catBooks: string;
  catGear: string;
  catDorm: string;
  catMore: string;

  // Home Trust Strip
  trustEscrowTitle: string;
  trustEscrowSub: string;
  trustHubTitle: string;
  trustHubSub: string;
  featuredTitle: string;
  viewAll: string;

  // Explore
  exploreTitle: string;
  exploreSubtitle: string;
  filterByCampus: string;
  change: string;
  sortFeatured: string;
  sortLowestPrice: string;
  sortTopRated: string;
  itemsCount: string;

  // Sell
  sellBannerText: string;
  sellTitle: string;
  sellSubtitle: string;
  step1Photo: string;
  step2Specs: string;
  step3Pricing: string;
  step4Barter: string;
  itemTitleLabel: string;
  categoryLabel: string;
  campusHubLabel: string;
  conditionLabel: string;
  askingPriceLabel: string;
  guaranteedPayoutLabel: string;
  barterToggleLabel: string;
  barterToggleSub: string;
  submitListingBtn: string;

  // SafeTrade Escrow & Activity
  activityTitle: string;
  activitySubtitle: string;
  tabActiveEscrow: string;
  tabCompletedEscrow: string;
  secretPinTitle: string;
  secretPinNotice: string;
  btnConfirmInspection: string;
  btnReportIssue: string;

  // Profile & Settings
  profileTitle: string;
  trustScoreLabel: string;
  safeTradesLabel: string;
  savedItemsLabel: string;
  savedListingsTitle: string;
  sectionPreferences: string;
  themeSetting: string;
  themeLight: string;
  themeDark: string;
  languageSetting: string;
  appVersionTitle: string;
  btnCheckUpdates: string;
  isUpToDate: string;
  campusIntermediarySupport: string;
  safeTradeProtectionGuarantee: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    tabHome: "Home",
    tabExplore: "Explore",
    tabSell: "Sell (0%)",
    tabActivity: "Activity",
    tabProfile: "Profile",

    campusLabel: "Campus Hub",
    signIn: "Sign In",
    signOut: "Sign Out",
    notifications: "Notifications",

    heroBadge: "Verified Student Marketplace",
    heroLiveCampus: "Campus Live",
    heroTitle1: "Buy, Sell and",
    heroTitle2: "Exchange with",
    heroTitleAccent: "Confidence.",
    heroSubtitle: "Find verified campus essentials across Ethiopian universities with 100% SafeTrade Escrow protection.",
    heroExploreBtn: "Explore Marketplace",
    heroSellBtn: "Start Selling",
    heroFeature1: "SafeTrade Escrow Protection",
    heroFeature2: "Campus Intermediary Desks",
    heroFeature3: "0% Seller Fee • 100% Cash",

    searchPlaceholder: "Search for laptops, textbooks, phones...",
    catAll: "All Items",
    catLaptops: "Laptops",
    catPhones: "Phones",
    catBooks: "Books",
    catGear: "Gear",
    catDorm: "Dorm",
    catMore: "More",

    trustEscrowTitle: "5% Escrow Protection",
    trustEscrowSub: "Funds held safely until inspection",
    trustHubTitle: "Campus Hub Desks",
    trustHubSub: "Safe in-person pickup desks",
    featuredTitle: "Featured for Students",
    viewAll: "View All",

    exploreTitle: "Explore Campus Listings",
    exploreSubtitle: "Verified university gear, laptops, and study materials",
    filterByCampus: "Filtered by:",
    change: "Change",
    sortFeatured: "Featured",
    sortLowestPrice: "Lowest Price",
    sortTopRated: "Top Rated",
    itemsCount: "items",

    sellBannerText: "0% Seller Fee • 100% Cash to You via SafeTrade Escrow",
    sellTitle: "List an Item for Sale / Exchange",
    sellSubtitle: "Sell directly to fellow students across Ethiopian universities with safe escrow handover.",
    step1Photo: "Upload Photos",
    step2Specs: "Item Specifications",
    step3Pricing: "Pricing & Guaranteed Payout",
    step4Barter: "Open for Item Exchange / Barter?",
    itemTitleLabel: "Item Title *",
    categoryLabel: "Category *",
    campusHubLabel: "Campus Hub *",
    conditionLabel: "Condition Grade *",
    askingPriceLabel: "Asking Price (ETB) *",
    guaranteedPayoutLabel: "Your Guaranteed Payout at Campus Desk:",
    barterToggleLabel: "Allow students to offer another item with cash balance",
    barterToggleSub: "Open for barter/trade offers",
    submitListingBtn: "Submit Listing for Campus Review",

    activityTitle: "SafeTrade Escrow Activity",
    activitySubtitle: "Track your student trades & secret pickup PINs",
    tabActiveEscrow: "Active Escrows",
    tabCompletedEscrow: "Completed",
    secretPinTitle: "Secret 4-Digit Inspection PIN",
    secretPinNotice: "Share this code with the desk intermediary only after you physically test the item.",
    btnConfirmInspection: "I Inspected & Accept Item",
    btnReportIssue: "Report Issue",

    profileTitle: "Student Profile",
    trustScoreLabel: "Escrow Trust Score",
    safeTradesLabel: "Safe Trades",
    savedItemsLabel: "Saved Items",
    savedListingsTitle: "Saved Listings",
    sectionPreferences: "App Preferences & Settings",
    themeSetting: "Theme Mode",
    themeLight: "Light (Default)",
    themeDark: "Dark Midnight",
    languageSetting: "Language (ቋንቋ)",
    appVersionTitle: "App Version & Updates",
    btnCheckUpdates: "Check for Updates",
    isUpToDate: "Estud is up to date (v2.1.0)",
    campusIntermediarySupport: "Campus Intermediary Support",
    safeTradeProtectionGuarantee: "SafeTrade Buyer & Seller Protection",
  },
  am: {
    tabHome: "መነሻ",
    tabExplore: "አስስ",
    tabSell: "ሽጥ (0%)",
    tabActivity: "እንቅስቃሴ",
    tabProfile: "መገለጫ",

    campusLabel: "የካምፓስ ማዕከል",
    signIn: "ይግቡ",
    signOut: "ይውጡ",
    notifications: "ማሳወቂያዎች",

    heroBadge: "የተረጋገጠ የተማሪዎች የገበያ ቦታ",
    heroLiveCampus: "ካምፓስ ላይቭ",
    heroTitle1: "በእርግጠኝነት ይግዙ፣",
    heroTitle2: "ይሽጡ እና",
    heroTitleAccent: "ይለዋወጡ።",
    heroSubtitle: "በኢትዮጵያ ዩኒቨርሲቲዎች ውስጥ የተረጋገጡ የተማሪ ዕቃዎችን በ100% ሴፍ ትሬድ ዋስትና ይግዙ እና ይሽጡ።",
    heroExploreBtn: "ገበያውን ያስሱ",
    heroSellBtn: "መሸጥ ይጀምሩ",
    heroFeature1: "የሴፍ ትሬድ ዋስትና ጥበቃ",
    heroFeature2: "የካምፓስ ደላላ ዴስኮች",
    heroFeature3: "0% የሻጭ ክፍያ • 100% ገንዘብ",

    searchPlaceholder: "ላፕቶፖች፣ መጽሐፍት፣ ስልኮች ይፈልጉ...",
    catAll: "ሁሉም",
    catLaptops: "ላፕቶፖች",
    catPhones: "ስልኮች",
    catBooks: "መጽሐፍት",
    catGear: "ዕቃዎች",
    catDorm: "ዶርም",
    catMore: "ተጨማሪ",

    trustEscrowTitle: "5% የኤስክሮው ጥበቃ",
    trustEscrowSub: "ዕቃው እስኪፈተሽ ድረስ ገንዘብ ደህንነቱ የተጠበቀ ነው",
    trustHubTitle: "የካምፓስ ዴስኮች",
    trustHubSub: "በአካል ተገናኝተው ለመረከብ",
    featuredTitle: "ለተማሪዎች የቀረቡ",
    viewAll: "ሁሉንም እይ",

    exploreTitle: "የካምፓስ ዝርዝሮችን ያስሱ",
    exploreSubtitle: "የተረጋገጡ የዩኒቨርሲቲ ዕቃዎች፣ ላፕቶፖች እና የትምህርት መጽሐፍት",
    filterByCampus: "የተጣራው በ:",
    change: "ቀይር",
    sortFeatured: "ተመራጭ",
    sortLowestPrice: "ዝቅተኛ ዋጋ",
    sortTopRated: "ከፍተኛ ደረጃ",
    itemsCount: "ዕቃዎች",

    sellBannerText: "0% የሻጭ ክፍያ • ሙሉ ገንዘብዎ በሴፍ ትሬድ ይደርስዎታል",
    sellTitle: "ዕቃ ለመሸጥ ወይም ለመለወጥ ይለጥፉ",
    sellSubtitle: "በኢትዮጵያ ዩኒቨርሲቲዎች ላሉ ተማሪዎች ዕቃዎችን በደህንነት ይሽጡ።",
    step1Photo: "ፎቶዎችን ይጫኑ",
    step2Specs: "የዕቃው መግለጫ",
    step3Pricing: "ዋጋ እና የተረጋገጠ ክፍያ",
    step4Barter: "በዕቃ ለመለወጥ ክፍት ነዎት?",
    itemTitleLabel: "የዕቃው ስም *",
    categoryLabel: "ምድብ *",
    campusHubLabel: "የካምፓስ ማዕከል *",
    conditionLabel: "የዕቃው ሁኔታ *",
    askingPriceLabel: "የሚሸጥበት ዋጋ (ETB) *",
    guaranteedPayoutLabel: "በካምፓስ ዴስክ የሚደርሶት የተረጋገጠ ክፍያ:",
    barterToggleLabel: "ተማሪዎች ሌላ ዕቃ ከቀሪ ብር ጋር እንዲያቀርቡ ይፍቀዱ",
    barterToggleSub: "ለዕቃ ልውውጥ ክፍት ነው",
    submitListingBtn: "ለካምፓስ ግምገማ ይለጥፉ",

    activityTitle: "የሴፍ ትሬድ ዋስትና እንቅስቃሴ",
    activitySubtitle: "የእርስዎን ግብይቶች እና ሚስጥራዊ ፒን ይከታተሉ",
    tabActiveEscrow: "በሂደት ላይ ያሉ",
    tabCompletedEscrow: "የተጠናቀቁ",
    secretPinTitle: "ሚስጥራዊ ባለ 4-ዲጂት መፈተሻ ፒን",
    secretPinNotice: "ይህን ኮድ ዕቃውን በአካል ፈትሸው ካረጋገጡ በኋላ ብቻ ለካምፓስ ዴስክ ይስጡ።",
    btnConfirmInspection: "ዕቃውን ፈትሼ ተቀብያለሁ",
    btnReportIssue: "ችግር ሪፖርት አድርግ",

    profileTitle: "የተማሪ መገለጫ",
    trustScoreLabel: "የእምነት ደረጃ",
    safeTradesLabel: "የተሳኩ ግብይቶች",
    savedItemsLabel: "የተቀመጡ ዕቃዎች",
    savedListingsTitle: "የተቀመጡ ዝርዝሮች",
    sectionPreferences: "የመተግበሪያ ምርጫዎች እና ቅንብሮች",
    themeSetting: "የገጽታ ሁነታ (Theme)",
    themeLight: "ብርሃን (Light - መደበኛ)",
    themeDark: "ጨለማ (Dark Midnight)",
    languageSetting: "ቋንቋ (Language)",
    appVersionTitle: "የመተግበሪያ ስሪት እና ዝመናዎች",
    btnCheckUpdates: "አዲስ ስሪት ፈትሽ",
    isUpToDate: "ኢስቱድ አዳዲሱ ስሪት ላይ ነው (v2.1.0)",
    campusIntermediarySupport: "የካምፓስ ደላላ ድጋፍ",
    safeTradeProtectionGuarantee: "የሴፍ ትሬድ የገዢ እና ሻጭ ዋስትና",
  },
};
