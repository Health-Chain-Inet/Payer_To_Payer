import React from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  settings: {
    id: string;
    label: string;
    type: 'toggle' | 'select' | 'input';
    value: any;
    options?: { label: string; value: string }[];
  }[];
}

const defaultSettings: SettingsSection[] = [
  {
    id: 'security',
    title: 'Security Settings',
    description: 'Configure security and authentication settings',
    icon: Shield,
    settings: [
      {
        id: 'mfa',
        label: 'Require Multi-Factor Authentication',
        type: 'toggle',
        value: true
      },
      {
        id: 'session',
        label: 'Session Timeout (minutes)',
        type: 'select',
        value: '30',
        options: [
          { label: '15 minutes', value: '15' },
          { label: '30 minutes', value: '30' },
          { label: '60 minutes', value: '60' }
        ]
      }
    ]
  },
  {
    id: 'data',
    title: 'Data Exchange Settings',
    description: 'Configure data exchange preferences',
    icon: Database,
    settings: [
      {
        id: 'batch_size',
        label: 'Batch Size',
        type: 'select',
        value: '1000',
        options: [
          { label: '500 records', value: '500' },
          { label: '1000 records', value: '1000' },
          { label: '2000 records', value: '2000' }
        ]
      },
      {
        id: 'retry_attempts',
        label: 'Retry Attempts',
        type: 'input',
        value: '3'
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Configure alert and notification settings',
    icon: Bell,
    settings: [
      {
        id: 'email_notifications',
        label: 'Email Notifications',
        type: 'toggle',
        value: true
      },
      {
        id: 'notification_frequency',
        label: 'Notification Frequency',
        type: 'select',
        value: 'immediate',
        options: [
          { label: 'Immediate', value: 'immediate' },
          { label: 'Daily Digest', value: 'daily' },
          { label: 'Weekly Summary', value: 'weekly' }
        ]
      }
    ]
  }
];

export default function Settings() {
  const [settings, setSettings] = React.useState<SettingsSection[]>(defaultSettings);
  const [saving, setSaving] = React.useState(false);

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSettings(prevSettings =>
      prevSettings.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            settings: section.settings.map(setting => {
              if (setting.id === settingId) {
                return { ...setting, value };
              }
              return setting;
            })
          };
        }
        return section;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure platform-wide settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {settings.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Icon className="h-6 w-6 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <div className="ml-4">
                        {setting.type === 'toggle' ? (
                          <button
                            onClick={() => handleSettingChange(section.id, setting.id, !setting.value)}
                            className={`${setting.value ? 'bg-indigo-600' : 'bg-gray-200'
                              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          >
                            <span
                              className={`${setting.value ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            />
                          </button>
                        ) : setting.type === 'select' ? (
                          <select
                            value={setting.value}
                            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
                            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            {setting.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={setting.value}
                            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
                            className="block w-48 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}