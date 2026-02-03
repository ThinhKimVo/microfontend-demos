import { useState } from 'react';
import {
  X,
  AlertTriangle,
  DollarSign,
  Mail,
  Bell,
  Ban,
  FileText,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import type { Appointment } from './AppointmentsList';

interface CancelAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const cancellationReasons = [
  { id: 'technical', label: 'Technical issue', description: 'Platform or system issues preventing the session' },
  { id: 'policy', label: 'Policy violation', description: 'User or therapist violated platform policies' },
  { id: 'dispute', label: 'Dispute resolution', description: 'Cancellation due to unresolved dispute' },
  { id: 'emergency', label: 'Emergency', description: 'Unforeseen emergency situation' },
  { id: 'other', label: 'Other', description: 'Other reason (specify below)' },
];

export default function CancelAppointmentModal({
  appointment,
  onClose,
  onConfirm,
}: CancelAppointmentModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [processRefund, setProcessRefund] = useState(true);
  const [notifyUser, setNotifyUser] = useState(true);
  const [notifyTherapist, setNotifyTherapist] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedReason) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const reason = selectedReason === 'other'
      ? customReason
      : cancellationReasons.find((r) => r.id === selectedReason)?.label || '';

    // Log to audit trail (mock)
    console.log('Audit Log:', {
      action: 'APPOINTMENT_CANCELLED',
      appointmentId: appointment.id,
      reason,
      refundProcessed: processRefund,
      notifiedUser: notifyUser,
      notifiedTherapist: notifyTherapist,
      adminNotes,
      timestamp: new Date().toISOString(),
    });

    if (notifyUser) {
      alert(`Email notification sent to patient: ${appointment.userEmail}`);
    }
    if (notifyTherapist) {
      alert(`Email notification sent to therapist: ${appointment.therapistName}`);
    }
    if (processRefund) {
      alert(`Refund of ${formatCurrency(appointment.amount)} processed successfully`);
    }

    onConfirm(reason);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cancel Appointment</h2>
              <p className="text-sm text-gray-500">{appointment.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Warning */}
          <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Warning: This action cannot be undone</p>
              <p className="text-sm text-red-700 mt-1">
                Cancelling this appointment will notify both the patient and therapist, and may trigger a refund.
              </p>
            </div>
          </div>

          {/* Appointment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Patient</p>
                <p className="font-medium text-gray-900">{appointment.userName}</p>
              </div>
              <div>
                <p className="text-gray-500">Therapist</p>
                <p className="font-medium text-gray-900">{appointment.therapistName}</p>
              </div>
              <div>
                <p className="text-gray-500">Scheduled</p>
                <p className="font-medium text-gray-900">{appointment.date.split('T')[0]} at {appointment.time}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-medium text-gray-900">{formatCurrency(appointment.amount)}</p>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {cancellationReasons.map((reason) => (
                <label
                  key={reason.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                    selectedReason === reason.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reason.label}</p>
                    <p className="text-xs text-gray-500">{reason.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedReason === 'other' && (
              <textarea
                className="input mt-3"
                rows={2}
                placeholder="Specify the reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>

          {/* Refund Option */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Process automatic refund</p>
                  <p className="text-xs text-gray-500">Refund {formatCurrency(appointment.amount)} to patient</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={processRefund}
                onChange={(e) => setProcessRefund(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </label>
          </div>

          {/* Notification Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Send notifications to:</p>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Patient</p>
                  <p className="text-xs text-gray-500">{appointment.userEmail}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyUser}
                onChange={(e) => setNotifyUser(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Therapist</p>
                  <p className="text-xs text-gray-500">{appointment.therapistName}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyTherapist}
                onChange={(e) => setNotifyTherapist(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </label>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Admin Notes (for audit trail)
            </label>
            <textarea
              className="input"
              rows={2}
              placeholder="Add any internal notes..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason || (selectedReason === 'other' && !customReason)}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Confirm Cancellation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
