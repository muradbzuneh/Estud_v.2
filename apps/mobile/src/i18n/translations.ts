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
    tabSell: "Sell",
    tabActivity: "Activity",
    tabProfile: "Profile",

    campusLabel: "Campus Hub",
    signIn: "Sign In",
    signOut: "Sign Out",
    notifications: "Notifications",

    heroBadge: "Student Marketplace",
    heroLiveCampus: "Campus Live",
    heroTitle1: "Campus",
    heroTitle2: "Marketplace",
    heroTitleAccent: "Verified.",
    heroSubtitle: "Buy, sell & trade safely with campus buyer protection.",
    heroExploreBtn: "Explore",
    heroSellBtn: "Sell",
    heroFeature1: "SafeTrade Buyer Protection",
    heroFeature2: "Campus Intermediary Desks",
    heroFeature3: "0% Seller Fee • 100% Cash",

    searchPlaceholder: "Search laptops, books, phones...",
    catAll: "All",
    catLaptops: "Laptops",
    catPhones: "Phones",
    catBooks: "Books",
    catGear: "Gear",
    catDorm: "Dorm",
    catMore: "More",

    trustEscrowTitle: "Buyer Protection",
    trustEscrowSub: "Funds held safely until inspection",
    trustHubTitle: "Campus Hubs",
    trustHubSub: "Safe in-person pickup desks",
    featuredTitle: "Featured Items",
    viewAll: "View All",

    exploreTitle: "Explore Listings",
    exploreSubtitle: "Verified campus essentials & gear",
    filterByCampus: "Campus:",
    change: "Change",
    sortFeatured: "Featured",
    sortLowestPrice: "Lowest Price",
    sortTopRated: "Top Rated",
    itemsCount: "items",

    sellBannerText: "0% Seller Fee • 100% Cash via SafeTrade",
    sellTitle: "List Item",
    sellSubtitle: "Post verified campus essentials for fellow students",
    step1Photo: "Photos",
    step2Specs: "Details",
    step3Pricing: "Price",
    step4Barter: "Trade Option",
    itemTitleLabel: "Title *",
    categoryLabel: "Category *",
    campusHubLabel: "Campus *",
    conditionLabel: "Condition *",
    askingPriceLabel: "Price (ETB) *",
    guaranteedPayoutLabel: "Payout:",
    barterToggleLabel: "Accept item trades",
    barterToggleSub: "Open for exchanges",
    submitListingBtn: "Submit Listing",

    activityTitle: "Protected Orders",
    activitySubtitle: "Track active trades & pickup PINs",
    tabActiveEscrow: "Active",
    tabCompletedEscrow: "Completed",
    secretPinTitle: "Inspection PIN",
    secretPinNotice: "Share with the campus desk only after inspecting the item.",
    btnConfirmInspection: "Accept Item",
    btnReportIssue: "Report Issue",

    profileTitle: "Profile",
    trustScoreLabel: "SafeTrade Trust Score",
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
    tabSell: "ሽጥ",
    tabActivity: "እንቅስቃሴ",
    tabProfile: "መገለጫ",

    campusLabel: "የካምፓስ ማዕከል",
    signIn: "ይግቡ",
    signOut: "ይውጡ",
    notifications: "ማሳወቂያዎች",

    heroBadge: "የተማሪዎች ገበያ",
    heroLiveCampus: "ቀጥታ",
    heroTitle1: "የካምፓስ",
    heroTitle2: "ገበያ",
    heroTitleAccent: "የተረጋገጠ።",
    heroSubtitle: "በሴፍ ትሬድ ዋስትና በደህንነት ይግዙ፣ ይሽጡ እና ይለውጡ።",
    heroExploreBtn: "ያስሱ",
    heroSellBtn: "ይሽጡ",
    heroFeature1: "የሴፍ ትሬድ የገዢ ጥበቃ",
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

    trustEscrowTitle: "የተጠበቀ ክፍያ",
    trustEscrowSub: "ዕቃው በአካል እስኪፈተሽ ድረስ ክፍያው ደህንነቱ የተጠበቀ ነው",
    trustHubTitle: "የካምፓስ ዴስኮች",
    trustHubSub: "በአካል ተገናኝተው ለመረከብ",
    featuredTitle: "ተመራጭ ዕቃዎች",
    viewAll: "ሁሉንም እይ",

    exploreTitle: "ዝርዝሮችን ያስሱ",
    exploreSubtitle: "የተረጋገጡ የካምፓስ ዕቃዎች",
    filterByCampus: "የተጣራው በ:",
    change: "ቀይር",
    sortFeatured: "ተመራጭ",
    sortLowestPrice: "ዝቅተኛ ዋጋ",
    sortTopRated: "ከፍተኛ ደረጃ",
    itemsCount: "ዕቃዎች",

    sellBannerText: "0% የሻጭ ክፍያ • ሙሉ ገንዘብ በሴፍ ትሬድ",
    sellTitle: "ዕቃ ይሽጡ",
    sellSubtitle: "ለተማሪዎች ዕቃዎችን በደህንነት ይለጥፉ",
    step1Photo: "ፎቶዎች",
    step2Specs: "ዝርዝር",
    step3Pricing: "ዋጋ",
    step4Barter: "የልውውጥ አማራጭ",
    itemTitleLabel: "ስም *",
    categoryLabel: "ምድብ *",
    campusHubLabel: "ካምፓስ *",
    conditionLabel: "ሁኔታ *",
    askingPriceLabel: "ዋጋ (ብር) *",
    guaranteedPayoutLabel: "ክፍያዎ:",
    barterToggleLabel: "የዕቃ ልውውጥ እቀበላለሁ",
    barterToggleSub: "ለልውውጥ ክፍት ነው",
    submitListingBtn: "ይለጥፉ",

    activityTitle: "የተጠበቁ ትዕዛዞች",
    activitySubtitle: "የተጠበቁ ግብይቶች እና የመቀበያ ፒን",
    tabActiveEscrow: "በሂደት ላይ",
    tabCompletedEscrow: "የተጠናቀቁ",
    secretPinTitle: "የመፈተሻ ፒን",
    secretPinNotice: "ይህን ኮድ ዕቃውን ፈትሸው ካረጋገጡ በኋላ ብቻ ለዴስክ ይስጡ።",
    btnConfirmInspection: "ተቀብያለሁ",
    btnReportIssue: "ችግር ሪፖርት አድርግ",

    profileTitle: "መገለጫ",
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
