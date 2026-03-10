import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { getReviews, flagReview, unflagReview, toggleHideReview } from '../../services/admin';

interface Review {
  id: string;
  rating: number;
  feedback: string | null;
  tags: string[];
  isAnonymous: boolean;
  isFlagged: boolean;
  isHidden: boolean;
  flagReason: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  therapist: { id: string; user: { firstName: string; lastName: string } };
  appointment: { id: string; scheduledAt: string };
}

export default function FeedbackManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', currentPage, search, ratingFilter, showFlaggedOnly, dateFrom, dateTo],
    queryFn: () => getReviews({
      page: currentPage,
      limit: 20,
      search: search || undefined,
      rating: ratingFilter ? parseInt(ratingFilter) : undefined,
      isFlagged: showFlaggedOnly ? true : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
  });

  const reviews: Review[] = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });

  const { mutate: doFlag } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => flagReview(id, reason),
    onSuccess: () => { invalidate(); setSelectedReview(null); setFlagReason(''); },
  });

  const { mutate: doUnflag } = useMutation({
    mutationFn: unflagReview,
    onSuccess: invalidate,
  });

  const { mutate: doToggleHide } = useMutation({
    mutationFn: toggleHideReview,
    onSuccess: invalidate,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => (
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

  const exportToCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Therapist', 'Appointment Date', 'Rating', 'Feedback', 'Submitted', 'Flagged', 'Hidden'];
    const rows = reviews.map((r) => [
      r.id,
      `${r.user.firstName} ${r.user.lastName}`,
      r.user.email,
      `Dr. ${r.therapist.user.firstName} ${r.therapist.user.lastName}`,
      formatDate(r.appointment.scheduledAt),
      r.rating.toString(),
      `"${(r.feedback || '').replace(/"/g, '""')}"`,
      formatDate(r.createdAt),
      r.isFlagged ? 'Yes' : 'No',
      r.isHidden ? 'Yes' : 'No',
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
            <p className="text-2xl font-bold text-gray-900">{stats?.total ?? 0}</p>
            <p className="text-sm text-gray-500">Total Feedback</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{(stats?.avgRating ?? 0).toFixed(1)}</p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Star className="h-5 w-5 text-green-600 fill-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.fiveStarCount ?? 0}</p>
            <p className="text-sm text-gray-500">5-Star Reviews</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Flag className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.flaggedCount ?? 0}</p>
            <p className="text-sm text-gray-500">Flagged</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form className="relative flex-1" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user name or feedback text..."
              className="input pl-10 w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn('btn btn-secondary', showFilters && 'bg-gray-100')}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={() => { setShowFlaggedOnly(!showFlaggedOnly); setCurrentPage(1); }}
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
                onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                className="input"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                className="input"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
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
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No feedback found</td></tr>
            ) : reviews.map((review) => (
              <tr
                key={review.id}
                className={cn(
                  'hover:bg-gray-50',
                  review.isFlagged && 'bg-red-50/50',
                  review.isHidden && 'opacity-50'
                )}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.isAnonymous ? 'Anonymous' : `${review.user.firstName} ${review.user.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500">{review.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-gray-900">
                      Dr. {review.therapist.user.firstName} {review.therapist.user.lastName}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-xs text-gray-500">{formatDate(review.appointment.scheduledAt)}</p>
                </td>
                <td className="px-4 py-4">
                  {renderStars(review.rating)}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-700 truncate max-w-xs">{review.feedback || 'No comment'}</p>
                  {review.isFlagged && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                      <Flag className="h-3 w-3" />
                      Flagged
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => doToggleHide(review.id)}
                      className={cn(
                        'p-2 rounded-lg',
                        review.isHidden
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      )}
                      title={review.isHidden ? 'Show' : 'Hide'}
                    >
                      {review.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    {!review.isFlagged ? (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Flag"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => doUnflag(review.id)}
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
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={currentPage === meta.totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Feedback Details</h2>
              </div>
              <button
                onClick={() => { setSelectedReview(null); setFlagReason(''); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
                {renderStars(selectedReview.rating, 'md')}
                <span className="text-lg font-bold text-gray-900 ml-2">{selectedReview.rating}/5</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-500">User</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedReview.isAnonymous ? 'Anonymous' : `${selectedReview.user.firstName} ${selectedReview.user.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500">{selectedReview.user.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-500">Therapist</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Dr. {selectedReview.therapist.user.firstName} {selectedReview.therapist.user.lastName}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Appointment</span>
                </div>
                <p className="text-sm text-gray-900">{formatDate(selectedReview.appointment.scheduledAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {selectedReview.feedback || 'No comment provided'}
                </p>
                {selectedReview.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedReview.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Submitted on {formatDateTime(selectedReview.createdAt)}</p>
              </div>

              {selectedReview.isFlagged && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Flagged</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">Reason: {selectedReview.flagReason}</p>
                </div>
              )}

              {!selectedReview.isFlagged && (
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
                    onClick={() => doFlag({ id: selectedReview.id, reason: flagReason })}
                    disabled={!flagReason}
                    className="btn bg-red-600 text-white hover:bg-red-700 w-full disabled:opacity-50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag & Hide Feedback
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => { doToggleHide(selectedReview.id); setSelectedReview(null); }}
                className="btn btn-secondary"
              >
                {selectedReview.isHidden ? (
                  <><Eye className="h-4 w-4 mr-2" />Show Feedback</>
                ) : (
                  <><EyeOff className="h-4 w-4 mr-2" />Hide Feedback</>
                )}
              </button>
              <button
                onClick={() => { setSelectedReview(null); setFlagReason(''); }}
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
