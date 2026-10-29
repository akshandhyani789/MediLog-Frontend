import { useNavigate } from "react-router-dom";

function Join() {
  const navigate = useNavigate();

  const handleJoin = (route) => navigate(route);

  const handleNewJoin = () => {
    handleJoin("/signup");
  };

  const handleLogin = () => {
    handleJoin("/login");
  };

  return (
    <>
      <section
        id="join"
        className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-[#CCFBF1] text-slate-900 flex flex-col justify-center items-center py-24 px-6 md:px-10 text-center"
      >
        {/* Main CTA */}
        <div className="relative w-full max-w-7xl flex flex-col items-center gap-6 bg-gradient-to-r from-[#0F857B] to-[#12B8A6] text-white p-8 md:p-12 rounded-3xl shadow-xl shadow-teal-900/15 overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold lg:text-6xl leading-tight max-w-3xl">
              Ready to make medicine easier to find and harder to waste?
            </h1>

            <p className="text-base md:text-lg text-white/90 max-w-2xl">
              Manage your medicines. Discover nearby availability. Connect with
              meaningful requests.
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              {/* Signup */}
              <button
                type="button"
                onClick={handleNewJoin}
                className="mt-4 px-8 py-3 bg-white text-[#0F857B] rounded-xl font-semibold text-lg hover:-translate-y-0.5 hover:bg-[#E6FFFA] transition-all duration-200 shadow-lg"
              >
                Get Started Now
              </button>

              {/* Login */}
              <button
                type="button"
                onClick={handleLogin}
                className="mt-4 px-8 py-3 bg-white/15 border border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/25 transition-all duration-200 shadow-lg"
              >
                Already have an account? Log in
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Join;
