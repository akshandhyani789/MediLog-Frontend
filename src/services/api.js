import { getAPIBaseURL } from "../utils/ipDetection.js";
import { auth } from "../firebase/firebase.js";
// ------------------ BASE URL ------------------

const cleanURL = (url) => url.replace(/\/+$/, "");

// ✅ define once (IMPORTANT FIX)
const BASE_URL = cleanURL(getAPIBaseURL());
console.log("🌐 API Base URL:", BASE_URL);

// ------------------ SAFE FETCH ------------------

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || "Invalid server response");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Request failed");
    }

    return data;

  } catch (err) {
    console.error("❌ Fetch failed:", url, err.message);

    if (err.message.includes("Failed to fetch")) {
      throw new Error("Backend not reachable. Is server running?");
    }

    throw err;
  }
};

// ------------------ API ------------------

export const getMedicineByBarcode = (barcode) =>
  safeFetch(`${BASE_URL}/api/medicines/${barcode}`);

export const scanMedicineOCR = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return safeFetch(`${BASE_URL}/ocr/scan`, {
    method: "POST",
    body: formData,
  });
};

export const sendUserToBackend = async (firebaseUser) => {
  if (!firebaseUser) return null;

  try {
    const token = await firebaseUser.getIdToken(true);

    return await safeFetch(`${BASE_URL}/api/users/firebase-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

  } catch (error) {
    console.error("❌ Backend login failed:", error.message);
    return null; // ✅ prevents app crash
  }
};

export const completeOnboarding = async (firebaseUser, data) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/users/complete-onboarding`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const addUserMedicine = async (firebaseUser, data) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/user-medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const getUserMedicines = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/user-medicines`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUserMedicine = async (firebaseUser, id) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/user-medicines/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 📥 Get notification settings
export const getNotificationSettings = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/users/notification-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 💾 Update notification settings
export const updateNotificationSettings = async (firebaseUser, data) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/users/notification-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const updateUserProfile = async (data) => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("User not logged in");
  }

  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/users/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};