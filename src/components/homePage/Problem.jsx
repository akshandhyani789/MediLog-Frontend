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
      className=" py-20 px-10 lg:px-30 flex flex-col gap-5 text-center items-center"
    >
      <h3 className="text-2xl font-semibold text-[#0F766E]">THE SILENT RISK</h3>
      <h1 className="text-6xl font-bold ">
        Your medicine cabinet could be a{" "}
        <span className="text-[#0F766E]">liability.</span>
      </h1>
      <p className="text-xl text-gray-700 py-4 px-10">
        Most Individuals keep expired medicines, creating unnecessary health
        risks and financial waste. It's time to take control.
      </p>
      <div className="flex gap-10 flex-col lg:flex-row items-center justify-center mt-10">
        {problems.map((problem, index) => (
          <ProblemCard
            key={index}
            icon={problem.icon}
            title={problem.title}
            description={problem.description}
            color={problem.color}
            bgColor={problem.bgColor}
          />
        ))}
      </div>
    </div>
  );
}

export default Problem;
