
import React from "react";
import { Sun, Sunrise, Moon, Calendar } from "lucide-react";
import { useAuth } from "../../../../../hooks/useAuth";

function GreetingCard() {
  const { userData } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return { text: "morning", Icon: Sunrise };
    if (hour < 18) return { text: "afternoon", Icon: Sun };

    return { text: "evening", Icon: Moon };
  };

  const { text, Icon } = getGreeting();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  let userName = "User";

  if (userData?.role === "vendor") {
    userName = userData?.ownerName || "Vendor";
  } else if (userData?.role === "individual") {
    userName = userData?.name || "Individual";
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00C2C7]/25 sm:p-8">
      {/* Subtle teal glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#00C2C7]/[0.08] blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-2xl border border-[#00C2C7]/20 bg-[#00C2C7]/[0.09] p-3 shadow-[0_0_20px_rgba(0,194,199,0.05)]">
              <Icon className="h-5 w-5 text-[#00C2C7]" />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                Your MediLog dashboard
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
                Good {text},{" "}
                <span className="text-[#00C2C7]">
                  {userName.split(" ")[0]}
                </span>
              </h1>
            </div>
          </div>

          <div className="ml-1 flex items-center gap-2 text-sm font-medium text-gray-400 sm:ml-14">
            <Calendar className="h-4 w-4 shrink-0 text-[#00C2C7]" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Online status */}
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="hidden text-xs font-medium text-emerald-300 sm:inline">
            Active
          </span>
        </div>
      </div>

      <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <p className="relative text-sm leading-relaxed text-gray-400">
        Stay on top of your medicines, monitor expiry dates, and keep your
        inventory organized.
      </p>
    </div>
  );
}

export default GreetingCard;