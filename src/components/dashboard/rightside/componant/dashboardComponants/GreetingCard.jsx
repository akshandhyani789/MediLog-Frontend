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
    <div className="w-full rounded-3xl p-6 bg-gradient-to-br from-teal-50 via-white to-blue-50 border border-teal-100/50 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-white/80 border border-teal-200 shadow-sm">
              <Icon className="w-5 h-5 text-teal-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Good {text},{" "}
                <span className="text-teal-600">
                  {userName.split(" ")[0]}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-600 text-sm font-medium mt-2 ml-12">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-teal-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent my-4" />

      
    </div>
  );
}

export default GreetingCard;