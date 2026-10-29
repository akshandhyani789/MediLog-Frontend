import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search,
  PackagePlus,
  Bell,
  MapPin,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../../../../hooks/useAuth";
import {
  getPublishedBundles,
} from "../../../../../services/medicineBundleService.js";
import { createMarketplaceSocket } from "../../../../../services/marketplaceSocket.js";
import MedicineSearchBar from "./MedicineSearchBar";
import MedicineListingCard from "./MedicineListingCard";
import CreateMedicineBundleModal from "./CreateMedicineBundleModal";

const initialFilters = {
  medicine: "",
  strength: "",
  location: "",
  quantity: "",
  expiryAfter: "",
  distance: "all",
  sortBy: "relevance",
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase();

const parseNumber = (value) => {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const dateKey = (value) => {
  if (value == null || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const getItems = (bundle) => (Array.isArray(bundle?.items) ? bundle.items : []);

const mergeBundles = (current, incoming) => {
  const merged = new Map(current.map((bundle) => [bundle.id, bundle]));
  incoming.forEach((bundle) => merged.set(bundle.id, bundle));
  return [...merged.values()].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
};

const applyRealtimeChanges = (incoming, changes) => {
  const merged = new Map(incoming.map((bundle) => [bundle.id, bundle]));
  changes.forEach((bundle, id) => {
    if (bundle) merged.set(id, bundle);
    else merged.delete(id);
  });
  return [...merged.values()].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
};

export default function FindMedicineSection() {
  const { user } = useAuth();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socketMessage, setSocketMessage] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [searchValue, setSearchValue] = useState("");
  const [viewerCoordinates, setViewerCoordinates] = useState(null);
  const [notice, setNotice] = useState("");
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const realtimeChanges = useRef(new Map());

  const loadBundles = useCallback(async () => {
    if (!user) {
      setBundles([]);
      setError("Sign in to view published medicine bundles.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getPublishedBundles(viewerCoordinates);
      if (!Array.isArray(data)) {
        throw new Error("The bundle service returned an invalid response.");
      }
      setBundles(applyRealtimeChanges(data, realtimeChanges.current));
    } catch (fetchError) {
      console.error("Published bundle fetch failed:", fetchError);
      setError(fetchError.message || "Unable to load published bundles.");
    } finally {
      setLoading(false);
    }
  }, [user, viewerCoordinates]);

  useEffect(() => {
    loadBundles();
  }, [loadBundles]);

  useEffect(() => {
    if (!user) return undefined;

    const socket = createMarketplaceSocket();
    const handlePublished = (bundle) => {
      if (!bundle?.id) return;
      realtimeChanges.current.set(bundle.id, bundle);
      setBundles((current) => mergeBundles(current, [bundle]));

      if (viewerCoordinates) {
        getPublishedBundles(viewerCoordinates)
          .then((latest) => {
            latest.forEach((listing) =>
              realtimeChanges.current.set(listing.id, listing)
            );
            setBundles((current) => mergeBundles(current, latest));
          })
          .catch((fetchError) => {
            console.error("Unable to refresh distance-filtered bundles:", fetchError);
            setSocketMessage("Live updates are delayed; use Refresh to retry.");
          });
      }
    };
    const handleUpdated = (update) => {
      if (!update?.id) return;
      realtimeChanges.current.set(
        update.id,
        update.status === "Published" && update.bundle ? update.bundle : null
      );
      setBundles((current) =>
        update.status === "Published" && update.bundle
          ? mergeBundles(current, [update.bundle])
          : current.filter((bundle) => bundle.id !== update.id)
      );
    };
    const handleConnect = () => {
      setSocketMessage("");
      realtimeChanges.current.clear();
      loadBundles();
    };
    const handleDisconnect = () =>
      setSocketMessage("Live updates disconnected. Reconnecting…");
    const handleConnectError = (socketError) => {
      console.error("Marketplace socket connection failed:", socketError);
      setSocketMessage("Live updates unavailable. Listings can still be refreshed.");
    };

    socket.on("bundlePublished", handlePublished);
    socket.on("bundleUpdated", handleUpdated);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      socket.off("bundlePublished", handlePublished);
      socket.off("bundleUpdated", handleUpdated);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [user, viewerCoordinates, loadBundles]);

  const listings = useMemo(() => {
    const query = normalizeText(appliedFilters.medicine);
    const strength = normalizeText(appliedFilters.strength);
    const location = normalizeText(appliedFilters.location);
    const minimumQuantity = parseNumber(appliedFilters.quantity);
    const maximumDistance =
      appliedFilters.distance === "all" || !appliedFilters.distance
        ? null
        : parseNumber(appliedFilters.distance);
    const expiryAfter = dateKey(appliedFilters.expiryAfter);

    const result = bundles.filter((bundle) => {
      const items = getItems(bundle);
      const matchingItems = items.filter((item) => {
        const matchesSearch =
          !query ||
          normalizeText(item.name).includes(query) ||
          normalizeText(item.brand).includes(query) ||
          normalizeText(bundle.name).includes(query);
        const matchesStrength =
          !strength || normalizeText(item.strength) === strength;
        const quantity = parseNumber(item.quantity);
        const matchesQuantity =
          minimumQuantity === null ||
          (quantity !== null && quantity >= minimumQuantity);
        const expiry = dateKey(item.expiryDate);
        const matchesExpiry =
          !appliedFilters.expiryAfter ||
          (expiry && expiryAfter && expiry >= expiryAfter);

        return (
          matchesSearch && matchesStrength && matchesQuantity && matchesExpiry
        );
      });

      const matchesLocation =
        !location || normalizeText(bundle.location).includes(location);
      const distance = parseNumber(bundle.distanceKm);
      const matchesDistance =
        maximumDistance === null ||
        (distance !== null && distance <= maximumDistance);

      return matchesLocation && matchesDistance && matchingItems.length > 0;
    });

    if (appliedFilters.sortBy === "distance") {
      result.sort(
        (a, b) =>
          (parseNumber(a.distanceKm) ?? Number.POSITIVE_INFINITY) -
          (parseNumber(b.distanceKm) ?? Number.POSITIVE_INFINITY)
      );
    } else if (appliedFilters.sortBy === "expiry") {
      result.sort((a, b) => {
        const firstExpiry = Math.min(
          ...getItems(a)
            .map((item) => Date.parse(item.expiryDate))
            .filter(Number.isFinite)
        );
        const secondExpiry = Math.min(
          ...getItems(b)
            .map((item) => Date.parse(item.expiryDate))
            .filter(Number.isFinite)
        );
        return (
          (Number.isFinite(firstExpiry) ? firstExpiry : Infinity) -
          (Number.isFinite(secondExpiry) ? secondExpiry : Infinity)
        );
      });
    } else if (appliedFilters.sortBy === "quantity") {
      result.sort(
        (a, b) =>
          getItems(b).reduce(
            (total, item) => total + (parseNumber(item.quantity) ?? 0),
            0
          ) -
          getItems(a).reduce(
            (total, item) => total + (parseNumber(item.quantity) ?? 0),
            0
          )
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [bundles, appliedFilters]);

  const handleFilterChange = (key, value) => {
    setAppliedFilters((previous) => ({ ...previous, [key]: value }));
  };

  const handleSearch = (query) => {
    setAppliedFilters((previous) => ({
      ...previous,
      medicine: query.trim(),
    }));
  };

  const clearSearch = () => {
    setSearchValue("");
    setAppliedFilters((previous) => ({ ...previous, medicine: "" }));
  };

  const clearFilters = () => {
    setSearchValue("");
    setViewerCoordinates(null);
    setAppliedFilters(initialFilters);
  };

  const handleViewDetails = (bundle) => {
    setNotice(
      `${bundle.name}: ${getItems(bundle).length} medicine(s). Seller details remain private.`
    );
  };

  const handleBundleCreated = (bundle) => {
    setNotice(`"${bundle.name}" was saved as a draft in My Medicine Bundles.`);
  };

  return (
    <section className="app-page-background w-full min-w-0 pb-10 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <header className="mb-7">
          <p className="mb-3 text-[10px] font-extrabold tracking-[0.2em] text-teal-400">
            MEDICINE DISCOVERY
          </p>
          <h1 className="font-serif text-3xl font-normal leading-tight tracking-tight text-slate-100 sm:text-4xl">
            Find the right medicine, nearby
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Browse published non-commercial community bundles from real user inventory.
          </p>
        </header>

        <MedicineSearchBar
          filters={appliedFilters}
          searchValue={searchValue}
          hasViewerLocation={Boolean(viewerCoordinates)}
          onSearchValueChange={setSearchValue}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onReset={clearFilters}
          onLocationChange={setViewerCoordinates}
        />

        {notice && (
          <div
            role="status"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-900 bg-teal-950/40 p-3 text-xs leading-relaxed text-teal-100"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="shrink-0 text-teal-300 hover:text-teal-100"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              {listings.length} matching bundles
            </h2>
            <p className="mt-1.5 text-[10px] text-slate-500">
              Only published bundles are visible; seller identity is not shared.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                realtimeChanges.current.clear();
                loadBundles();
              }}
              disabled={loading}
              className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-3.5 text-xs font-semibold text-slate-200 transition hover:border-teal-800 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() =>
                setNotice("Saved searches are not available yet.")
              }
              className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-3.5 text-xs font-semibold text-slate-200 transition hover:border-teal-800"
            >
              <Bell size={15} />
              Save search
            </button>
            <button
              type="button"
              onClick={() => setIsBundleModalOpen(true)}
              className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 text-xs font-bold text-[#041312] transition hover:bg-teal-400 active:scale-[0.98]"
              title="Create a non-commercial bundle draft from your saved inventory"
            >
              <PackagePlus size={16} />
              Create bundle draft
            </button>
          </div>
        </div>

        {socketMessage && (
          <p role="status" className="mb-3 text-xs text-amber-300">
            {socketMessage}
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-xs text-red-300"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={loadBundles}
              className="font-semibold text-red-200 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-[#101615] p-10 text-sm text-slate-400">
            <LoaderCircle size={17} className="animate-spin" />
            Loading published bundles...
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {listings.map((bundle) => (
              <MedicineListingCard
                key={bundle.id}
                bundle={bundle}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.09] bg-[#101615] px-5 py-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-teal-900 bg-teal-950/50 text-teal-400">
              <Search size={22} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-100">
              No medicines found. Try a different search or adjust your filters.
            </h3>
            {appliedFilters.distance !== "all" && !viewerCoordinates && (
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-amber-300">
                Use your location to apply the selected distance filter.
              </p>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold transition hover:border-teal-700 hover:text-teal-300"
            >
              Reset search and filters
            </button>
          </div>
        )}

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <MapPin size={16} className="mt-0.5 shrink-0 text-teal-400" />
          <p className="text-[10px] leading-relaxed text-slate-500">
            Listings are restricted to vendor accounts and eligible saved inventory. Confirm applicable local requirements before any medicine transaction. Seller contact information is not exposed in public listings.
          </p>
        </div>
      </div>

      <CreateMedicineBundleModal
        isOpen={isBundleModalOpen}
        onClose={() => setIsBundleModalOpen(false)}
        onCreated={handleBundleCreated}
      />
    </section>
  );
}
