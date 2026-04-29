import { Pill, Calendar } from "lucide-react";

const medicines = [
  {
    name: "Ibuprofen 400mg",
    status: "Safe",
    days: "45 days left",
    type: "safe",
  },
  {
    name: "Amoxicillin 500mg",
    status: "Expiring Soon",
    days: "12 days left",
    type: "warning",
  },
  {
    name: "Paracetamol 500mg",
    status: "Expired",
    days: "Expired 5 days ago",
    type: "expired",
  },
  {
    name: "Vitamin D3",
    status: "Safe",
    days: "120 days left",
    type: "safe",
  },
];

export default function DemoDashBoardCard() {
  return (
    <div className="flex items-center justify-center  p-6 lg:w-200 lg:px-10 lg:py-5">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 animate-float">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F766E]">
              Medicine Cabinet
            </h2>
          </div>

          <div className=" relative flex justify-around gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar size={16} />
              4 items
            </div>

            <div className="bg-red-500 text-white text-md px-4 py-2 rounded-full font-medium -top-12  -right-10  absolute text-center">
              2 Alerts
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {medicines.map((med, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 border-amber-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Pill className="text-blue-600" size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {med.name}
                  </h3>
                  <p className="text-sm text-gray-500">{med.days}</p>
                </div>
              </div>

              <StatusBadge type={med.type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ type }) {
  if (type === "safe")
    return (
      <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
        Safe
      </span>
    );

  if (type === "warning")
    return (
      <span className="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full text-sm font-medium">
        Expiring Soon
      </span>
    );

  return (
    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
      Expired
    </span>
  );
}
