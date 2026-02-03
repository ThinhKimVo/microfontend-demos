import { useState } from 'react';
import {
  Mail,
  Edit,
  Eye,
  Send,
  Save,
  X,
  Check,
  Code,
  FileText,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { cn, formatDateTime } from '../../lib/utils';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastUpdated: string;
  status: 'active' | 'draft';
}

const initialTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{app_name}}!',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to {{app_name}}!</h1>
    </div>
    <div class="content">
      <p>Hi {{user_name}},</p>
      <p>Thank you for joining {{app_name}}! We're excited to have you on board.</p>
      <p>Get started by exploring our platform and connecting with qualified therapists who can help you on your wellness journey.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{app_url}}" class="button">Get Started</a>
      </p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The {{app_name}} Team</p>
    </div>
    <div class="footer">
      <p>© 2024 {{app_name}}. All rights reserved.</p>
      <p>{{contact_address}}</p>
    </div>
  </div>
</body>
</html>`,
    variables: ['app_name', 'user_name', 'app_url', 'contact_address'],
    lastUpdated: '2024-01-15T10:30:00Z',
    status: 'active',
  },
  {
    id: 'otp',
    name: 'OTP Verification',
    subject: 'Your verification code: {{otp_code}}',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .otp-box { background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; }
    .warning { background: #fef3c7; padding: 10px; border-radius: 6px; font-size: 14px; color: #92400e; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verification Code</h2>
    <p>Hi {{user_name}},</p>
    <p>Your verification code is:</p>
    <div class="otp-box">
      <span class="otp-code">{{otp_code}}</span>
    </div>
    <p>This code will expire in {{expiry_minutes}} minutes.</p>
    <div class="warning">
      <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your verification code.
    </div>
  </div>
</body>
</html>`,
    variables: ['user_name', 'otp_code', 'expiry_minutes'],
    lastUpdated: '2024-01-10T14:20:00Z',
    status: 'active',
  },
  {
    id: 'booking_confirmation',
    name: 'Booking Confirmation',
    subject: 'Appointment Confirmed - {{appointment_date}}',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Appointment Confirmed!</h2>
    <p>Hi {{user_name}},</p>
    <p>Your appointment has been confirmed. Here are the details:</p>
    <div class="details">
      <div class="detail-row"><span>Therapist:</span><strong>{{therapist_name}}</strong></div>
      <div class="detail-row"><span>Date:</span><strong>{{appointment_date}}</strong></div>
      <div class="detail-row"><span>Time:</span><strong>{{appointment_time}}</strong></div>
      <div class="detail-row"><span>Type:</span><strong>{{session_type}}</strong></div>
      <div class="detail-row"><span>Amount:</span><strong>{{amount}}</strong></div>
    </div>
    <p style="text-align: center;">
      <a href="{{meeting_link}}" class="button">Join Session</a>
    </p>
    <p>You will receive a reminder 24 hours and 1 hour before your appointment.</p>
  </div>
</body>
</html>`,
    variables: ['user_name', 'therapist_name', 'appointment_date', 'appointment_time', 'session_type', 'amount', 'meeting_link'],
    lastUpdated: '2024-01-12T09:15:00Z',
    status: 'active',
  },
  {
    id: 'cancellation',
    name: 'Appointment Cancellation',
    subject: 'Appointment Cancelled - {{appointment_date}}',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .refund { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Appointment Cancelled</h2>
    <p>Hi {{user_name}},</p>
    <div class="alert">
      <p>Your appointment with <strong>{{therapist_name}}</strong> scheduled for <strong>{{appointment_date}}</strong> has been cancelled.</p>
    </div>
    <p><strong>Reason:</strong> {{cancellation_reason}}</p>
    <div class="refund">
      <p><strong>Refund Status:</strong> {{refund_status}}</p>
      <p>{{refund_message}}</p>
    </div>
    <p>We apologize for any inconvenience. You can book a new appointment at any time.</p>
  </div>
</body>
</html>`,
    variables: ['user_name', 'therapist_name', 'appointment_date', 'cancellation_reason', 'refund_status', 'refund_message'],
    lastUpdated: '2024-01-08T16:45:00Z',
    status: 'active',
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
    .warning { background: #fef3c7; padding: 10px; border-radius: 6px; font-size: 14px; color: #92400e; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>Hi {{user_name}},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="{{reset_link}}" class="button">Reset Password</a>
    </p>
    <p>This link will expire in {{expiry_hours}} hours.</p>
    <div class="warning">
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </div>
  </div>
</body>
</html>`,
    variables: ['user_name', 'reset_link', 'expiry_hours'],
    lastUpdated: '2024-01-05T11:30:00Z',
    status: 'active',
  },
  {
    id: 'payment_receipt',
    name: 'Payment Receipt',
    subject: 'Payment Receipt - {{transaction_id}}',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .receipt { background: #f9fafb; padding: 20px; border-radius: 8px; }
    .total { font-size: 24px; font-weight: bold; color: #4F46E5; text-align: center; padding: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Payment Receipt</h2>
    <p>Hi {{user_name}},</p>
    <p>Thank you for your payment. Here's your receipt:</p>
    <div class="receipt">
      <p><strong>Transaction ID:</strong> {{transaction_id}}</p>
      <p><strong>Date:</strong> {{payment_date}}</p>
      <p><strong>Description:</strong> {{description}}</p>
      <p><strong>Payment Method:</strong> {{payment_method}}</p>
      <div class="total">{{amount}}</div>
    </div>
  </div>
</body>
</html>`,
    variables: ['user_name', 'transaction_id', 'payment_date', 'description', 'payment_method', 'amount'],
    lastUpdated: '2024-01-03T13:00:00Z',
    status: 'active',
  },
];

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedSubject(template.subject);
    setEditedBody(template.body);
    setShowPreview(false);
  };

  const handleCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, subject: editedSubject, body: editedBody, lastUpdated: new Date().toISOString() }
          : t
      )
    );
    setSelectedTemplate((prev) =>
      prev ? { ...prev, subject: editedSubject, body: editedBody, lastUpdated: new Date().toISOString() } : null
    );
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleTestSend = async () => {
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSending(false);
    setShowSent(true);
    setTimeout(() => setShowSent(false), 3000);
  };

  const getPreviewHtml = () => {
    // Replace variables with sample data for preview
    const sampleData: Record<string, string> = {
      app_name: 'Healthcare Platform',
      user_name: 'John Doe',
      app_url: 'https://healthcare.com',
      contact_address: '123 Healthcare Ave, NY 10001',
      otp_code: '123456',
      expiry_minutes: '10',
      therapist_name: 'Dr. Sarah Smith',
      appointment_date: 'January 20, 2024',
      appointment_time: '2:00 PM EST',
      session_type: 'Video Consultation',
      amount: '$150.00',
      meeting_link: 'https://meet.healthcare.com/abc123',
      cancellation_reason: 'Schedule conflict',
      refund_status: 'Refund Processed',
      refund_message: 'Your refund of $150.00 will be credited within 5-7 business days.',
      reset_link: 'https://healthcare.com/reset/abc123',
      expiry_hours: '24',
      transaction_id: 'TXN-000001',
      payment_date: 'January 15, 2024',
      description: 'Session booking payment',
      payment_method: 'Visa ending in 4242',
    };

    let html = editedBody;
    Object.entries(sampleData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return html;
  };

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <>
          {/* Templates List */}
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variables</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Mail className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">{template.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 truncate max-w-xs block">{template.subject}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((v) => (
                          <span key={v} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {v}
                          </span>
                        ))}
                        {template.variables.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            +{template.variables.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{formatDateTime(template.lastUpdated)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      )}>
                        {template.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Edit Template */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Back to Templates
            </button>
            <div className="flex items-center gap-2">
              {showSaved && (
                <span className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
              {showSent && (
                <span className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Test email sent
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h2>
                    <p className="text-sm text-gray-500">Last updated: {formatDateTime(selectedTemplate.lastUpdated)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                  <input
                    type="text"
                    className="input w-full"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Email Body (HTML)</label>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors',
                        showPreview ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {showPreview ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showPreview ? 'Edit Code' : 'Preview'}
                    </button>
                  </div>
                  {showPreview ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        srcDoc={getPreviewHtml()}
                        className="w-full h-96 bg-white"
                        title="Email Preview"
                      />
                    </div>
                  ) : (
                    <textarea
                      className="input w-full font-mono text-sm"
                      rows={16}
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary"
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
                        Save Template
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleTestSend}
                    disabled={isSending}
                    className="btn btn-secondary"
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
                        Send Test Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Variables Panel */}
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-500" />
                  Available Variables
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Click to copy. Use double curly braces in the template.
                </p>
                <div className="space-y-2">
                  {selectedTemplate.variables.map((variable) => (
                    <button
                      key={variable}
                      onClick={() => handleCopyVariable(variable)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <code className="text-primary-600">{`{{${variable}}}`}</code>
                      {copiedVar === variable ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  Tips
                </h3>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li>• Use inline CSS for email compatibility</li>
                  <li>• Test on multiple email clients</li>
                  <li>• Keep emails under 102KB to avoid Gmail clipping</li>
                  <li>• Use table-based layouts for consistent rendering</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
