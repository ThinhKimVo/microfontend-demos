import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Stethoscope, Calendar, DollarSign,
  TrendingUp, Clock, CheckCircle, CreditCard,
  UserPlus, ArrowRight, RefreshCw,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { getDashboard } from '../../services/admin';

export default function Dashboard() {
  const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    refetchInterval: 5 * 60 * 1000,
  });

  const stats = data?.stats;
  const revenue = data?.revenue;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-4">
          {dataUpdatedAt > 0 && (
            <span className="text-xs text-gray-400">
              Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn-secondary text-sm flex items-center gap-2"
          >
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { name: 'Verify Therapists', href: '/therapists', icon: CheckCircle, count: stats?.pendingVerifications },
          { name: 'View Payments', href: '/payments', icon: CreditCard, count: null },
          { name: 'Manage Users', href: '/users', icon: Users, count: null },
          { name: 'Appointments', href: '/appointments', icon: Calendar, count: stats?.pendingAppointments },
        ].map((link) => (
          <Link key={link.name} to={link.href} className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <link.icon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{link.name}</p>
              {link.count != null && <p className="text-xs text-gray-500">{link.count} items</p>}
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Overview Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="card p-6 h-28 animate-pulse bg-gray-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Total Users', value: stats?.totalUsers?.toLocaleString(), icon: Users, color: 'bg-blue-500' },
            { name: 'Active Therapists', value: stats?.totalTherapists?.toLocaleString(), icon: Stethoscope, color: 'bg-green-500' },
            { name: 'Pending Appointments', value: stats?.pendingAppointments?.toLocaleString(), icon: Calendar, color: 'bg-purple-500' },
          ].map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between">
                <div className={cn(stat.color, 'p-3 rounded-lg')}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value ?? '—'}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Stats */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Today', value: revenue?.today, bg: 'bg-green-50' },
            { label: 'This Week', value: revenue?.thisWeek, bg: 'bg-blue-50' },
            { label: 'This Month', value: revenue?.thisMonth, bg: 'bg-purple-50' },
          ].map((r) => (
            <div key={r.label} className={cn('p-4 rounded-lg', r.bg)}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{r.label}</span>
                <TrendingUp className="h-3 w-3 text-green-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {isLoading ? '—' : formatCurrency((r.value || 0) / 100)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Stats */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { name: 'Completed', value: stats?.completedAppointments, color: 'bg-green-500' },
            { name: 'Pending', value: stats?.pendingAppointments, color: 'bg-blue-500' },
            { name: 'Cancelled', value: stats?.cancelledAppointments, color: 'bg-red-500' },
            { name: 'Total', value: stats?.totalAppointments, color: 'bg-gray-500' },
          ].map((s) => (
            <div key={s.name} className="text-center">
              <div className={cn('w-16 h-16 mx-auto rounded-full flex items-center justify-center', s.color)}>
                <span className="text-xl font-bold text-white">{isLoading ? '—' : (s.value ?? 0)}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Verifications */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Verifications</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="px-6 py-8 text-center text-gray-400">Loading...</div>
            ) : data?.pendingTherapists?.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">No pending verifications</div>
            ) : (
              data?.pendingTherapists?.map((t: any) => (
                <div key={t.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.user.firstName} {t.user.lastName}</p>
                    <p className="text-xs text-gray-500">{t.specializations?.[0]?.specialization?.name || 'Therapist'}</p>
                  </div>
                  <Link to="/therapists" className="btn btn-primary text-xs px-3 py-1">Review</Link>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link to="/therapists" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all pending ({stats?.pendingVerifications ?? 0})
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="px-6 py-8 text-center text-gray-400">Loading...</div>
            ) : data?.recentBookings?.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">No bookings yet</div>
            ) : (
              data?.recentBookings?.map((b: any) => (
                <div key={b.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.user?.firstName} {b.user?.lastName}</p>
                    <p className="text-xs text-gray-500">
                      Dr. {b.therapist?.user?.firstName} {b.therapist?.user?.lastName} •{' '}
                      {new Date(b.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {b.status.toLowerCase()}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link to="/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
