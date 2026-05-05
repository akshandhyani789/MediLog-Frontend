import { Activity } from "lucide-react";

function Logo({ handleScroll = () => {} }) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => handleScroll("hero")}
    >
      <span className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#0F766E]">
        <Activity size={24} strokeWidth={2} color="#fff" />
      </span>

      <h2 className="text-2xl font-bold text-[#0F766E]">MediLog</h2>
    </div>
  );
}

export default Logo;