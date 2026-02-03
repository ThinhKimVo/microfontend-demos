import { useState } from 'react';
import {
  X,
  User,
  Calendar,
  DollarSign,
  Star,
  Activity,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  UserX,
  UserCheck,
  Bell,
  CheckCircle,
  XCircle,
  Briefcase,
  Award,
  TrendingUp,
  Download,
} from 'lucide-react';
import { cn, formatDate, formatDateTime, formatCurrency } from '../../lib/utils';
import type { Therapist } from './TherapistsList';

interface TherapistDetailsModalProps {
  therapist: Therapist;
  onClose: () => void;
  onStatusChange: (status: 'active' | 'inactive', reason?: string) => void;
  onProfileStatusChange: (status: 'approved' | 'rejected', reason?: string) => void;
}

type TabType = 'profile' | 'appointments' | 'earnings' | 'reviews' | 'activity';

// Mock data generators
const generateAppointments = () => [
  { id: 'APT-001', patient: 'John Doe', date: '2024-01-20T10:00:00', status: 'scheduled', type: 'Therapy Session', amount: 150, duration: 60 },
  { id: 'APT-002', patient: 'Jane Smith', date: '2024-01-18T14:30:00', status: 'completed', type: 'Follow-up', amount: 120, duration: 45 },
  { id: 'APT-003', patient: 'Mike Johnson', date: '2024-01-15T09:00:00', status: 'completed', type: 'Initial Consultation', amount: 200, duration: 90 },
  { id: 'APT-004', patient: 'Sarah Williams', date: '2024-01-12T11:00:00', status: 'cancelled', type: 'Therapy Session', amount: 150, duration: 60 },
  { id: 'APT-005', patient: 'David Brown', date: '2024-01-10T15:00:00', status: 'completed', type: 'Therapy Session', amount: 150, duration: 60 },
  { id: 'APT-006', patient: 'Emily Davis', date: '2024-01-08T10:00:00', status: 'no_show', type: 'Therapy Session', amount: 150, duration: 60 },
];

