import { useState } from 'react';
import {
  X,
  User,
  Stethoscope,
  Calendar,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle,
  FileText,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { cn, formatCurrency, formatDate, formatDateTime } from '../../lib/utils';
import type { Transaction } from './PaymentsList';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onRefund: (transactionId: string, amount: number, reason: string) => void;
}

export default function TransactionDetailsModal({
  transaction,
  onClose,
  onRefund,
}: TransactionDetailsModalProps) {
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState(transaction.amount / 100);
  const [refundReason, setRefundReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const canRefund = transaction.status === 'success' || transaction.status === 'pending';
  const maxRefundAmount = transaction.amount / 100;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) return;
    if (refundAmount <= 0 || refundAmount > maxRefundAmount) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    onRefund(transaction.id, Math.round(refundAmount * 100), refundReason);
    setIsProcessing(false);
  };

  const getStatusInfo = () => {
    const configs = {
      success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Success' },
      failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' },
      refunded: { icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Refunded' },
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      partially_refunded: { icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Partially Refunded' },
    };
    return configs[transaction.status];
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getPaymentMethodLabel = () => {
    const labels = {
      card: `${transaction.cardBrand || 'Card'} •••• ${transaction.cardLast4}`,
      bank_transfer: 'Bank Transfer',
      paypal: 'PayPal',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay',
    };
    return labels[transaction.paymentMethod];
  };

  const downloadInvoice = () => {
    // Generate a simple invoice PDF (in a real app, this would call the backend)
    const invoiceContent = `
INVOICE
=======

Transaction ID: ${transaction.id}
Date: ${formatDateTime(transaction.createdAt)}

Customer: ${transaction.userName}
Email: ${transaction.userEmail}

${transaction.therapistName ? `Therapist: ${transaction.therapistName}` : ''}
${transaction.appointmentId ? `Appointment: ${transaction.appointmentId}` : ''}

Description: ${transaction.description}

Amount: ${formatCurrency(transaction.amount / 100)} ${transaction.currency}
${transaction.platformFee ? `Platform Fee: ${formatCurrency(transaction.platformFee / 100)}` : ''}
${transaction.therapistEarnings ? `Therapist Earnings: ${formatCurrency(transaction.therapistEarnings / 100)}` : ''}

Payment Method: ${getPaymentMethodLabel()}
Status: ${transaction.status.toUpperCase()}

Stripe Transaction ID: ${transaction.stripeTransactionId}

${transaction.refundAmount ? `
REFUND DETAILS
--------------
Refund Amount: ${formatCurrency(transaction.refundAmount / 100)}
Reason: ${transaction.refundReason}
Refunded At: ${formatDateTime(transaction.refundedAt!)}
` : ''}

---
Healthcare Admin Platform
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${transaction.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full', statusInfo.bg)}>
              <StatusIcon className={cn('h-5 w-5', statusInfo.color)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
              <p className="text-sm text-gray-500">{transaction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Amount and Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(transaction.amount / 100)}
                <span className="text-sm font-normal text-gray-500 ml-2">{transaction.currency}</span>
              </p>
            </div>
            <div className={cn('px-4 py-2 rounded-lg flex items-center gap-2', statusInfo.bg)}>
              <StatusIcon className={cn('h-5 w-5', statusInfo.color)} />
              <span className={cn('font-medium', statusInfo.color)}>{statusInfo.label}</span>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Customer</h3>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-primary-100 rounded-full">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{transaction.userName}</p>
                <p className="text-sm text-gray-500">{transaction.userEmail}</p>
                <p className="text-xs text-gray-400 mt-1">{transaction.userId}</p>
              </div>
            </div>
          </div>

          {/* Therapist Details */}
          {transaction.therapistName && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Therapist</h3>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{transaction.therapistName}</p>
                  <p className="text-xs text-gray-400 mt-1">{transaction.therapistId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          {transaction.appointmentId && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Appointment</h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-mono text-gray-900">{transaction.appointmentId}</p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Payment Method</span>
                </div>
                <p className="font-medium text-gray-900">{getPaymentMethodLabel()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Platform Fee</span>
                </div>
                <p className="font-medium text-gray-900">{formatCurrency(transaction.platformFee / 100)}</p>
              </div>
              {transaction.therapistEarnings && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Therapist Earnings</span>
                  </div>
                  <p className="font-medium text-gray-900">{formatCurrency(transaction.therapistEarnings / 100)}</p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Transaction Date</span>
                </div>
                <p className="font-medium text-gray-900">{formatDateTime(transaction.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Stripe Transaction ID */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Stripe Transaction ID</h3>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <code className="flex-1 text-sm font-mono text-gray-700 break-all">
                {transaction.stripeTransactionId}
              </code>
              <button
                onClick={() => handleCopy(transaction.stripeTransactionId, 'stripe')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copiedField === 'stripe' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Refund Information (if refunded) */}
          {transaction.refundAmount && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Refund Details</h3>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Refund Amount</span>
                  <span className="font-semibold text-purple-900">{formatCurrency(transaction.refundAmount / 100)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Reason</span>
                  <span className="text-purple-900">{transaction.refundReason}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Refunded At</span>
                  <span className="text-purple-900">{formatDateTime(transaction.refundedAt!)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Refund Form */}
          {canRefund && showRefundForm && (
            <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Process Refund</h4>
                  <p className="text-sm text-red-700">This action will refund the customer and cannot be undone.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-red-800 mb-1">
                    Refund Amount (max: {formatCurrency(maxRefundAmount)})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0.01"
                      max={maxRefundAmount}
                      step="0.01"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                      className="input pl-8 border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-red-800 mb-1">
                    Refund Reason *
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="input border-red-300 focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Customer request">Customer request</option>
                    <option value="Therapist cancelled">Therapist cancelled</option>
                    <option value="Technical issue">Technical issue</option>
                    <option value="Double charge">Double charge</option>
                    <option value="Service not provided">Service not provided</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleRefund}
                    disabled={isProcessing || !refundReason || refundAmount <= 0 || refundAmount > maxRefundAmount}
                    className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Process Refund
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowRefundForm(false)}
                    className="btn btn-secondary"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={downloadInvoice}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </button>

          <div className="flex items-center gap-3">
            {canRefund && !showRefundForm && (
              <button
                onClick={() => setShowRefundForm(true)}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refund
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
