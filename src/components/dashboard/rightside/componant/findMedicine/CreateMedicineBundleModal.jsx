
import React, { useEffect, useState } from "react";
import {
  X,
  PackagePlus,
  Plus,
  Trash2,
  MapPin,
  CalendarDays,
  LoaderCircle,
  LocateFixed,
} from "lucide-react";

import {
  createMedicineBundle,
  getMyMedicinesForBundle,
  updateMedicineBundleDraft,
} from "../../../../../services/medicineBundleService.js";

export default function CreateMedicineBundleModal({
  isOpen,
  onClose,
  onCreated,
  initialBundle = null,
}) {
  const [medicines, setMedicines] = useState([]);
  const [items, setItems] = useState([]);
  const [bundleName, setBundleName] = useState("");
  const [location, setLocation] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [draftRequestKey, setDraftRequestKey] = useState(() =>
    crypto.randomUUID()
  );

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setBundleName(initialBundle?.name || "");
    setLocation(initialBundle?.location || "");
    setLocationCoordinates(initialBundle?.locationCoordinates || null);
    setDescription(initialBundle?.description || "");
    setItems([]);
    if (!initialBundle) setDraftRequestKey(crypto.randomUUID());

    async function loadInventory() {
      setLoading(true);
      setError("");

      try {
        const data = await getMyMedicinesForBundle();

        if (!cancelled) {
          setMedicines(data);
          setItems(
            (initialBundle?.items || []).map((bundleItem) => {
              const medicine = data.find(
                (item) => item.id === bundleItem.medicineId
              );
              return {
                medicineId: bundleItem.medicineId,
                name: bundleItem.name,
                brand: bundleItem.brand || "",
                strength: bundleItem.strength || "",
                availableStock: medicine?.stock ?? bundleItem.quantity,
                expiryDate: medicine?.expiryDate || bundleItem.expiryDate,
                quantity: bundleItem.quantity,
              };
            })
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message || "Unable to load your medicine inventory."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInventory();

    return () => {
      cancelled = true;
    };
  }, [isOpen, initialBundle]);

  if (!isOpen) return null;

  const addMedicine = (medicineId) => {
    if (!medicineId) return;

    if (items.some((item) => item.medicineId === medicineId)) {
      setError("This medicine is already in your bundle.");
      return;
    }

    const medicine = medicines.find((item) => item.id === medicineId);
    if (!medicine) return;

    setError("");

    setItems((prev) => [
      ...prev,
      {
        medicineId: medicine.id,
        name: medicine.name,
        brand: medicine.brand,
        strength: medicine.strength,
        availableStock: medicine.stock,
        expiryDate: medicine.expiryDate,
        quantity: 1,
      },
    ]);
  };

  const updateItem = (medicineId, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const removeItem = (medicineId) => {
    setItems((prev) =>
      prev.filter((item) => item.medicineId !== medicineId)
    );
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location access is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLocationMessage(
          "Coordinates are stored privately; only approximate distance is shared."
        );
      },
      () => {
        setLocationMessage("Location permission was denied.");
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!bundleName.trim()) {
      setError("Please enter a bundle name.");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one medicine to your bundle.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the bundle location.");
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1 ||
        Number(item.quantity) > item.availableStock
    );

    if (invalidItem) {
      setError("Check that every quantity is within the available stock.");
      return;
    }

    const bundle = {
      name: bundleName.trim(),
      location: location.trim(),
      locationCoordinates,
      description: description.trim(),
      items: items.map((item) => ({
        medicineId: item.medicineId,
        quantity: Number(item.quantity),
      })),
    };

    try {
      setSaving(true);
      const savedBundle = initialBundle?.id
        ? await updateMedicineBundleDraft(initialBundle.id, bundle)
        : await createMedicineBundle(bundle, draftRequestKey);
      onCreated?.(savedBundle);
      onClose();
    } catch (publishError) {
      setError(publishError.message || "Unable to save the bundle draft.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-bundle-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0c1211] shadow-2xl shadow-black/40"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.08] bg-[#0c1211]/95 p-5 backdrop-blur sm:p-6">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-teal-900 bg-teal-950/60 text-teal-400">
              <PackagePlus size={21} />
            </div>

            <h2
              id="create-bundle-title"
              className="font-serif text-2xl text-slate-100"
            >
              {initialBundle ? "Edit bundle draft" : "Create bundle draft"}
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Select saved medicines and review the complete bundle before publishing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          <div>
            <label
              htmlFor="bundle-name"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Bundle name
            </label>
            <input
              id="bundle-name"
              value={bundleName}
              onChange={(event) => setBundleName(event.target.value)}
              placeholder="e.g. First-aid essentials"
              maxLength={100}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#080d0c] px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-teal-500"
            />
          </div>

          <div>
            <label
              htmlFor="bundle-location"
              className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300"
            >
              <MapPin size={14} className="text-teal-400" />
              Pickup location
            </label>
            <div className="flex gap-2">
              <input
                id="bundle-location"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setLocationCoordinates(null);
                  setLocationMessage("");
                }}
                placeholder="City or locality"
                maxLength={120}
                className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080d0c] px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={useCurrentLocation}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 text-[10px] font-semibold text-teal-300 transition hover:border-teal-800"
              >
                <LocateFixed size={14} />
                Use location
              </button>
            </div>
            {locationMessage && (
              <p className="mt-2 text-[10px] text-slate-500">
                {locationMessage}
              </p>
            )}
            <p className="rounded-lg border border-teal-900/50 bg-teal-950/20 p-3 text-[10px] leading-relaxed text-teal-100">
              Bundles are non-commercial community listings. No asking price or
              payment is collected. Only include medicines you are legally
              permitted to share; MediLog does not determine regulatory
              eligibility. Saving a draft does not reserve or deduct stock.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-200">
                Bundle medicines
              </h3>
              <span className="text-[10px] text-slate-500">
                {items.length} selected
              </span>
            </div>

            <label
              htmlFor="add-bundle-medicine"
              className="mb-2 block text-xs text-slate-400"
            >
              Select from My Medicines
            </label>

            <select
              id="add-bundle-medicine"
              value=""
              disabled={loading || saving}
              onChange={(event) => addMedicine(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#080d0c] px-3 text-xs text-slate-200 outline-none focus:border-teal-500 disabled:opacity-50"
            >
              <option value="">
                {loading ? "Loading inventory..." : "+ Add a medicine"}
              </option>
              {medicines
                .filter((medicine) => {
                  const expiry = new Date(medicine.expiryDate);
                  return (
                    Number(medicine.stock) > 0 &&
                    Number.isFinite(expiry.getTime()) &&
                    expiry > new Date() &&
                    !medicine.isPublished
                  );
                })
                .filter(
                  (medicine) =>
                    !items.some((item) => item.medicineId === medicine.id)
                )
                .map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name} {medicine.strength} · {medicine.stock} in
                    stock
                  </option>
                ))}
            </select>

            {loading && (
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <LoaderCircle size={14} className="animate-spin" />
                Loading your inventory...
              </p>
            )}

            {!loading && !error && medicines.length === 0 && (
              <p className="mt-3 text-xs text-amber-300">
                No medicines found. Add medicines to My Medicines first.
              </p>
            )}

            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div
                  key={item.medicineId}
                  className="rounded-xl border border-white/[0.09] bg-white/[0.02] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200">
                        {item.name} {item.strength}
                      </h4>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.brand} · {item.availableStock} units available
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                        <CalendarDays size={12} />
                        Expires:{" "}
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.medicineId)}
                      aria-label={`Remove ${item.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-950/40 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4">
                    <label className="text-[10px] text-slate-400">
                      Quantity
                      <input
                        type="number"
                        min="1"
                        max={item.availableStock}
                        step="1"
                        required
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(
                            item.medicineId,
                            "quantity",
                            event.target.value
                          )
                        }
                        className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#080d0c] px-3 text-xs text-slate-200 outline-none focus:border-teal-500"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="bundle-description"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Description <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id="bundle-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Add details about the bundle..."
              className="w-full resize-y rounded-xl border border-white/10 bg-[#080d0c] p-3 text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
            />
          </div>

          <div className="rounded-xl border border-teal-900/60 bg-teal-950/30 p-4">
            <div>
              <p className="text-[10px] text-slate-400">
                Bundle preview
              </p>
              <p className="mt-1 text-sm font-semibold text-teal-200">
                {bundleName.trim() || "Untitled bundle"} · {items.length} medicine(s)
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Non-commercial; prices and payment are not supported.
              </p>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-xs text-red-300"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-11 rounded-xl border border-white/10 px-5 text-xs font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 text-xs font-bold text-[#041312] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && <LoaderCircle size={15} className="animate-spin" />}
              {saving ? "Saving..." : "Save as draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
