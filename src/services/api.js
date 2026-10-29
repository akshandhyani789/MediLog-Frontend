import { getAPIBaseURL } from "../utils/ipDetection.js";
import { auth } from "../firebase/firebase.js";

const cleanURL = (url) => url.replace(/\/+$/, "");
const BASE_URL = cleanURL(getAPIBaseURL());

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
    console.error("Fetch failed:", url, err.message);

    if (err.message.includes("Failed to fetch")) {
      throw new Error("Backend not reachable. Is server running?");
    }

    throw err;
  }
};

export const getMedicineByBarcode = (barcode) =>
  safeFetch(`${BASE_URL}/api/medicines/${barcode}`);

export const scanMedicineOCR = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return safeFetch(`${BASE_URL}/api/ocr/scan`, {
    method: "POST",
    body: formData,
  });
};

export const sendUserToBackend = async (firebaseUser, profile) => {
  if (!firebaseUser) return null;

  try {
    const token = await firebaseUser.getIdToken(true);

    return await safeFetch(`${BASE_URL}/api/users/firebase-login`, {
      method: "POST",
      body: JSON.stringify(profile ? { profile } : {}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

  } catch (error) {
    console.error("Backend login failed:", error.message);
    return null;
  }
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

const getAuthenticatedHeaders = async (firebaseUser, includeContentType = false) => {
  if (!firebaseUser) {
    throw new Error("User not logged in");
  }

  const token = await firebaseUser.getIdToken();
  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
};

export const getPublishedMedicineBundles = async (
  firebaseUser,
  locationCoordinates
) => {
  const params = new URLSearchParams();
  if (locationCoordinates) {
    params.set("latitude", String(locationCoordinates.latitude));
    params.set("longitude", String(locationCoordinates.longitude));
  }
  const query = params.size ? `?${params.toString()}` : "";

  return safeFetch(`${BASE_URL}/api/bundles${query}`, {
    headers: await getAuthenticatedHeaders(firebaseUser),
  });
};

export const getMyMedicineBundles = async (firebaseUser) =>
  safeFetch(`${BASE_URL}/api/bundles/mine`, {
    headers: await getAuthenticatedHeaders(firebaseUser),
  });

export const createMedicineBundle = async (firebaseUser, bundle) =>
  safeFetch(`${BASE_URL}/api/bundles`, {
    method: "POST",
    headers: await getAuthenticatedHeaders(firebaseUser, true),
    body: JSON.stringify(bundle),
  });

export const updateMedicineBundleDraft = async (
  firebaseUser,
  bundleId,
  bundle
) =>
  safeFetch(`${BASE_URL}/api/bundles/${encodeURIComponent(bundleId)}`, {
    method: "PATCH",
    headers: await getAuthenticatedHeaders(firebaseUser, true),
    body: JSON.stringify(bundle),
  });

export const publishMedicineBundle = async (firebaseUser, bundleId) =>
  safeFetch(
    `${BASE_URL}/api/bundles/${encodeURIComponent(bundleId)}/publish`,
    {
      method: "POST",
      headers: await getAuthenticatedHeaders(firebaseUser, true),
    }
  );

export const updateMedicineBundleStatus = async (
  firebaseUser,
  bundleId,
  status
) =>
  safeFetch(`${BASE_URL}/api/bundles/${encodeURIComponent(bundleId)}/status`, {
    method: "PATCH",
    headers: await getAuthenticatedHeaders(firebaseUser, true),
    body: JSON.stringify({ status }),
  });

export const deleteUserMedicine = async (firebaseUser, id) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/user-medicines/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNotificationSettings = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/users/notification-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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

export const updateMedicineStock = async (firebaseUser, id, change) => {
  if (!firebaseUser) {
    throw new Error("User not logged in");
  }

  const token = await firebaseUser.getIdToken();

  return safeFetch(`${BASE_URL}/api/user-medicines/${id}/stock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ change: Number(change) }),
  });
};