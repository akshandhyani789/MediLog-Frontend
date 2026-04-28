import React from "react";

function About() {
  return (
    <section
      id="about"
      className="flex flex-col justify-center items-center gap-2 bg-[#ffffff] border border-t-1-[#E5EAF3] py-15 px-10 md:p-20 lg:p-32 text-center"
    >
      <p className="text-[#0F766E] text-lg font-semibold">OUR MISSION</p>
      <h1 className="text-3xl md:text-4xl font-bold pb-6">
        Dedicated To Medical Safety
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-4xl font-medium">
        MediLog exists to make medicine management simple, safe, and reliable.
        We help individuals and healthcare providers track medicines, prevent
        expiry-related losses, and maintain accurate records
        <span className="text-[#0F766E] font-semibold">
          - so no dose, stock, or life-critical detail is ever missed.
        </span>
      </p>
      <div className="flex gap-10 text-gray-700 mt-6 ">
        <i className="fa-solid fa-briefcase-medical text-xl hover:text-[#0F766E] hover:scale-110 transition-all duration-300"></i>
        <i className="fa-solid fa-user-shield text-xl hover:text-[#0F766E] hover:scale-110 transition-all duration-300"></i>
        <i className="fa-solid fa-heart-pulse text-xl hover:text-[#0F766E] hover:scale-110 transition-all duration-300"></i>
      </div>
    </section>
  );
}

export default About;
