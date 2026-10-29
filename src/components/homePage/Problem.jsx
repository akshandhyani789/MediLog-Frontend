import ProblemCard from "./problemSectionCard/ProblemCard";
import {
  AlertTriangle,
  DollarSign,
  Heart,
  Bell,
  ClipboardList,
} from "lucide-react";

function Problem() {
  const problems = [
    {
      title: "Expired Medicines at Home",
      description:
        "Many people unknowingly consume expired medicines because they forget expiry dates or fail to track them properly.",
    },

    {
      title: "No Reminder System",
      description:
        "Traditional medicine storage provides no alerts or notifications when medicines are about to expire or run out.",
    },

    {
      icon: ClipboardList,
      title: "Poor Medicine Management",
      description:
        "Managing prescriptions, stock levels, and medicine records manually becomes difficult, especially for families and vendors.",
    },
  ];

  return (
    <div
      id="problem"
      className="relative overflow-hidden py-24 px-6 lg:px-32 flex flex-col gap-6 text-center items-center bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-teal-200 blur-[150px] opacity-30 rounded-full"></div>

      <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#0F857B] shadow-sm mb-5">
        <span className="h-2 w-2 rounded-full bg-[#12B8A6]" />
        The Gap
      </span>

      <h1 className="text-2xl md:text-3xl lg:text-5xl font-semiBold leading-[0.95] max-w-3xl">
        <span className="block">Too many medicines are</span>
        <span className="block">forgotten. Too many needs</span>
        <span className="block top-[-10px]">remain disconnected.</span>
      </h1>

      <p className="text-base md:text-xl text-gray-600 py-2 px-4 max-w-4xl">
        Usable medicines can sit unnoticed while people and organizations
        struggle to discover what is available nearby. MediLog brings these
        pieces together.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12 w-full max-w-8xl mx-auto place-items-center">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="w-full max-w-2xl transform hover:-translate-y-2 transition duration-300"
          >
            <ProblemCard
              index={index + 1}
              title={problem.title}
              description={problem.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Problem;
