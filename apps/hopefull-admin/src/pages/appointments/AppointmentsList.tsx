import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Calendar,
  ChevronsUpDown,
  BarChart3,
} from 'lucide-react';
import { cn, formatDate, formatDateTime, formatCurrency } from '../../lib/utils';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import AppointmentAnalyticsModal from './AppointmentAnalyticsModal';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  therapistId: string;
  therapistName: string;
  therapistSpecialty: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingNotes?: string;
  sessionNotes?: string;
  cancellationReason?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

// Generate mock appointments
const generateMockAppointments = (): Appointment[] => {
  const userNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Emily Davis', 'Chris Wilson', 'Amanda Martinez', 'Robert Taylor', 'Jessica Anderson'];
  const therapistNames = ['Dr. Sarah Smith', 'Dr. Michael Brown', 'Dr. Emily Chen', 'Dr. James Wilson', 'Dr. Lisa Johnson', 'Dr. David Lee', 'Dr. Jennifer Garcia', 'Dr. Robert Miller'];
  const specialties = ['Clinical Psychology', 'Cognitive Behavioral Therapy', 'Marriage & Family Therapy', 'Anxiety & Depression', 'Trauma Therapy'];
  const statuses: Appointment['status'][] = ['pending', 'confirmed', 'completed', 'completed', 'completed', 'cancelled', 'no_show'];
  const durations = [30, 45, 60, 90];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

  return Array.from({ length: 500 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const userName = userNames[Math.floor(Math.random() * userNames.length)];
    const therapistName = therapistNames[Math.floor(Math.random() * therapistNames.length)];
    const date = new Date(2024, 0, 1 + Math.floor(Math.random() * 60));
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const amount = duration === 30 ? 75 : duration === 45 ? 100 : duration === 60 ? 150 : 200;

    return {
      id: `APT-${String(i + 1).padStart(6, '0')}`,
      userId: `USR-${String(Math.floor(Math.random() * 1000) + 1).padStart(5, '0')}`,
      userName,
      userEmail: `${userName.toLowerCase().replace(' ', '.')}@email.com`,
      therapistId: `THP-${String(Math.floor(Math.random() * 100) + 1).padStart(5, '0')}`,
      therapistName,
      therapistSpecialty: specialties[Math.floor(Math.random() * specialties.length)],
      date: date.toISOString(),
      time: times[Math.floor(Math.random() * times.length)],
      duration,
      status,
      amount,
      paymentStatus: status === 'cancelled' ? (Math.random() > 0.5 ? 'refunded' : 'paid') : 'paid',
      bookingNotes: Math.random() > 0.7 ? 'Patient requested specific focus on anxiety management.' : undefined,
      sessionNotes: status === 'completed' ? 'Session went well. Patient showed improvement.' : undefined,
      cancellationReason: status === 'cancelled' ? 'Patient requested cancellation' : undefined,
      feedback: status === 'completed' && Math.random() > 0.3 ? {
        rating: Math.floor(3 + Math.random() * 3),
        comment: 'Great session, very helpful!'
      } : undefined,
      createdAt: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: ['confirmed', 'completed'].includes(status) ? new Date(date.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      completedAt: status === 'completed' ? date.toISOString() : undefined,
      cancelledAt: status === 'cancelled' ? new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    };
  });
};

const mockAppointments = generateMockAppointments();

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 100;

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [therapistFilter, setTherapistFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Get unique therapists for filter
  const therapists = useMemo(() => {
    const unique = new Set(appointments.map(a => a.therapistName));
    return Array.from(unique).sort();
  }, [appointments]);

  // Filter and sort
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(searchLower) ||
          a.userName.toLowerCase().includes(searchLower) ||
          a.therapistName.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (dateFrom) {
      result = result.filter((a) => new Date(a.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((a) => new Date(a.date) <= new Date(dateTo));
    }

    if (therapistFilter) {
      result = result.filter((a) => a.therapistName === therapistFilter);
    }

    result.sort((a, b) => {
      let aVal: number;
      let bVal: number;

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else {
        aVal = a.amount;
        bVal = b.amount;
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [appointments, search, statusFilter, dateFrom, dateTo, therapistFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Appointment ID', 'User', 'Therapist', 'Date', 'Time', 'Duration', 'Status', 'Amount', 'Payment Status'].join(','),
      ...filteredAppointments.map((a) =>
        [a.id, a.userName, a.therapistName, formatDate(a.date), a.time, `${a.duration}min`, a.status, a.amount, a.paymentStatus].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCancelAppointment = (appointmentId: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, status: 'cancelled' as const, cancellationReason: reason, cancelledAt: new Date().toISOString(), paymentStatus: 'refunded' as const }
          : a
      )
    );
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    );
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setTherapistFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = search || statusFilter !== 'all' || dateFrom || dateTo || therapistFilter;

  // Stats
  const stats = useMemo(() => ({
    total: filteredAppointments.length,
    pending: filteredAppointments.filter(a => a.status === 'pending').length,
    confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length,
    revenue: filteredAppointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.amount, 0),
  }), [filteredAppointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">{filteredAppointments.length} appointments found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAnalyticsModal(true)} className="btn btn-secondary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button onClick={handleExport} className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, user, or therapist..."
              className="input pl-10 w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn('btn btn-secondary', hasActiveFilters && 'ring-2 ring-primary-500')}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">Active</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as typeof statusFilter);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date From
                </label>
                <input
                  type="date"
                  className="input"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date To
                </label>
                <input
                  type="date"
                  className="input"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
                <select
                  className="input"
                  value={therapistFilter}
                  onChange={(e) => {
                    setTherapistFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Therapists</option>
                  {therapists.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn btn-secondary w-full" disabled={!hasActiveFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapist</th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date & Time
                    <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <SortIcon field="amount" />
                  </div>
                </th>
                <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-500">{appointment.id}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.userName}</p>
                      <p className="text-xs text-gray-500">{appointment.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.therapistName}</p>
                      <p className="text-xs text-gray-500">{appointment.therapistSpecialty}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{formatDate(appointment.date)}</p>
                      <p className="text-xs text-gray-500">{appointment.time}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{appointment.duration} min</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusBadge(appointment.status))}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(appointment.amount)}</p>
                      <p className={cn('text-xs', appointment.paymentStatus === 'refunded' ? 'text-red-500' : 'text-green-500')}>
                        {appointment.paymentStatus}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAppointments.length)} of {filteredAppointments.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary px-3 py-2 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'px-3 py-1 text-sm rounded',
                      currentPage === page ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary px-3 py-2 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
          onCancel={(reason) => {
            handleCancelAppointment(selectedAppointment.id, reason);
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {showAnalyticsModal && (
        <AppointmentAnalyticsModal
          appointments={appointments}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}
    </div>
  );
}
