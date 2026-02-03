import { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Filter,
  Download,
  Flag,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Stethoscope,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { cn, formatDate, formatDateTime } from '../../lib/utils';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  therapistId: string;
  therapistName: string;
  appointmentId: string;
  appointmentDate: string;
  rating: number;
  feedbackText: string;
  submittedAt: string;
  isFlagged: boolean;
  isHidden: boolean;
  flagReason: string | null;
}

// Generate mock feedback
const generateMockFeedback = (): Feedback[] => {
  const userNames = ['John Smith', 'Jane Doe', 'Michael Brown', 'Emily Chen', 'David Wilson', 'Sarah Johnson', 'Robert Taylor', 'Amanda White'];
  const therapistNames = [
    'Dr. Sarah Smith', 'Dr. Michael Brown', 'Dr. Emily Chen', 'Dr. James Wilson',
    'Dr. Lisa Johnson', 'Dr. David Lee', 'Dr. Jennifer Garcia', 'Dr. Robert Miller',
  ];
  const feedbackTexts = [
    'Great session! Dr. Smith was very understanding and helped me work through my anxiety. Highly recommend.',
    'Very professional and attentive. The video call quality was excellent.',
    'Good session overall. Would have liked more time to discuss coping strategies.',
    'Excellent therapist! Made me feel comfortable from the start.',
    'The session was helpful but felt a bit rushed at the end.',
    'Amazing experience. Dr. Chen really listens and provides valuable insights.',
    'Decent session. Some technical issues with the video but the therapist handled it well.',
    'Very supportive and non-judgmental. Exactly what I needed.',
    'Helpful advice on managing stress at work. Will definitely book again.',
    'The therapist was late to the session which was disappointing.',
    'Wonderful session! Learned new techniques for dealing with depression.',
    'Average experience. Expected more personalized advice.',
    'Incredible support during a difficult time. Thank you!',
    'Good listener but could improve on providing actionable steps.',
    'Perfect session. Felt heard and understood throughout.',
  ];
  const inappropriateFeedback = [
    'This therapist is useless and a waste of money! Complete scam!',
    'Worst experience ever. The therapist seemed distracted and unprofessional.',
  ];

  const feedback: Feedback[] = [];

  for (let i = 0; i < 100; i++) {
    const isInappropriate = Math.random() < 0.05;
    const rating = isInappropriate ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3;
    const appointmentDate = new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000));
    const submittedAt = new Date(appointmentDate.getTime() + Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000));

    feedback.push({
      id: `FBK-${String(i + 1).padStart(5, '0')}`,
      userId: `USR-${String(Math.floor(Math.random() * 150) + 1).padStart(3, '0')}`,
      userName: userNames[Math.floor(Math.random() * userNames.length)],
      userEmail: userNames[Math.floor(Math.random() * userNames.length)].toLowerCase().replace(/\s+/g, '.') + '@example.com',
      therapistId: `THP-${String(Math.floor(Math.random() * 120) + 1).padStart(3, '0')}`,
      therapistName: therapistNames[Math.floor(Math.random() * therapistNames.length)],
      appointmentId: `APT-${String(Math.floor(Math.random() * 500) + 1).padStart(5, '0')}`,
      appointmentDate: appointmentDate.toISOString(),
      rating,
      feedbackText: isInappropriate
        ? inappropriateFeedback[Math.floor(Math.random() * inappropriateFeedback.length)]
        : feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)],
      submittedAt: submittedAt.toISOString(),
      isFlagged: isInappropriate,
      isHidden: false,
      flagReason: isInappropriate ? 'Inappropriate language' : null,
    });
  }

  return feedback.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
};

const mockFeedback = generateMockFeedback();

