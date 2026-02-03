import { useState, useMemo } from 'react';
import {
  X,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Calculator,
  FileText,
  Calendar,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import type { Transaction } from './PaymentsList';

interface RevenueReportsModalProps {
  transactions: Transaction[];
  onClose: () => void;
}

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

// Simple bar chart component
function BarChart({ data, maxValue, color = 'primary' }: { data: { label: string; value: number }[]; maxValue: number; color?: string }) {
  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-16 text-right truncate">{item.label}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', colorClasses[color as keyof typeof colorClasses] || colorClasses.primary)}
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 w-20">{formatCurrency(item.value / 100)}</span>
        </div>
      ))}
    </div>
  );
}

// Simple line chart component
function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#gradient)" opacity="0.3" />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 100;
          return <circle key={i} cx={x} cy={y} r="2" fill="#3b82f6" />;
        })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} className="text-xs text-gray-500">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// Simple pie chart component
function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let currentAngle = 0;

  const segments = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (currentAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...d,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: ((d.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg className="w-32 h-32" viewBox="0 0 100 100">
        {segments.map((segment, i) => (
          <path key={i} d={segment.path} fill={segment.color} className="hover:opacity-80 transition-opacity" />
        ))}
      </svg>
      <div className="flex-1 space-y-2">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm text-gray-600 flex-1 truncate">{segment.label}</span>
            <span className="text-sm font-medium text-gray-900">{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RevenueReportsModal({ transactions, onClose }: RevenueReportsModalProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return transactions.filter((t) => t.status === 'success');
    }

    return transactions.filter(
      (t) => t.status === 'success' && new Date(t.createdAt) >= startDate
    );
  }, [transactions, dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const grossRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const platformCommission = filteredTransactions.reduce((sum, t) => sum + t.platformFee, 0);
    const netRevenue = filteredTransactions.reduce((sum, t) => sum + (t.therapistEarnings || 0), 0);
    const totalTransactions = filteredTransactions.length;
    const avgTransactionValue = totalTransactions > 0 ? grossRevenue / totalTransactions : 0;

    return {
      grossRevenue,
      platformCommission,
      netRevenue,
      totalTransactions,
      avgTransactionValue,
    };
  }, [filteredTransactions]);

  // Revenue over time data
  const revenueOverTime = useMemo(() => {
    const groupedByDay = new Map<string, number>();
    const now = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 30;

    // Initialize all days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0];
      groupedByDay.set(key, 0);
    }

    // Sum revenue by day
    filteredTransactions.forEach((t) => {
      const key = t.createdAt.split('T')[0];
      if (groupedByDay.has(key)) {
        groupedByDay.set(key, (groupedByDay.get(key) || 0) + t.amount);
      }
    });

    return Array.from(groupedByDay.entries()).map(([date, value]) => ({
      label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value,
    }));
  }, [filteredTransactions, dateRange]);

  // Revenue by specialization (using description as proxy)
  const revenueBySpecialization = useMemo(() => {
    const grouped = new Map<string, number>();
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    filteredTransactions.forEach((t) => {
      const spec = t.description.includes('Group') ? 'Group Therapy' :
                   t.description.includes('Package') ? 'Package' :
                   t.description.includes('Initial') ? 'Initial Assessment' :
                   t.description.includes('Follow-up') ? 'Follow-up' :
                   t.description.includes('Emergency') ? 'Emergency' :
                   'Consultation';
      grouped.set(spec, (grouped.get(spec) || 0) + t.amount);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length],
      }));
  }, [filteredTransactions]);

  // Top therapists by revenue
  const topTherapists = useMemo(() => {
    const grouped = new Map<string, number>();

    filteredTransactions.forEach((t) => {
      if (t.therapistName) {
        grouped.set(t.therapistName, (grouped.get(t.therapistName) || 0) + t.amount);
      }
    });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }));
  }, [filteredTransactions]);

  const maxTherapistRevenue = Math.max(...topTherapists.map((t) => t.value), 1);

  const exportToPDF = () => {
    // In a real app, this would generate a proper PDF
    const content = `
REVENUE REPORT
==============

Date Range: ${dateRange === 'all' ? 'All Time' : `Last ${dateRange}`}
Generated: ${new Date().toLocaleString()}

KEY METRICS
-----------
Gross Revenue: ${formatCurrency(metrics.grossRevenue / 100)}
Platform Commission (15%): ${formatCurrency(metrics.platformCommission / 100)}
Net Revenue (to Therapists): ${formatCurrency(metrics.netRevenue / 100)}
Total Transactions: ${metrics.totalTransactions}
Average Transaction Value: ${formatCurrency(metrics.avgTransactionValue / 100)}

TOP THERAPISTS BY REVENUE
-------------------------
${topTherapists.map((t, i) => `${i + 1}. ${t.label}: ${formatCurrency(t.value / 100)}`).join('\n')}

---
Healthcare Admin Platform
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Transaction ID', 'Amount', 'Platform Fee', 'Therapist Earnings', 'Therapist', 'Description'];
    const rows = filteredTransactions.map((t) => [
      t.createdAt.split('T')[0],
      t.id,
      (t.amount / 100).toFixed(2),
      (t.platformFee / 100).toFixed(2),
      t.therapistEarnings ? (t.therapistEarnings / 100).toFixed(2) : '',
      t.therapistName || '',
      t.description,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-data-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Reports</h2>
              <p className="text-sm text-gray-500">Financial performance and analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
              <div className="flex gap-1">
                {(['7d', '30d', '90d', '1y', 'all'] as DateRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={cn(
                      'px-3 py-1 text-sm rounded-lg transition-colors',
                      dateRange === range
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    )}
                  >
                    {range === '7d' ? '7 Days' :
                     range === '30d' ? '30 Days' :
                     range === '90d' ? '90 Days' :
                     range === '1y' ? '1 Year' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportToPDF} className="btn btn-secondary text-sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button onClick={exportToCSV} className="btn btn-secondary text-sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-500">Gross Revenue</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.grossRevenue / 100)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-primary-600" />
                <span className="text-xs text-gray-500">Platform Commission</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.platformCommission / 100)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-500">Net Revenue</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.netRevenue / 100)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-500">Total Transactions</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{metrics.totalTransactions}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-gray-500">Avg Transaction</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.avgTransactionValue / 100)}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Over Time */}
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Revenue Over Time</h3>
              <LineChart data={revenueOverTime} />
            </div>

            {/* Revenue by Specialization */}
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Revenue by Service Type</h3>
              {revenueBySpecialization.length > 0 ? (
                <PieChart data={revenueBySpecialization} />
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Top Therapists */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Top Therapists by Revenue</h3>
            {topTherapists.length > 0 ? (
              <BarChart data={topTherapists} maxValue={maxTherapistRevenue} color="green" />
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

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
