import { CheckCircle } from "lucide-react";

function NoAlertsCard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="p-4 rounded-2xl bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Clear! 🎉</h2>
          <p className="text-gray-600 text-center font-medium">
            No active alerts. Your medicines are all in good standing.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Keep monitoring for upcoming expiry dates and stock levels.
          </p>
        </div>
  );
}

export default NoAlertsCard;