export default function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(mockFeedback);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [therapistFilter, setTherapistFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [flagReason, setFlagReason] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get unique therapists for filter
  const therapists = useMemo(() => {
    const unique = [...new Set(feedbackList.map((f) => f.therapistName))];
    return unique.sort();
  }, [feedbackList]);

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    let filtered = [...feedbackList];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.userName.toLowerCase().includes(searchLower) ||
          f.therapistName.toLowerCase().includes(searchLower) ||
          f.feedbackText.toLowerCase().includes(searchLower)
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter((f) => f.rating === parseInt(ratingFilter));
    }

    if (therapistFilter !== 'all') {
      filtered = filtered.filter((f) => f.therapistName === therapistFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter((f) => new Date(f.submittedAt) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((f) => new Date(f.submittedAt) <= new Date(dateTo + 'T23:59:59'));
    }

    if (showFlaggedOnly) {
      filtered = filtered.filter((f) => f.isFlagged);
    }

    return filtered;
  }, [feedbackList, search, ratingFilter, therapistFilter, dateFrom, dateTo, showFlaggedOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const total = feedbackList.length;
    const avgRating = feedbackList.reduce((sum, f) => sum + f.rating, 0) / total;
    const fiveStars = feedbackList.filter((f) => f.rating === 5).length;
    const flagged = feedbackList.filter((f) => f.isFlagged).length;

    return { total, avgRating, fiveStars, flagged };
  }, [feedbackList]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  const handleFlagFeedback = (feedbackId: string, reason: string) => {
    setFeedbackList((prev) =>
      prev.map((f) =>
        f.id === feedbackId
          ? { ...f, isFlagged: true, flagReason: reason }
          : f
      )
    );
    setSelectedFeedback(null);
    setFlagReason('');
  };

  const handleToggleHidden = (feedbackId: string) => {
    setFeedbackList((prev) =>
      prev.map((f) =>
        f.id === feedbackId
          ? { ...f, isHidden: !f.isHidden }
          : f
      )
    );
  };

  const handleUnflag = (feedbackId: string) => {
    setFeedbackList((prev) =>
      prev.map((f) =>
        f.id === feedbackId
          ? { ...f, isFlagged: false, flagReason: null }
          : f
      )
    );
  };

  const exportToCSV = () => {
    const headers = ['Feedback ID', 'User Name', 'User Email', 'Therapist', 'Appointment Date', 'Rating', 'Feedback', 'Submitted At', 'Flagged', 'Hidden'];
    const rows = filteredFeedback.map((f) => [
      f.id,
      f.userName,
      f.userEmail,
      f.therapistName,
      formatDate(f.appointmentDate),
      f.rating.toString(),
      `"${f.feedbackText.replace(/"/g, '""')}"`,
      formatDate(f.submittedAt),
      f.isFlagged ? 'Yes' : 'No',
      f.isHidden ? 'Yes' : 'No',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Feedback</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Star className="h-5 w-5 text-green-600 fill-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.fiveStars}</p>
            <p className="text-sm text-gray-500">5-Star Reviews</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Flag className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
            <p className="text-sm text-gray-500">Flagged</p>
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
              placeholder="Search by user name, therapist, or feedback text..."
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
          <button
            onClick={() => {
              setShowFlaggedOnly(!showFlaggedOnly);
              setCurrentPage(1);
            }}
            className={cn('btn', showFlaggedOnly ? 'btn-primary' : 'btn-secondary')}
          >
            <Flag className="h-4 w-4 mr-2" />
            Flagged Only
          </button>
          <button onClick={exportToCSV} className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
              <select
                className="input"
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Therapist</label>
              <select
                className="input"
                value={therapistFilter}
                onChange={(e) => {
                  setTherapistFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Therapists</option>
                {therapists.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
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
          </div>
        )}
      </div>

      {/* Feedback Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapist</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedFeedback.map((feedback) => (
              <tr
                key={feedback.id}
                className={cn(
                  'hover:bg-gray-50',
                  feedback.isFlagged && 'bg-red-50/50',
                  feedback.isHidden && 'opacity-50'
                )}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{feedback.userName}</p>
                      <p className="text-xs text-gray-500">{feedback.userId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-900">{feedback.therapistName}</p>
                      <p className="text-xs text-gray-500">{feedback.therapistId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-mono text-gray-600">{feedback.appointmentId}</p>
                    <p className="text-xs text-gray-500">{formatDate(feedback.appointmentDate)}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {renderStars(feedback.rating)}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-700 truncate max-w-xs">{feedback.feedbackText}</p>
                  {feedback.isFlagged && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                      <Flag className="h-3 w-3" />
                      Flagged
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500">{formatDate(feedback.submittedAt)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleHidden(feedback.id)}
                      className={cn(
                        'p-2 rounded-lg',
                        feedback.isHidden
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      )}
                      title={feedback.isHidden ? 'Show' : 'Hide'}
                    >
                      {feedback.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    {!feedback.isFlagged ? (
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Flag"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnflag(feedback.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                        title="Unflag"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedFeedback.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No feedback found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredFeedback.length)} of {filteredFeedback.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Feedback Details</h2>
                  <p className="text-sm text-gray-500">{selectedFeedback.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setFlagReason('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
                {renderStars(selectedFeedback.rating, 'md')}
                <span className="text-lg font-bold text-gray-900 ml-2">{selectedFeedback.rating}/5</span>
              </div>

              {/* User & Therapist */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-500">User</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedFeedback.userName}</p>
                  <p className="text-xs text-gray-500">{selectedFeedback.userEmail}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-500">Therapist</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedFeedback.therapistName}</p>
                  <p className="text-xs text-gray-500">{selectedFeedback.therapistId}</p>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Appointment</span>
                </div>
                <p className="text-sm text-gray-900">
                  {selectedFeedback.appointmentId} • {formatDate(selectedFeedback.appointmentDate)}
                </p>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {selectedFeedback.feedbackText}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Submitted on {formatDateTime(selectedFeedback.submittedAt)}
                </p>
              </div>

              {/* Flagged Status */}
              {selectedFeedback.isFlagged && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Flagged</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">Reason: {selectedFeedback.flagReason}</p>
                </div>
              )}

              {/* Flag Form */}
              {!selectedFeedback.isFlagged && (
                <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Flag Inappropriate Feedback</span>
                  </div>
                  <select
                    className="input w-full"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    <option value="Inappropriate language">Inappropriate language</option>
                    <option value="Harassment or abuse">Harassment or abuse</option>
                    <option value="Spam or fake review">Spam or fake review</option>
                    <option value="Personal information">Contains personal information</option>
                    <option value="Defamatory content">Defamatory content</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    onClick={() => handleFlagFeedback(selectedFeedback.id, flagReason)}
                    disabled={!flagReason}
                    className="btn bg-red-600 text-white hover:bg-red-700 w-full disabled:opacity-50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag & Hide Feedback
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleToggleHidden(selectedFeedback.id)}
                className="btn btn-secondary"
              >
                {selectedFeedback.isHidden ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Feedback
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Feedback
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setFlagReason('');
                }}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
