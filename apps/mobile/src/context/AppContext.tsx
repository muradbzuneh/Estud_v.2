import React, { createContext, useContext, useState, ReactNode } from "react";
import { MobileProductItem } from "../components/MobileProductCard";

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
  // User & Auth
  user: StudentUser | null;
  isAuthenticated: boolean;
  login: (name: string, email: string, campus: string) => void;
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

  // Products
  products: MobileProductItem[];
  addProduct: (product: Omit<MobileProductItem, "id" | "rating" | "reviewCount">) => void;
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;

  // Product Detail & Checkout Modal
  selectedProduct: MobileProductItem | null;
  setSelectedProduct: (product: MobileProductItem | null) => void;

  // Escrow Orders
  orders: EscrowOrder[];
  createOrder: (order: Omit<EscrowOrder, "id" | "orderNumber" | "secretPin" | "status" | "createdAt">) => EscrowOrder;
  completeOrder: (orderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(DEFAULT_USER);
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [currentCampus, setCurrentCampus] = useState<string>("AAU 4 Kilo (Science)");
  const [isCampusModalVisible, setCampusModalVisible] = useState(false);
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [products, setProducts] = useState<MobileProductItem[]>(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "prod-1": true, "prod-2": true });
  const [selectedProduct, setSelectedProduct] = useState<MobileProductItem | null>(null);
  const [orders, setOrders] = useState<EscrowOrder[]>(INITIAL_ORDERS);

  const login = (name: string, email: string, campus: string) => {
    setUser({
      id: "usr-" + Date.now(),
      name: name.trim() || "Student Trader",
      email: email.trim() || "student@estud.et",
      campus: campus || "AAU 4 Kilo (Science)",
      studentId: `UGR/${Math.floor(1000 + Math.random() * 9000)}/16`,
      trustScore: 98,
      tradesCompleted: 4,
      isVerified: true,
    });
    setAuthModalVisible(false);
  };

  const logout = () => {
    setUser(null);
  };

  const addProduct = (newProduct: Omit<MobileProductItem, "id" | "rating" | "reviewCount">) => {
    const item: MobileProductItem = {
      ...newProduct,
      id: "prod-" + Date.now(),
      rating: 5.0,
      reviewCount: 1,
      badge: "New",
    };
    setProducts((prev) => [item, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const createOrder = (orderData: Omit<EscrowOrder, "id" | "orderNumber" | "secretPin" | "status" | "createdAt">) => {
    const randomPin = `${Math.floor(1 + Math.random() * 9)} ${Math.floor(0 + Math.random() * 9)} ${Math.floor(0 + Math.random() * 9)} ${Math.floor(1 + Math.random() * 9)}`;
    const randomOrderNumber = `EST-${Math.floor(10000 + Math.random() * 89999)}`;
    
    const newOrder: EscrowOrder = {
      ...orderData,
      id: "ord-" + Date.now(),
      orderNumber: randomOrderNumber,
      secretPin: randomPin,
      status: "ready_inspection",
      createdAt: "Just now",
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const completeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: "completed" } : ord))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
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
        selectedProduct,
        setSelectedProduct,
        orders,
        createOrder,
        completeOrder,
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
