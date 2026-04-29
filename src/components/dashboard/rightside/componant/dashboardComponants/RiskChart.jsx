import React, { useMemo } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

// 🔥 Risk calculator
const getRiskLevel = (expiryDate) => {
  if (!expiryDate) return "UNKNOWN";

  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "HIGH";     // expired
  if (diffDays <= 7) return "HIGH";    // critical
  if (diffDays <= 30) return "SOON";   // warning
  return "SAFE";                      // safe
};

function RiskChart({ medicines = [] }) {

  // 📊 Aggregate risk data
  const riskData = useMemo(() => {
    const riskMap = {
      SAFE: 0,
      SOON: 0,
      HIGH: 0,
    };

    medicines.forEach((med) => {
      const risk = getRiskLevel(med.expiryDate);
      if (riskMap[risk] !== undefined) {
        riskMap[risk]++;
      }
    });

    return [
      {
        name: "Safe",
        value: riskMap.SAFE,
        color: "#10B981",
        bgColor: "bg-green-50",
        icon: CheckCircle,
        textColor: "text-green-700",
      },
      {
        name: "Expiring Soon",
        value: riskMap.SOON,
        color: "#F59E0B",
        bgColor: "bg-amber-50",
        icon: Clock,
        textColor: "text-amber-700",
      },
      {
        name: "High Risk",
        value: riskMap.HIGH,
        color: "#EF4444",
        bgColor: "bg-red-50",
        icon: AlertCircle,
        textColor: "text-red-700",
      },
    ];
  }, [medicines]);

  const total = useMemo(() => {
    return riskData.reduce((sum, item) => sum + item.value, 0);
  }, [riskData]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-300">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          Medicine Risk Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Health status by expiry dates
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* CENTER - TOTAL COUNT */}
        <div className="sm:col-span-3 flex items-center justify-center py-4">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              {total}
            </div>
            <div className="text-sm text-gray-500 font-medium mt-2">
              Total Medicines
            </div>
          </div>
        </div>

        {/* RISK ITEMS */}
        {riskData.map((item, index) => {
          const Icon = item.icon;
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          
          return (
            <div key={index} className="group">
              <div className={`${item.bgColor} rounded-2xl p-4 border border-gray-200 transition-all duration-300 group-hover:shadow-md group-hover:border-gray-300`}>
                
                {/* Icon + Label */}
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${item.textColor}`} />
                  <span className={`text-sm font-semibold ${item.textColor}`}>
                    {item.name}
                  </span>
                </div>

                {/* Value */}
                <div className={`text-2xl font-bold ${item.textColor} mb-2`}>
                  {item.value}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Percentage */}
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  {percentage}% of total
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          {riskData[0].value > 0 && `✅ ${riskData[0].value} medicines are safe | `}
          {riskData[1].value > 0 && `⏰ ${riskData[1].value} expiring soon | `}
          {riskData[2].value > 0 && `🚨 ${riskData[2].value} need immediate attention`}
          {total === 0 && "No medicines tracked yet"}
        </p>
      </div>
    </div>
  );
}

export default RiskChart;