import {
  ArrowUpRight,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  PackageCheck,
  Leaf,
} from "lucide-react";

function About() {
  const benefits = [
    "Keep medicine information organized",
    "Stay aware of upcoming expiry dates",
    "Discover available medicines more easily",
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-r from-[#0F857B] to-[#12B8A6] py-20 md:py-28 px-6 sm:px-10 lg:px-20"
    >
      {/* Soft gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-0 h-80 w-80 rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#D5FFF6]/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section label */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
          <HeartPulse size={16} />
          About MediLog
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: About text */}
          <div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Making medicine management
              <span className="block text-[#D5FFF6]">
                simpler and more responsible.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/95 md:text-lg">
              Medicines can be forgotten, expiry dates can be overlooked, and
              useful stock can go to waste. MediLog brings medicine tracking,
              expiry awareness, and medicine discovery together in one
              easy-to-use platform.
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
              Our goal is to help individuals and medicine providers manage
              medicine information more efficiently and make it easier to
              discover available medicines when they are needed.
            </p>

            {/* Benefits */}
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-white">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-[#D5FFF6]"
                  />
                  <span className="leading-6">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Visual storytelling panel */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-white/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white p-6 shadow-2xl shadow-teal-950/15 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="mt-1 text-xl font-bold text-slate-800">
                    Manage with confidence
                  </h3>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F857B] to-[#12B8A6] text-white shadow-md shadow-teal-900/10">
                  <HeartPulse size={25} />
                </div>
              </div>

              {/* Three key pillars */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F857B] shadow-sm">
                    <PackageCheck size={22} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">Organize</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Keep medicine records and quantities in one place.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-gradient-to-r from-[#E8FAF7] to-white p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F857B] shadow-sm">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Stay informed
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Make expiry dates and stock status easier to monitor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F857B] shadow-sm">
                    <Leaf size={22} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Reduce waste
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Support more responsible medicine management and
                      discovery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission banner */}
              <div className="mt-6 rounded-xl bg-gradient-to-r from-[#0F857B] to-[#12B8A6] px-5 py-4 text-white">
                <p className="text-sm font-medium text-white/85">Our mission</p>
                <p className="mt-1 text-lg font-semibold leading-snug">
                  Better organization. Smarter discovery. Less waste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
