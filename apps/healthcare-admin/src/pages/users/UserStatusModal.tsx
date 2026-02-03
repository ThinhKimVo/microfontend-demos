import { useState } from 'react';
import { X, UserX, UserCheck, Mail, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { User } from './UsersList';

interface UserStatusModalProps {
  user: User | null;
  action: 'activate' | 'deactivate';
  bulkCount?: number;
  onClose: () => void;
  onConfirm: (reason: string | undefined, sendEmail: boolean) => void;
}

const deactivationReasons = [
  'User requested account deactivation',
  'Violation of terms of service',
  'Suspicious activity detected',
  'Payment issues',
  'Inactive for extended period',
  'Other (specify below)',
];

export default function UserStatusModal({
  user,
  action,
  bulkCount,
  onClose,
  onConfirm,
}: UserStatusModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isDeactivate = action === 'deactivate';
  const isBulk = bulkCount !== undefined && bulkCount > 0;
  const targetLabel = isBulk ? `${bulkCount} users` : user?.name || 'this user';

  const handleConfirm = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reason = isDeactivate
      ? selectedReason === 'Other (specify below)'
        ? customReason
        : selectedReason
      : undefined;

    onConfirm(reason, sendEmail);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2 rounded-full',
                isDeactivate ? 'bg-red-100' : 'bg-green-100'
              )}
            >
              {isDeactivate ? (
                <UserX className={cn('h-5 w-5', 'text-red-600')} />
              ) : (
                <UserCheck className={cn('h-5 w-5', 'text-green-600')} />
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isDeactivate ? 'Deactivate' : 'Activate'} {isBulk ? 'Users' : 'User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div
            className={cn(
              'p-4 rounded-lg flex items-start gap-3',
              isDeactivate ? 'bg-red-50' : 'bg-green-50'
            )}
          >
            <AlertTriangle
              className={cn('h-5 w-5 mt-0.5', isDeactivate ? 'text-red-600' : 'text-green-600')}
            />
            <div>
              <p className={cn('text-sm font-medium', isDeactivate ? 'text-red-800' : 'text-green-800')}>
                {isDeactivate
                  ? `You are about to deactivate ${targetLabel}`
                  : `You are about to reactivate ${targetLabel}`}
              </p>
              <p className={cn('text-sm mt-1', isDeactivate ? 'text-red-700' : 'text-green-700')}>
                {isDeactivate
                  ? 'Deactivated users will not be able to log in or access their accounts.'
                  : 'Reactivated users will be able to log in and access their accounts again.'}
              </p>
            </div>
          </div>

          {/* Deactivation Reason (only for deactivate action) */}
          {isDeactivate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Deactivation <span className="text-gray-400">(optional)</span>
              </label>
              <div className="space-y-2">
                {deactivationReasons.map((reason) => (
                  <label key={reason} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              {selectedReason === 'Other (specify below)' && (
                <textarea
                  className="input mt-3"
                  rows={3}
                  placeholder="Enter custom reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Email Notification Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Send email notification</p>
                <p className="text-xs text-gray-500">
                  {isDeactivate
                    ? 'Notify user(s) about account deactivation'
                    : 'Notify user(s) about account reactivation'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'btn',
              isDeactivate
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'btn-primary'
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {isDeactivate ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate {isBulk ? `${bulkCount} Users` : 'User'}
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate {isBulk ? `${bulkCount} Users` : 'User'}
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
