import React, { useState } from 'react';
import Toggle from './Toggle';
import ThresholdSlider from './ThresholdSlider';
import LogoutButton from './LogoutButton';

const NotificationCard = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appAlerts, setAppAlerts] = useState(true);
  const [threshold, setThreshold] = useState(7);

  return (
    <section className="w-full mt-6">
      <div className="bg-white rounded-[1.2rem] shadow-sm border border-gray-50 p-8 md:p-14">
        
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-10">
          Notification Preferences
        </h2>

        <div className="space-y-10">
          
          {/* Email Alerts */}
          <div className="flex justify-between items-start pb-8 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-slate-800">Email Alerts</h3>
              <p className="text-sm text-gray-500">
                Receive expiry and stock alerts by email
              </p>
            </div>
            <Toggle 
              enabled={emailAlerts} 
              onChange={() => setEmailAlerts(!emailAlerts)} 
            />
          </div>

          {/* In-App Alerts */}
          <div className="flex justify-between items-start pb-8 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-slate-800">In-App Alerts</h3>
              <p className="text-sm text-gray-500">
                Show notification banners within the application
              </p>
            </div>
            <Toggle 
              enabled={appAlerts} 
              onChange={() => setAppAlerts(!appAlerts)} 
            />
          </div>

          {/* Threshold */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-800">Alert threshold</h3>
              <p className="text-sm text-gray-500">
                Notify me when a medicine expires within this many days
              </p>
            </div>

            <div className="pt-2">
              <ThresholdSlider 
                value={threshold} 
                onChange={setThreshold} 
              />
            </div>
            <LogoutButton />
          </div>

        </div>

      </div>
    </section>
  );
};

export default NotificationCard;