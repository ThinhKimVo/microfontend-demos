import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, MoreVertical, Eye, UserX, UserCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { getUsers, updateUserStatus, deleteUser } from '../../services/admin';

export default function UsersList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search, statusFilter],
    queryFn: () => getUsers({ page, limit: 20, search: search || undefined, status: statusFilter || undefined }),
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{meta?.total ?? 0} users total</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <form className="relative flex-1" onSubmit={handleSearch}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input pl-10 w-full"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <select
          className="input w-40"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Registered', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
              ) : users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {(user.firstName || user.email)?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      user.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {actionMenuOpen === user.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(null)} />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                          <button
                            onClick={() => {
                              changeStatus({ id: user.id, status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' });
                              setActionMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {user.status === 'ACTIVE' ? <><UserX className="h-4 w-4" />Suspend</> : <><UserCheck className="h-4 w-4" />Activate</>}
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => {
                              if (confirm('Delete this user? This cannot be undone.')) {
                                removeUser(user.id);
                              }
                              setActionMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {meta.page} of {meta.totalPages} · {meta.total} users
            </p>
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
