import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { MobileProductItem } from "../components/MobileProductCard";
import { ThemeMode, ColorPalette, getThemeColors } from "../theme/theme";
import { Language, Translations, translations } from "../i18n/translations";
import { showSuccessToast, showInfoToast, showUpdateToast } from "../utils/toast";
import {
  checkoutWithEscrowMobile,
  fetchLiveProductsMobile,
  fetchLiveBroadcastsMobile,
  submitProductMobile,
  CampusBroadcastItem,
  AppReleaseInfo,
  fetchLatestReleaseMobile,
} from "../utils/api";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  campus: string;
  studentId: string;
  trustScore: number;
  tradesCompleted: number;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface EscrowOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  escrowFee: number;
  totalAmount: number;
  imageUrl: string;
  campusHub: string;
  sellerName: string;
  collectionMethod: "hub" | "runner";
  paymentMethod: "telebirr" | "cbe" | "cash";
  secretPin: string;
  expiresAt: number;
  expiresFormatted: string;
  isExpired?: boolean;
  transactionReference?: string;
  screenshotUrl?: string;
  status: "secured" | "at_hub" | "ready_inspection" | "completed" | "disputed";
  createdAt: string;
}

export type MobileTab = "home" | "explore" | "sell" | "activity" | "profile";

export const ETHIOPIAN_CAMPUSES = [
  "AAU 4 Kilo (Science)",
  "AAiT 5 Kilo (Technology)",
  "AAU 6 Kilo (Main)",
  "ASTU Adama",
  "Hawassa University",
  "Jimma University",
  "Bahir Dar University",
  "Mekelle University",
];

export const INITIAL_PRODUCTS: MobileProductItem[] = [
  {
    id: "prod-1",
    title: "Dell Inspiron 15 (i5 11th Gen, 16GB RAM)",
    category: "laptops",
    condition: "Used • Like New",
    price: 18500,
    originalPrice: 22000,
    rating: 4.9,
    reviewCount: 128,
    badge: "Best Seller",
    location: "AAU 4 Kilo (Science)",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    title: "Sony Noise-Canceling Wireless Earbuds",
    category: "phones",
    condition: "Brand New • Sealed",
    price: 2500,
    originalPrice: 3500,
    rating: 4.8,
    reviewCount: 95,
    badge: "Popular",
    location: "AAiT 5 Kilo (Technology)",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    title: "Thomas Calculus 14th Edition (Hardcover)",
    category: "books",
    condition: "Used • Good Condition",
    price: 650,
    originalPrice: 950,
    rating: 4.9,
    reviewCount: 64,
    badge: "New",
    location: "Hawassa University",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    title: "Heavy-Duty Ergonomic Campus Backpack",
    category: "fashion",
    condition: "Brand New • Waterproof",
    price: 1350,
    originalPrice: 1700,
    rating: 4.7,
    reviewCount: 82,
    badge: "20% OFF",
    location: "ASTU Adama",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    title: "Casio fx-991EX ClassWiz Calculator",
    category: "laptops",
    condition: "Used • Like New",
    price: 2800,
    originalPrice: 3200,
    rating: 5.0,
    reviewCount: 142,
    badge: "Best Seller",
    location: "AAU 4 Kilo (Science)",
    imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-6",
    title: "Dorm Compact Electric Kettle & Boiler (1.8L)",
    category: "sports",
    condition: "Used • Like New",
    price: 950,
    originalPrice: 1300,
    rating: 4.6,
    reviewCount: 38,
    badge: "Popular",
    location: "Jimma University",
    imageUrl: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&auto=format&fit=crop&q=80",
  },
];

