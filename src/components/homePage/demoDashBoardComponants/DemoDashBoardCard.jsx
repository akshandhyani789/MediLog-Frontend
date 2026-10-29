import {
  Search,
  MapPin,
  Bell,
  CheckCircle2,
} from "lucide-react";

export default function DemoDashBoardCard() {
  return (
    <div className="relative w-full flex justify-center px-2 sm:px-6 py-6">
      
      {/* Main Dashboard */}
      <div
  className="
    relative
    w-full
    max-w-[1250px]
    rounded-[28px]
    border border-slate-200
    bg-gradient-to-br from-white to-[#F0FDFA]
    p-5 sm:p-7
    shadow-2xl
  "
>
        {/* Inner Search Area */}
        <div
          className="
            relative
            rounded-[22px]
            bg-gradient-to-br from-[#FFFFFF] to-[#ECFDF5]
            p-4 sm:p-5
          "
        >
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
            
            <div
              className="
                rounded-xl
                bg-teal-50
                px-3 py-2
                text-sm sm:text-base
                text-[#00A6B2]
                font-medium
              "
            >
              Find medicine
            </div>

            <div
              className="
                px-1
                text-sm sm:text-base
                text-gray-400
                font-medium
              "
            >
              Nearby availability
            </div>

          </div>

          {/* Search Inputs */}
          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-3
            "
          >
            {/* Medicine Input */}
            <div
              className="
                flex
                items-center
                gap-3
                flex-1
                bg-white
                rounded-2xl
                px-4
                py-3.5
              "
            >
              <Search
                size={21}
                className="text-gray-400 shrink-0"
              />

              <span className="text-slate-800 text-base sm:text-lg">
                Search published bundles
              </span>
            </div>

            {/* Location Input */}
            <div
              className="
                flex
                items-center
                gap-3
                lg:w-[250px]
                bg-white
                rounded-2xl
                px-4
                py-3.5
              "
            >
              <MapPin
                size={21}
                className="text-[#00A6B2] shrink-0"
              />

              <span className="text-slate-800 text-base sm:text-lg">
                Your area
              </span>
            </div>

            {/* Search Button */}
            <button
              className="
                bg-[#009BA8]
                hover:bg-[#00A6B2]
                text-black
                font-medium
                text-base
                px-7
                py-3.5
                rounded-2xl
                transition-all
                duration-200
                hover:scale-[1.02]
              "
            >
              Search
            </button>
          </div>

          {/* Expiry Alert */}
          <div
            className="
              absolute
              -top-4
              right-[-5px] sm:right-[-20px]
              flex
              items-center
              gap-2
              bg-white
              border border-slate-200
              rounded-full
              px-4
              py-2
              shadow-xl
              whitespace-nowrap
            "
          >
            <Bell
              size={17}
              className="text-red-400"
            />

            <span className="text-slate-800 text-sm font-semibold">
              Expiry alerts from your saved inventory
            </span>
          </div>
        </div>

        {/* Medicine Results */}
        <div className="mt-5 rounded-[22px] border border-slate-200 bg-gradient-to-br from-white to-[#F0FDFA] px-5 py-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            Published listings appear here
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Only real bundles explicitly published by vendors are shown.
          </p>
        </div>
      </div>

      {/* Match Created Badge */}
      <div
        className="
          absolute
          bottom-0
          left-[-5px] sm:left-[-30px]
          flex
          items-center
          gap-2
          bg-white
          border border-slate-200
          rounded-full
          px-4
          py-2
          shadow-xl
        "
      >
        <CheckCircle2
          size={18}
          className="text-[#00A6B2]"
        />

        <span className="text-slate-800 text-sm font-semibold">
          Live listing updates
        </span>
      </div>
    </div>
  );
}