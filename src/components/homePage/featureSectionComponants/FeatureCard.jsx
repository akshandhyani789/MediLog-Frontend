import React from "react";

const FeatureCard = ({ icon, title, description, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300">
      
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 mb-6">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl lg:text-3xl font-semibold mb-4">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
        {description}
      </p>

      {/* Extra Content */}
      {children}
    </div>
  );
};

export default FeatureCard;
