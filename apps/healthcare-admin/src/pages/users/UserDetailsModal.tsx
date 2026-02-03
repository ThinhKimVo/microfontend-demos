import { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  MessageSquare,
  Activity,
  UserX,
  UserCheck,
  Trash2,
  Bell,
  Edit,
  Save,
  MapPin,
  Star,
} from 'lucide-react';
import { cn, formatDate, formatDateTime, formatCurrency } from '../../lib/utils';
import type { User as UserType } from './UsersList';

interface UserDetailsModalProps {
  user: UserType;
  onClose: () => void;
  onStatusChange: (status: 'active' | 'inactive', reason?: string) => void;
  onDelete: () => void;
}

type TabType = 'profile' | 'appointments' | 'payments' | 'feedback' | 'activity';

// Mock data generators
const generateAppointments = (userId: string) => [
  { id: 'APT-001', therapist: 'Dr. Sarah Smith', date: '2024-01-15T10:00:00', status: 'completed', type: 'Therapy Session', amount: 150 },
  { id: 'APT-002', therapist: 'Dr. Michael Brown', date: '2024-01-08T14:30:00', status: 'completed', type: 'Initial Consultation', amount: 200 },
  { id: 'APT-003', therapist: 'Dr. Sarah Smith', date: '2024-01-22T10:00:00', status: 'scheduled', type: 'Follow-up', amount: 120 },
  { id: 'APT-004', therapist: 'Dr. Emily Chen', date: '2023-12-20T11:00:00', status: 'cancelled', type: 'Therapy Session', amount: 150 },
  { id: 'APT-005', therapist: 'Dr. Sarah Smith', date: '2023-12-15T10:00:00', status: 'completed', type: 'Therapy Session', amount: 150 },
];

const generatePayments = (userId: string) => [
  { id: 'PAY-001', date: '2024-01-15', amount: 150, method: 'Credit Card', status: 'completed', description: 'Therapy Session - Dr. Sarah Smith' },
  { id: 'PAY-002', date: '2024-01-08', amount: 200, method: 'Credit Card', status: 'completed', description: 'Initial Consultation - Dr. Michael Brown' },
  { id: 'PAY-003', date: '2023-12-15', amount: 150, method: 'PayPal', status: 'completed', description: 'Therapy Session - Dr. Sarah Smith' },
  { id: 'PAY-004', date: '2023-12-01', amount: 120, method: 'Credit Card', status: 'refunded', description: 'Cancelled appointment refund' },
];

const generateFeedback = (userId: string) => [
  { id: 'FB-001', therapist: 'Dr. Sarah Smith', date: '2024-01-15', rating: 5, comment: 'Excellent session. Very helpful and understanding.' },
  { id: 'FB-002', therapist: 'Dr. Michael Brown', date: '2024-01-08', rating: 4, comment: 'Good initial consultation. Clear explanations.' },
  { id: 'FB-003', therapist: 'Dr. Sarah Smith', date: '2023-12-15', rating: 5, comment: 'Making great progress. Thank you!' },
];

const generateActivityLog = (userId: string) => [
  { id: 1, action: 'Logged in', timestamp: '2024-01-16T09:30:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 2, action: 'Booked appointment with Dr. Sarah Smith', timestamp: '2024-01-15T14:20:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 3, action: 'Updated profile information', timestamp: '2024-01-14T11:45:00', ip: '192.168.1.100', device: 'Safari / iOS' },
  { id: 4, action: 'Logged in', timestamp: '2024-01-14T11:40:00', ip: '10.0.0.50', device: 'Safari / iOS' },
  { id: 5, action: 'Completed payment of $150', timestamp: '2024-01-08T14:35:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 6, action: 'Logged in', timestamp: '2024-01-08T14:30:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 7, action: 'Account created', timestamp: '2024-01-01T10:00:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
];

export default function UserDetailsModal({ user, onClose, onStatusChange, onDelete }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: '123 Main Street, New York, NY 10001',
    dateOfBirth: '1990-05-15',
  });

  const appointments = generateAppointments(user.id);
  const payments = generatePayments(user.id);
  const feedback = generateFeedback(user.id);
  const activityLog = generateActivityLog(user.id);

  const tabs: { id: TabType; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const handleSave = () => {
    // In real app, would save to backend
    alert('Profile updated successfully');
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary-600">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.id}</p>
            </div>
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}
            >
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                {isEditing ? (
                  <button onClick={handleSave} className="btn btn-primary text-sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary text-sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Info
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{editedUser.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="input"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{editedUser.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="input"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{editedUser.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="input"
                      value={editedUser.dateOfBirth}
                      onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(editedUser.dateOfBirth)}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={editedUser.address}
                      onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{editedUser.address}</p>
                  )}
                </div>
              </div>

              <hr className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(user.registrationDate)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDateTime(user.lastLogin)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-lg font-semibold text-gray-900">{appointments.length}</p>
                </div>
              </div>

              {user.status === 'inactive' && user.deactivationReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Deactivation Reason:</p>
                  <p className="text-sm text-red-700">{user.deactivationReason}</p>
                </div>
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapist</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{apt.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{apt.therapist}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(apt.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{apt.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(apt.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusColor(apt.status))}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                <div className="text-sm text-gray-500">
                  Total spent: <span className="font-semibold text-gray-900">{formatCurrency(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{pay.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(pay.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{pay.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{pay.method}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(pay.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusColor(pay.status))}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Feedback Given</h3>
              <div className="space-y-4">
                {feedback.map((fb) => (
                  <div key={fb.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{fb.therapist}</span>
                        <span className="text-sm text-gray-500">{formatDate(fb.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-4 w-4',
                              i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
              <div className="space-y-3">
                {activityLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <Activity className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(log.timestamp)}
                        </span>
                        <span>IP: {log.ip}</span>
                        <span>{log.device}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStatusChange(user.status === 'active' ? 'inactive' : 'active')}
              className={cn(
                'btn text-sm',
                user.status === 'active'
                  ? 'btn-secondary text-red-600 hover:bg-red-50'
                  : 'btn-primary'
              )}
            >
              {user.status === 'active' ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate User
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activate User
                </>
              )}
            </button>
            <button
              onClick={() => alert(`Notification sent to ${user.email}`)}
              className="btn btn-secondary text-sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Notification
            </button>
          </div>
          <button onClick={onDelete} className="btn btn-secondary text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
