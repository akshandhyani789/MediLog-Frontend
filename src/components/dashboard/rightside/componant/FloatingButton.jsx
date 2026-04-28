import { Plus } from "lucide-react";

function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 
        w-14 h-14 
        bg-teal-500 hover:bg-teal-600 
        text-white 
        rounded-full 
        flex items-center justify-center 
        shadow-lg hover:shadow-xl 
        transition-all duration-200
        z-50
      "
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

export default FloatingButton;