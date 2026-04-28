import { Heart } from "lucide-react";
import IconCard from "../../IconCard";

export default function ProblemCard({
  index,
  icon:Icon,
  title,
  description,
  color,
  bgColor,
}) {
  return (
    <div className={`group relative max-w-2xl rounded-3xl px-10 py-15 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${bgColor}  hover:text-white`}>
      {/* Decorative Circle */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-200 opacity-40 rounded-full transition-transform duration-300 ease-out 
                  group-hover:scale-[1.20]"></div>

      {/* Content */}
      <div className="  relative  text-left">
        {/* Icon */}
        <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${color} rounded-2xl shadow-md transition-transform duration-300 ease-out 
                  group-hover:scale-[1.20]`}>
          <IconCard Icon={Icon} />
        </div>

        {/* Title */}
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-600 leading-relaxed  text-xl">
          {description}
        </p>
      </div>
    </div>
  );
}
