import { getAPIBaseURL } from "../utils/ipDetection.js";

// ✅ Dynamic API URL based on environment
const getBaseURL = () => getAPIBaseURL();

// ========================================
// 🔍 GET MEDICINE BY BARCODE
// ========================================
export const getMedicineByBarcode = async (barcode) => {
  try {
    const res = await fetch(`${getBaseURL()}/medicines/${barcode}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Medicine not found");
    }

    console.log("✅ Medicine found:", data);
    return data;

  } catch (err) {
    console.error("❌ Error fetching medicine:", err);
    throw err;
  }
};

// ========================================
// 📸 SCAN MEDICINE WITH OCR
// ========================================
export const scanMedicineOCR = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${getBaseURL()}/ocr/scan`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "OCR scan failed");
    }

    console.log("✅ OCR scan complete:", data);
    return data;

  } catch (err) {
    console.error("❌ Error scanning medicine:", err);
    throw err;
  }
};

// ========================================
// 🔐 FIREBASE LOGIN WITH RETRY
// ========================================
export const sendUserToBackend = async (firebaseUser, retries = 3) => {
  if (!firebaseUser) {
    console.error("❌ No Firebase user provided");
    return null;
  }

  console.log("🔐 Attempting Firebase login...");
  
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

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      console.log("✅ Backend login successful");
      return data;

    } catch (err) {
      console.error(`❌ Login attempt ${attempt}/${retries} failed:`, err.message);

      if (attempt === retries) {
        console.error("❌ All retry attempts failed. Backend URL:", getBaseURL());
        return null;
      }

      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      );
    }
  }
};

// ========================================
// ✏️ COMPLETE ONBOARDING
// ========================================
export const completeOnboarding = async (firebaseUser, data) => {
  try {
    const token = await firebaseUser.getIdToken();

    console.log("📋 Submitting onboarding data:", data);

    const res = await fetch(`${getBaseURL()}/users/complete-onboarding`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error || "Onboarding failed");
    }

    console.log("✅ Onboarding complete:", responseData);
    return responseData;

  } catch (err) {
    console.error("❌ Onboarding error:", err);
    throw err;
  }
};

// ========================================
// 💊 ADD USER MEDICINE
// ========================================
export const addUserMedicine = async (firebaseUser, medicineData) => {
  try {
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

    console.log("✅ Medicine added:", data);
    return data;

  } catch (err) {
    console.error("❌ Error adding medicine:", err);
    throw err;
  }
};

// ========================================
// 🔍 GET USER MEDICINES
// ========================================
export const getUserMedicines = async (firebaseUser) => {
  try {
    const token = await firebaseUser.getIdToken();

    const res = await fetch(`${getBaseURL()}/user-medicines`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch medicines");
    }

    console.log("✅ User medicines retrieved:", data);
    return data;

  } catch (err) {
    console.error("❌ Error fetching medicines:", err);
    throw err;
  }
};

// ========================================
// ❌ DELETE USER MEDICINE
// ========================================
export const deleteUserMedicine = async (firebaseUser, medicineId) => {
  try {
    const token = await firebaseUser.getIdToken();

    const res = await fetch(`${getBaseURL()}/user-medicines/${medicineId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete medicine");
    }

    console.log("✅ Medicine deleted");
    return true;

  } catch (err) {
    console.error("❌ Error deleting medicine:", err);
    throw err;
  }
};
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

    const res = await fetch(`${BASE_URL}/user-medicines`, {
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

    const res = await fetch(`${BASE_URL}/user-medicines`, {
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