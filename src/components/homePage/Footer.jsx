import React from "react";
import { Activity } from "lucide-react";

function Footer() {
  const handleScroll = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#134E4A] text-[#CBD5E1] py-16 px-6 overflow-hidden">
      {/* Glow Effects */}

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo & Description */}
          <div className="max-w-md">

            <p className="text-[#F4F6F5] leading-relaxed font-semibold">
              Professional medicine tracking to help individuals and families
              manage medicines safely and efficiently.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#F4F6F5]">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li
                className="hover:text-[#137fec] cursor-pointer transition"
                onClick={handleScroll("features")}
              >
                Features
              </li>
              <li
                className="hover:text-[#137fec] cursor-pointer transition"
                onClick={handleScroll("about")}
              >
                About Us
              </li>
              <li
                className="hover:text-[#137fec] cursor-pointer transition"
                onClick={handleScroll("join")}
              >
                Join Us
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-400 text-sm">
          © 2026 MediLog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
