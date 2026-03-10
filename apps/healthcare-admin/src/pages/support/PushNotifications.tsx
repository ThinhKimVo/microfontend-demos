import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Send,
  Image,
  Link,
  Calendar,
  Eye,
  Users,
  Stethoscope,
  User,
  Target,
  Clock,
  X,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn, formatDateTime } from '../../lib/utils';
import { getPushNotifications, createPushNotification, sendPushNotification } from '../../services/admin';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  imageUrl: string | null;
  deepLink: string | null;
  targetAudience: string;
  targetUserId: string | null;
  targetCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  status: string;
  deliveredCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: string;
}

const deepLinkOptions = [
  { value: '', label: 'None' },
  { value: '/home', label: 'Home Screen' },
  { value: '/appointments', label: 'My Appointments' },
  { value: '/therapists', label: 'Browse Therapists' },
  { value: '/profile', label: 'User Profile' },
  { value: '/wallet', label: 'Wallet / Payments' },
  { value: '/settings', label: 'Settings' },
  { value: '/promotions', label: 'Promotions' },
];

export default function PushNotifications() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [targetAudience, setTargetAudience] = useState<string>('all_users');
  const [specificUserId, setSpecificUserId] = useState('');
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['push-notifications', currentPage],
    queryFn: () => getPushNotifications({ page: currentPage, limit: 10 }),
  });

  const notifications: PushNotification[] = data?.data || [];
  const meta = data?.meta;

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createPushNotification,
    onSuccess: async (created) => {
      if (scheduleType === 'immediate') {
        await send(created.id);
      }
      queryClient.invalidateQueries({ queryKey: ['push-notifications'] });
      resetForm();
    },
  });

  const { mutateAsync: send, isPending: isSending } = useMutation({
    mutationFn: sendPushNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-notifications'] });
    },
  });

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      all: 'All (Users + Therapists)',
      all_users: 'All Users',
      all_therapists: 'All Therapists',
      specific: 'Specific User',
    };
    return labels[audience] || audience;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
      sending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Sending' },
      sent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Sent' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
    };
    const { bg, text, label } = config[status] || config.draft;
    return (
      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', bg, text)}>
        {label}
      </span>
    );
  };

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    create({
      title,
      message,
      imageUrl: imageUrl || undefined,
      deepLink: deepLink || undefined,
      targetAudience,
      targetUserId: targetAudience === 'specific' ? specificUserId : undefined,
      scheduledAt: scheduleType === 'scheduled' ? scheduledDateTime : undefined,
    });
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setImageUrl('');
    setDeepLink('');
    setTargetAudience('all_users');
    setSpecificUserId('');
    setScheduleType('immediate');
    setScheduledDateTime('');
    setShowForm(false);
    setShowPreview(false);
  };

  const isSubmitting = isCreating || isSending;

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Push Notification Log</h2>
              <p className="text-sm text-gray-500">{meta?.total ?? 0} notifications total</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </button>
          </div>

          {/* Notifications Table */}
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notification</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
                ) : notifications.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No notifications yet</td></tr>
                ) : notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Bell className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {notification.imageUrl && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Image className="h-3 w-3" />
                                Image
                              </span>
                            )}
                            {notification.deepLink && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Link className="h-3 w-3" />
                                {notification.deepLink}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {notification.targetAudience === 'all_therapists' ? (
                          <Stethoscope className="h-4 w-4 text-green-600" />
                        ) : notification.targetAudience === 'all_users' ? (
                          <Users className="h-4 w-4 text-blue-600" />
                        ) : notification.targetAudience === 'specific' ? (
                          <User className="h-4 w-4 text-purple-600" />
                        ) : (
                          <Target className="h-4 w-4 text-orange-600" />
                        )}
                        <div>
                          <p className="text-sm text-gray-900">{getAudienceLabel(notification.targetAudience)}</p>
                          <p className="text-xs text-gray-500">{notification.targetCount.toLocaleString()} recipients</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(notification.status)}
                      {notification.status === 'scheduled' && notification.scheduledAt && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(notification.scheduledAt)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {notification.status === 'sent' ? (
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {notification.deliveredCount.toLocaleString()} delivered
                          </p>
                          {notification.failedCount > 0 && (
                            <p className="text-xs text-red-500">
                              {notification.failedCount.toLocaleString()} failed
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{formatDateTime(notification.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage === meta.totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Send Notification Form */}
          <div className="flex items-center justify-between">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to Notification Log
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="card p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Bell className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Send Push Notification</h2>
                  <p className="text-sm text-gray-500">Broadcast to your users</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Notification title"
                  maxLength={50}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  className="input w-full"
                  rows={3}
                  placeholder="Notification message"
                  maxLength={250}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">{message.length}/250 characters</p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="h-4 w-4 inline mr-1" />
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  className="input w-full"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {/* Deep Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Link className="h-4 w-4 inline mr-1" />
                  Deep Link (App Screen)
                </label>
                <select
                  className="input w-full"
                  value={deepLink}
                  onChange={(e) => setDeepLink(e.target.value)}
                >
                  {deepLinkOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="h-4 w-4 inline mr-1" />
                  Target Audience
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all_users', label: 'All Users', icon: Users },
                    { value: 'all_therapists', label: 'All Therapists', icon: Stethoscope },
                    { value: 'all', label: 'Everyone', icon: Users },
                    { value: 'specific', label: 'Specific User', icon: User },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                        targetAudience === opt.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="targetAudience"
                        value={opt.value}
                        checked={targetAudience === opt.value}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="sr-only"
                      />
                      <opt.icon className={cn(
                        'h-5 w-5',
                        targetAudience === opt.value ? 'text-primary-600' : 'text-gray-400'
                      )} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {targetAudience === 'specific' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Enter user ID"
                      value={specificUserId}
                      onChange={(e) => setSpecificUserId(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Schedule
                </label>
                <div className="flex gap-4">
                  <label className={cn(
                    'flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                    scheduleType === 'immediate'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}>
                    <input
                      type="radio"
                      name="scheduleType"
                      value="immediate"
                      checked={scheduleType === 'immediate'}
                      onChange={() => setScheduleType('immediate')}
                      className="sr-only"
                    />
                    <Send className={cn('h-4 w-4', scheduleType === 'immediate' ? 'text-primary-600' : 'text-gray-400')} />
                    <span className="text-sm font-medium">Send Now</span>
                  </label>
                  <label className={cn(
                    'flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                    scheduleType === 'scheduled'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}>
                    <input
                      type="radio"
                      name="scheduleType"
                      value="scheduled"
                      checked={scheduleType === 'scheduled'}
                      onChange={() => setScheduleType('scheduled')}
                      className="sr-only"
                    />
                    <Clock className={cn('h-4 w-4', scheduleType === 'scheduled' ? 'text-primary-600' : 'text-gray-400')} />
                    <span className="text-sm font-medium">Schedule</span>
                  </label>
                </div>

                {scheduleType === 'scheduled' && (
                  <div className="mt-3">
                    <input
                      type="datetime-local"
                      className="input w-full"
                      min={new Date().toISOString().slice(0, 16)}
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn btn-secondary"
                  disabled={!title.trim() || !message.trim()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSubmitting || !title.trim() || !message.trim() || (scheduleType === 'scheduled' && !scheduledDateTime)}
                  className="btn btn-primary flex-1"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {scheduleType === 'immediate' ? 'Send Notification' : 'Schedule Notification'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Notification Preview
                </h3>
                <div className="bg-gray-900 rounded-3xl p-4 max-w-sm mx-auto">
                  <div className="bg-gray-800 rounded-2xl p-3">
                    <div className="flex items-center justify-between text-white text-xs mb-3">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span>5G</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                          <Bell className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-900">Healthcare</p>
                            <span className="text-xs text-gray-400">now</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {title || 'Notification Title'}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                            {message || 'Your notification message will appear here...'}
                          </p>
                        </div>
                      </div>
                      {imageUrl && (
                        <div className="mt-3 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Audience</span>
                    <span className="font-medium text-gray-900">{getAudienceLabel(targetAudience)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Schedule</span>
                    <span className="font-medium text-gray-900">
                      {scheduleType === 'immediate' ? 'Immediate' : scheduledDateTime ? formatDateTime(scheduledDateTime) : 'Not set'}
                    </span>
                  </div>
                  {deepLink && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deep Link</span>
                      <span className="font-medium text-gray-900">{deepLink}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Bell className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Healthcare Platform</p>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600 mt-1">{message}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowPreview(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
