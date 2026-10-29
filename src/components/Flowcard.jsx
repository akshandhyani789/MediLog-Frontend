import { ChevronRight } from "lucide-react";

const Flowcard = ({  icon: Icon, title, description, showArrow = true }) => {
  return (
    <div className="relative min-h-[230px] w-full rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-[#F0FDFA] p-7 shadow-sm">
      
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
        <Icon className="h-6 w-6 text-teal-700" />
      </div>

      {/* Content */}
      <div className="mt-10 text-start">
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-[15px] leading-7 text-slate-600">
          {description}
        </p>
      </div>

      {/* Arrow */}
      {showArrow && (
        <ChevronRight
          className="absolute -right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700"
        />
      )}
    </div>
  );
};

export default Flowcard;