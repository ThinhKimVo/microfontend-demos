import { useState } from 'react';
import {
  FileText,
  Eye,
  Save,
  RotateCcw,
  Clock,
  Check,
  Upload,
  History,
  ExternalLink,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { cn, formatDateTime } from '../../lib/utils';

interface ContentVersion {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  notes: string;
}

interface ContentPage {
  id: string;
  name: string;
  slug: string;
  content: string;
  lastPublished: string | null;
  lastUpdated: string;
  status: 'published' | 'draft';
  versions: ContentVersion[];
}

const initialPages: ContentPage[] = [
  {
    id: 'privacy',
    name: 'Privacy Policy',
    slug: '/privacy-policy',
    content: `<h1>Privacy Policy</h1>

<p>Last updated: January 15, 2024</p>

<h2>1. Introduction</h2>
<p>Welcome to Healthcare Platform ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.</p>

<h2>2. Information We Collect</h2>
<p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, or otherwise contact us.</p>

<h3>Personal Information Provided by You</h3>
<ul>
<li>Name and contact data (email address, phone number)</li>
<li>Credentials (passwords, security questions)</li>
<li>Payment data (credit card numbers, billing address)</li>
<li>Health-related information you choose to share</li>
</ul>

<h2>3. How We Use Your Information</h2>
<p>We use personal information collected via our platform for a variety of business purposes:</p>
<ul>
<li>To facilitate account creation and login</li>
<li>To facilitate therapist-patient communications</li>
<li>To process payments and refunds</li>
<li>To send administrative information</li>
</ul>

<h2>4. Data Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

<h2>5. Contact Us</h2>
<p>If you have questions about this policy, please contact us at privacy@healthcare.com.</p>`,
    lastPublished: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
    status: 'published',
    versions: [
      {
        id: 'v3',
        content: '...(current version)',
        createdAt: '2024-01-15T10:00:00Z',
        createdBy: 'Admin User',
        notes: 'Updated data collection section',
      },
      {
        id: 'v2',
        content: '...(previous version)',
        createdAt: '2024-01-10T14:30:00Z',
        createdBy: 'Admin User',
        notes: 'Added GDPR compliance section',
      },
      {
        id: 'v1',
        content: '...(initial version)',
        createdAt: '2023-12-01T09:00:00Z',
        createdBy: 'Admin User',
        notes: 'Initial privacy policy',
      },
    ],
  },
  {
    id: 'terms',
    name: 'Terms & Conditions',
    slug: '/terms',
    content: `<h1>Terms and Conditions</h1>

<p>Last updated: January 10, 2024</p>

<h2>1. Agreement to Terms</h2>
<p>By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>

<h2>2. Use of Services</h2>
<p>Our platform provides a connection between users seeking mental health support and licensed therapists. We do not provide medical advice directly.</p>

<h3>User Responsibilities</h3>
<ul>
<li>Provide accurate and complete information</li>
<li>Maintain the confidentiality of your account</li>
<li>Use the platform for lawful purposes only</li>
<li>Respect the privacy of therapists and other users</li>
</ul>

<h2>3. Payments and Refunds</h2>
<p>All payments are processed securely through our payment provider. Refund policies vary based on cancellation timing:</p>
<ul>
<li>24+ hours before: Full refund</li>
<li>12-24 hours before: 50% refund</li>
<li>Less than 12 hours: No refund</li>
</ul>

<h2>4. Limitation of Liability</h2>
<p>Healthcare Platform is not liable for any indirect, incidental, special, or consequential damages arising from your use of our services.</p>

<h2>5. Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. Users will be notified of significant changes.</p>`,
    lastPublished: '2024-01-10T14:00:00Z',
    lastUpdated: '2024-01-10T14:00:00Z',
    status: 'published',
    versions: [
      {
        id: 'v2',
        content: '...(current version)',
        createdAt: '2024-01-10T14:00:00Z',
        createdBy: 'Admin User',
        notes: 'Updated refund policy',
      },
      {
        id: 'v1',
        content: '...(initial version)',
        createdAt: '2023-11-15T10:00:00Z',
        createdBy: 'Admin User',
        notes: 'Initial terms and conditions',
      },
    ],
  },
  {
    id: 'about',
    name: 'About Us',
    slug: '/about',
    content: `<h1>About Healthcare Platform</h1>

<h2>Our Mission</h2>
<p>We believe that everyone deserves access to quality mental health care. Our mission is to break down barriers and make therapy accessible, affordable, and convenient for all.</p>

<h2>Who We Are</h2>
<p>Healthcare Platform was founded in 2020 by a team of mental health professionals and technologists who saw the need for better access to therapy services.</p>

<h2>Our Values</h2>
<ul>
<li><strong>Accessibility:</strong> Mental health support should be available to everyone</li>
<li><strong>Quality:</strong> We partner only with licensed, vetted professionals</li>
<li><strong>Privacy:</strong> Your information is always secure and confidential</li>
<li><strong>Innovation:</strong> We continuously improve our platform to serve you better</li>
</ul>

<h2>Our Impact</h2>
<p>Since our launch, we have:</p>
<ul>
<li>Connected over 50,000 users with therapists</li>
<li>Facilitated more than 200,000 therapy sessions</li>
<li>Partnered with 500+ licensed therapists</li>
<li>Achieved a 4.8/5 average satisfaction rating</li>
</ul>

<h2>Contact Us</h2>
<p>Have questions? Reach out to us at hello@healthcare.com</p>`,
    lastPublished: '2024-01-05T11:00:00Z',
    lastUpdated: '2024-01-05T11:00:00Z',
    status: 'published',
    versions: [
      {
        id: 'v1',
        content: '...(current version)',
        createdAt: '2024-01-05T11:00:00Z',
        createdBy: 'Admin User',
        notes: 'Initial about page',
      },
    ],
  },
  {
    id: 'faq',
    name: 'FAQ',
    slug: '/faq',
    content: `<h1>Frequently Asked Questions</h1>

<h2>Getting Started</h2>

<h3>How do I create an account?</h3>
<p>Simply click "Sign Up" on our homepage, enter your email address, and follow the verification steps. You can then complete your profile and start browsing therapists.</p>

<h3>Is my information secure?</h3>
<p>Yes, we use bank-level encryption to protect your personal data. All communications between you and your therapist are private and confidential.</p>

<h2>Booking Sessions</h2>

<h3>How do I book a session?</h3>
<p>Browse our therapist directory, select a therapist that matches your needs, choose an available time slot, and complete the payment. You'll receive a confirmation email with your session details.</p>

<h3>Can I cancel or reschedule?</h3>
<p>Yes, you can cancel or reschedule up to 24 hours before your session for a full refund. Cancellations within 24 hours may be subject to a fee.</p>

<h2>Payments</h2>

<h3>What payment methods do you accept?</h3>
<p>We accept all major credit cards, debit cards, PayPal, Apple Pay, and Google Pay.</p>

<h3>Do you offer refunds?</h3>
<p>Yes, refunds are available based on our cancellation policy. If you're unsatisfied with a session, contact our support team within 24 hours.</p>

<h2>For Therapists</h2>

<h3>How do I become a therapist on the platform?</h3>
<p>Click "Join as Therapist" and complete our application process. You'll need to provide your license information, credentials, and pass our verification process.</p>

<h3>How do payouts work?</h3>
<p>Therapists receive payouts weekly via direct deposit. The platform takes a 15% commission on each session.</p>`,
    lastPublished: '2024-01-02T16:00:00Z',
    lastUpdated: '2024-01-08T09:30:00Z',
    status: 'draft',
    versions: [
      {
        id: 'v3',
        content: '...(draft version)',
        createdAt: '2024-01-08T09:30:00Z',
        createdBy: 'Admin User',
        notes: 'Added therapist FAQ section (draft)',
      },
      {
        id: 'v2',
        content: '...(published version)',
        createdAt: '2024-01-02T16:00:00Z',
        createdBy: 'Admin User',
        notes: 'Added payment FAQ section',
      },
      {
        id: 'v1',
        content: '...(initial version)',
        createdAt: '2023-12-15T10:00:00Z',
        createdBy: 'Admin User',
        notes: 'Initial FAQ page',
      },
    ],
  },
];

export default function ContentManagement() {
  const [pages, setPages] = useState<ContentPage[]>(initialPages);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showPublished, setShowPublished] = useState(false);

  const handleSelectPage = (page: ContentPage) => {
    setSelectedPage(page);
    setEditedContent(page.content);
    setShowPreview(false);
    setShowHistory(false);
  };

  const handleSaveDraft = async () => {
    if (!selectedPage) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newVersion: ContentVersion = {
      id: `v${selectedPage.versions.length + 1}`,
      content: editedContent,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin User',
      notes: 'Auto-saved draft',
    };

    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedPage.id
          ? {
              ...p,
              content: editedContent,
              lastUpdated: new Date().toISOString(),
              status: 'draft' as const,
              versions: [newVersion, ...p.versions],
            }
          : p
      )
    );
    setSelectedPage((prev) =>
      prev
        ? {
            ...prev,
            content: editedContent,
            lastUpdated: new Date().toISOString(),
            status: 'draft',
            versions: [newVersion, ...prev.versions],
          }
        : null
    );
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handlePublish = async () => {
    if (!selectedPage) return;
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1500));

    const newVersion: ContentVersion = {
      id: `v${selectedPage.versions.length + 1}`,
      content: editedContent,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin User',
      notes: 'Published version',
    };

    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedPage.id
          ? {
              ...p,
              content: editedContent,
              lastUpdated: new Date().toISOString(),
              lastPublished: new Date().toISOString(),
              status: 'published' as const,
              versions: [newVersion, ...p.versions],
            }
          : p
      )
    );
    setSelectedPage((prev) =>
      prev
        ? {
            ...prev,
            content: editedContent,
            lastUpdated: new Date().toISOString(),
            lastPublished: new Date().toISOString(),
            status: 'published',
            versions: [newVersion, ...prev.versions],
          }
        : null
    );
    setIsPublishing(false);
    setShowPublished(true);
    setTimeout(() => setShowPublished(false), 3000);
  };

  const handleRevertToVersion = (version: ContentVersion) => {
    setEditedContent(version.content === '...(current version)' || version.content.startsWith('...(')
      ? selectedPage?.content || ''
      : version.content
    );
    setShowHistory(false);
  };

  return (
    <div className="space-y-6">
      {!selectedPage ? (
        <>
          {/* Pages List */}
          <div className="grid md:grid-cols-2 gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectPage(page)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{page.name}</h3>
                      <p className="text-sm text-gray-500">{page.slug}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {page.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Updated {formatDateTime(page.lastUpdated)}
                  </span>
                  <span className="flex items-center gap-1">
                    <History className="h-4 w-4" />
                    {page.versions.length} versions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Edit Page */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPage(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to Pages
            </button>
            <div className="flex items-center gap-2">
              {showSaved && (
                <span className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Draft saved
                </span>
              )}
              {showPublished && (
                <span className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Published
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Editor */}
            <div className="lg:col-span-3 space-y-4">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedPage.name}</h2>
                      <p className="text-sm text-gray-500">{selectedPage.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors',
                        showPreview
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      <Eye className="h-4 w-4" />
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <a
                      href={selectedPage.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live
                    </a>
                  </div>
                </div>

                {selectedPage.status === 'draft' && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      This page has unpublished changes
                    </span>
                  </div>
                )}

                {showPreview ? (
                  <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-6 bg-white min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: editedContent }} />
                  </div>
                ) : (
                  <textarea
                    className="input w-full font-mono text-sm min-h-[400px]"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {selectedPage.lastPublished ? (
                      <span>Last published: {formatDateTime(selectedPage.lastPublished)}</span>
                    ) : (
                      <span>Never published</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="btn btn-secondary"
                    >
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Draft
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="btn btn-primary"
                    >
                      {isPublishing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Publishing...
                        </span>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Version History */}
              <div className="card p-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-900"
                >
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4 text-gray-500" />
                    Version History
                  </span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', showHistory && 'rotate-180')} />
                </button>

                {showHistory && (
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                    {selectedPage.versions.map((version, index) => (
                      <div
                        key={version.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-900">
                            {version.id}
                            {index === 0 && (
                              <span className="ml-2 px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                                Current
                              </span>
                            )}
                          </span>
                          {index > 0 && (
                            <button
                              onClick={() => handleRevertToVersion(version)}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              <RotateCcw className="h-3 w-3 inline mr-1" />
                              Revert
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{version.notes}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDateTime(version.createdAt)} by {version.createdBy}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="card p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">HTML Tips</h3>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li>• Use <code className="bg-gray-100 px-1">&lt;h1&gt;</code> to <code className="bg-gray-100 px-1">&lt;h6&gt;</code> for headings</li>
                  <li>• Use <code className="bg-gray-100 px-1">&lt;p&gt;</code> for paragraphs</li>
                  <li>• Use <code className="bg-gray-100 px-1">&lt;ul&gt;</code> and <code className="bg-gray-100 px-1">&lt;li&gt;</code> for lists</li>
                  <li>• Use <code className="bg-gray-100 px-1">&lt;strong&gt;</code> for bold text</li>
                  <li>• Use <code className="bg-gray-100 px-1">&lt;a href=""&gt;</code> for links</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
