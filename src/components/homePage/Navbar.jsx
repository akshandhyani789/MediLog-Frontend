import Logo from "../Logo";
import JoinBtn from "../JoinBtn";

function Navbar() {
  const handleScroll = (id, e) => {
    if (e) e.preventDefault();

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className="fixed top-0 left-0 flex w-full items-center justify-between px-5 md:px-10 py-4 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] backdrop-blur-xl shadow-md shadow-teal-900/10 z-50 border-b border-white/20 rounded-b-4xl">
      <Logo handleScroll={handleScroll} variant="light" />

      <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base font-medium">
        <li>
          <a
            href="#problem"
            onClick={(e) => handleScroll("about", e)}
            className="text-white hover:text-[#D5FFF6] transition-colors duration-300"
          >
            Problem
          </a>
        </li>
        <li>
          <a
            href="#workflow"
            onClick={(e) => handleScroll("features", e)}
            className="text-white hover:text-[#D5FFF6] transition-colors duration-300"
          >
            How It Works
          </a>
        </li>
        <li>
          <a
            href="#features"
            onClick={(e) => handleScroll("hero", e)}
            className="text-white hover:text-[#D5FFF6] transition-colors duration-300"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={(e) => handleScroll("about", e)}
            className="text-white hover:text-[#D5FFF6] transition-colors duration-300"
          >
            About Us
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        <JoinBtn />
      </div>
    </nav>
  );
}

export default Navbar;
