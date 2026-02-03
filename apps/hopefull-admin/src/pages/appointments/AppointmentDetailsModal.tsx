import { useState } from 'react';
import {
  X,
  User,
  Stethoscope,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Download,
  Ban,
} from 'lucide-react';
import { cn, formatDate, formatDateTime, formatCurrency } from '../../lib/utils';
import type { Appointment } from './AppointmentsList';
import CancelAppointmentModal from './CancelAppointmentModal';

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onCancel: (reason: string) => void;
}

export default function AppointmentDetailsModal({
  appointment,
  onClose,
  onCancel,
}: AppointmentDetailsModalProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const getStatusIcon = (status: string, isActive: boolean) => {
    const iconClass = cn('h-5 w-5', isActive ? 'text-white' : 'text-gray-400');
    switch (status) {
      case 'booked':
        return <Calendar className={iconClass} />;
      case 'confirmed':
        return <CheckCircle className={iconClass} />;
      case 'completed':
        return <Star className={iconClass} />;
      case 'cancelled':
        return <XCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getTimelineStatus = () => {
    const timeline = [
      { status: 'booked', label: 'Booked', date: appointment.createdAt },
      { status: 'confirmed', label: 'Confirmed', date: appointment.confirmedAt },
      { status: appointment.status === 'cancelled' ? 'cancelled' : 'completed', label: appointment.status === 'cancelled' ? 'Cancelled' : 'Completed', date: appointment.completedAt || appointment.cancelledAt },
    ];

    const currentIndex = appointment.status === 'pending' ? 0 :
      appointment.status === 'confirmed' ? 1 :
      ['completed', 'cancelled', 'no_show'].includes(appointment.status) ? 2 : 0;

    return { timeline, currentIndex };
  };

  const { timeline, currentIndex } = getTimelineStatus();

  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
                <p className="text-sm text-gray-500 font-mono">{appointment.id}</p>
              </div>
              <span className={cn(
                'px-3 py-1 text-sm font-medium rounded-full capitalize',
                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              )}>
                {appointment.status.replace('_', ' ')}
              </span>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Timeline */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Appointment Timeline</h3>
              <div className="flex items-center justify-between">
                {timeline.map((step, index) => (
                  <div key={step.status} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        index <= currentIndex
                          ? step.status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'
                          : 'bg-gray-200'
                      )}>
                        {getStatusIcon(step.status, index <= currentIndex)}
                      </div>
                      <p className={cn(
                        'text-xs font-medium mt-2',
                        index <= currentIndex ? 'text-gray-900' : 'text-gray-400'
                      )}>
                        {step.label}
                      </p>
                      {step.date && index <= currentIndex && (
                        <p className="text-xs text-gray-500">{formatDateTime(step.date)}</p>
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={cn(
                        'flex-1 h-1 mx-2',
                        index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Details */}
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">Patient Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">{appointment.userName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.userName}</p>
                      <p className="text-xs text-gray-500">{appointment.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {appointment.userEmail}
                  </div>
                  <button className="btn btn-secondary text-xs w-full">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact Patient
                  </button>
                </div>
              </div>

              {/* Therapist Details */}
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">Therapist Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.therapistName}</p>
                      <p className="text-xs text-gray-500">{appointment.therapistSpecialty}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{appointment.therapistId}</p>
                  <button className="btn btn-secondary text-xs w-full">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact Therapist
                  </button>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Appointment Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Time</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{appointment.duration} minutes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Amount</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(appointment.amount)}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Payment Details</h3>
                <button className="btn btn-secondary text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  View Invoice
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(appointment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <span className={cn(
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize',
                    appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    appointment.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  )}>
                    {appointment.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Booked On</p>
                  <p className="text-sm text-gray-900">{formatDateTime(appointment.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(appointment.bookingNotes || appointment.sessionNotes) && (
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="space-y-4">
                  {appointment.bookingNotes && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-medium">Booking Notes</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{appointment.bookingNotes}</p>
                    </div>
                  )}
                  {appointment.sessionNotes && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs font-medium">Session Notes</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{appointment.sessionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            {appointment.feedback && (
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Patient Feedback</h3>
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < appointment.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{appointment.feedback.comment}</p>
                </div>
              </div>
            )}

            {/* Cancellation Info */}
            {appointment.status === 'cancelled' && appointment.cancellationReason && (
              <div className="card p-4 bg-red-50 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="text-sm font-semibold text-red-900">Cancellation Details</h3>
                </div>
                <p className="text-sm text-red-700">{appointment.cancellationReason}</p>
                {appointment.cancelledAt && (
                  <p className="text-xs text-red-600 mt-2">Cancelled on {formatDateTime(appointment.cancelledAt)}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-secondary text-sm">
                <Download className="h-4 w-4 mr-2" />
                View Invoice
              </button>
              <button onClick={onClose} className="btn btn-primary text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <CancelAppointmentModal
          appointment={appointment}
          onClose={() => setShowCancelModal(false)}
          onConfirm={(reason) => {
            onCancel(reason);
            setShowCancelModal(false);
          }}
        />
      )}
    </>
  );
}
