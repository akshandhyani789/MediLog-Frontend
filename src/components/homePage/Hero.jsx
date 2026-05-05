import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DemoDashBoardCard from "./demoDashBoardComponants/DemoDashBoardCard";
import MedilogLoader from "../MedilogLoader";

function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handelJoin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div
      id="hero"
      className="relative overflow-hidden flex flex-col justify-center items-center gap-20 xl:gap-30 py-10 md:py-30 px-10 md:p-20 lg:px-30 xl:flex-row lg:py-50 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100"
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-300 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-300 blur-[140px] rounded-full"></div>
      </div>

      <div id="text" className="max-w-xl relative">
        <h1 className="font-bold text-3xl sm:text-4xl lg:text-7xl">
          Track Every Medicine<span className="text-[#0F766E]"> Before</span> It
          Expires
        </h1>

        <p className="text-[#64748B] py-6 text-xl md:text-2xl">
          MediLog protects you from the health risks and financial waste of
          expired medication with smart inventory management and real-time
          alerts.
        </p>

        <div className="flex gap-4">
          <button
            onClick={handelJoin}
            className="px-10 py-3 bg-[#0F766E] text-lg rounded-lg text-white hover:scale-105 transition-all duration-75 shadow-2xl font-medium"
          >
            Get Started
          </button>
        </div>

        <span className="inline-block mt-4 px-4 py-1 text-sm font-medium text-[#0F766E] bg-teal-50 rounded-full">
          Designed with patient safety in mind
        </span>
      </div>

      {isLoading && <MedilogLoader />}

      <div className="flex relative">
        <DemoDashBoardCard />
      </div>
    </div>
  );
}

export default Hero;