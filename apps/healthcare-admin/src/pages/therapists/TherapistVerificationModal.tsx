import { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  FileText,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import type { Therapist } from './TherapistsList';

interface TherapistVerificationModalProps {
  therapist: Therapist;
  onClose: () => void;
  onApprove: (sendEmail: boolean) => void;
  onReject: (reason: string, sendEmail: boolean) => void;
}

const rejectionReasons = [
  { id: 'unclear_photo', label: 'Unclear profile photo' },
  { id: 'invalid_license', label: 'Invalid or expired license' },
  { id: 'missing_info', label: 'Missing required information' },
  { id: 'unverifiable', label: 'Unable to verify credentials' },
  { id: 'other', label: 'Other (specify below)' },
];

// Mock license documents
const mockLicenses = [
  { id: 1, name: 'Medical License.pdf', type: 'pdf', url: '/licenses/medical-license.pdf' },
  { id: 2, name: 'Board Certification.pdf', type: 'pdf', url: '/licenses/board-cert.pdf' },
  { id: 3, name: 'ID Verification.jpg', type: 'image', url: 'https://placehold.co/800x600/e2e8f0/64748b?text=ID+Document' },
];

export default function TherapistVerificationModal({
  therapist,
  onClose,
  onApprove,
  onReject,
}: TherapistVerificationModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'photo' | 'licenses'>('profile');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onApprove(sendEmail);
  };

  const handleReject = async () => {
    if (!selectedReason) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const reason = selectedReason === 'other' ? customReason : rejectionReasons.find((r) => r.id === selectedReason)?.label || '';
    onReject(reason, sendEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={therapist.photo}
              alt={therapist.name}
              className="w-12 h-12 rounded-full bg-gray-100"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Review: {therapist.name}</h2>
              <p className="text-sm text-gray-500">
                Applied on {formatDate(therapist.registrationDate)}
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              Pending Review
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {[
            { id: 'profile', label: 'Profile Info', icon: User },
            { id: 'photo', label: 'Profile Photo', icon: User },
            { id: 'licenses', label: 'Licenses & Documents', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Full Name</label>
                      <p className="text-sm font-medium text-gray-900">{therapist.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{therapist.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{therapist.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Professional Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Specialty</label>
                      <p className="text-sm font-medium text-gray-900">{therapist.specialty}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Years of Experience</label>
                      <p className="text-sm text-gray-900">{therapist.yearsExperience} years</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Hourly Rate</label>
                      <p className="text-sm text-gray-900">${therapist.hourlyRate}/hour</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  License Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-xs text-gray-500">License Number</label>
                    <p className="text-sm font-mono font-medium text-gray-900">{therapist.licenseNumber}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-xs text-gray-500">License Expiry</label>
                    <p className="text-sm font-medium text-gray-900">{formatDate(therapist.licenseExpiry)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Bio</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{therapist.bio}</p>
              </div>
            </div>
          )}

          {/* Photo Tab */}
          {activeTab === 'photo' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPhotoZoom((z) => Math.max(0.5, z - 0.25))}
                    className="btn btn-secondary p-2"
                    disabled={photoZoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-500 w-16 text-center">{Math.round(photoZoom * 100)}%</span>
                  <button
                    onClick={() => setPhotoZoom((z) => Math.min(3, z + 0.25))}
                    className="btn btn-secondary p-2"
                    disabled={photoZoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center min-h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={therapist.photo}
                  alt={therapist.name}
                  className="transition-transform duration-200"
                  style={{ transform: `scale(${photoZoom})`, maxHeight: '400px' }}
                />
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Photo Review Guidelines</p>
                  <p className="text-xs text-blue-700">
                    Ensure the photo is professional, clear, shows the face clearly, and has appropriate lighting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Licenses Tab */}
          {activeTab === 'licenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Uploaded Documents</h3>
                <span className="text-sm text-gray-500">{mockLicenses.length} documents</span>
              </div>

              {/* Document List */}
              <div className="grid grid-cols-3 gap-3">
                {mockLicenses.map((doc, index) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedLicense(index)}
                    className={cn(
                      'p-3 rounded-lg border-2 text-left transition-colors',
                      selectedLicense === index
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className={cn('h-5 w-5', selectedLicense === index ? 'text-primary-600' : 'text-gray-400')} />
                      <span className="text-sm font-medium text-gray-900 truncate">{doc.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Document Viewer */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLicense((s) => Math.max(0, s - 1))}
                      disabled={selectedLicense === 0}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                      {selectedLicense + 1} / {mockLicenses.length}
                    </span>
                    <button
                      onClick={() => setSelectedLicense((s) => Math.min(mockLicenses.length - 1, s + 1))}
                      disabled={selectedLicense === mockLicenses.length - 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{mockLicenses[selectedLicense].name}</span>
                    <button className="btn btn-secondary text-xs px-2 py-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="h-96 bg-gray-100 flex items-center justify-center">
                  {mockLicenses[selectedLicense].type === 'pdf' ? (
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">PDF Document</p>
                      <p className="text-xs text-gray-400 mt-1">{mockLicenses[selectedLicense].name}</p>
                      <button className="btn btn-primary text-sm mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Open PDF
                      </button>
                    </div>
                  ) : (
                    <img
                      src={mockLicenses[selectedLicense].url}
                      alt={mockLicenses[selectedLicense].name}
                      className="max-h-full object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                <div className="p-2 bg-amber-100 rounded-full">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">Document Verification</p>
                  <p className="text-xs text-amber-700">
                    Verify that all licenses are valid, not expired, and match the therapist's information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rejection Form */}
        {showRejectForm && (
          <div className="px-6 py-4 border-t border-gray-200 bg-red-50">
            <h4 className="text-sm font-semibold text-red-900 mb-3">Rejection Reason</h4>
            <div className="space-y-2 mb-4">
              {rejectionReasons.map((reason) => (
                <label key={reason.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-red-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{reason.label}</span>
                </label>
              ))}
            </div>
            {selectedReason === 'other' && (
              <textarea
                className="input mb-4"
                rows={2}
                placeholder="Enter custom reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Send email notification</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {showRejectForm ? (
              <>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading || !selectedReason || (selectedReason === 'other' && !customReason)}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button onClick={onClose} className="btn btn-secondary" disabled={isLoading}>
                  Close
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button onClick={handleApprove} className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
