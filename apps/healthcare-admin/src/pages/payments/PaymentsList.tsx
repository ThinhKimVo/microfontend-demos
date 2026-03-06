import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getPayments } from '../../services/admin';

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
  PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-800',
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function PaymentsList() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page, statusFilter, dateFrom, dateTo],
    queryFn: () => getPayments({
      page, limit: 20,
      status: statusFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
  });

  const payments = data?.data || [];
  const meta = data?.meta;
  const summary = data?.summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">{meta?.total ?? 0} transactions</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Revenue', value: summary.totalRevenue, color: 'text-green-600' },
            { label: 'Platform Fee', value: summary.totalPlatformFee, color: 'text-indigo-600' },
            { label: 'Therapist Payout', value: summary.totalTherapistPayout, color: 'text-orange-600' },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={cn('text-2xl font-bold mt-1', s.color)}>{formatCents(s.value)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <select
          className="input w-44"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <input type="date" className="input" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
        <input type="date" className="input" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Patient', 'Therapist', 'Amount', 'Platform Fee', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No payments found</td></tr>
              ) : payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{p.user?.firstName} {p.user?.lastName}</p>
                    <p className="text-xs text-gray-500">{p.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {p.appointment?.therapist ? `Dr. ${p.appointment.therapist.user?.firstName} ${p.appointment.therapist.user?.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCents(p.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatCents(p.platformFee)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex px-2 py-1 text-xs font-medium rounded-full', STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-800')}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
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
    </div>
  );
}
