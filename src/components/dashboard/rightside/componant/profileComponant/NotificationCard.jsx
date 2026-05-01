import React, { useState, useEffect } from 'react';
import Toggle from './Toggle';
import ThresholdSlider from './ThresHoldSlider';
import LogoutButton from './LogoutButton';
import { Bell, Smartphone, Clock } from 'lucide-react';
import { 
  getNotificationSettings, 
  updateNotificationSettings 
} from "../../../../../services/api";
import { getAuth } from "firebase/auth";
import axios from 'axios';

const auth = getAuth();

const NotificationCard = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [threshold, setThreshold] = useState(7);

  // 🔑 Get Firebase token
  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  // 📥 Load settings from backend
  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getNotificationSettings(user);

      setEmailAlerts(data.emailNotifications ?? true);
      setThreshold(data.notificationThreshold ?? 7);

    } catch (err) {
      console.error("❌ Failed to load settings", err);
    }
  };

  fetchSettings();
}, []);

  // 💾 Save settings to backend
  const saveSettings = async (email, thresh) => {
    try {
      const token = await getToken();

      await axios.put(
        "http://localhost:5000/api/users/notification-settings",
        {
          emailNotifications: email,
          notificationThreshold: thresh,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (err) {
      console.error("❌ Failed to save settings", err);
    }
  };

  // 🔁 Email toggle handler
  const handleEmailToggle = () => {
    const updated = !emailAlerts;
    setEmailAlerts(updated);
    saveSettings(updated, threshold);
  };

  // 🔁 Slider handler
  const handleThresholdChange = (value) => {
    setThreshold(value);
    saveSettings(emailAlerts, value);
  };

  return (
    <section className="w-full">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10">

        <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mb-8">
          Control how and when you receive alerts
        </p>

        <div className="space-y-6">

          {/* Email Alerts */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex gap-3">
              <Bell />
              <div>
                <h3>Email Alerts</h3>
                <p className="text-xs text-gray-500">
                  Receive expiry alerts via email
                </p>
              </div>
            </div>

            <Toggle 
              enabled={emailAlerts} 
              onChange={handleEmailToggle} 
            />
          </div>

          {/* In-App Alerts (Always On) */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex gap-3">
              <Smartphone />
              <div>
                <h3>In-App Alerts</h3>
                <p className="text-xs text-gray-500">
                  Always enabled
                </p>
              </div>
            </div>

            <span className="text-xs bg-green-100 px-3 py-1 rounded-full">
              Always On
            </span>
          </div>

          {/* Threshold */}
          <div>
            <h3 className="mb-2">Alert Threshold</h3>

            <ThresholdSlider 
              value={threshold} 
              onChange={handleThresholdChange} 
            />
          </div>

          <LogoutButton />

        </div>
      </div>
    </section>
  );
};

export default NotificationCard;