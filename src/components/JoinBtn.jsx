import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MedilogLoader from "./MedilogLoader";

const JoinBtn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isNavigating = useRef(false);
  const navigationTimer = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(navigationTimer.current);
    };
  }, []);

  const handleJoin = (event) => {
    event.preventDefault();
    if (isNavigating.current) return;

    isNavigating.current = true;
    setIsLoading(true);
    navigationTimer.current = window.setTimeout(() => {
      navigationTimer.current = null;
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <Link
        to="/login"
        onClick={handleJoin}
        aria-disabled={isLoading}
        className="rounded-xl bg-white px-5 py-2.5 font-semibold text-[#0F766E] shadow-sm transition-colors hover:bg-[#E6FFFA] rounded shadow-lg hover:shadow-teal-900/20 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2"
      >
        Get Started
      </Link>
      {isLoading && <MedilogLoader />}
    </>
  );
};

export default JoinBtn;
