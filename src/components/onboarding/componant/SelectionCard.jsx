import React from 'react';

const SelectionCard = ({ title, description, icon, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer p-8 rounded-[2rem] transition-all duration-300 w-full max-w-sm h-80 flex flex-col justify-between border-2 ${
        isSelected 
        ? 'bg-white border-transparent shadow-xl ring-1 ring-black/5' 
        : 'bg-white/50 border-transparent opacity-80 hover:opacity-100'
      }`}
    >
      {/* Selection Checkmark */}
      {isSelected && (
        <div className="absolute top-6 right-6 bg-[#00695C] text-white rounded-full p-1 shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Icon Circle */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 ${
        isSelected ? 'bg-[#B2DFDB]' : 'bg-[#E0E0E0]'
      }`}>
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-2xl font-serif text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SelectionCard;