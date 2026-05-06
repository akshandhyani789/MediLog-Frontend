import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MedilogLoader from "../MedilogLoader";

function Join({ btnData }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <section
      id="join"
      className="relative overflow-hidden bg-[#0F766E] text-white flex flex-col justify-center items-center py-24 px-6 md:px-20 text-center"
    >
      <div className="relative flex flex-col items-center gap-6 max-w-4xl">
        <h1 className="text-3xl font-bold lg:text-6xl leading-tight">
          Ready to secure your medicine cabinet?
        </h1>

        <p className="text-md md:text-lg text-gray-300">
          Join MediLog today and take control of your medication management. Sign up now to experience the benefits of organized tracking.
        </p>

        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="mt-4 px-8 py-3 text-[#0F766E] bg-white rounded-xl font-medium text-lg hover:scale-105 transition-all duration-200 transform shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Get Started Now
        </button>
      </div>

      {isLoading && <MedilogLoader />}
    </section>
  );
}

export default Join;
