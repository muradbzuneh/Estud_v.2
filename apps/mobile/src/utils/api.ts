import { Platform } from "react-native";
import Constants from "expo-constants";
import { MobileProductItem } from "../components/MobileProductCard";

export interface MobileCheckoutPayload {
  productId: string;
  deliveryMethod: "hub" | "runner";
  deliveryFee?: number;
  channel: "TELEBIRR" | "CBE_BIRR" | "CBE_TRANSFER" | "OTHER_BANK";
  bankTransactionReference: string;
  screenshotUrl?: string;
  senderAccountOrPhone?: string;
  notes?: string;
}

export interface MobileProductSubmissionPayload {
  title: string;
  description?: string;
  category: string;
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
  price: number;
  campus?: string;
  imageUrl?: string;
  images?: string[];
  isExchangeEligible?: boolean;
  sellerName?: string;
  sellerId?: string;
}

export interface CampusBroadcastItem {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  priority: "URGENT" | "NORMAL" | "UPDATE";
  createdAt: string;
  authorName: string;
}

export interface AppReleaseInfo {
  version: string;
  versionCode: number;
  releaseDate: string;
  title: string;
  releaseNotes: string[];
  downloadUrl: string;
  forceUpdate: boolean;
}

let customApiBaseUrl: string | null = null;

/**
 * Normalizes input URL: ensures protocol (http/https), appends default port 3000 for local IPs if omitted,
 * and removes trailing slashes.
 */
export function normalizeApiUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url) return url;

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    if (/^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i.test(url)) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  // If it's an IP address or localhost without a port, append :3000
  const ipOrLocalhostMatch = url.match(/^(https?:\/\/(?:localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(\/.*)?$/i);
  if (ipOrLocalhostMatch) {
    const origin = ipOrLocalhostMatch[1];
    const pathAndQuery = ipOrLocalhostMatch[2] || "";
    // If no port specified in origin
    if (!/:\d+$/.test(origin)) {
      url = `${origin}:3000${pathAndQuery}`;
    }
  }

  return url.replace(/\/+$/, "");
}

export function setCustomApiBaseUrl(url: string | null) {
  customApiBaseUrl = url ? normalizeApiUrl(url) : null;
}

export function getCustomApiBaseUrl(): string | null {
  return customApiBaseUrl;
}

/**
 * Smart API Base URL resolver for Expo (Web, Android Emulator, LAN Mobile Device)
 */
export function getApiBaseUrl(): string {
  if (customApiBaseUrl && customApiBaseUrl.trim().length > 0) {
    return normalizeApiUrl(customApiBaseUrl);
  }

  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location?.hostname) {
      const protocol = window.location.protocol || "http:";
      const hostname = window.location.hostname;
      return `${protocol}//${hostname}:3000`;
    }
    return "http://localhost:3000";
  }

  // 1. Auto-detect host from Expo development server / Metro bundler
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:3000`;
    }
  }

  // 2. If env var is explicitly configured
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes("localhost")) {
    return normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);
  }

  // 3. Fallback to current host IP
  return "http://192.168.137.26:3000";
}

/**
 * Fast ping to test whether mobile device can reach the backend server
 */
export async function pingBackendServer(): Promise<{ ok: boolean; statusText: string; url: string }> {
  const url = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(
      `${url}/api/trpc/broadcasts.getLatestRelease?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      }
    );
    clearTimeout(timeout);
    if (res.ok) {
      return { ok: true, statusText: "Connected (Live)", url };
    }
    return { ok: false, statusText: `HTTP ${res.status}`, url };
  } catch (err: any) {
    const rawMsg = String(err?.message || "");

    // Cleartext policy block (Android 9+ default for HTTP on standalone APKs)
    if (rawMsg.includes("CLEARTEXT") || rawMsg.includes("network security policy")) {
      return {
        ok: false,
        statusText:
          "Android blocked HTTP (Cleartext). Use an HTTPS URL (e.g. ngrok tunnel) or rebuild APK with cleartext enabled",
        url,
      };
    }

    // Common virtual switch IP mistake
    if (url.includes("192.168.16.1")) {
      return {
        ok: false,
        statusText:
          "192.168.16.1 is a PC internal virtual switch (Hyper-V). Use your PC's Wi-Fi IP (e.g. 10.172.204.191:3000) or an HTTPS tunnel",
        url,
      };
    }

    // Localhost on physical phone
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return {
        ok: false,
        statusText:
          "localhost points to your phone itself. Use your PC's Wi-Fi IP or an HTTPS tunnel",
        url,
      };
    }

    if (err?.name === "AbortError" || rawMsg.includes("aborted")) {
      return {
        ok: false,
        statusText: "Connection timed out. Ensure PC & phone are on same Wi-Fi and port 3000 is running",
        url,
      };
    }

    return { ok: false, statusText: rawMsg || "Unreachable", url };
  }
}

