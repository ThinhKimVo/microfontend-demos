import { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  Filter,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import type { Appointment } from './AppointmentsList';

interface AppointmentAnalyticsModalProps {
  appointments: Appointment[];
  onClose: () => void;
}

export default function AppointmentAnalyticsModal({
  appointments,
  onClose,
}: AppointmentAnalyticsModalProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Get unique values for filters
  const therapists = useMemo(() => [...new Set(appointments.map(a => a.therapistName))].sort(), [appointments]);
  const specialties = useMemo(() => [...new Set(appointments.map(a => a.therapistSpecialty))].sort(), [appointments]);

  // Filter appointments based on selections
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (dateRange !== 'all') {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter(a => new Date(a.date) >= cutoff);
    }

    if (selectedTherapist) {
      result = result.filter(a => a.therapistName === selectedTherapist);
    }

    if (selectedSpecialty) {
      result = result.filter(a => a.therapistSpecialty === selectedSpecialty);
    }

    return result;
  }, [appointments, dateRange, selectedTherapist, selectedSpecialty]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredAppointments.length;
    const completed = filteredAppointments.filter(a => a.status === 'completed').length;
    const cancelled = filteredAppointments.filter(a => a.status === 'cancelled').length;
    const noShow = filteredAppointments.filter(a => a.status === 'no_show').length;
    const totalDuration = filteredAppointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.duration, 0);
    const revenue = filteredAppointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.amount, 0);

    return {
      total,
      completed,
      cancelled,
      noShow,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0,
      noShowRate: total > 0 ? Math.round((noShow / total) * 100) : 0,
      avgDuration: completed > 0 ? Math.round(totalDuration / completed) : 0,
      revenue,
    };
  }, [filteredAppointments]);

  // Daily appointments chart data
  const dailyData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 60;
    const data: { date: string; count: number; revenue: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayAppointments = filteredAppointments.filter(
        a => a.date.split('T')[0] === dateStr
      );

      data.push({
        date: dateStr,
        count: dayAppointments.length,
        revenue: dayAppointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.amount, 0),
      });
    }

    return data;
  }, [filteredAppointments, dateRange]);

  // Peak hours heatmap data
  const peakHoursData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const heatmap: number[][] = days.map(() => hours.map(() => 0));

    filteredAppointments.forEach(apt => {
      const date = new Date(apt.date);
      const dayIndex = (date.getDay() + 6) % 7; // Monday = 0
      const hour = parseInt(apt.time.split(':')[0]);
      const hourIndex = hour - 8;

      if (hourIndex >= 0 && hourIndex < 12) {
        heatmap[dayIndex][hourIndex]++;
      }
    });

    return { hours, days, heatmap };
  }, [filteredAppointments]);

  const maxHeatmapValue = Math.max(...peakHoursData.heatmap.flat(), 1);

  const getHeatmapColor = (value: number) => {
    const intensity = value / maxHeatmapValue;
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.25) return 'bg-green-100';
    if (intensity < 0.5) return 'bg-green-300';
    if (intensity < 0.75) return 'bg-green-500';
    return 'bg-green-700';
  };

  const handleExport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      dateRange,
      filters: { therapist: selectedTherapist, specialty: selectedSpecialty },
      metrics,
      dailyData: dailyData.slice(-7),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Appointment Analytics</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn btn-secondary text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex gap-1">
              {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    dateRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {range === 'all' ? 'All Time' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
            <select
              className="input text-sm py-1"
              value={selectedTherapist}
              onChange={(e) => setSelectedTherapist(e.target.value)}
            >
              <option value="">All Therapists</option>
              {therapists.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="input text-sm py-1"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Completed</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completed}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{metrics.cancelled}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">No-Show</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.noShow}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completionRate}%</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Cancellation Rate</p>
              <p className="text-2xl font-bold text-red-600">{metrics.cancellationRate}%</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgDuration}m</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.revenue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Per Day Chart */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Appointments Per Day</h3>
              <div className="h-48">
                <SimpleBarChart
                  data={dailyData.slice(-14)}
                  dataKey="count"
                  color="bg-blue-500"
                  labelKey="date"
                />
              </div>
            </div>

            {/* Revenue Per Day Chart */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Per Day</h3>
              <div className="h-48">
                <SimpleBarChart
                  data={dailyData.slice(-14)}
                  dataKey="revenue"
                  color="bg-green-500"
                  labelKey="date"
                  formatValue={formatCurrency}
                />
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Distribution</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 flex rounded-full overflow-hidden bg-gray-200">
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${metrics.completionRate}%` }}
                  />
                  <div
                    className="bg-red-500 transition-all"
                    style={{ width: `${metrics.cancellationRate}%` }}
                  />
                  <div
                    className="bg-yellow-500 transition-all"
                    style={{ width: `${metrics.noShowRate}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Completed ({metrics.completionRate}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>Cancelled ({metrics.cancellationRate}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded" />
                  <span>No-Show ({metrics.noShowRate}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hours Heatmap */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              <Clock className="h-4 w-4 inline mr-2" />
              Peak Hours Heatmap
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-1 text-xs text-gray-500"></th>
                    {peakHoursData.hours.map((hour) => (
                      <th key={hour} className="p-1 text-xs text-gray-500 text-center">
                        {hour}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {peakHoursData.days.map((day, dayIndex) => (
                    <tr key={day}>
                      <td className="p-1 text-xs text-gray-500 font-medium">{day}</td>
                      {peakHoursData.heatmap[dayIndex].map((value, hourIndex) => (
                        <td key={hourIndex} className="p-1">
                          <div
                            className={cn(
                              'w-8 h-8 rounded flex items-center justify-center text-xs',
                              getHeatmapColor(value),
                              value > maxHeatmapValue * 0.5 ? 'text-white' : 'text-gray-600'
                            )}
                            title={`${peakHoursData.days[dayIndex]} ${peakHoursData.hours[hourIndex]}:00 - ${value} appointments`}
                          >
                            {value > 0 ? value : ''}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <div className="w-4 h-4 bg-green-100 rounded" />
                <div className="w-4 h-4 bg-green-300 rounded" />
                <div className="w-4 h-4 bg-green-500 rounded" />
                <div className="w-4 h-4 bg-green-700 rounded" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Bar Chart Component
function SimpleBarChart({
  data,
  dataKey,
  color,
  labelKey,
  formatValue,
}: {
  data: Record<string, any>[];
  dataKey: string;
  color: string;
  labelKey: string;
  formatValue?: (value: number) => string;
}) {
  const maxValue = Math.max(...data.map((d) => d[dataKey]), 1);
  const displayData = data.length > 14 ? data.slice(-14) : data;

  return (
    <div className="flex items-end justify-between h-full gap-1">
      {displayData.map((item, index) => {
        const value = item[dataKey];
        const height = (value / maxValue) * 100;
        const label = item[labelKey];
        const displayLabel = typeof label === 'string' && label.includes('-')
          ? label.split('-').slice(1).join('/')
          : label;

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="w-full flex flex-col items-center justify-end h-32">
              <span className="text-[10px] text-gray-500 mb-1 truncate max-w-full">
                {formatValue ? formatValue(value) : value}
              </span>
              <div
                className={cn(color, 'w-full rounded-t transition-all duration-300 min-h-[2px]')}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 truncate max-w-full">{displayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}
