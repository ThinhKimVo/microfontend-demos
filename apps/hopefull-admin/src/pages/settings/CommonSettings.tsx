import { useState } from 'react';
import {
  Building,
  Upload,
  Globe,
  DollarSign,
  Clock,
  Save,
  Check,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Image,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AppSettings {
  // App Information
  appName: string;
  logo: string | null;
  contactEmail: string;
  phone: string;
  address: string;
  // Social Media
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  // Commission
  commissionRate: number;
  minimumPayoutAmount: number;
  // System
  timezone: string;
  currency: string;
}

const initialSettings: AppSettings = {
  appName: 'Healthcare Platform',
  logo: null,
  contactEmail: 'contact@healthcare.com',
  phone: '+1 (555) 123-4567',
  address: '123 Healthcare Ave, Medical District, NY 10001',
  facebookUrl: 'https://facebook.com/healthcare',
  instagramUrl: 'https://instagram.com/healthcare',
  twitterUrl: 'https://twitter.com/healthcare',
  linkedinUrl: 'https://linkedin.com/company/healthcare',
  commissionRate: 15,
  minimumPayoutAmount: 50,
  timezone: 'America/New_York',
  currency: 'USD',
};

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (AUD)', symbol: 'A$' },
  { value: 'JPY', label: 'Japanese Yen (JPY)', symbol: '¥' },
  { value: 'SGD', label: 'Singapore Dollar (SGD)', symbol: 'S$' },
];

export default function CommonSettings() {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        setSettings((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSettings((prev) => ({ ...prev, logo: null }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* App Information */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Building className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">App Information</h2>
            <p className="text-sm text-gray-500">Basic application details</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
            <input
              type="text"
              className="input w-full"
              value={settings.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-start gap-4">
              {logoPreview || settings.logo ? (
                <div className="relative">
                  <img
                    src={logoPreview || settings.logo || ''}
                    alt="Logo preview"
                    className="h-24 w-24 object-contain rounded-lg border border-gray-200 bg-white"
                  />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <label className="btn btn-secondary cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, or SVG. Max 2MB.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              className="input w-full"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="input w-full"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              className="input w-full"
              rows={2}
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
            <p className="text-sm text-gray-500">Social media profile links</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Facebook className="h-4 w-4 inline mr-2 text-blue-600" />
              Facebook URL
            </label>
            <input
              type="url"
              className="input w-full"
              placeholder="https://facebook.com/..."
              value={settings.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Instagram className="h-4 w-4 inline mr-2 text-pink-600" />
              Instagram URL
            </label>
            <input
              type="url"
              className="input w-full"
              placeholder="https://instagram.com/..."
              value={settings.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Twitter className="h-4 w-4 inline mr-2 text-sky-500" />
              Twitter URL
            </label>
            <input
              type="url"
              className="input w-full"
              placeholder="https://twitter.com/..."
              value={settings.twitterUrl}
              onChange={(e) => handleChange('twitterUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Linkedin className="h-4 w-4 inline mr-2 text-blue-700" />
              LinkedIn URL
            </label>
            <input
              type="url"
              className="input w-full"
              placeholder="https://linkedin.com/company/..."
              value={settings.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Commission Settings</h2>
            <p className="text-sm text-gray-500">Platform fee and payout configuration</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="input w-full pr-8"
                value={settings.commissionRate}
                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value) || 0)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Percentage deducted from each transaction as platform fee
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Payout Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="10"
                className="input w-full pl-8"
                value={settings.minimumPayoutAmount}
                onChange={(e) => handleChange('minimumPayoutAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum balance required for therapist payout
            </p>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-500">Time zone and currency configuration</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Timezone</label>
            <select
              className="input w-full"
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
            <select
              className="input w-full"
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {showSaved && (
          <span className="flex items-center gap-2 text-green-600 text-sm">
            <Check className="h-4 w-4" />
            Settings saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
