import { getAPIBaseURL } from "../utils/ipDetection.js";

const cleanURL = (url) => url.replace(/\/+$/, "");

const getBaseURL = () => cleanURL(getAPIBaseURL());

const safeFetch = async (url, options = {}) => {
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
};

// ------------------ API ------------------

export const getMedicineByBarcode = (barcode) =>
  safeFetch(`${getBaseURL()}/api/medicines/${barcode}`);

export const scanMedicineOCR = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return safeFetch(`${getBaseURL()}/ocr/scan`, {
    method: "POST",
    body: formData,
  });
};

export const sendUserToBackend = async (firebaseUser) => {
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

export const addUserMedicine = async (firebaseUser, data) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${getBaseURL()}/api/user-medicines`, {
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

  return safeFetch(`${getBaseURL()}/api/user-medicines`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUserMedicine = async (firebaseUser, id) => {
  const token = await firebaseUser.getIdToken();

  return safeFetch(`${getBaseURL()}/api/user-medicines/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};