const INITIAL_EXPIRATION_TIME = Date.now() + 48 * 60 * 60 * 1000;
const INITIAL_EXPIRATION_FORMATTED = new Date(INITIAL_EXPIRATION_TIME).toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const INITIAL_ORDERS: EscrowOrder[] = [
  {
    id: "ord-1",
    orderNumber: "EST-84920",
    productId: "prod-1",
    productTitle: "Dell Inspiron 15 (i5 11th Gen, 16GB RAM)",
    productPrice: 18500,
    escrowFee: 925,
    totalAmount: 19425,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
    campusHub: "AAU 4 Kilo - Science Faculty Intermediary Desk",
    sellerName: "Alazar T. (AAU CS Senior)",
    collectionMethod: "hub",
    paymentMethod: "telebirr",
    secretPin: "7 2 9 4",
    expiresAt: INITIAL_EXPIRATION_TIME,
    expiresFormatted: `Valid for 48h until ${INITIAL_EXPIRATION_FORMATTED}`,
    isExpired: false,
    status: "ready_inspection",
    createdAt: "Today, 10:15 AM",
  },
];

const DEFAULT_USER: StudentUser = {
  id: "usr-1",
  name: "Murad Bezuneh",
  email: "murad.b@student.aau.edu.et",
  campus: "AAU 4 Kilo (Science)",
  studentId: "UGR/4921/14",
  trustScore: 99,
  tradesCompleted: 16,
  isVerified: true,
};

interface AppContextType {
  // Theme & Language
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  colors: ColorPalette;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // User & Auth
  user: StudentUser | null;
  isAuthenticated: boolean;
  login: (name: string, email: string, campus: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthModalVisible: boolean;
  setAuthModalVisible: (visible: boolean) => void;

  // Navigation
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;

  // Campus
  currentCampus: string;
  setCurrentCampus: (campus: string) => void;
  isCampusModalVisible: boolean;
  setCampusModalVisible: (visible: boolean) => void;

  // Real-time Products & Broadcasts
  products: MobileProductItem[];
  addProduct: (product: Omit<MobileProductItem, "id" | "rating" | "reviewCount">) => Promise<void>;
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
  broadcasts: CampusBroadcastItem[];
  isLiveConnected: boolean;
  lastSyncedAt: Date | null;
  refreshLiveProducts: () => Promise<void>;
  refreshLiveBroadcasts: () => Promise<void>;

  // Product Detail & Checkout Modal
  selectedProduct: MobileProductItem | null;
  setSelectedProduct: (product: MobileProductItem | null) => void;

  // Escrow Orders & Expiration
  orders: EscrowOrder[];
  createOrder: (order: Omit<EscrowOrder, "id" | "orderNumber" | "secretPin" | "expiresAt" | "expiresFormatted" | "status" | "createdAt">) => EscrowOrder;
  completeOrder: (orderId: string) => void;
  regenerateOrderPin: (orderId: string) => string;

  // Lost & Found Desk Modal
  isLostFoundModalVisible: boolean;
  setLostFoundModalVisible: (visible: boolean) => void;

  // Version & Updates
  appVersion: string;
  serverRelease: AppReleaseInfo | null;
  isUpdateAvailable: boolean;
  isUpdateModalVisible: boolean;
  setUpdateModalVisible: (visible: boolean) => void;
  checkForUpdates: (silent?: boolean) => Promise<void>;
  upgradeAppVersion: (newVer?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [language, setLanguageState] = useState<Language>("en");

  const [user, setUser] = useState<StudentUser | null>(DEFAULT_USER);
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [currentCampus, setCurrentCampusState] = useState<string>("AAU 4 Kilo (Science)");
  const [isCampusModalVisible, setCampusModalVisible] = useState(false);
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isLostFoundModalVisible, setLostFoundModalVisible] = useState(false);

  // Products and real-time connectivity
  const [products, setProducts] = useState<MobileProductItem[]>(INITIAL_PRODUCTS);
  const [broadcasts, setBroadcasts] = useState<CampusBroadcastItem[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "prod-1": true, "prod-2": true });
  const [selectedProduct, setSelectedProduct] = useState<MobileProductItem | null>(null);
  const [orders, setOrders] = useState<EscrowOrder[]>(INITIAL_ORDERS);

