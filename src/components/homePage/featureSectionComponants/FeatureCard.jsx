import React from 'react';

const FeatureCard = ({ icon: Icon, title }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#F0FDFA] p-6 text-slate-900 shadow-sm transition-colors hover:border-teal-200">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#0F766E]">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <span className="text-base font-medium text-gray-200">{title}</span>
    </div>
  );
};

export default FeatureCard;