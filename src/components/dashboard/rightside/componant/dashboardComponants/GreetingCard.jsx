import React from "react";
import { Sun, Sunrise, Moon } from "lucide-react";
import InsightCard from "./InsightCard";
import { useAuth } from "../../../../../hooks/useAuth";

function GreetingCard() {
  
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
    year: "numeric",
  });

  const { userData } = useAuth();
  const userName = userData?.name || "User";




  return (
    <div className="w-full rounded-2xl p-5 
      bg-gradient-to-br from-[#F4F6F5] to-white 
      border border-gray-200 
      shadow-sm space-y-4">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            
            {/* Icon */}
            <div className="p-1.5 rounded-lg bg-[#0F766E]/10">
              <Icon className="w-4 h-4 text-[#0F766E]" />
            </div>

            Good {text},{" "}
            <span className="text-[#0F766E] font-semibold">
              {userName}
            </span>
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {formattedDate}
          </p>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full 
          bg-[#0F766E]/10 text-[#0F766E] 
          text-xs font-medium backdrop-blur-sm">
          
          <Icon className="w-3 h-3" />
          {text}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Insight */}
      {/* <InsightCard /> */}
    </div>
  );
}

export default GreetingCard;