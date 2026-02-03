import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  CreditCard,
  UserPlus,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';

// Mock data
const overviewStats = [
  {
    name: 'Total Users',
    value: '12,345',
    icon: Users,
    change: '+12%',
    trend: 'up',
    color: 'bg-blue-500',
  },
  {
    name: 'Total Therapists',
    value: '234',
    icon: Stethoscope,
    change: '+5%',
    trend: 'up',
    color: 'bg-green-500',
  },
  {
    name: 'Active Appointments',
    value: '89',
    icon: Calendar,
    change: '+18%',
    trend: 'up',
    color: 'bg-purple-500',
  },
];

const revenueStats = {
  today: { value: 4520, change: '+8%', trend: 'up' },
  thisWeek: { value: 28750, change: '+15%', trend: 'up' },
  thisMonth: { value: 125430, change: '+23%', trend: 'up' },
};

const userGrowthData = [
  { month: 'Aug', users: 8500 },
  { month: 'Sep', users: 9200 },
  { month: 'Oct', users: 10100 },
  { month: 'Nov', users: 11200 },
  { month: 'Dec', users: 11800 },
  { month: 'Jan', users: 12345 },
];

const revenueData = [
  { month: 'Aug', revenue: 85000 },
  { month: 'Sep', revenue: 92000 },
  { month: 'Oct', revenue: 98000 },
  { month: 'Nov', revenue: 110000 },
  { month: 'Dec', revenue: 118000 },
  { month: 'Jan', revenue: 125430 },
];

const appointmentStats = [
  { name: 'Completed', value: 456, color: 'bg-green-500' },
  { name: 'Scheduled', value: 89, color: 'bg-blue-500' },
  { name: 'Cancelled', value: 23, color: 'bg-red-500' },
  { name: 'No-show', value: 12, color: 'bg-yellow-500' },
];

const recentActivities = [
  { type: 'registration', message: 'New user registered: john.doe@email.com', time: '2 min ago', icon: UserPlus },
  { type: 'verification', message: 'Dr. Sarah Smith completed verification', time: '15 min ago', icon: CheckCircle },
  { type: 'booking', message: 'New appointment booked (#APT-1234)', time: '32 min ago', icon: Calendar },
  { type: 'payment', message: 'Payment received: $120.00', time: '1 hr ago', icon: CreditCard },
  { type: 'registration', message: 'New user registered: jane.smith@email.com', time: '1.5 hr ago', icon: UserPlus },
  { type: 'verification', message: 'New therapist application: Dr. Mike Johnson', time: '2 hr ago', icon: Stethoscope },
];

const pendingVerifications = [
  { id: 1, name: 'Dr. Emily Brown', specialty: 'Psychologist', date: '2024-01-07' },
  { id: 2, name: 'Dr. James Wilson', specialty: 'Therapist', date: '2024-01-07' },
  { id: 3, name: 'Dr. Lisa Chen', specialty: 'Counselor', date: '2024-01-06' },
];

const recentBookings = [
  { id: 'APT-1234', patient: 'John D.', therapist: 'Dr. Smith', date: 'Jan 8, 2:00 PM', status: 'confirmed' },
  { id: 'APT-1235', patient: 'Sarah M.', therapist: 'Dr. Johnson', date: 'Jan 8, 3:30 PM', status: 'pending' },
  { id: 'APT-1236', patient: 'Mike R.', therapist: 'Dr. Chen', date: 'Jan 9, 10:00 AM', status: 'confirmed' },
];

const quickLinks = [
  { name: 'Verify Therapists', href: '/therapists/pending', icon: CheckCircle, count: 3 },
  { name: 'View Payments', href: '/payments', icon: CreditCard, count: null },
  { name: 'Manage Users', href: '/users', icon: Users, count: null },
  { name: 'Appointments', href: '/appointments', icon: Calendar, count: 89 },
];

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 5 minutes (mock real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary text-sm flex items-center gap-2"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <div className="p-2 bg-primary-50 rounded-lg">
              <link.icon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{link.name}</p>
              {link.count !== null && (
                <p className="text-xs text-gray-500">{link.count} items</p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overviewStats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center justify-between">
              <div className={cn(stat.color, 'p-3 rounded-lg')}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={cn(
                  'flex items-center text-sm font-medium',
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today</span>
              <span className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {revenueStats.today.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(revenueStats.today.value)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {revenueStats.thisWeek.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(revenueStats.thisWeek.value)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {revenueStats.thisMonth.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(revenueStats.thisMonth.value)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
          <div className="h-48">
            <SimpleBarChart data={userGrowthData} dataKey="users" color="bg-blue-500" />
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-48">
            <SimpleBarChart data={revenueData} dataKey="revenue" color="bg-green-500" formatValue={formatCurrency} />
          </div>
        </div>
      </div>

      {/* Appointment Stats */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {appointmentStats.map((stat) => (
            <div key={stat.name} className="text-center">
              <div className={cn('w-16 h-16 mx-auto rounded-full flex items-center justify-center', stat.color)}>
                <span className="text-xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="px-6 py-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-gray-100 rounded-full">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activity.message}</p>
                    <span className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all activity
            </button>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Verifications</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingVerifications.map((therapist) => (
              <div key={therapist.id} className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{therapist.name}</p>
                    <p className="text-xs text-gray-500">{therapist.specialty}</p>
                  </div>
                  <button className="btn btn-primary text-xs px-3 py-1">Review</button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/therapists/pending"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all pending ({pendingVerifications.length})
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.patient}</p>
                    <p className="text-xs text-gray-500">
                      {booking.therapist} • {booking.date}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/appointments"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Bar Chart Component (no external dependencies)
interface ChartData {
  month: string;
  [key: string]: string | number;
}

function SimpleBarChart({
  data,
  dataKey,
  color,
  formatValue,
}: {
  data: ChartData[];
  dataKey: string;
  color: string;
  formatValue?: (value: number) => string;
}) {
  const maxValue = Math.max(...data.map((d) => d[dataKey] as number));

  return (
    <div className="flex items-end justify-between h-full gap-2">
      {data.map((item, index) => {
        const value = item[dataKey] as number;
        const height = (value / maxValue) * 100;

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-end h-36">
              <span className="text-xs text-gray-500 mb-1">
                {formatValue ? formatValue(value) : value.toLocaleString()}
              </span>
              <div
                className={cn(color, 'w-full rounded-t-md transition-all duration-300')}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}
