import React from "react";

function IconCard({ Icon, size = 26 }) {
  return (
    <div>
      <Icon className="text-white" size={size} />
    </div>
  );
}

export default IconCard;
