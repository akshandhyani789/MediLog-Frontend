import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../Logo";
import MedilogLoader from "../MedilogLoader";

function Navbar({ btnData }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handelJoin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 2000);
  };

  const handleScroll = (id, e) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="flex justify-around items-center p-4 md:fixed w-full bg-white shadow-md z-10">
      <Logo handleScroll={handleScroll} />

      <ul className="gap-6 hidden md:flex items-center text-md md:text-lg font-medium">
        <li className="hover:text-[#0F766E] cursor-pointer hover:scale-105 transition-all duration-75">
          <a href="#hero" onClick={(e) => handleScroll("hero", e)}>Home</a>
        </li>
        <li className="hover:text-[#0F766E] cursor-pointer hover:scale-105 transition-all duration-75">
          <a href="#features" onClick={(e) => handleScroll("features", e)}>Features</a>
        </li>
        <li className="hover:text-[#0F766E] cursor-pointer hover:scale-105 transition-all duration-75">
          <a href="#about" onClick={(e) => handleScroll("about", e)}>About</a>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        <button
          onClick={handelJoin}
          className="hidden sm:flex hover:text-[#0F766E] cursor-pointer hover:scale-105 transition-all duration-75 text-md md:text-lg font-medium"
        >
          Sing In
        </button>
        <button
          onClick={handelJoin}
          className="px-5 py-2 bg-[#0F766E] rounded-lg text-white hover:scale-105 transition-all duration-75 shadow-2xl font-medium text-md md:text-lg"
        >
          Sign Up
        </button>
      </div>

      {isLoading && <MedilogLoader />}
    </nav>
  );
}

export default Navbar;
