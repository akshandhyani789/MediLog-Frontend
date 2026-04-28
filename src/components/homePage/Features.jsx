import React from "react";
import { Bell, Users } from "lucide-react";
import FeatureCard from "./featureSectionComponants/FeatureCard";
const Features = () => {
  return (
    <section id="features" className="bg-gray-100 py-30 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left side Big Card */}
        <div className="bg-gradient-to-br from-[#0F766E] to-[#134E4A] text-white rounded-3xl p-10 shadow-xl hover:scale-105 transition-all duration-300 ">
          <div className="w-14 h-14 bg-[#64748B] rounded-xl flex items-center justify-center mb-6">
            📊
          </div>

          <h2 className="text-4xl font-bold mb-6 lg:text-5xl">
            Comprehensive Medicine Management
          </h2>

          <p className="text-blue-100 mb-8 leading-relaxed text-lg ">
            Never lose track of your medications again. Our intelligent system
            monitors every item, calculates expiry dates, and sends timely
            alerts to keep your family safe.
          </p>

          <ul className="space-y-4">
            <li>✔ Automatic expiry tracking</li>
            <li>✔ Smart notification system</li>
          </ul>

          
        </div>

        {/* Right Side Cards */}
        <div className="space-y-8">
          {/* Alerts Card */}
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

          {/* Status Card */}
          <FeatureCard
            icon={<Users className="text-green-600" />}
            title="Visual Status Indicators"
            description="Color-coded system makes it instantly clear which medicines are safe, which need attention, and which must be replaced."
          >
            <div className="flex gap-4">
              <div className="flex-1 bg-green-100 text-green-700 text-center py-3 rounded-xl">
                ● Safe
              </div>
              <div className="flex-1 bg-yellow-100 text-yellow-700 text-center py-3 rounded-xl">
                ● Soon
              </div>
              <div className="flex-1 bg-red-100 text-red-700 text-center py-3 rounded-xl">
                ● Expired
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default Features;
