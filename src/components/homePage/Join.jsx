import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MedilogLoader from "../MedilogLoader";

function Join({ btnData, UserLogedIn }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (UserLogedIn) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }, 1500);
  };

  return (
    <section
      id="join"
      className="relative overflow-hidden bg-[#0F766E] text-white flex flex-col justify-center items-center py-24 px-6 md:px-20 text-center"
    >
      {/* Background Glow Effects */}
      {/* <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl rounded-full"></div> */}

      <div className="relative  flex flex-col items-center gap-6 max-w-4xl">
        {/* Heading */}
        <h1 className="text-4xl font-bold lg:text-6xl leading-tight">
          {UserLogedIn
            ? "Your health dashboard is waiting"
            : "Ready to secure your medicine cabinet?"}
        </h1>

        {/* Description */}
        <p className="text-md md:text-lg text-gray-300">
          {UserLogedIn
            ? "Ready to take control of your medicine cabinet?"
            : "Join MediLog today and take control of your medication management. Sign up now to experience the benefits of organized tracking."}
        </p>

        {/* Button */}
        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="mt-4 px-8 py-3 text-[#0F766E] bg-white rounded-xl font-medium text-lg hover:scale-105 transition-all duration-200 transform  shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {UserLogedIn ? "Go to My Dashboard" : "Get Started Now"}
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <MedilogLoader    />
      )}
    </section>
  );
}

export default Join;
