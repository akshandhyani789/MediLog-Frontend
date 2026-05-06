import { Bell, Users, PackageSearch } from "lucide-react";
import FeatureCard from "./featureSectionComponants/FeatureCard";

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 px-10 sm:px-12 lg:px-24"
    >
      <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] bg-teal-200 blur-[160px] opacity-30 rounded-full"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[450px] h-[450px] bg-blue-200 blur-[180px] opacity-30 rounded-full"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 relative">
        
        <div className="bg-gradient-to-br from-[#0F766E] to-[#134E4A] text-white rounded-3xl p-10 md:p-12 shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-white/10">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 text-xl">
            📊
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Comprehensive Medicine Management
          </h2>

          <p className="text-white/80 mb-8 leading-relaxed text-base md:text-lg">
            Never lose track of your medications again. Our intelligent system
            monitors every item, calculates expiry dates, and sends timely
            alerts to keep your family safe.
          </p>

          <ul className="space-y-3 text-white/90">
            <li>✔ Automatic expiry tracking</li>
            <li>✔ Smart notification system</li>
          </ul>
        </div>

        <div className="space-y-8">
          <div className="hover:-translate-y-1 transition duration-300">
            <FeatureCard
              icon={<Bell className="text-yellow-500" />}
              title="Automatic Alerts"
              description="Get notified before medicines expire. Customizable alerts via email, SMS, or push notifications ensure you're always informed."
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-medium text-md">Aspirin expires in 5 days</p>
                <p className="text-xs text-gray-500">Tap to view details</p>
              </div>
            </FeatureCard>
          </div>

          <div className="hover:-translate-y-1 transition duration-300">
  <FeatureCard
    icon={<PackageSearch className="text-teal-600" />}
    title="Smart Barcode Integration"
    description="Instantly scan medicine barcodes to auto-fetch medicine details, reduce manual entry, and manage inventory faster with accuracy."
  >
    <div className="flex gap-4">
      <div className="flex-1 bg-teal-100 text-teal-700 text-center py-3 rounded-xl font-medium">
        📷 Scan
      </div>

      <div className="flex-1 bg-blue-100 text-blue-700 text-center py-3 rounded-xl font-medium">
        ⚡ Fetch
      </div>

      <div className="flex-1 bg-green-100 text-green-700 text-center py-3 rounded-xl font-medium">
        ✅ Save
      </div>
    </div>
  </FeatureCard>
</div>
        </div>
      </div>
    </section>
  );
};

export default Features;