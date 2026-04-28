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
      className="bg-gray-100 flex flex-col justify-center items-center gap-20 xl:gap-30 py-10 md:py-30 px-10  md:p-20 lg:px-30 xl:flex-row lg:py-50"
    >
      <div id="text" className="max-w-xl ">
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
        <span className="inline-block mt-4 px-4 py-1 text-sm font-medium text-blue-[#0F766E] bg-blue-50 rounded-full">
          Designed with patient safety in mind
        </span>
      </div>
      {isLoading && (
      <MedilogLoader  />
      )}
      <div className="flex">
        <DemoDashBoardCard />
      </div>
    </div>
  );
}

export default Hero;
