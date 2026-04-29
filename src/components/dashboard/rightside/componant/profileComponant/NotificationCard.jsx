import React, { useState } from 'react';
import Toggle from './Toggle';
import ThresholdSlider from './ThresHoldSlider';
import LogoutButton from './LogoutButton';
import { Bell, Smartphone, Clock } from 'lucide-react';

const NotificationCard = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appAlerts, setAppAlerts] = useState(true);
  const [threshold, setThreshold] = useState(7);

  return (
    <section className="w-full">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 hover:border-gray-300 transition-all duration-300">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-500 font-medium mb-8">
          Control how and when you receive alerts
        </p>

        <div className="space-y-6">
          
          {/* Email Alerts */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-900">Email Alerts</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Receive expiry & stock alerts via email
                </p>
              </div>
            </div>
            <Toggle 
              enabled={emailAlerts} 
              onChange={() => setEmailAlerts(!emailAlerts)} 
            />
          </div>

          {/* In-App Alerts */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-100 flex-shrink-0">
                <Smartphone className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-900">In-App Alerts</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Show notifications within the application
                </p>
              </div>
            </div>
            <Toggle 
              enabled={appAlerts} 
              onChange={() => setAppAlerts(!appAlerts)} 
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

          {/* Threshold */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-900">Alert Threshold</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Notify when medicine expires within this many days
                </p>
              </div>
            </div>

            <div className="pt-2 px-4">
              <ThresholdSlider 
                value={threshold} 
                onChange={setThreshold} 
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

            {/* Logout */}
            <LogoutButton />
          </div>

        </div>

      </div>
    </section>
  );
};

export default NotificationCard;