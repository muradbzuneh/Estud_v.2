import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { showErrorToast, showSuccessToast } from "./toast";

export const SAMPLE_PAYMENT_PROOFS = [
  {
    label: "Telebirr Transfer Slip (ETB)",
    url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Commercial Bank of Ethiopia (CBE Mobile)",
    url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Bank Counter Slip / Receipt",
    url: "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80",
  },
];

export const SAMPLE_PRODUCT_PHOTOS = [
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&auto=format&fit=crop&q=80",
];

/**
 * Web browser fallback using standard HTML5 file reader
 */
function pickImageWeb(capture = false): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    if (capture) {
      input.setAttribute("capture", "environment");
    }
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) {
        document.body.removeChild(input);
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        document.body.removeChild(input);
        resolve((event.target?.result as string) || null);
      };
      reader.onerror = () => {
        document.body.removeChild(input);
        resolve(null);
      };
      reader.readAsDataURL(file);
    };

    // Trigger click on file picker
    input.click();
  });
}

/**
 * Request device gallery permissions and pick image from device storage.
 * Works seamlessly on Web browsers, Android, and iOS devices.
 */
export async function pickImageFromDevice(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return await pickImageWeb(false);
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showErrorToast(
        "Permission Required",
        "Please allow photo gallery access in settings to upload from your device."
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        return `data:image/jpeg;base64,${asset.base64}`;
      }
      return asset.uri;
    }
  } catch (error: any) {
    console.warn("[ImagePicker] Error picking image:", error);
    // On web fallback if ImagePicker throws
    if (Platform.OS === "web") {
      return await pickImageWeb(false);
    }
    showErrorToast("Upload Error", "Could not open device photo picker.");
  }
  return null;
}

/**
 * Capture photo directly using device camera
 */
export async function takePhotoWithCamera(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return await pickImageWeb(true);
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showErrorToast(
        "Camera Permission Required",
        "Please allow camera access in device settings to snap a photo."
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        return `data:image/jpeg;base64,${asset.base64}`;
      }
      return asset.uri;
    }
  } catch (error: any) {
    console.warn("[ImagePicker] Error using camera:", error);
    if (Platform.OS === "web") {
      return await pickImageWeb(true);
    }
    showErrorToast("Camera Error", "Could not access device camera.");
  }
  return null;
}
