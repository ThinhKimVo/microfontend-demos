import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  CheckCircle,
  XCircle,
  Bell,
  Star,
  X,
  ChevronsUpDown,
  FileCheck,
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import TherapistDetailsModal from './TherapistDetailsModal';
import TherapistStatusModal from './TherapistStatusModal';
import TherapistVerificationModal from './TherapistVerificationModal';

export interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  specialty: string;
  profileStatus: 'pending' | 'approved' | 'rejected';
  verificationStatus: 'unverified' | 'verified' | 'expired';
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  status: 'active' | 'inactive';
  registrationDate: string;
  lastLogin: string;
  licenseNumber: string;
  licenseExpiry: string;
  rejectionReason?: string;
  deactivationReason?: string;
  bio: string;
  hourlyRate: number;
  yearsExperience: number;
}

// Generate mock therapists
const generateMockTherapists = (): Therapist[] => {
  const firstNames = ['Sarah', 'Michael', 'Emily', 'James', 'Jennifer', 'Robert', 'Lisa', 'David', 'Amanda', 'Christopher', 'Jessica', 'Daniel', 'Ashley', 'Matthew', 'Nicole'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'];
  const specialties = ['Clinical Psychology', 'Cognitive Behavioral Therapy', 'Marriage & Family Therapy', 'Child Psychology', 'Trauma Therapy', 'Addiction Counseling', 'Anxiety & Depression', 'PTSD Treatment', 'Grief Counseling'];

  return Array.from({ length: 120 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const profileStatus = ['pending', 'approved', 'approved', 'approved', 'rejected'][Math.floor(Math.random() * 5)] as Therapist['profileStatus'];
    const status = profileStatus === 'approved' ? (Math.random() > 0.1 ? 'active' : 'inactive') : 'inactive';
    const verificationStatus = profileStatus === 'approved'
      ? (Math.random() > 0.9 ? 'expired' : 'verified')
      : 'unverified';
    const regDate = new Date(2022, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
    const lastLoginDate = new Date(regDate.getTime() + Math.random() * (Date.now() - regDate.getTime()));

    return {
      id: `THP-${String(i + 1).padStart(5, '0')}`,
      name: `Dr. ${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@healthcare.com`,
      phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
      profileStatus,
      verificationStatus,
      averageRating: profileStatus === 'approved' ? Math.round((3.5 + Math.random() * 1.5) * 10) / 10 : 0,
      totalReviews: profileStatus === 'approved' ? Math.floor(Math.random() * 150) : 0,
      totalBookings: profileStatus === 'approved' ? Math.floor(Math.random() * 500) : 0,
      status,
      registrationDate: regDate.toISOString(),
      lastLogin: lastLoginDate.toISOString(),
      licenseNumber: `LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      licenseExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString(),
      rejectionReason: profileStatus === 'rejected' ? 'License verification failed' : undefined,
      bio: `Experienced ${specialties[Math.floor(Math.random() * specialties.length)].toLowerCase()} specialist with ${Math.floor(5 + Math.random() * 20)} years of practice.`,
      hourlyRate: Math.floor(80 + Math.random() * 170),
      yearsExperience: Math.floor(5 + Math.random() * 25),
    };
  });
};

const mockTherapists = generateMockTherapists();

type SortField = 'name' | 'averageRating' | 'registrationDate' | 'totalBookings';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 50;

export default function TherapistsList() {
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [search, setSearch] = useState('');
  const [profileStatusFilter, setProfileStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '4+' | '4.5+'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('registrationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Modals
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('deactivate');

  // Filter and sort
  const filteredTherapists = useMemo(() => {
    let result = [...therapists];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.email.toLowerCase().includes(searchLower)
      );
    }

    if (profileStatusFilter !== 'all') {
      result = result.filter((t) => t.profileStatus === profileStatusFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (ratingFilter !== 'all') {
      const minRating = ratingFilter === '4+' ? 4 : 4.5;
      result = result.filter((t) => t.averageRating >= minRating);
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === 'registrationDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [therapists, search, profileStatusFilter, statusFilter, ratingFilter, sortField, sortDirection]);

  const pendingCount = therapists.filter((t) => t.profileStatus === 'pending').length;

  // Pagination
  const totalPages = Math.ceil(filteredTherapists.length / ITEMS_PER_PAGE);
  const paginatedTherapists = filteredTherapists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleStatusChange = (therapistId: string, newStatus: 'active' | 'inactive', reason?: string) => {
    setTherapists((prev) =>
      prev.map((t) =>
        t.id === therapistId ? { ...t, status: newStatus, deactivationReason: reason } : t
      )
    );
  };

  const handleProfileStatusChange = (therapistId: string, newStatus: 'approved' | 'rejected', reason?: string) => {
    setTherapists((prev) =>
      prev.map((t) =>
        t.id === therapistId
          ? {
              ...t,
              profileStatus: newStatus,
              verificationStatus: newStatus === 'approved' ? 'verified' : 'unverified',
              status: newStatus === 'approved' ? 'active' : 'inactive',
              rejectionReason: reason,
            }
          : t
      )
    );
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    );
  };

  const getProfileStatusBadge = (status: Therapist['profileStatus']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const getVerificationBadge = (status: Therapist['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return { class: 'text-green-600', icon: CheckCircle };
      case 'expired':
        return { class: 'text-yellow-600', icon: XCircle };
      case 'unverified':
        return { class: 'text-gray-400', icon: XCircle };
    }
  };

  const clearFilters = () => {
    setSearch('');
    setProfileStatusFilter('all');
    setStatusFilter('all');
    setRatingFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = search || profileStatusFilter !== 'all' || statusFilter !== 'all' || ratingFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Therapists</h1>
          <p className="text-sm text-gray-500">
            {filteredTherapists.length} therapists found
          </p>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={() => {
              setProfileStatusFilter('pending');
              setShowFilters(true);
            }}
            className="btn btn-primary"
          >
            <FileCheck className="h-4 w-4 mr-2" />
            Review Pending ({pendingCount})
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
            className={cn('btn btn-secondary', hasActiveFilters && 'ring-2 ring-primary-500')}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">
                Active
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Status</label>
                <select
                  className="input"
                  value={profileStatusFilter}
                  onChange={(e) => {
                    setProfileStatusFilter(e.target.value as typeof profileStatusFilter);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as typeof statusFilter);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  className="input"
                  value={ratingFilter}
                  onChange={(e) => {
                    setRatingFilter(e.target.value as typeof ratingFilter);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Ratings</option>
                  <option value="4+">4+ Stars</option>
                  <option value="4.5+">4.5+ Stars</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary w-full"
                  disabled={!hasActiveFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Therapist
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('averageRating')}
                >
                  <div className="flex items-center gap-1">
                    Rating
                    <SortIcon field="averageRating" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalBookings')}
                >
                  <div className="flex items-center gap-1">
                    Bookings
                    <SortIcon field="totalBookings" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('registrationDate')}
                >
                  <div className="flex items-center gap-1">
                    Registered
                    <SortIcon field="registrationDate" />
                  </div>
                </th>
                <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTherapists.map((therapist) => {
                const verificationBadge = getVerificationBadge(therapist.verificationStatus);
                return (
                  <tr key={therapist.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-500">{therapist.id}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={therapist.photo}
                          alt={therapist.name}
                          className="w-10 h-10 rounded-full bg-gray-100"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{therapist.name}</p>
                          <p className="text-xs text-gray-500">{therapist.specialty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full capitalize',
                          getProfileStatusBadge(therapist.profileStatus)
                        )}
                      >
                        {therapist.profileStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <verificationBadge.icon className={cn('h-5 w-5', verificationBadge.class)} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {therapist.averageRating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">
                            {therapist.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">({therapist.totalReviews})</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{therapist.totalBookings}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          therapist.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {therapist.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(therapist.registrationDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === therapist.id ? null : therapist.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {actionMenuOpen === therapist.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActionMenuOpen(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedTherapist(therapist);
                                  setShowDetailsModal(true);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              {therapist.profileStatus === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedTherapist(therapist);
                                    setShowVerificationModal(true);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <FileCheck className="h-4 w-4" />
                                  Review Profile
                                </button>
                              )}
                              {therapist.profileStatus === 'approved' && (
                                <button
                                  onClick={() => {
                                    setSelectedTherapist(therapist);
                                    setStatusAction(therapist.status === 'active' ? 'deactivate' : 'activate');
                                    setShowStatusModal(true);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {therapist.status === 'active' ? (
                                    <>
                                      <UserX className="h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  alert(`Notification sent to ${therapist.email}`);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Bell className="h-4 w-4" />
                                Send Notification
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTherapists.length)} of{' '}
            {filteredTherapists.length} therapists
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary px-3 py-2 disabled:opacity-50"
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
                      'px-3 py-1 text-sm rounded',
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
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
              className="btn btn-secondary px-3 py-2 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedTherapist && (
        <TherapistDetailsModal
          therapist={selectedTherapist}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTherapist(null);
          }}
          onStatusChange={(status, reason) => {
            handleStatusChange(selectedTherapist.id, status, reason);
            setShowDetailsModal(false);
            setSelectedTherapist(null);
          }}
          onProfileStatusChange={(status, reason) => {
            handleProfileStatusChange(selectedTherapist.id, status, reason);
            setShowDetailsModal(false);
            setSelectedTherapist(null);
          }}
        />
      )}

      {showStatusModal && selectedTherapist && (
        <TherapistStatusModal
          therapist={selectedTherapist}
          action={statusAction}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedTherapist(null);
          }}
          onConfirm={(reason, sendEmail) => {
            const newStatus = statusAction === 'activate' ? 'active' : 'inactive';
            handleStatusChange(selectedTherapist.id, newStatus, reason);
            if (sendEmail) {
              alert(`Email notification sent to ${selectedTherapist.email}`);
            }
            setShowStatusModal(false);
            setSelectedTherapist(null);
          }}
        />
      )}

      {showVerificationModal && selectedTherapist && (
        <TherapistVerificationModal
          therapist={selectedTherapist}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedTherapist(null);
          }}
          onApprove={(sendEmail) => {
            handleProfileStatusChange(selectedTherapist.id, 'approved');
            if (sendEmail) {
              alert(`Approval notification sent to ${selectedTherapist.email}`);
            }
            setShowVerificationModal(false);
            setSelectedTherapist(null);
          }}
          onReject={(reason, sendEmail) => {
            handleProfileStatusChange(selectedTherapist.id, 'rejected', reason);
            if (sendEmail) {
              alert(`Rejection notification sent to ${selectedTherapist.email}`);
            }
            setShowVerificationModal(false);
            setSelectedTherapist(null);
          }}
        />
      )}
    </div>
  );
}