const generateEarnings = () => ({
  totalEarnings: 45680,
  pendingPayout: 2340,
  lastPayout: { amount: 3200, date: '2024-01-15' },
  payoutHistory: [
    { id: 'PAY-001', date: '2024-01-15', amount: 3200, status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-002', date: '2024-01-01', amount: 4100, status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-003', date: '2023-12-15', amount: 3800, status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-004', date: '2023-12-01', amount: 3600, status: 'completed', method: 'Bank Transfer' },
  ],
  monthlyStats: [
    { month: 'Jan 2024', sessions: 42, earnings: 5540 },
    { month: 'Dec 2023', sessions: 38, earnings: 4890 },
    { month: 'Nov 2023', sessions: 45, earnings: 5820 },
    { month: 'Oct 2023', sessions: 40, earnings: 5200 },
  ],
});

const generateReviews = () => [
  { id: 1, patient: 'John D.', date: '2024-01-18', rating: 5, comment: 'Excellent therapist! Very understanding and professional. Highly recommend.' },
  { id: 2, patient: 'Jane S.', date: '2024-01-15', rating: 5, comment: 'Great session. Felt heard and understood. Will continue sessions.' },
  { id: 3, patient: 'Mike J.', date: '2024-01-12', rating: 4, comment: 'Very helpful insights. Looking forward to next session.' },
  { id: 4, patient: 'Sarah W.', date: '2024-01-08', rating: 5, comment: 'Amazing experience. The therapist really knows how to help.' },
  { id: 5, patient: 'David B.', date: '2024-01-05', rating: 4, comment: 'Professional and caring. Good progress so far.' },
];

const generateActivityLog = () => [
  { id: 1, action: 'Completed session with John D.', timestamp: '2024-01-18T15:00:00', type: 'session' },
  { id: 2, action: 'Logged in', timestamp: '2024-01-18T09:30:00', type: 'login' },
  { id: 3, action: 'Updated availability schedule', timestamp: '2024-01-17T14:20:00', type: 'profile' },
  { id: 4, action: 'Received payout of $3,200', timestamp: '2024-01-15T10:00:00', type: 'payment' },
  { id: 5, action: 'Completed session with Jane S.', timestamp: '2024-01-15T16:00:00', type: 'session' },
  { id: 6, action: 'Received new review (5 stars)', timestamp: '2024-01-15T16:30:00', type: 'review' },
  { id: 7, action: 'Logged in', timestamp: '2024-01-15T08:45:00', type: 'login' },
];

export default function TherapistDetailsModal({
  therapist,
  onClose,
  onStatusChange,
  onProfileStatusChange,
}: TherapistDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const appointments = generateAppointments();
  const earnings = generateEarnings();
  const reviews = generateReviews();
  const activityLog = generateActivityLog();

  const tabs: { id: TabType; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session': return Calendar;
      case 'login': return User;
      case 'profile': return Briefcase;
      case 'payment': return DollarSign;
      case 'review': return Star;
      default: return Activity;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img src={therapist.photo} alt={therapist.name} className="w-14 h-14 rounded-full bg-gray-100" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{therapist.name}</h2>
                {therapist.verificationStatus === 'verified' && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">{therapist.specialty}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded-full capitalize',
                therapist.profileStatus === 'approved' ? 'bg-green-100 text-green-800' :
                therapist.profileStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              )}>
                {therapist.profileStatus}
              </span>
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                therapist.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}>
                {therapist.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="card p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{therapist.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{therapist.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">New York, NY</span>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="card p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Professional Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Specialty</span>
                      <span className="text-sm font-medium text-gray-900">{therapist.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Experience</span>
                      <span className="text-sm font-medium text-gray-900">{therapist.yearsExperience} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Hourly Rate</span>
                      <span className="text-sm font-medium text-gray-900">${therapist.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">{therapist.averageRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{therapist.totalReviews} reviews</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{therapist.totalBookings}</p>
                  <p className="text-xs text-gray-500">Total Bookings</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.totalEarnings)}</p>
                  <p className="text-xs text-gray-500">Total Earnings</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{therapist.yearsExperience}</p>
                  <p className="text-xs text-gray-500">Years Experience</p>
                </div>
              </div>

              {/* License Info */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">License Information</h3>
                  <button className="btn btn-secondary text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    View License
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">License Number</p>
                    <p className="text-sm font-mono font-medium text-gray-900">{therapist.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(therapist.licenseExpiry)}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-sm text-gray-700">{therapist.bio}</p>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
                <div className="flex gap-2">
                  {['all', 'scheduled', 'completed', 'cancelled'].map((filter) => (
                    <button key={filter} className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 capitalize">
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{apt.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{apt.patient}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(apt.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{apt.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{apt.duration} min</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(apt.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusColor(apt.status))}>
                            {apt.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-900">{formatCurrency(earnings.totalEarnings)}</p>
                    </div>
                  </div>
                </div>
                <div className="card p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700">Pending Payout</p>
                      <p className="text-2xl font-bold text-yellow-900">{formatCurrency(earnings.pendingPayout)}</p>
                    </div>
                  </div>
                </div>
                <div className="card p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Last Payout</p>
                      <p className="text-2xl font-bold text-blue-900">{formatCurrency(earnings.lastPayout.amount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                <div className="space-y-3">
                  {earnings.monthlyStats.map((stat) => (
                    <div key={stat.month} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm font-medium text-gray-900">{stat.month}</span>
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-500">{stat.sessions} sessions</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(stat.earnings)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout History */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Payout History</h3>
                  <button className="btn btn-secondary text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {earnings.payoutHistory.map((payout) => (
                      <tr key={payout.id}>
                        <td className="px-4 py-2 text-sm font-mono text-gray-500">{payout.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{formatDate(payout.date)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{payout.method}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(payout.amount)}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 capitalize">
                            {payout.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Patient Reviews</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-5 w-5',
                            i < Math.round(therapist.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{therapist.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({therapist.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">{review.patient.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.patient}</span>
                        <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn('h-4 w-4', i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300')}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
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
                {activityLog.map((log) => {
                  const Icon = getActivityIcon(log.type);
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDateTime(log.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {therapist.profileStatus === 'pending' && (
              <>
                <button
                  onClick={() => onProfileStatusChange('approved')}
                  className="btn btn-primary text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Profile
                </button>
                <button
                  onClick={() => onProfileStatusChange('rejected', 'Administrative decision')}
                  className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Profile
                </button>
              </>
            )}
            {therapist.profileStatus === 'approved' && (
              <button
                onClick={() => onStatusChange(therapist.status === 'active' ? 'inactive' : 'active')}
                className={cn(
                  'btn text-sm',
                  therapist.status === 'active'
                    ? 'btn-secondary text-red-600 hover:bg-red-50'
                    : 'btn-primary'
                )}
              >
                {therapist.status === 'active' ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => alert(`Notification sent to ${therapist.email}`)}
              className="btn btn-secondary text-sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Notification
            </button>
          </div>
          <button
            onClick={() => alert('Opening license viewer...')}
            className="btn btn-secondary text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            View License
          </button>
        </div>
      </div>
    </div>
  );
}
