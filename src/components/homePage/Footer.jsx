import { Activity, ArrowUpRight } from "lucide-react";

function Footer() {
  const handleScroll = (id) => (e) => {
    e.preventDefault();

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer
      id="footer"
      className="sticky bottom-0 z-0 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white px-6 py-16 md:py-20 overflow-hidden"
    >
      {/* Subtle teal background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-[#C5FFF4]/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/15 border border-white/25">
                <Activity size={23} className="text-white" />
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white">
                Medi<span className="text-[#D5FFF6]">Log</span>
              </h3>
            </div>

            <p className="text-white leading-7 text-sm md:text-base max-w-sm">
              Professional medicine tracking to help individuals and families
              manage medicines safely and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-5 text-white">
              Quick Links
            </h4>

            <ul className="space-y-4 text-sm">
              {[
                ["Features", "features"],
                ["About Us", "about"],
                ["Join Us", "join"],
              ].map(([label, id]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={handleScroll(id)}
                    className="group inline-flex items-center gap-2 text-white/90 hover:text-[#D5FFF6] transition-colors duration-300"
                  >
                    {label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/25 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/90 text-sm text-center">
            © {new Date().getFullYear()} MediLog. All rights reserved.
          </p>

          <p className="text-white/90 text-xs">
            Smarter medicine management. Safer living.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
