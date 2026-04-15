import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/admin';

const FIELDS = [
  { key: 'app_name', label: 'App Name', placeholder: 'Hopefull' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'contact@hopeful.com', type: 'email' },
  { key: 'contact_phone', label: 'Contact Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
  { key: 'commission_rate', label: 'Commission Rate (%)', placeholder: '15', type: 'number' },
  { key: 'min_payout', label: 'Minimum Payout ($)', placeholder: '50', type: 'number' },
  { key: 'session_default_duration', label: 'Default Session Duration (min)', placeholder: '60', type: 'number' },
  { key: 'max_advance_booking_days', label: 'Max Advance Booking (days)', placeholder: '30', type: 'number' },
  { key: 'support_email', label: 'Support Email', placeholder: 'support@hopeful.com', type: 'email' },
  { key: 'timezone', label: 'Default Timezone', placeholder: 'America/New_York' },
  { key: 'currency', label: 'Currency', placeholder: 'USD' },
];

export default function CommonSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  useEffect(() => {
    if (settings) {
      setForm(settings);
      setIsDirty(false);
    }
  }, [settings]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setIsDirty(false);
    },
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  if (isLoading) {
    return <div className="py-8 text-center text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {isDirty && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
          You have unsaved changes
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type || 'text'}
              className="input w-full"
              placeholder={field.placeholder}
              value={form[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
        onClick={() => save(form)}
        disabled={!isDirty || isPending}
      >
        <Save className="h-4 w-4" />
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
