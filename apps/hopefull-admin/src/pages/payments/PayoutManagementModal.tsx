import { useState, useMemo } from 'react';
import {
  X,
  Wallet,
  CheckCircle,
  Clock,
  Send,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Building,
  CreditCard,
  AlertCircle,
  Check,
  History,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../../lib/utils';

interface Payout {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistEmail: string;
  amount: number;
  currency: string;
  payoutMethod: 'bank_transfer' | 'paypal' | 'stripe';
  bankLast4: string | null;
  scheduledDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt: string | null;
  createdAt: string;
}

// Generate mock payouts
const generateMockPayouts = (): Payout[] => {
  const therapists = [
    { id: 'THP-001', name: 'Dr. Sarah Smith', email: 'sarah.smith@example.com' },
    { id: 'THP-002', name: 'Dr. Michael Brown', email: 'michael.brown@example.com' },
    { id: 'THP-003', name: 'Dr. Emily Chen', email: 'emily.chen@example.com' },
    { id: 'THP-004', name: 'Dr. James Wilson', email: 'james.wilson@example.com' },
    { id: 'THP-005', name: 'Dr. Lisa Johnson', email: 'lisa.johnson@example.com' },
    { id: 'THP-006', name: 'Dr. David Lee', email: 'david.lee@example.com' },
    { id: 'THP-007', name: 'Dr. Jennifer Garcia', email: 'jennifer.garcia@example.com' },
    { id: 'THP-008', name: 'Dr. Robert Miller', email: 'robert.miller@example.com' },
    { id: 'THP-009', name: 'Dr. Amanda White', email: 'amanda.white@example.com' },
    { id: 'THP-010', name: 'Dr. Christopher Taylor', email: 'chris.taylor@example.com' },
  ];

  const statuses: Payout['status'][] = ['pending', 'pending', 'pending', 'processing', 'completed', 'completed', 'completed', 'completed', 'failed'];
  const payoutMethods: Payout['payoutMethod'][] = ['bank_transfer', 'bank_transfer', 'bank_transfer', 'paypal', 'stripe'];

  const payouts: Payout[] = [];

  for (let i = 0; i < 80; i++) {
    const therapist = therapists[Math.floor(Math.random() * therapists.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = payoutMethods[Math.floor(Math.random() * payoutMethods.length)];
    const amount = Math.floor(Math.random() * 5000 + 500) * 100; // $500 - $5500

    const scheduledDate = new Date(Date.now() + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000);
    const createdAt = new Date(scheduledDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    payouts.push({
      id: `PAY-${String(i + 1).padStart(5, '0')}`,
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistEmail: therapist.email,
      amount,
      currency: 'USD',
      payoutMethod: method,
      bankLast4: method === 'bank_transfer' ? String(Math.floor(Math.random() * 9000) + 1000) : null,
      scheduledDate: scheduledDate.toISOString(),
      status,
      processedAt: status === 'completed' ? scheduledDate.toISOString() : null,
      createdAt: createdAt.toISOString(),
    });
  }

  return payouts.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
};

const mockPayouts = generateMockPayouts();

interface PayoutManagementModalProps {
  onClose: () => void;
}

export default function PayoutManagementModal({ onClose }: PayoutManagementModalProps) {
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState<'pending' | 'history'>('pending');
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter payouts
  const filteredPayouts = useMemo(() => {
    let filtered = [...payouts];

    // Tab filter
    if (tab === 'pending') {
      filtered = filtered.filter((p) => p.status === 'pending' || p.status === 'processing');
    } else {
      filtered = filtered.filter((p) => p.status === 'completed' || p.status === 'failed');
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.therapistName.toLowerCase().includes(searchLower) ||
          p.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    return filtered;
  }, [payouts, tab, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const pending = payouts.filter((p) => p.status === 'pending');
    const processing = payouts.filter((p) => p.status === 'processing');
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalProcessing = processing.reduce((sum, p) => sum + p.amount, 0);

    return {
      pendingCount: pending.length,
      processingCount: processing.length,
      totalPending,
      totalProcessing,
    };
  }, [payouts]);

  const getStatusBadge = (status: Payout['status']) => {
    const config = {
      pending: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { icon: Send, bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      completed: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      failed: { icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
    };
    const { icon: Icon, bg, text, label } = config[status];
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full', bg, text)}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const getPayoutMethodIcon = (method: Payout['payoutMethod']) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className="h-4 w-4 text-gray-500" />;
      case 'paypal':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'stripe':
        return <CreditCard className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPayoutMethodLabel = (method: Payout['payoutMethod'], bankLast4: string | null) => {
    switch (method) {
      case 'bank_transfer':
        return `Bank Transfer ${bankLast4 ? `•••• ${bankLast4}` : ''}`;
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
    }
  };

  const handleSelectAll = () => {
    if (selectedPayouts.size === paginatedPayouts.filter((p) => p.status === 'pending').length) {
      setSelectedPayouts(new Set());
    } else {
      setSelectedPayouts(new Set(paginatedPayouts.filter((p) => p.status === 'pending').map((p) => p.id)));
    }
  };

  const handleSelectPayout = (id: string) => {
    const newSelected = new Set(selectedPayouts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPayouts(newSelected);
  };

  const handleApprovePayout = async (payoutId: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: 'processing' as const }
          : p
      )
    );
    setSelectedPayouts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(payoutId);
      return newSet;
    });
    setIsProcessing(false);
  };

  const handleApproveSelected = async () => {
    if (selectedPayouts.size === 0) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPayouts((prev) =>
      prev.map((p) =>
        selectedPayouts.has(p.id) && p.status === 'pending'
          ? { ...p, status: 'processing' as const }
          : p
      )
    );
    setSelectedPayouts(new Set());
    setIsProcessing(false);
  };

  const pendingPayoutsCount = paginatedPayouts.filter((p) => p.status === 'pending').length;
  const allPendingSelected = selectedPayouts.size === pendingPayoutsCount && pendingPayoutsCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-full">
              <Wallet className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payout Management</h2>
              <p className="text-sm text-gray-500">Manage therapist payouts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Payouts</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.pendingCount} <span className="text-sm font-normal text-gray-500">({formatCurrency(stats.totalPending / 100)})</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Processing</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.processingCount} <span className="text-sm font-normal text-gray-500">({formatCurrency(stats.totalProcessing / 100)})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setTab('pending');
                setCurrentPage(1);
                setSelectedPayouts(new Set());
              }}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                tab === 'pending'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Pending Payouts
            </button>
            <button
              onClick={() => {
                setTab('history');
                setCurrentPage(1);
                setSelectedPayouts(new Set());
              }}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                tab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <History className="h-4 w-4 inline mr-2" />
              Payout History
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by therapist name or payout ID..."
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
              className={cn('btn btn-secondary', showFilters && 'bg-gray-100')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            {tab === 'pending' && selectedPayouts.size > 0 && (
              <button
                onClick={handleApproveSelected}
                disabled={isProcessing}
                className="btn btn-primary"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve Selected ({selectedPayouts.size})
                  </>
                )}
              </button>
            )}
          </div>

          {showFilters && (
            <div className="flex gap-4 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  {tab === 'pending' ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                    </>
                  ) : (
                    <>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {tab === 'pending' && (
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={allPendingSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapist</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {tab === 'pending' && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  {tab === 'pending' && (
                    <td className="px-4 py-4">
                      {payout.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedPayouts.has(payout.id)}
                          onChange={() => handleSelectPayout(payout.id)}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300"
                        />
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{payout.id}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payout.therapistName}</p>
                      <p className="text-xs text-gray-500">{payout.therapistEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payout.amount / 100)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getPayoutMethodIcon(payout.payoutMethod)}
                      <span className="text-sm text-gray-600">
                        {getPayoutMethodLabel(payout.payoutMethod, payout.bankLast4)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{formatDate(payout.scheduledDate)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(payout.status)}
                  </td>
                  {tab === 'pending' && (
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {payout.status === 'pending' && (
                        <button
                          onClick={() => handleApprovePayout(payout.id)}
                          disabled={isProcessing}
                          className="btn btn-primary text-sm py-1 px-3"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedPayouts.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No payouts found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPayouts.length)} of {filteredPayouts.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
