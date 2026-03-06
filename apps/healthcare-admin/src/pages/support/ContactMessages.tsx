import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getSupportTickets, updateSupportTicket } from '../../services/admin';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  NORMAL: 'bg-indigo-100 text-indigo-600',
  HIGH: 'bg-red-100 text-red-700',
};

export default function ContactMessages() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['support', page, search, statusFilter],
    queryFn: () => getSupportTickets({
      page, limit: 20,
      search: search || undefined,
      status: statusFilter || undefined,
    }),
  });

  const { mutate: updateTicket } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSupportTicket(id, { status }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['support'] });
      setSelected((prev: any) => prev ? { ...prev, status: updated.status } : null);
    },
  });

  const tickets = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form className="relative flex-1" onSubmit={handleSearch}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input pl-10 w-full"
            placeholder="Search tickets..."
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
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Tickets list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="card p-8 text-center text-gray-400">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">No tickets found</div>
        ) : tickets.map((t: any) => (
          <div
            key={t.id}
            onClick={() => setSelected(t)}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.subject}</p>
                  <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-600')}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', PRIORITY_COLORS[t.priority] || 'bg-gray-100 text-gray-600')}>
                    {t.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.name} · {t.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages}</p>
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

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <h3 className="flex-1 text-lg font-bold text-gray-900">{selected.subject}</h3>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-indigo-600">{selected.name} · {selected.email}</p>
            <p className="text-xs text-gray-400 mb-4">{new Date(selected.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{selected.message}</p>

            <p className="text-sm font-semibold text-gray-700 mb-3">Update Status:</p>
            <div className="flex gap-3">
              {['NEW', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateTicket({ id: selected.id, status: s })}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium rounded-lg border transition-colors',
                    selected.status === s
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
