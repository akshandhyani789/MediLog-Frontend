import React from "react";

const EditButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium text-teal-600 hover:text-teal-800 transition"
    >
      {children}
    </button>
  );
};

export default EditButton;