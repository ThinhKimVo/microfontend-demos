import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { getAppointments, adminCancelAppointment } from '../../services/admin';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-gray-100 text-gray-800',
};

export default function AppointmentsList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancelModal, setCancelModal] = useState<{ id: string } | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', page, search, statusFilter],
    queryFn: () => getAppointments({
      page, limit: 20,
      search: search || undefined,
      status: statusFilter || undefined,
    }),
  });

  const { mutate: cancel } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminCancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setCancelModal(null);
      setCancelReason('');
    },
  });

  const appointments = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-sm text-gray-500">{meta?.total ?? 0} appointments total</p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <form className="relative flex-1" onSubmit={handleSearch}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input pl-10 w-full"
            placeholder="Search by patient or therapist..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <select
          className="input w-44"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Patient', 'Therapist', 'Date', 'Duration', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No appointments found</td></tr>
              ) : appointments.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {a.user?.firstName} {a.user?.lastName}
                    <p className="text-xs text-gray-500">{a.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    Dr. {a.therapist?.user?.firstName} {a.therapist?.user?.lastName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(a.scheduledAt).toLocaleDateString()} {new Date(a.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.duration}m</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${(a.amount / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex px-2 py-1 text-xs font-medium rounded-full', STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-800')}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                      <button
                        onClick={() => setCancelModal({ id: a.id })}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <XCircle className="h-3 w-3" />Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages} · {meta.total} total</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn btn-secondary px-3 py-2 disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === meta.totalPages} className="btn btn-secondary px-3 py-2 disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Appointment</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for cancellation:</p>
            <textarea
              className="input w-full min-h-[80px]"
              placeholder="Reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setCancelModal(null); setCancelReason(''); }} className="btn btn-secondary">Back</button>
              <button
                disabled={!cancelReason.trim()}
                onClick={() => cancel({ id: cancelModal.id, reason: cancelReason })}
                className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
