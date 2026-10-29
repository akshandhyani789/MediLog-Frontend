import { Link } from "react-router-dom";

const JoinBtn = () => {
  return (
    <Link
      to="/signup"
      className="rounded-xl bg-white px-5 py-2.5 font-semibold text-[#0F766E] shadow-sm transition-colors hover:bg-[#E6FFFA] rounded shadow-lg hover:shadow-teal-900/20 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2"
    >
      Get Started
    </Link>
  );
};

export default JoinBtn;
