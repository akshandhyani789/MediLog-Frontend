export default function ProblemCard({
  index,
  title,
  description,
}) {
  console.log(index, title, description);
  return (
    <div className="group relative rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-[#F0FDFA] px-8 py-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Content */}
      <div className="  relative text-left ">
      <p className="font-semibold text-teal-700">0{index}</p>

        {/* Title */}
        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
