import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  X,
  Send,
  Check,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn, formatDateTime, formatDate } from '../../lib/utils';

interface SupportTicket {
  id: string;
  fromName: string;
  fromEmail: string;
  fromType: 'user' | 'therapist';
  fromId: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  replies: {
    id: string;
    from: 'admin' | 'customer';
    message: string;
    createdAt: string;
  }[];
}

// Generate mock tickets
const generateMockTickets = (): SupportTicket[] => {
  const userNames = ['John Smith', 'Jane Doe', 'Michael Brown', 'Emily Chen', 'David Wilson', 'Sarah Johnson'];
  const therapistNames = ['Dr. Sarah Smith', 'Dr. Michael Brown', 'Dr. Emily Chen', 'Dr. James Wilson', 'Dr. Lisa Johnson'];
  const subjects = [
    'Unable to book appointment',
    'Payment issue',
    'Technical problem with video call',
    'Request for refund',
    'Account access issue',
    'Feedback about therapist',
    'App crashing on login',
    'Cannot view appointment history',
    'Question about pricing',
    'Privacy concern',
  ];
  const messages = [
    'I have been trying to book an appointment but the system keeps showing an error. Can you please help?',
    'My payment was charged twice for the same session. Please investigate and process a refund.',
    'The video call quality was very poor during my last session. The connection kept dropping.',
    'I need to request a refund for my cancelled appointment. The therapist did not show up.',
    'I cannot log into my account. I have tried resetting my password but still having issues.',
    'I would like to provide feedback about my recent session with Dr. Smith. Overall it was good but...',
    'The app crashes every time I try to login. I am using iPhone 15 with latest iOS.',
    'I cannot see my past appointments in the history section. They all disappeared.',
    'Can you explain the pricing structure? I am confused about the different session types.',
    'I have concerns about how my data is being used. Can you clarify your privacy policy?',
  ];
  const statuses: SupportTicket['status'][] = ['new', 'new', 'new', 'in_progress', 'in_progress', 'resolved', 'resolved', 'resolved'];
  const priorities: SupportTicket['priority'][] = ['low', 'medium', 'medium', 'high'];

  const tickets: SupportTicket[] = [];

  for (let i = 0; i < 50; i++) {
    const isTherapist = Math.random() > 0.7;
    const name = isTherapist
      ? therapistNames[Math.floor(Math.random() * therapistNames.length)]
      : userNames[Math.floor(Math.random() * userNames.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

    const replies = [];
    if (status !== 'new') {
      replies.push({
        id: `reply-${i}-1`,
        from: 'admin' as const,
        message: 'Thank you for contacting us. We are looking into this issue and will get back to you shortly.',
        createdAt: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      });
    }
    if (status === 'resolved') {
      replies.push({
        id: `reply-${i}-2`,
        from: 'customer' as const,
        message: 'Thank you for your help!',
        createdAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      });
      replies.push({
        id: `reply-${i}-3`,
        from: 'admin' as const,
        message: 'You\'re welcome! If you have any other questions, feel free to reach out. Closing this ticket.',
        createdAt: new Date(createdAt.getTime() + 25 * 60 * 60 * 1000).toISOString(),
      });
    }

    tickets.push({
      id: `TKT-${String(i + 1).padStart(5, '0')}`,
      fromName: name,
      fromEmail: name.toLowerCase().replace(/\s+/g, '.').replace('dr.', '') + '@example.com',
      fromType: isTherapist ? 'therapist' : 'user',
      fromId: isTherapist ? `THP-${String(Math.floor(Math.random() * 120) + 1).padStart(3, '0')}` : `USR-${String(Math.floor(Math.random() * 150) + 1).padStart(3, '0')}`,
      subject,
      message,
      status,
      priority,
      createdAt: createdAt.toISOString(),
      updatedAt: replies.length > 0 ? replies[replies.length - 1].createdAt : createdAt.toISOString(),
      replies,
    });
  }

  return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const mockTickets = generateMockTickets();

export default function ContactMessages() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(searchLower) ||
          t.fromName.toLowerCase().includes(searchLower) ||
          t.fromEmail.toLowerCase().includes(searchLower) ||
          t.subject.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.fromType === typeFilter);
    }

    return filtered;
  }, [tickets, search, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    new: tickets.filter((t) => t.status === 'new').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const config = {
      new: { icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-800', label: 'New' },
      in_progress: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
      resolved: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
    };
    const { icon: Icon, bg, text, label } = config[status];
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full', bg, text)}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const config = {
      low: { bg: 'bg-gray-100', text: 'text-gray-600' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-700' },
      high: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const { bg, text } = config[priority];
    return (
      <span className={cn('px-2 py-0.5 text-xs font-medium rounded', bg, text)}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newReply = {
      id: `reply-${Date.now()}`,
      from: 'admin' as const,
      message: replyText,
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: 'in_progress' as const,
              updatedAt: new Date().toISOString(),
              replies: [...t.replies, newReply],
            }
          : t
      )
    );

    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            status: 'in_progress',
            updatedAt: new Date().toISOString(),
            replies: [...prev.replies, newReply],
          }
        : null
    );

    setReplyText('');
    setIsSending(false);
  };

  const handleMarkResolved = () => {
    if (!selectedTicket) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, status: 'resolved' as const, updatedAt: new Date().toISOString() }
          : t
      )
    );
    setSelectedTicket((prev) =>
      prev ? { ...prev, status: 'resolved', updatedAt: new Date().toISOString() } : null
    );
  };

  const handleTogglePriority = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newPriority = t.priority === 'high' ? 'medium' : t.priority === 'medium' ? 'low' : 'high';
        return { ...t, priority: newPriority };
      })
    );
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => {
        if (!prev) return null;
        const newPriority = prev.priority === 'high' ? 'medium' : prev.priority === 'medium' ? 'low' : 'high';
        return { ...prev, priority: newPriority };
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
            <p className="text-sm text-gray-500">New Tickets</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            <p className="text-sm text-gray-500">Resolved</p>
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
              placeholder="Search by ticket ID, name, email, or subject..."
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
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">User Type</label>
              <select
                className="input"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Types</option>
                <option value="user">Users</option>
                <option value="therapist">Therapists</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTickets.map((ticket) => (
              <tr key={ticket.id} className={cn('hover:bg-gray-50', ticket.status === 'new' && 'bg-red-50/50')}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900">{ticket.id}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {ticket.fromType === 'therapist' ? (
                      <Stethoscope className="h-4 w-4 text-green-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ticket.fromName}</p>
                      <p className="text-xs text-gray-500">{ticket.fromEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-900 truncate max-w-xs">{ticket.subject}</p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button onClick={() => handleTogglePriority(ticket.id)}>
                    {getPriorityBadge(ticket.priority)}
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(ticket.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedTickets.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No tickets found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length}
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

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2 rounded-full',
                  selectedTicket.fromType === 'therapist' ? 'bg-green-100' : 'bg-blue-100'
                )}>
                  {selectedTicket.fromType === 'therapist' ? (
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedTicket.id}</h2>
                  <p className="text-sm text-gray-500">{selectedTicket.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedTicket.status)}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedTicket.fromName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedTicket.fromEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedTicket.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Priority</p>
                    <button onClick={() => handleTogglePriority(selectedTicket.id)}>
                      {getPriorityBadge(selectedTicket.priority)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {/* Original Message */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-700">{selectedTicket.fromName}</span>
                    <span className="text-xs text-blue-500">{formatDateTime(selectedTicket.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                {/* Replies */}
                {selectedTicket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={cn(
                      'p-4 rounded-lg',
                      reply.from === 'admin' ? 'bg-primary-50 ml-8' : 'bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-xs font-medium',
                        reply.from === 'admin' ? 'text-primary-700' : 'text-gray-700'
                      )}>
                        {reply.from === 'admin' ? 'Admin' : selectedTicket.fromName}
                      </span>
                      <span className={cn(
                        'text-xs',
                        reply.from === 'admin' ? 'text-primary-500' : 'text-gray-500'
                      )}>
                        {formatDateTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== 'resolved' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Reply</label>
                  <textarea
                    className="input w-full"
                    rows={4}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedTicket(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                {selectedTicket.status !== 'resolved' && (
                  <>
                    <button
                      onClick={handleMarkResolved}
                      className="btn btn-secondary"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={isSending || !replyText.trim()}
                      className="btn btn-primary"
                    >
                      {isSending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
