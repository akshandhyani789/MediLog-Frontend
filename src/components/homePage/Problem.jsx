import React from "react";
import ProblemCard from "./problemSectionCard/ProblemCard";
import { AlertTriangle, DollarSign, Heart } from "lucide-react";

function Problem() {
  const problems = [
    {
      icon: Heart,
      title: "Health Hazards",
      description:
        "Expired medications can lose potency or become harmful, putting your family's health at serious risk.",
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
    },
    {
      icon: DollarSign,
      title: "Financial Loss",
      description:
        "The average household wastes $200+ annually on medicines that expire before use. Money down the drain.",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Readiness",
      description:
        "When you need medicine urgently, discovering it's expired can delay critical treatment.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div
      id="problem"
      className="
        relative overflow-hidden
        py-24 px-6 lg:px-32
        flex flex-col gap-6 text-center items-center
        bg-gradient-to-b from-white via-slate-50 to-white
      "
    >
      {/* subtle background glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-teal-200 blur-[150px] opacity-30 rounded-full"></div>

      <h3 className="text-sm md:text-base font-semibold tracking-widest text-[#0F766E] uppercase">
        The Silent Risk
      </h3>

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
        Your medicine cabinet could be a{" "}
        <span className="text-[#0F766E]">liability.</span>
      </h1>

      <p className="text-base md:text-xl text-gray-600 py-2 px-4 max-w-3xl">
        Most individuals keep expired medicines, creating unnecessary health
        risks and financial waste. It's time to take control.
      </p>

      <div className="flex gap-8 flex-col lg:flex-row items-stretch justify-center mt-12 w-full max-w-6xl">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="transform hover:-translate-y-2 transition duration-300"
          >
            <ProblemCard
              icon={problem.icon}
              title={problem.title}
              description={problem.description}
              color={problem.color}
              bgColor={problem.bgColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Problem;