  const colors = getThemeColors(theme);
  const t = translations[language];
  const [appVersion, setAppVersion] = useState<string>("v2.3.1");
  const [serverRelease, setServerRelease] = useState<AppReleaseInfo | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const hasPromptedUpdateRef = useRef<boolean>(false);

  /**
   * Automatically queries server for new releases and shows update alert if available
   */
  const checkForUpdates = useCallback(async (silent = false) => {
    try {
      const release = await fetchLatestReleaseMobile();
      if (release) {
        setIsLiveConnected(true);
        setLastSyncedAt(new Date());
        setServerRelease(release);
        const serverVer = release.version.replace(/^v/, "").trim();
        const currentVer = appVersion.replace(/^v/, "").trim();
        const hasNewerVersion = serverVer !== currentVer;

        if (hasNewerVersion) {
          setIsUpdateAvailable(true);
          if (!silent) {
            setUpdateModalVisible(true);
            showUpdateToast(
              language === "am" ? "አዲስ ዝመና ተገኝቷል!" : `New Update Available (${release.version})!`,
              release.title
            );
          } else if (release.forceUpdate && !hasPromptedUpdateRef.current) {
            hasPromptedUpdateRef.current = true;
            setUpdateModalVisible(true);
          }
        } else {
          setIsUpdateAvailable(false);
          if (!silent) {
            showSuccessToast(
              language === "am" ? "የቅርብ ጊዜ ስሪት ነው" : "You are up to date!",
              `Running Estud ${appVersion}`
            );
          }
        }
      }
    } catch {
      // Offline fallback
    }
  }, [appVersion, language]);

  /**
   * Refreshes active listings from PostgreSQL
   */
  const refreshLiveProducts = useCallback(async () => {
    try {
      const live = await fetchLiveProductsMobile();
      if (live) {
        if (live.length > 0) {
          setProducts(live);
        }
        setIsLiveConnected(true);
        setLastSyncedAt(new Date());
      }
    } catch {
      // Offline fallback
    }
  }, []);

  /**
   * Refreshes real-time campus broadcasts sent from the Admin Desk
   */
  const refreshLiveBroadcasts = useCallback(async () => {
    try {
      const liveNews = await fetchLiveBroadcastsMobile();
      if (liveNews) {
        if (liveNews.length > 0) {
          setBroadcasts(liveNews);
        }
        setIsLiveConnected(true);
        setLastSyncedAt(new Date());
      }
    } catch {
      // Offline fallback
    }
  }, []);

