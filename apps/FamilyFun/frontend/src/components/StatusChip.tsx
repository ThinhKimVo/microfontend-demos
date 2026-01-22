import React from 'react';
import { Chip } from '@mui/material';
import type { EventStatus, SubscriptionStatus } from '../types';

interface StatusChipProps {
  status: EventStatus | SubscriptionStatus;
  size?: 'small' | 'medium';
}

const statusConfig: Record<
  EventStatus | SubscriptionStatus,
  { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; label: string }
> = {
  draft: { color: 'default', label: 'Draft' },
  submitted: { color: 'info', label: 'Submitted' },
  approved: { color: 'success', label: 'Approved' },
  rejected: { color: 'error', label: 'Rejected' },
  trial: { color: 'info', label: 'Trial' },
  active: { color: 'success', label: 'Active' },
  expired: { color: 'error', label: 'Expired' },
  cancelled: { color: 'warning', label: 'Cancelled' },
};

const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 600 }}
    />
  );
};

export default StatusChip;
