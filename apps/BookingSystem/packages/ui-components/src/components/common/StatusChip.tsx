import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'verified'
  | 'superhost'
  | 'instant_book';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType;
  locale?: 'en' | 'ar';
}

const statusConfig: Record<StatusType, {
  labelEn: string;
  labelAr: string;
  color: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'default';
  icon?: React.ReactElement;
}> = {
  active: {
    labelEn: 'Active',
    labelAr: 'نشط',
    color: 'success',
    icon: <CheckCircleIcon />,
  },
  inactive: {
    labelEn: 'Inactive',
    labelAr: 'غير نشط',
    color: 'default',
  },
  pending: {
    labelEn: 'Pending',
    labelAr: 'قيد الانتظار',
    color: 'warning',
    icon: <PendingIcon />,
  },
  confirmed: {
    labelEn: 'Confirmed',
    labelAr: 'مؤكد',
    color: 'success',
    icon: <CheckCircleIcon />,
  },
  cancelled: {
    labelEn: 'Cancelled',
    labelAr: 'ملغي',
    color: 'error',
    icon: <CancelIcon />,
  },
  completed: {
    labelEn: 'Completed',
    labelAr: 'مكتمل',
    color: 'success',
    icon: <CheckCircleIcon />,
  },
  verified: {
    labelEn: 'Verified',
    labelAr: 'موثق',
    color: 'info',
    icon: <VerifiedIcon />,
  },
  superhost: {
    labelEn: 'Superhost',
    labelAr: 'مضيف مميز',
    color: 'secondary',
    icon: <StarIcon />,
  },
  instant_book: {
    labelEn: 'Instant Book',
    labelAr: 'حجز فوري',
    color: 'primary',
  },
};

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  locale = 'en',
  size = 'small',
  ...props
}) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={locale === 'ar' ? config.labelAr : config.labelEn}
      color={config.color}
      size={size}
      icon={config.icon}
      {...props}
    />
  );
};

export default StatusChip;
