const BASE_URL = "http://localhost:5000/api";

// 🔍 GET MEDICINE
export const getMedicineByBarcode = async (barcode) => {
  const res = await fetch(`${BASE_URL}/medicines/${barcode}`);

  if (!res.ok) throw new Error("Not found");

  return res.json();
};

// 🔐 SEND USER
export const sendUserToBackend = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken();

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};