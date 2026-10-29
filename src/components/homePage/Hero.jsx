import { Pill, ShieldCheck } from "lucide-react";
import DemoDashBoardCard from "./demoDashBoardComponants/DemoDashBoardCard";
import JoinBtn from "../JoinBtn";

function Hero() {
  return (
    <div
      id="hero"
      className="
    relative
    overflow-hidden
    flex flex-col
    justify-center
    items-center
    gap-10
    py-20 md:py-20
    px-8 md:px-8
    lg:py-40
    bg-gradient-to-br from-[#ECFDF5] via-[#CCFBF1] to-[#F0FDFA]
  "
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-28 -left-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.18),transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-36 -right-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(6,78,59,0.10),transparent_70%)] blur-2xl" />
        <div className="absolute right-[12%] top-[15%] hidden h-16 w-16 rotate-12 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-teal-700 shadow-xl shadow-teal-900/10 md:flex">
          <Pill className="h-8 w-8" />
        </div>
        <div className="absolute bottom-[18%] left-[12%] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-emerald-700 shadow-xl shadow-teal-900/10 md:flex">
          <ShieldCheck className="h-7 w-7" />
        </div>
      </div>

      {/* Text Section */}
      <div
        id="text"
        className="relative w-full max-w-6xl text-center flex flex-col items-center"
      >
        <h1 className="text-slate-900 font-bold text-3xl sm:text-4xl lg:text-7xl tracking-tight">
          Turn unused medicines
        </h1>
        <h1 className="text-teal-800 font-bold text-3xl sm:text-4xl lg:text-7xl tracking-tight">
          <span className="text-slate-900">into</span> medicine that matters.
        </h1>

        <p className="text-slate-600 py-6 text-lg md:text-xl max-w-4xl leading-relaxed">
          MediLog helps you manage your medicines, discover available medicines
          nearby, and connect people and organizations with the medicines they
          need.
        </p>

        <div className="flex gap-4">
          <JoinBtn />
        </div>
      </div>

      {/* Dashboard */}
      <div className="relative w-full max-w-[900px] flex justify-center">
        <DemoDashBoardCard />
      </div>
    </div>
  );
}

export default Hero;
