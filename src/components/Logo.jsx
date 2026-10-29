import { Pill } from 'lucide-react';

function Logo({ handleScroll = () => {}, variant = "dark" }) {
  const isLight = variant === "light";

  return (
    <button
      type="button"
      aria-label="MediLog home"
      onClick={() => handleScroll("hero")}
      className="flex cursor-pointer items-center gap-2 text-left"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
          isLight ? "bg-[#E0F7F2]" : "bg-[#0F857B]"
        }`}
      >
        <Pill
          className={`h-6 w-6 rotate-15 ${
            isLight ? "text-[#0F857B]" : "text-white"
          }`}
        />
      </span>

      <span
        className={`text-2xl font-bold ${
          isLight ? "text-white" : "text-[#0F857B]"
        }`}
      >
        MediLog
      </span>
    </button>
  );
}

export default Logo;