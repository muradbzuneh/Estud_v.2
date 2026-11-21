import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { showErrorToast, showSuccessToast } from "./toast";

export const SAMPLE_PAYMENT_PROOFS = [
  {
    label: "Telebirr Transfer Slip (ETB)",
    url: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
  },
  {
    label: "Commercial Bank of Ethiopia (CBE Mobile)",
    url: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
  },
  {
    label: "Bank Counter Slip / Receipt",
    url: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
  },
];

export const SAMPLE_PRODUCT_PHOTOS = [
  "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205480/estud/products/i1rk4m8ywq8mccyfzuv1.jpg",
  "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205483/estud/products/vmgc9gbcyr8x8w2sej01.jpg",
  "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205482/estud/products/gm1mw2kvp0cdxfh0e6ib.jpg",
  "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205485/estud/products/epqmnjm8x3mmsx90yx6f.jpg",
  "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
  "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205491/estud/products/toucxz480xisroboew86.jpg",
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
