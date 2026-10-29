import { auth } from "../firebase/firebase.js";
import {
  createMedicineBundle as saveNewMedicineBundleDraft,
  getMyMedicineBundles as fetchMyMedicineBundles,
  getPublishedMedicineBundles,
  getUserMedicines,
  publishMedicineBundle as publishSavedMedicineBundle,
  updateMedicineBundleDraft as saveMedicineBundleDraft,
  updateMedicineBundleStatus as changeMedicineBundleStatus,
} from "./api.js";

const getSignedInUser = () => {
  if (!auth.currentUser) {
    throw new Error("Sign in to access medicine bundles.");
  }

  return auth.currentUser;
};

export async function getMyMedicinesForBundle() {
  const medicines = await getUserMedicines(getSignedInUser());
  if (!Array.isArray(medicines)) {
    throw new Error("Unable to read your saved medicine inventory.");
  }

  return medicines.map((medicine) => ({
    ...medicine,
    id: medicine._id,
    strength: medicine.dosage || "",
    stock: Number(medicine.stock),
  }));
}

const withIdempotencyKey = (bundle, idempotencyKey = crypto.randomUUID()) => ({
  ...bundle,
  idempotencyKey,
});

const toCommunityBundlePayload = ({
  name,
  location,
  locationCoordinates,
  description,
  items,
}) => ({
  name,
  location,
  locationCoordinates,
  description,
  listingType: "community",
  items: items.map(({ medicineId, quantity }) => ({ medicineId, quantity })),
});

export async function createMedicineBundle(
  bundle,
  idempotencyKey = crypto.randomUUID()
) {
  const response = await saveNewMedicineBundleDraft(
    getSignedInUser(),
    withIdempotencyKey(toCommunityBundlePayload(bundle), idempotencyKey)
  );
  return response.bundle;
}

export async function updateMedicineBundleDraft(id, bundle) {
  const response = await saveMedicineBundleDraft(
    getSignedInUser(),
    id,
    withIdempotencyKey(toCommunityBundlePayload(bundle))
  );
  return response.bundle;
}

export async function publishMedicineBundle(id) {
  const response = await publishSavedMedicineBundle(getSignedInUser(), id);
  return response.bundle;
}

export async function getMyMedicineBundles() {
  const response = await fetchMyMedicineBundles(getSignedInUser());
  return response.bundles;
}

export async function getPublishedBundles(locationCoordinates) {
  const response = await getPublishedMedicineBundles(
    getSignedInUser(),
    locationCoordinates
  );
  return response.bundles;
}

export async function updateMedicineBundleStatus(id, status) {
  const response = await changeMedicineBundleStatus(
    getSignedInUser(),
    id,
    status
  );
  return response.bundle;
}