  // Live Auto-Sync polling: fetches live products, news, and updates automatically every 8 seconds
  useEffect(() => {
    refreshLiveProducts();
    refreshLiveBroadcasts();
    checkForUpdates(true);

    const interval = setInterval(() => {
      refreshLiveProducts();
      refreshLiveBroadcasts();
      checkForUpdates(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [refreshLiveProducts, refreshLiveBroadcasts, checkForUpdates]);

  const upgradeAppVersion = (newVer?: string) => {
    const updated = newVer || (serverRelease ? `v${serverRelease.version}` : "v2.3.1");
    setAppVersion(updated);
    setIsUpdateAvailable(false);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const setCurrentCampus = (campus: string) => {
    setCurrentCampusState(campus);
  };

  const login = (name: string, email: string, campus: string) => {
    const newUser: StudentUser = {
      id: "usr-" + Date.now(),
      name: name.trim() || "Student Trader",
      email: email.trim() || "student@estud.et",
      campus: campus || "AAU 4 Kilo (Science)",
      studentId: `UGR/${Math.floor(1000 + Math.random() * 9000)}/16`,
      trustScore: 99,
      tradesCompleted: 4,
      isVerified: true,
    };
    setUser(newUser);
    setAuthModalVisible(false);
    showSuccessToast(
      language === "am" ? "እንኳን ደህና መጡ!" : "Welcome to Estud!",
      `Logged in as ${newUser.name}`
    );
  };

  const loginWithGoogle = async () => {
    const googleUser: StudentUser = {
      id: "google-" + Date.now(),
      name: "Murad Bezuneh",
      email: "murad.b@student.aau.edu.et",
      campus: "AAU 4 Kilo (Science)",
      studentId: "UGR/4921/14",
      trustScore: 100,
      tradesCompleted: 18,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
    };
    setUser(googleUser);
    setAuthModalVisible(false);
    showSuccessToast(
      language === "am" ? "በGoogle በተሳካ ሁኔታ ገብተዋል" : "Signed in with Google",
      `Connected as ${googleUser.email}`
    );
  };

  const logout = () => {
    setUser(null);
    showInfoToast(
      language === "am" ? "ከመለያዎ ወጥተዋል" : "Signed Out",
      "You are browsing in guest mode"
    );
  };

  /**
   * Submits student listing for Admin Desk review & approval before going live
   */
  const addProduct = async (newProduct: Omit<MobileProductItem, "id" | "rating" | "reviewCount">) => {
    const tempId = "prod-" + Date.now();
    const item: MobileProductItem = {
      ...newProduct,
      id: tempId,
      rating: 5.0,
      reviewCount: 1,
      badge: "New",
    };

    showSuccessToast(
      language === "am" ? "ዕቃዎ ለግምገማ ቀርቧል!" : "Submitted for Review!",
      language === "am"
        ? `"${item.title}" በአድሚን ተገምግሞ ሲፈቀድ በገበያው ላይ ይታያል።`
        : `"${item.title}" will appear live on marketplace once approved by Admin.`
    );

    try {
      await submitProductMobile({
        title: item.title,
        description: `${item.title} (${item.condition}) - Listed from mobile at ${item.location}`,
        category: item.category || "laptops",
        condition: (item.condition?.includes("Brand")
          ? "NEW"
          : item.condition?.includes("Good")
          ? "GOOD"
          : "LIKE_NEW") as any,
        price: item.price,
        campus: item.location,
        imageUrl: item.imageUrl,
        sellerName: user?.name || "Verified Student Seller",
        sellerId: user?.id,
      });

      // Refresh live approved products
      await refreshLiveProducts();
    } catch (err: any) {
      console.warn("[Mobile API] Listing submission note:", err?.message || err);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /**
   * Creates escrow order with 48-Hour PIN expiration and syncs payment proof to Admin Queue
   */
  const createOrder = (
    orderData: Omit<
      EscrowOrder,
      "id" | "orderNumber" | "secretPin" | "expiresAt" | "expiresFormatted" | "status" | "createdAt"
    >
  ) => {
    const randomPin = `${Math.floor(1 + Math.random() * 9)} ${Math.floor(0 + Math.random() * 9)} ${Math.floor(0 + Math.random() * 9)} ${Math.floor(1 + Math.random() * 9)}`;
    const randomOrderNumber = `EST-${Math.floor(10000 + Math.random() * 89999)}`;
    const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 Hours validity
    const expiresFormatted = new Date(expiresAt).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newOrder: EscrowOrder = {
      ...orderData,
      id: "ord-" + Date.now(),
      orderNumber: randomOrderNumber,
      secretPin: randomPin,
      expiresAt,
      expiresFormatted: `Valid for 48h until ${expiresFormatted}`,
      isExpired: false,
      status: "ready_inspection",
      createdAt: "Just now",
    };

    setOrders((prev) => [newOrder, ...prev]);
    showSuccessToast(
      language === "am" ? "የተጠበቀ ክፍያ ተይዟል!" : "Funds Locked in Safe Protection!",
      `Inspection PIN: ${randomPin} (Valid for 48h)`
    );

    // Live sync order & payment to PostgreSQL and Admin Verification Queue
    const channelMap: Record<string, "TELEBIRR" | "CBE_TRANSFER" | "OTHER_BANK"> = {
      telebirr: "TELEBIRR",
      cbe: "CBE_TRANSFER",
      cash: "OTHER_BANK",
    };

    checkoutWithEscrowMobile({
      productId: orderData.productId,
      deliveryMethod: orderData.collectionMethod,
      deliveryFee: orderData.collectionMethod === "runner" ? 75 : 0,
      channel: channelMap[orderData.paymentMethod] || "TELEBIRR",
      bankTransactionReference: orderData.transactionReference || ("MOB-" + Date.now().toString(36).toUpperCase()),
      screenshotUrl: orderData.screenshotUrl,
      senderAccountOrPhone: user?.name || "Mobile Student User",
      notes: `Mobile order for ${orderData.productTitle} (${orderData.collectionMethod === "runner" ? "Student Runner" : "Campus Hub"})`,
    })
      .then((serverRes) => {
        if (serverRes?.orderNumber) {
          setOrders((current) =>
            current.map((o) =>
              o.id === newOrder.id ? { ...o, orderNumber: serverRes.orderNumber } : o
            )
          );
        }
        showSuccessToast(
          language === "am" ? "ክፍያዎ ለአስተዳዳሪው ደርሷል!" : "Payment Synced to Campus Admin!",
          language === "am"
            ? `የማረጋገጫ ሰነድ (${orderData.transactionReference}) ለአስተዳዳሪው ተልኳል`
            : `Receipt proof & ref ${orderData.transactionReference} delivered to Admin verification desk`
        );
      })
      .catch((err) => {
        console.warn("[Mobile API] Escrow sync note:", err?.message || err);
      });

    return newOrder;
  };

  /**
   * Regenerates/extends the Secret Inspection PIN if expired or refreshed for security
   */
  const regenerateOrderPin = (orderId: string): string => {
    const freshPin = `${Math.floor(1 + Math.random() * 9)} ${Math.floor(0 + Math.random() * 9)} ${Math.floor(0 + Math.random() * 9)} ${Math.floor(1 + Math.random() * 9)}`;
    const newExpiresAt = Date.now() + 48 * 60 * 60 * 1000;
    const newExpiresFormatted = new Date(newExpiresAt).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              secretPin: freshPin,
              expiresAt: newExpiresAt,
              expiresFormatted: `Valid for 48h until ${newExpiresFormatted}`,
              isExpired: false,
            }
          : o
      )
    );

    showSuccessToast(
      language === "am" ? "አዲስ ሚስጥራዊ ፒን ተፈጥሯል!" : "Fresh Secret PIN Generated!",
      `New PIN: ${freshPin} • Valid for 48 hours`
    );

    return freshPin;
  };

  const completeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: "completed" } : ord))
    );
    showSuccessToast(
      language === "am" ? "ግብይቱ ተጠናቋል!" : "Trade Completed!",
      "100% payout released to the student seller"
    );
  };



  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        colors,
        language,
        setLanguage,
        t,
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        isAuthModalVisible,
        setAuthModalVisible,
        activeTab,
        setActiveTab,
        currentCampus,
        setCurrentCampus,
        isCampusModalVisible,
        setCampusModalVisible,
        products,
        addProduct,
        favorites,
        toggleFavorite,
        broadcasts,
        isLiveConnected,
        lastSyncedAt,
        refreshLiveProducts,
        refreshLiveBroadcasts,
        selectedProduct,
        setSelectedProduct,
        orders,
        createOrder,
        completeOrder,
        regenerateOrderPin,
        isLostFoundModalVisible,
        setLostFoundModalVisible,
        appVersion,
        serverRelease,
        isUpdateAvailable,
        isUpdateModalVisible,
        setUpdateModalVisible,
        checkForUpdates,
        upgradeAppVersion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
