import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { getTherapists, updateTherapistVerification } from '../../services/admin';

export default function TherapistsList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['therapists', page, search, verificationFilter],
    queryFn: () => getTherapists({
      page,
      limit: 20,
      search: search || undefined,
      verificationStatus: verificationFilter || undefined,
    }),
  });

  const { mutate: verify } = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      updateTherapistVerification(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setRejectModal(null);
      setRejectReason('');
    },
  });

  const therapists = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const STATUS_COLORS: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-800',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Therapists</h1>
        <p className="text-sm text-gray-500">{meta?.total ?? 0} therapists total</p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <form className="relative flex-1" onSubmit={handleSearch}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input pl-10 w-full"
            placeholder="Search therapists..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <select
          className="input w-48"
          value={verificationFilter}
          onChange={(e) => { setVerificationFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Therapist', 'Specializations', 'Rating', 'Bookings', 'Verification', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : therapists.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No therapists found</td></tr>
              ) : therapists.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-700">
                          {t.user?.firstName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dr. {t.user?.firstName} {t.user?.lastName}</p>
                        <p className="text-xs text-gray-500">{t.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">
                    {t.specializations?.map((s: any) => s.specialization?.name).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{t.averageRating?.toFixed(1) || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{t.totalBookings ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex px-2 py-1 text-xs font-medium rounded-full', STATUS_COLORS[t.verificationStatus] || 'bg-gray-100 text-gray-800')}>
                      {t.verificationStatus?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {t.verificationStatus === 'PENDING_REVIEW' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => verify({ id: t.id, status: 'APPROVED' })}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          <CheckCircle className="h-3 w-3" />Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: t.id, name: `${t.user?.firstName} ${t.user?.lastName}` })}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          <XCircle className="h-3 w-3" />Reject
                        </button>
                      </div>
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

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject {rejectModal.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for rejection (optional):</p>
            <textarea
              className="input w-full min-h-[80px]"
              placeholder="Reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="btn btn-secondary">Cancel</button>
              <button
                onClick={() => verify({ id: rejectModal.id, status: 'REJECTED', reason: rejectReason || undefined })}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
