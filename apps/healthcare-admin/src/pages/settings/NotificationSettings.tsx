import { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Save,
  Check,
  Send,
  AlertCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NotificationChannel {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationTrigger {
  id: string;
  name: string;
  description: string;
  category: 'user' | 'booking' | 'payment' | 'system';
  channels: NotificationChannel;
  timing?: string[];
  enabled: boolean;
}

interface RateLimitSettings {
  maxPerHour: number;
  maxPerDay: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursEnabled: boolean;
}

const initialTriggers: NotificationTrigger[] = [
  // User notifications
  {
    id: 'user_registration',
    name: 'User Registration',
    description: 'Welcome email sent when a new user signs up',
    category: 'user',
    channels: { email: true, push: false, sms: false },
    enabled: true,
  },
  {
    id: 'email_verification',
    name: 'Email Verification',
    description: 'OTP code for email verification',
    category: 'user',
    channels: { email: true, push: false, sms: false },
    enabled: true,
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    description: 'Password reset link when requested',
    category: 'user',
    channels: { email: true, push: false, sms: false },
    enabled: true,
  },
  {
    id: 'profile_update',
    name: 'Profile Updated',
    description: 'Confirmation when profile is updated',
    category: 'user',
    channels: { email: false, push: true, sms: false },
    enabled: false,
  },
  // Booking notifications
  {
    id: 'booking_confirmed',
    name: 'Booking Confirmed',
    description: 'Confirmation when appointment is booked',
    category: 'booking',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'appointment_reminder',
    name: 'Appointment Reminder',
    description: 'Reminder before scheduled appointment',
    category: 'booking',
    channels: { email: true, push: true, sms: true },
    timing: ['24h', '1h', '15m'],
    enabled: true,
  },
  {
    id: 'booking_cancelled',
    name: 'Booking Cancelled',
    description: 'Notification when appointment is cancelled',
    category: 'booking',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'booking_rescheduled',
    name: 'Booking Rescheduled',
    description: 'Notification when appointment is rescheduled',
    category: 'booking',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'therapist_no_show',
    name: 'Therapist No-Show',
    description: 'Alert if therapist misses appointment',
    category: 'booking',
    channels: { email: true, push: true, sms: true },
    enabled: true,
  },
  // Payment notifications
  {
    id: 'payment_success',
    name: 'Payment Success',
    description: 'Receipt sent after successful payment',
    category: 'payment',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'payment_failed',
    name: 'Payment Failed',
    description: 'Alert when payment fails',
    category: 'payment',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'refund_processed',
    name: 'Refund Processed',
    description: 'Notification when refund is completed',
    category: 'payment',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'payout_sent',
    name: 'Payout Sent (Therapist)',
    description: 'Notification when payout is processed',
    category: 'payment',
    channels: { email: true, push: true, sms: false },
    enabled: true,
  },
  // System notifications
  {
    id: 'new_review',
    name: 'New Review',
    description: 'Notification when user leaves a review',
    category: 'system',
    channels: { email: false, push: true, sms: false },
    enabled: true,
  },
  {
    id: 'account_suspended',
    name: 'Account Suspended',
    description: 'Alert when account is suspended',
    category: 'system',
    channels: { email: true, push: true, sms: true },
    enabled: true,
  },
  {
    id: 'security_alert',
    name: 'Security Alert',
    description: 'Suspicious activity detected',
    category: 'system',
    channels: { email: true, push: true, sms: true },
    enabled: true,
  },
];

const initialRateLimits: RateLimitSettings = {
  maxPerHour: 10,
  maxPerDay: 50,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  quietHoursEnabled: true,
};

const categoryLabels = {
  user: 'User Account',
  booking: 'Bookings & Appointments',
  payment: 'Payments & Billing',
  system: 'System Alerts',
};

const categoryIcons = {
  user: '👤',
  booking: '📅',
  payment: '💳',
  system: '⚙️',
};

export default function NotificationSettings() {
  const [triggers, setTriggers] = useState<NotificationTrigger[]>(initialTriggers);
  const [rateLimits, setRateLimits] = useState<RateLimitSettings>(initialRateLimits);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showTestSent, setShowTestSent] = useState(false);

  const handleToggleEnabled = (triggerId: string) => {
    setTriggers((prev) =>
      prev.map((t) =>
        t.id === triggerId ? { ...t, enabled: !t.enabled } : t
      )
    );
  };

  const handleToggleChannel = (triggerId: string, channel: keyof NotificationChannel) => {
    setTriggers((prev) =>
      prev.map((t) =>
        t.id === triggerId
          ? { ...t, channels: { ...t.channels, [channel]: !t.channels[channel] } }
          : t
      )
    );
  };

  const handleToggleTiming = (triggerId: string, timing: string) => {
    setTriggers((prev) =>
      prev.map((t) => {
        if (t.id !== triggerId || !t.timing) return t;
        const newTiming = t.timing.includes(timing)
          ? t.timing.filter((time) => time !== timing)
          : [...t.timing, timing];
        return { ...t, timing: newTiming };
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleTestNotification = async (triggerId: string) => {
    setTestingId(triggerId);
    await new Promise((r) => setTimeout(r, 1500));
    setTestingId(null);
    setShowTestSent(true);
    setTimeout(() => setShowTestSent(false), 3000);
  };

  const groupedTriggers = triggers.reduce((acc, trigger) => {
    if (!acc[trigger.category]) acc[trigger.category] = [];
    acc[trigger.category].push(trigger);
    return acc;
  }, {} as Record<string, NotificationTrigger[]>);

  return (
    <div className="space-y-8">
      {/* Notification Triggers */}
      {Object.entries(groupedTriggers).map(([category, categoryTriggers]) => (
        <div key={category} className="card overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {categoryTriggers.map((trigger) => (
              <div key={trigger.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleEnabled(trigger.id)}
                        className={cn(
                          'transition-colors',
                          trigger.enabled ? 'text-primary-600' : 'text-gray-300'
                        )}
                      >
                        {trigger.enabled ? (
                          <ToggleRight className="h-6 w-6" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                      <div>
                        <h3 className={cn(
                          'font-medium',
                          trigger.enabled ? 'text-gray-900' : 'text-gray-400'
                        )}>
                          {trigger.name}
                        </h3>
                        <p className={cn(
                          'text-sm',
                          trigger.enabled ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {trigger.description}
                        </p>
                      </div>
                    </div>

                    {/* Channels */}
                    {trigger.enabled && (
                      <div className="mt-4 ml-9 space-y-3">
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={trigger.channels.email}
                              onChange={() => handleToggleChannel(trigger.id, 'email')}
                              className="h-4 w-4 text-primary-600 rounded border-gray-300"
                            />
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Email</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={trigger.channels.push}
                              onChange={() => handleToggleChannel(trigger.id, 'push')}
                              className="h-4 w-4 text-primary-600 rounded border-gray-300"
                            />
                            <Smartphone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Push</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={trigger.channels.sms}
                              onChange={() => handleToggleChannel(trigger.id, 'sms')}
                              className="h-4 w-4 text-primary-600 rounded border-gray-300"
                            />
                            <Bell className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">SMS</span>
                          </label>
                        </div>

                        {/* Timing options for reminders */}
                        {trigger.timing && (
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Send at:</span>
                            <div className="flex gap-2">
                              {['24h', '1h', '15m'].map((time) => (
                                <button
                                  key={time}
                                  onClick={() => handleToggleTiming(trigger.id, time)}
                                  className={cn(
                                    'px-3 py-1 text-xs rounded-full transition-colors',
                                    trigger.timing?.includes(time)
                                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                                      : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                                  )}
                                >
                                  {time === '24h' ? '24 hours' : time === '1h' ? '1 hour' : '15 minutes'}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Test Button */}
                  <button
                    onClick={() => handleTestNotification(trigger.id)}
                    disabled={!trigger.enabled || testingId === trigger.id}
                    className="btn btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
                  >
                    {testingId === trigger.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send className="h-3 w-3 mr-1" />
                        Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Rate Limiting */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Settings className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Rate Limiting</h2>
            <p className="text-sm text-gray-500">Control notification frequency per user</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum notifications per hour
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="input w-full"
              value={rateLimits.maxPerHour}
              onChange={(e) => setRateLimits((prev) => ({ ...prev, maxPerHour: parseInt(e.target.value) || 1 }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum notifications per day
            </label>
            <input
              type="number"
              min="1"
              max="500"
              className="input w-full"
              value={rateLimits.maxPerDay}
              onChange={(e) => setRateLimits((prev) => ({ ...prev, maxPerDay: parseInt(e.target.value) || 1 }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={rateLimits.quietHoursEnabled}
                onChange={(e) => setRateLimits((prev) => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                className="h-4 w-4 text-primary-600 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable quiet hours (no push notifications)</span>
            </label>

            {rateLimits.quietHoursEnabled && (
              <div className="flex items-center gap-4 ml-7">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="time"
                    className="input"
                    value={rateLimits.quietHoursStart}
                    onChange={(e) => setRateLimits((prev) => ({ ...prev, quietHoursStart: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="time"
                    className="input"
                    value={rateLimits.quietHoursEnd}
                    onChange={(e) => setRateLimits((prev) => ({ ...prev, quietHoursEnd: e.target.value }))}
                  />
                </div>
              </div>
            )}
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
        {showTestSent && (
          <span className="flex items-center gap-2 text-green-600 text-sm">
            <Check className="h-4 w-4" />
            Test notification sent to admin
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
