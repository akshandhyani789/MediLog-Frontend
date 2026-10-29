
import React, { useCallback, useEffect, useState } from "react";
import {
  Package,
  PackageOpen,
  MapPin,
  CalendarDays,
  RefreshCw,
  CheckCircle2,
  Plus,
  Pencil,
  Globe2,
  Pause,
  RotateCcw,
  XCircle,
} from "lucide-react";

import {
  getMyMedicineBundles,
  publishMedicineBundle,
  updateMedicineBundleStatus,
} from "../../../../../services/medicineBundleService.js";
import { useAuth } from "../../../../../hooks/useAuth";
import { createMarketplaceSocket } from "../../../../../services/marketplaceSocket.js";
import CreateMedicineBundleModal from "./CreateMedicineBundleModal";

export default function MyMedicineBundlesSection() {
  const { user } = useAuth();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBundleId, setUpdatingBundleId] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);

  const loadBundles = useCallback(async () => {
    if (!user) {
      setBundles([]);
      setError("Sign in to manage your medicine bundles.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getMyMedicineBundles();
      if (!Array.isArray(data)) {
        throw new Error("The bundle service returned an invalid response.");
      }
      setBundles(data);
    } catch (loadError) {
      console.error("Owner bundle fetch failed:", loadError);
      setError(loadError.message || "Unable to load your bundles.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBundles();
  }, [loadBundles]);

  useEffect(() => {
    if (!user) return undefined;

    const socket = createMarketplaceSocket();
    let initialConnection = true;
    const handleConnect = () => {
      if (initialConnection) {
        initialConnection = false;
        return;
      }
      loadBundles();
    };
    const handlePublished = (published) => {
      if (!published?.id) return;
      setBundles((previous) =>
        previous.map((bundle) =>
          bundle.id === published.id
            ? { ...bundle, status: "Published" }
            : bundle
        )
      );
    };
    const handleUpdated = (update) => {
      if (!update?.id) return;
      setBundles((previous) =>
        previous.map((bundle) =>
          bundle.id === update.id
            ? { ...bundle, status: update.status }
            : bundle
        )
      );
    };

    socket.on("bundlePublished", handlePublished);
    socket.on("bundleUpdated", handleUpdated);
    socket.on("connect", handleConnect);
    socket.connect();
    return () => {
      socket.off("bundlePublished", handlePublished);
      socket.off("bundleUpdated", handleUpdated);
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [user, loadBundles]);

  const handleStatusChange = async (bundle, status) => {
    try {
      setUpdatingBundleId(bundle.id);
      setError("");
      const updatedBundle = await updateMedicineBundleStatus(
        bundle.id,
        status
      );
      setBundles((previous) =>
        previous.map((item) =>
          item.id === updatedBundle.id ? updatedBundle : item
        )
      );
    } catch (updateError) {
      console.error("Bundle unpublish failed:", updateError);
      setError(updateError.message || "Unable to update this bundle.");
    } finally {
      setUpdatingBundleId("");
    }
  };

  const handlePublish = async (bundle) => {
    if (
      !window.confirm(
        "Publish this non-commercial community bundle? It will be visible to other signed-in users."
      )
    ) {
      return;
    }

    try {
      setUpdatingBundleId(bundle.id);
      setError("");
      const published = await publishMedicineBundle(bundle.id);
      setBundles((previous) =>
        previous.map((item) =>
          item.id === published.id ? published : item
        )
      );
    } catch (publishError) {
      console.error("Bundle publish failed:", publishError);
      setError(publishError.message || "Unable to publish this bundle.");
    } finally {
      setUpdatingBundleId("");
    }
  };

  const handleDraftSaved = (savedBundle) => {
    setBundles((previous) => {
      const exists = previous.some((item) => item.id === savedBundle.id);
      return exists
        ? previous.map((item) =>
            item.id === savedBundle.id ? savedBundle : item
          )
        : [savedBundle, ...previous];
    });
    setEditingBundle(null);
    setIsEditorOpen(false);
  };

  const activeCount = bundles.filter(
    (bundle) => bundle.status === "Published"
  ).length;

  const totalCount = bundles.length;

  return (
    <section className="app-page-background mx-auto w-full max-w-7xl space-y-7 px-4 pb-10 pt-6 text-slate-900 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-[10px] font-extrabold tracking-[0.2em] text-teal-400">
            YOUR INVENTORY MARKETPLACE
          </p>
          <h1 className="font-serif text-3xl text-slate-100 sm:text-4xl">
            My Medicine Bundles
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Create private drafts from your saved inventory, preview the
            contents, then explicitly publish a non-commercial community
            listing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setEditingBundle(null);
              setIsEditorOpen(true);
            }}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 text-xs font-bold text-[#041312] transition hover:bg-teal-400"
          >
            <Plus size={15} />
            Create Bundle
          </button>
          <button
            type="button"
            onClick={loadBundles}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-semibold text-slate-300 transition hover:border-teal-800 hover:text-teal-300"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-[#101615] p-5">
          <Package size={20} className="text-teal-400" />
          <p className="mt-4 text-xs text-slate-400">Total bundles</p>
          <p className="mt-1 text-3xl font-semibold text-slate-100">
            {totalCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#101615] p-5">
          <CheckCircle2 size={20} className="text-teal-400" />
          <p className="mt-4 text-xs text-slate-400">Published</p>
          <p className="mt-1 text-3xl font-semibold text-slate-100">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#101615] p-5">
          <PackageOpen size={20} className="text-slate-400" />
          <p className="mt-4 text-xs text-slate-400">Drafts and paused</p>
          <p className="mt-1 text-3xl font-semibold text-slate-100">
            {totalCount - activeCount}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-xs text-red-300"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#101615] p-10 text-center text-sm text-slate-400">
          Loading your bundles...
        </div>
      ) : bundles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1312] px-5 py-14 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-teal-900 bg-teal-950/40 text-teal-400">
            <PackageOpen size={25} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-100">
            No bundles created yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400">
            Create a bundle draft using medicines from your saved inventory.
            Drafts do not reserve or deduct stock.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {bundles.map((bundle) => (
            <article
              key={bundle.id}
              className="min-w-0 rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#111817] to-[#0b100f] p-5 transition hover:border-teal-900/80"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words text-base font-semibold text-slate-100">
                    {bundle.name}
                  </h2>
                  <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <MapPin size={13} />
                    {bundle.location}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${
                    bundle.status === "Published"
                      ? "border-teal-900 bg-teal-950/50 text-teal-300"
                      : "border-white/10 bg-white/5 text-slate-400"
                  }`}
                >
                  {bundle.status}
                </span>
              </div>

              {bundle.description && (
                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {bundle.description}
                </p>
              )}

              <div className="mt-4 space-y-2">
                {(Array.isArray(bundle.items) ? bundle.items : []).map((item, index) => (
                  <div
                    key={`${bundle.id}-${item.medicineId || index}`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200">
                        {item.name} {item.strength}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.brand ? `${item.brand} · ` : ""}
                        {item.quantity} units
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Expires:{" "}
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString("en-IN")
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                <div>
                  <p className="text-xs font-semibold text-teal-200">
                    {bundle.listingType === "community"
                      ? "Non-commercial community bundle"
                      : "Legacy listing hidden from Find Medicine"}
                  </p>
                  <p className="mt-1 text-[9px] text-slate-600">
                    <CalendarDays size={11} className="mr-1 inline" />
                    Created{" "}
                    {new Date(bundle.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {bundle.status === "Draft" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBundle(bundle);
                          setIsEditorOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] font-semibold text-slate-300 hover:border-teal-800 hover:text-teal-300"
                      >
                        <Pencil size={13} />
                        Edit draft
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePublish(bundle)}
                        disabled={updatingBundleId === bundle.id}
                        className="flex items-center gap-2 rounded-xl bg-teal-500 px-3 py-2.5 text-[10px] font-bold text-[#041312] hover:bg-teal-400 disabled:opacity-50"
                      >
                        <Globe2 size={13} />
                        {updatingBundleId === bundle.id
                          ? "Publishing..."
                          : "Publish"}
                      </button>
                    </>
                  )}
                  {bundle.listingType === "community" &&
                    ["Paused", "Unavailable"].includes(bundle.status) && (
                    <button
                      type="button"
                      onClick={() => handlePublish(bundle)}
                      disabled={updatingBundleId === bundle.id}
                      className="flex items-center gap-2 rounded-xl bg-teal-500 px-3 py-2.5 text-[10px] font-bold text-[#041312] hover:bg-teal-400 disabled:opacity-50"
                    >
                      <RotateCcw size={13} />
                      Republish
                    </button>
                    )}
                  {bundle.status === "Published" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(bundle, "Paused")}
                      disabled={updatingBundleId === bundle.id}
                      className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] font-semibold text-slate-300 hover:border-amber-900 hover:text-amber-300 disabled:opacity-50"
                    >
                      <Pause size={13} />
                      Pause
                    </button>
                  )}
                  {!["Withdrawn", "Rejected"].includes(bundle.status) && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(bundle, "Withdrawn")}
                      disabled={updatingBundleId === bundle.id}
                      className="flex items-center gap-2 rounded-xl border border-red-900/50 px-3 py-2.5 text-[10px] font-semibold text-red-300 hover:bg-red-950/30 disabled:opacity-50"
                    >
                      <XCircle size={13} />
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <CreateMedicineBundleModal
        isOpen={isEditorOpen}
        initialBundle={editingBundle}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingBundle(null);
        }}
        onCreated={handleDraftSaved}
      />
    </section>
  );
}
