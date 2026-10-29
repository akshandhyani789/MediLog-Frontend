import {
  BellRing,
  Package,
  ScanLine,
  ClipboardList,
  Search,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BellRing,
    title: "Expiry Tracking & Alerts",
    description:
      "Track medicine expiry dates and receive timely alerts before medicines expire.",
    number: "01",
  },
  {
    icon: Package,
    title: "Medicine Inventory",
    description:
      "Keep your medicines organized with expiry dates, dosage details, and quantity tracking.",
    number: "02",
  },
  {
    icon: ScanLine,
    title: "Barcode & OCR Scanning",
    description:
      "Simplify medicine entry with barcode scanning and text recognition from medicine labels.",
    number: "03",
  },
  {
    icon: ClipboardList,
    title: "Stock Management",
    description:
      "Monitor medicine quantities, update stock, and identify low-stock or unavailable items.",
    number: "04",
  },
  {
    icon: Search,
    title: "Medicine Discovery",
    description:
      "Explore medicine listings and bundles to help connect available medicines with people who need them.",
    number: "05",
  },
];

const Features = () => {
  // Duplicate cards for a seamless continuous carousel.
  const carouselFeatures = [...features, ...features];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-br from-[#F0FDFA] via-white to-[#ECFDF5] py-20 md:py-24 px-5 sm:px-8 lg:px-16"
    >
      <style>{`
        @keyframes medilog-feature-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .medilog-feature-track {
          animation: medilog-feature-scroll 35s linear infinite;
        }

        .medilog-feature-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .medilog-feature-track {
            animation: none;
          }
        }
      `}</style>

      {/* Background accents */}
      <div className="absolute -top-24 left-0 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#0F857B] shadow-sm mb-5">
            <span className="h-2 w-2 rounded-full bg-[#12B8A6]" />
            What MediLog Offers
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight">
            Smarter Medicine
            <span className="block text-[#0F857B]">Management Starts Here</span>
          </h2>

          <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
            Everything you need to organize medicines, stay ahead of expiry
            dates, manage stock, and discover available medicines in one place.
          </p>
        </div>

        {/* Carousel container */}
        <div className="rounded-3xl border border-teal-100 bg-white/70 p-4 sm:p-6 md:p-8 shadow-xl shadow-teal-900/5 backdrop-blur-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800">
                Explore Our Features
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Practical tools for safer medicine management.
              </p>
            </div>

            <span className="text-xs font-medium text-[#0F857B]">
              Built for everyday healthcare
            </span>
          </div>

          {/* Moving cards */}
          <div
            className="overflow-hidden"
            role="region"
            aria-label="MediLog features carousel"
          >
            <div className="medilog-feature-track flex w-max gap-4 py-2">
              {carouselFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const isDuplicate = index >= features.length;

                return (
                  <article
                    key={`${feature.number}-${index}`}
                    aria-hidden={isDuplicate ? true : undefined}
                    className="group flex w-[250px] sm:w-[280px] min-h-[225px] flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/10"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E0F7F3] to-[#CCFBF1] text-[#0F857B] transition-colors duration-300 group-hover:from-[#0F857B] group-hover:to-[#12B8A6] group-hover:text-white">
                        <Icon size={23} strokeWidth={1.8} />
                      </div>

                      <span className="text-sm font-semibold text-slate-300">
                        {feature.number}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold leading-snug text-slate-800">
                      {feature.title}
                    </h4>

                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0F857B]">
                      <span>Smart healthcare</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="mt-7 flex items-center justify-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-[#0F857B]" />
            <span className="h-1.5 w-3 rounded-full bg-teal-200" />
            <span className="h-1.5 w-3 rounded-full bg-teal-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
