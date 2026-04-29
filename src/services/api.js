import { getAPIBaseURL } from "../utils/ipDetection.js";

// ✅ normalize base URL (FIXES // PROBLEM)
const cleanURL = (url) => url.replace(/\/+$/, "");

// ========================================
// 🌐 BASE URL
// ========================================
const getBaseURL = () => cleanURL(getAPIBaseURL());

// ========================================
// 🔥 SAFE FETCH WRAPPER
// ========================================
const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(text || "Non-JSON response from server");
    }

    if (!res.ok) {
      throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
  } catch (err) {
    console.error("❌ API Error:", err.message);
    throw err;
  }
};

// ========================================
// 🔍 GET MEDICINE
// ========================================
export const getMedicineByBarcode = async (barcode) => {
  return safeFetch(`${getBaseURL()}/api/medicines/${barcode}`);
};

// ========================================
// 📸 OCR SCAN
// ========================================
export const scanMedicineOCR = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return safeFetch(`${getBaseURL()}/api/ocr/scan`, {
    method: "POST",
    body: formData,
  });
};

// ========================================
// 🔐 LOGIN
// ========================================
export const sendUserToBackend = async (firebaseUser) => {
  if (!firebaseUser) return null;

  const token = await firebaseUser.getIdToken(true);

  return safeFetch(`${getBaseURL()}/api/users/firebase-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      phone: firebaseUser.phoneNumber,
    }),
  });
};

// ========================================
// ✏️ ONBOARDING
// ========================================
export const completeOnboarding = async (firebaseUser, data) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${getBaseURL()}/api/users/complete-onboarding`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// ========================================
// 💊 ADD MEDICINE
// ========================================
export const addUserMedicine = async (firebaseUser, medicineData) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${getBaseURL()}/api/user-medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(medicineData),
  });
};

// ========================================
// 📦 GET MEDICINES
// ========================================
export const getUserMedicines = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${getBaseURL()}/api/user-medicines`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ========================================
// ❌ DELETE MEDICINE
// ========================================
export const deleteUserMedicine = async (firebaseUser, medicineId) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${getBaseURL()}/api/user-medicines/${medicineId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};