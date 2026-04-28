function InfoBadge({
  Icon,
  iconText,
  countType = "none",
  bgColor = "bg-gray-100",
  borderColor = "border-gray-200",
  color = "text-gray-700",
  bgHover = "hover:bg-gray-200",
  alertCount = 0,
  handleClick,
}) {


  return (
    <div
    onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-1.5 ${bgColor} border ${borderColor} rounded-lg text-sm ${color} shadow-sm ${bgHover} transition cursor-pointer`}
    >
      <Icon className={`w-4 h-4 ${color}`} />

      {countType !== "none" && (
        <span className="font-medium">
          {alertCount} {iconText}
        </span>
      )}
    </div>
  );
}

export default InfoBadge;