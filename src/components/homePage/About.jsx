function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden flex flex-col justify-center items-center gap-4 bg-gradient-to-b from-white via-slate-50 to-white py-24 px-6 md:p-20 lg:p-32 text-center"
    >
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-teal-200 blur-[160px] opacity-30 rounded-full"></div>

      <p className="text-[#0F766E] text-sm md:text-base font-semibold tracking-widest uppercase ">
        Our Mission
      </p>

      <h1 className="text-3xl md:text-5xl font-bold pb-6 max-w-3xl leading-tight ">
        Dedicated To Medical Safety
      </h1>

      <p className="text-base md:text-xl text-gray-600 max-w-4xl font-medium leading-relaxed">
        MediLog exists to make medicine management simple, safe, and reliable.
        We help individuals and healthcare providers track medicines, prevent
        expiry-related losses, and maintain accurate records
        <span className="text-[#0F766E] font-semibold">
          {" "}— so no dose, stock, or life-critical detail is ever missed.
        </span>
      </p>

      <div className="flex gap-10 text-gray-500 mt-8">
        <i className="fa-solid fa-briefcase-medical text-2xl hover:text-[#0F766E] hover:scale-110 transition-all duration-300"></i>
        <i className="fa-solid fa-user-shield text-2xl hover:text-[#0F766E] hover:scale-110 transition-all duration-300"></i>
        <i className="fa-solid fa-heart-pulse text-2xl hover:text-[#0F766E] hover:scale-110 transition-all duration-300"></i>
      </div>
    </section>
  );
}

export default About;