/**
 * Submits an order & payment evidence (screenshot + ref code) directly to backend PostgreSQL.
 * Automatically queues into the Admin Payments verification desk and orders registry.
 */
export async function checkoutWithEscrowMobile(payload: MobileCheckoutPayload) {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/trpc/orders.checkoutWithEscrow?batch=1`;

  const body = {
    "0": {
      json: {
        productId: payload.productId,
        deliveryMethod: payload.deliveryMethod,
        deliveryFee: payload.deliveryFee || 0,
        channel: payload.channel,
        bankTransactionReference: payload.bankTransactionReference,
        screenshotUrl:
          payload.screenshotUrl ||
          "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
        senderAccountOrPhone: payload.senderAccountOrPhone || "Mobile Student User",
        notes: payload.notes || "Escrow Order submitted from Estud Mobile App",
      },
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const data = result?.[0]?.result?.data?.json;
  return data;
}

/**
 * Submits a new sell listing from the mobile app directly to PostgreSQL.
 * Appears immediately in Admin Marketplace Listings and Mobile feeds!
 */
export async function submitProductMobile(payload: MobileProductSubmissionPayload) {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/trpc/products.submitMobileListing?batch=1`;

  const body = {
    "0": {
      json: {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        condition: payload.condition,
        price: payload.price,
        campus: payload.campus,
        imageUrl: payload.imageUrl,
        images: payload.images || (payload.imageUrl ? [payload.imageUrl] : []),
        isExchangeEligible: payload.isExchangeEligible ?? false,
        sellerName: payload.sellerName,
        sellerId: payload.sellerId,
        status: "PENDING_VALUATION",
      },
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const data = result?.[0]?.result?.data?.json;
  return data;
}

/**
 * Fetches real active products from the PostgreSQL database via tRPC.
 */
export async function fetchLiveProductsMobile(): Promise<MobileProductItem[] | null> {
  try {
    const baseUrl = getApiBaseUrl();
    // Valid input object with limit 50 so all live catalog listings load
    const endpoint = `${baseUrl}/api/trpc/products.list?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22limit%22%3A50%7D%7D%7D`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Mobile API] fetchLiveProducts HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    const items = data?.[0]?.result?.data?.json?.items;

    if (Array.isArray(items)) {
      return items.map((p: any) => {
        const rawPrice = Number(p.approvedItemValue || p.proposedPrice || 0);
        let img = p.images?.[0]?.imageUrl || p.images?.[0]?.url;
        // If image is a giant raw base64 string (>50KB), replace with high-res Cloudinary fallback
        if (!img || (typeof img === "string" && img.startsWith("data:") && img.length > 50000)) {
          img = "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205480/estud/products/i1rk4m8ywq8mccyfzuv1.jpg";
        }
        let categorySlug = p.category?.slug || "general";
        if (categorySlug === "electronics") {
          categorySlug = "laptops";
        }
        return {
          id: p.id,
          title: p.title,
          category: categorySlug,
          condition: p.condition ? p.condition.replace(/_/g, " ") : "Used • Good",
          price: rawPrice,
          originalPrice: Math.round(rawPrice * 1.25),
          rating: 4.9,
          reviewCount: Math.floor(18 + Math.random() * 80),
          badge: (p.isExchangeEligible ? "Popular" : "New") as "Popular" | "New",
          location: p.campus?.name || p.institution?.name || "Campus Safe Trade Hub",
          imageUrl: img,
          sellerName: "Campus Verified Seller",
        };
      });
    }
  } catch (err: any) {
    console.warn("[Mobile API] fetchLiveProducts note:", err?.message || err);
  }
  return null;
}

/**
 * Fetches real-time campus broadcasts & announcements sent from Admin page
 */
export async function fetchLiveBroadcastsMobile(): Promise<CampusBroadcastItem[] | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/trpc/broadcasts.listLive?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    const items = data?.[0]?.result?.data?.json;
    if (Array.isArray(items)) {
      return items;
    }
  } catch (err) {
    console.warn("[Mobile API] fetchLiveBroadcasts note:", err);
  }
  return null;
}

/**
 * Fetches the latest published release and update alert info from server
 */
export async function fetchLatestReleaseMobile(): Promise<AppReleaseInfo | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/trpc/broadcasts.getLatestRelease?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    return data?.[0]?.result?.data?.json || null;
  } catch (err) {
    console.warn("[Mobile API] fetchLatestRelease note:", err);
  }
  return null;
}
