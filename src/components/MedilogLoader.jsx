const MedilogLoader = () => {
  return (
    <div
      className="fixed inset-0 z-[99999] flex min-h-screen flex-col items-center justify-center bg-white/40 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label="Joining the MediLog community"
    >
      {/* Teal loading spinner */}
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-teal-100 border-t-[#0F857B]" />

      <p className="mt-5 animate-pulse text-lg font-semibold text-[#0F766E]">
        Joining the community...
      </p>

      <p className="mt-2 text-sm text-slate-600">
        Preparing your MediLog experience
      </p>
    </div>
  );
};

export default MedilogLoader;
