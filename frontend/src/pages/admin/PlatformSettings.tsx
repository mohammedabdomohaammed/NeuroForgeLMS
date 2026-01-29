// src/pages/admin/PlatformSettings.tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { ToggleLeft, ToggleRight, Save } from 'lucide-react';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    aiModel: 'Gemini 1.5 Flash',
    maxDailySubmissions: 50
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-slate-400 mb-8">Global configuration for PyForge.</p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          
          {/* General Toggles */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Maintenance Mode</h3>
              <p className="text-slate-500 text-sm">Disable access for all non-admin users.</p>
            </div>
            <button onClick={() => toggle('maintenanceMode')} className="text-slate-400 hover:text-white transition-colors">
              {settings.maintenanceMode ? <ToggleRight className="w-10 h-10 text-red-500" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Allow New Registrations</h3>
              <p className="text-slate-500 text-sm">Open or close the signup page.</p>
            </div>
            <button onClick={() => toggle('allowRegistrations')} className="text-slate-400 hover:text-white transition-colors">
              {settings.allowRegistrations ? <ToggleRight className="w-10 h-10 text-green-500" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>

          {/* AI Config */}
          <div className="p-6">
            <h3 className="text-white font-medium mb-4">AI Configuration</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Active Model</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3"
                  value={settings.aiModel}
                  onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                >
                  <option>Gemini 1.5 Flash</option>
                  <option>Gemini 1.5 Pro</option>
                  <option>GPT-4o (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 bg-slate-950">
             <Button className="w-full bg-red-600 hover:bg-red-700">
               <Save className="w-4 h-4 mr-2" /> Save Changes
             </Button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default PlatformSettings;