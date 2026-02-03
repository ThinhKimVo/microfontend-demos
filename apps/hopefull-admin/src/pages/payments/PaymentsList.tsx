import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  RotateCcw,
  CreditCard,
  DollarSign,
  BarChart3,
  Wallet,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import TransactionDetailsModal from './TransactionDetailsModal';
import RevenueReportsModal from './RevenueReportsModal';
import PayoutManagementModal from './PayoutManagementModal';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  therapistId: string | null;
  therapistName: string | null;
  appointmentId: string | null;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'paypal' | 'apple_pay' | 'google_pay';
  cardLast4: string | null;
  cardBrand: string | null;
  stripeTransactionId: string;
  status: 'success' | 'failed' | 'refunded' | 'pending' | 'partially_refunded';
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  platformFee: number;
  therapistEarnings: number | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Generate mock transactions
const generateMockTransactions = (): Transaction[] => {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
  const therapistNames = [
    'Dr. Sarah Smith', 'Dr. Michael Brown', 'Dr. Emily Chen', 'Dr. James Wilson',
    'Dr. Lisa Johnson', 'Dr. David Lee', 'Dr. Jennifer Garcia', 'Dr. Robert Miller',
    'Dr. Amanda White', 'Dr. Christopher Taylor',
  ];
  const statuses: Transaction['status'][] = ['success', 'success', 'success', 'success', 'success', 'failed', 'refunded', 'pending', 'partially_refunded'];
  const paymentMethods: Transaction['paymentMethod'][] = ['card', 'card', 'card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay'];
  const cardBrands = ['Visa', 'Mastercard', 'Amex', 'Discover'];
  const descriptions = [
    'Session booking payment',
    'Consultation fee',
    'Follow-up session',
    'Initial assessment',
    'Group therapy session',
    'Emergency consultation',
    'Package purchase - 5 sessions',
    'Package purchase - 10 sessions',
  ];

  const transactions: Transaction[] = [];

  for (let i = 0; i < 500; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const hasTherapist = Math.random() > 0.1;
    const amount = Math.floor(Math.random() * 300 + 50) * 100; // $50 - $350 in cents
    const platformFee = Math.floor(amount * 0.15); // 15% platform fee
    const therapistEarnings = hasTherapist ? amount - platformFee : null;

    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000));
    let refundAmount = null;
    let refundReason = null;
    let refundedAt = null;

    if (status === 'refunded') {
      refundAmount = amount;
      refundReason = ['Customer request', 'Therapist cancelled', 'Technical issue', 'Double charge'][Math.floor(Math.random() * 4)];
      refundedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
    } else if (status === 'partially_refunded') {
      refundAmount = Math.floor(amount * 0.5);
      refundReason = 'Partial session cancellation';
      refundedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
    }

    transactions.push({
      id: `TXN-${String(i + 1).padStart(6, '0')}`,
      userId: `USR-${String(Math.floor(Math.random() * 150) + 1).padStart(3, '0')}`,
      userName: `${firstName} ${lastName}`,
      userEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      therapistId: hasTherapist ? `THP-${String(Math.floor(Math.random() * 120) + 1).padStart(3, '0')}` : null,
      therapistName: hasTherapist ? therapistNames[Math.floor(Math.random() * therapistNames.length)] : null,
      appointmentId: hasTherapist ? `APT-${String(Math.floor(Math.random() * 500) + 1).padStart(5, '0')}` : null,
      amount,
      currency: 'USD',
      paymentMethod,
      cardLast4: paymentMethod === 'card' ? String(Math.floor(Math.random() * 9000) + 1000) : null,
      cardBrand: paymentMethod === 'card' ? cardBrands[Math.floor(Math.random() * cardBrands.length)] : null,
      stripeTransactionId: `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status,
      refundAmount,
      refundReason,
      refundedAt,
      platformFee,
      therapistEarnings,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const mockTransactions = generateMockTransactions();

type SortField = 'createdAt' | 'amount';
type SortDirection = 'asc' | 'desc';

export default function PaymentsList() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Modals
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRevenueReports, setShowRevenueReports] = useState(false);
  const [showPayoutManagement, setShowPayoutManagement] = useState(false);

  // Filter and sort
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(searchLower) ||
          t.userName.toLowerCase().includes(searchLower) ||
          (t.therapistName && t.therapistName.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Payment method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter((t) => t.paymentMethod === methodFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((t) => new Date(t.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((t) => new Date(t.createdAt) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, search, statusFilter, methodFilter, dateFrom, dateTo, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const successful = transactions.filter((t) => t.status === 'success');
    const totalRevenue = successful.reduce((sum, t) => sum + t.amount, 0);
    const totalPlatformFees = successful.reduce((sum, t) => sum + t.platformFee, 0);
    const refunded = transactions.filter((t) => t.status === 'refunded' || t.status === 'partially_refunded');
    const totalRefunded = refunded.reduce((sum, t) => sum + (t.refundAmount || 0), 0);
    const failed = transactions.filter((t) => t.status === 'failed');

    return {
      totalRevenue,
      totalPlatformFees,
      totalRefunded,
      successCount: successful.length,
      failedCount: failed.length,
      refundedCount: refunded.length,
    };
  }, [transactions]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const config = {
      success: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800', label: 'Success' },
      failed: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      refunded: { icon: RotateCcw, bg: 'bg-purple-100', text: 'text-purple-800', label: 'Refunded' },
      pending: { icon: CreditCard, bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      partially_refunded: { icon: RotateCcw, bg: 'bg-orange-100', text: 'text-orange-800', label: 'Partial Refund' },
    };
    const { icon: Icon, bg, text, label } = config[status];
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full', bg, text)}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: Transaction['paymentMethod']) => {
    const labels = {
      card: 'Card',
      bank_transfer: 'Bank Transfer',
      paypal: 'PayPal',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay',
    };
    return labels[method];
  };

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'User', 'Therapist', 'Appointment ID', 'Amount', 'Payment Method', 'Status', 'Date'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.userName,
      t.therapistName || '-',
      t.appointmentId || '-',
      `$${(t.amount / 100).toFixed(2)}`,
      getPaymentMethodLabel(t.paymentMethod),
      t.status,
      formatDate(t.createdAt),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // For Excel, we'll create a more formatted CSV that Excel can open
    const headers = ['Transaction ID', 'User Name', 'User Email', 'Therapist', 'Appointment ID', 'Amount', 'Currency', 'Payment Method', 'Card Last 4', 'Stripe ID', 'Status', 'Platform Fee', 'Therapist Earnings', 'Description', 'Date'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.userName,
      t.userEmail,
      t.therapistName || '',
      t.appointmentId || '',
      (t.amount / 100).toFixed(2),
      t.currency,
      getPaymentMethodLabel(t.paymentMethod),
      t.cardLast4 || '',
      t.stripeTransactionId,
      t.status,
      (t.platformFee / 100).toFixed(2),
      t.therapistEarnings ? (t.therapistEarnings / 100).toFixed(2) : '',
      t.description,
      formatDate(t.createdAt),
    ]);

    const csv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefund = (transactionId: string, amount: number, reason: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: amount === t.amount ? 'refunded' : 'partially_refunded',
              refundAmount: amount,
              refundReason: reason,
              refundedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setSelectedTransaction(null);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setMethodFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const hasActiveFilters = search || statusFilter !== 'all' || methodFilter !== 'all' || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">
            {transactions.length} transactions • {formatCurrency(stats.totalRevenue / 100)} total revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPayoutManagement(true)}
            className="btn btn-secondary"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Payouts
          </button>
          <button
            onClick={() => setShowRevenueReports(true)}
            className="btn btn-primary"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Revenue Reports
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue / 100)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Platform Fees</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalPlatformFees / 100)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <RotateCcw className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Refunded</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalRefunded / 100)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Failed Transactions</p>
              <p className="text-xl font-bold text-gray-900">{stats.failedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID, User, or Therapist..."
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
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                Active
              </span>
            )}
          </button>
          <div className="relative group">
            <button className="btn btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={exportToCSV}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={exportToExcel}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
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
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="partially_refunded">Partial Refund</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment Method</label>
              <select
                className="input"
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Methods</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="apple_pay">Apple Pay</option>
                <option value="google_pay">Google Pay</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
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
              <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
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
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
        </span>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapist</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Amount
                    {getSortIcon('amount')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Date
                    {getSortIcon('createdAt')}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{transaction.id}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.userName}</p>
                      <p className="text-xs text-gray-500">{transaction.userId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {transaction.therapistName ? (
                      <div>
                        <p className="text-sm text-gray-900">{transaction.therapistName}</p>
                        <p className="text-xs text-gray-500">{transaction.therapistId}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {transaction.appointmentId ? (
                      <span className="text-sm font-mono text-gray-600">{transaction.appointmentId}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.amount / 100)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                      {transaction.cardLast4 && (
                        <span className="text-gray-400"> •••• {transaction.cardLast4}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedTransactions.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-sm',
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100'
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
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onRefund={handleRefund}
        />
      )}

      {showRevenueReports && (
        <RevenueReportsModal
          transactions={transactions}
          onClose={() => setShowRevenueReports(false)}
        />
      )}

      {showPayoutManagement && (
        <PayoutManagementModal
          onClose={() => setShowPayoutManagement(false)}
        />
      )}
    </div>
  );
}
