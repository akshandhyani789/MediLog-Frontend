import { getAPIBaseURL } from "../utils/ipDetection.js";

// ✅ Dynamic API URL based on network access
const getBaseURL = () => getAPIBaseURL();

// 🔍 GET MEDICINE

export const getMedicineByBarcode = async (barcode) => {
  const res = await fetch(`${getBaseURL()}/medicines/${barcode}`);

  const data = await res.json(); // ✅ read once

  if (!res.ok) {
    throw new Error(data.message || "Not found");
  }

  console.log("Medicine found:", data);

  return data;
};

export const scanMedicineOCR = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${getBaseURL()}/ocr/scan`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

// 🔐 SEND USER (LOGIN) WITH RETRY LOGIC
export const sendUserToBackend = async (firebaseUser, retries = 3) => {
  if (!firebaseUser) {
    console.error("No Firebase user provided");
    return null;
  }

  console.log("Attempting to send user to backend:",firebaseUser);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Force refresh to get a fresh token
      const token = await firebaseUser.getIdToken(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${getBaseURL()}/users/firebase-login`, {
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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      console.log("Backend login successful", data);

      if (!res.ok) throw new Error(data.error || "Server error");

      return data;
    } catch (err) {
      console.error(`Backend connection attempt ${attempt}/${retries} failed:`, err.message);

      // If it's the last attempt, return null
      if (attempt === retries) {
        console.error("All retry attempts failed. Make sure the server is running on port 5000");
        return null;
      }

      // Wait before retrying (exponential backoff: 1s, 2s, 4s)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }
};

// ✅ COMPLETE ONBOARDING (FIXED)
export const completeOnboarding = async (firebaseUser, data) => {
  try {
    const token = await firebaseUser.getIdToken();

    console.log("Sending onboarding data:", data); // 🔍 debug

    const res = await fetch(`${getBaseURL()}/users/complete-onboarding`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    console.log("Backend response:", result); // 🔍 debug

    if (!res.ok) throw new Error(result.error || "Failed onboarding");

    return result;

  } catch (err) {
    console.error("Onboarding error:", err);
    return null;
  }
};

// 📦 GET USER MEDICINES
// 📦 GET USER MEDICINES (FRONTEND)
export const getUserMedicines = async (firebaseUser) => {
  try {
    if (!firebaseUser) {
      console.warn("No user provided to getUserMedicines");
      return [];
    }

    const token = await firebaseUser.getIdToken();

    const res = await fetch(`${getBaseURL()}/user-medicines`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch medicines");

    // Ensure data is always an array
    return Array.isArray(data) ? data : data?.medicines || [];

  } catch (err) {
    console.error("Error fetching medicines:", err);
    return [];
  }
};

// ➕ ADD USER MEDICINE
export const addUserMedicine = async (firebaseUser, medicineData) => {
  try {
    if (!firebaseUser) {
      throw new Error("User not authenticated");
    }

    const token = await firebaseUser.getIdToken();

    const res = await fetch(`${getBaseURL()}/user-medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to add medicine");
    }

    return data;

  } catch (err) {
    console.error("Error adding medicine:", err);
    throw err;
  }
};