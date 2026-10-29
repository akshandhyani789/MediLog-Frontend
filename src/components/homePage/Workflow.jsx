import React from "react";
import { Database, Clock3, Search, Sparkles } from "lucide-react";
import Flowcard from "../Flowcard";

function Workflow() {
  const wrokflow = [
    {
      icon: Database,
      title: "Manage",
      description: "Add medicines manually, through barcode scanning or OCR.",
    },
    {
      icon: Clock3,
      title: "Monitor",
      description: "Track quantity, expiry dates and medicine information.",
    },
    {
      icon: Search,
      title: "Discover",
      description:
        "Search available medicines using name, location, quantity and expiry.",
    },
    {
      icon: Sparkles,
      title: "Match & Rescue",
      description:
        "Rank relevant availability against requests and create meaningful connections.",
    },
  ];
  return (
    <div
      id="Workflow"
      className="relative overflow-hidden py-24 px-6 lg:px-32 flex flex-col gap-6 text-center items-center bg-gradient-to-br from-white via-[#F0FDFA] to-[#ECFDF5]"
    >
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(20,184,166,0.14),transparent_70%)] blur-[100px] rounded-full"></div>

      <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#0F857B] shadow-sm mb-5">
        <span className="h-2 w-2 rounded-full bg-[#12B8A6]" />
        The System
      </span>

      <h1 className="text-slate-900 text-2xl md:text-3xl lg:text-5xl font-semiBold leading-[0.95] max-w-3xl">
        <span className="block">One platform. Four simple steps.</span>
      </h1>

      <p className="text-base md:text-xl text-[#64748B] py-2 px-4 max-w-4xl">
        From the medicine cabinet to the right request, MediLog makes every step
        visible.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-12 w-full max-w-8xl mx-auto place-items-center">
        {wrokflow.map((workflow, index) => (
          <div
            key={index}
            className="w-full max-w-2xl transform hover:-translate-y-2 transition duration-300"
          >
            <Flowcard
              index={index}
              icon={workflow.icon}
              title={workflow.title}
              description={workflow.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workflow;
