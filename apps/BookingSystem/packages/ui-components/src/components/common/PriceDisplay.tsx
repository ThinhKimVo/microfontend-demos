import React from 'react';
import { Box, Typography } from '@mui/material';
import { Currency } from '@staygcc/shared/types';

interface PriceDisplayProps {
  amount: number;
  currency: Currency;
  locale?: 'en' | 'ar';
  perNight?: boolean;
  originalAmount?: number;
  size?: 'small' | 'medium' | 'large';
}

const currencySymbols: Record<Currency, { en: string; ar: string }> = {
  SAR: { en: 'SAR', ar: 'ر.س' },
  AED: { en: 'AED', ar: 'د.إ' },
  KWD: { en: 'KWD', ar: 'د.ك' },
  BHD: { en: 'BHD', ar: 'د.ب' },
  OMR: { en: 'OMR', ar: 'ر.ع' },
  QAR: { en: 'QAR', ar: 'ر.ق' },
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency,
  locale = 'en',
  perNight = false,
  originalAmount,
  size = 'medium',
}) => {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const symbol = currencySymbols[currency][locale];
  const formattedAmount = formatAmount(amount);

  const fontSize = {
    small: { main: '0.875rem', sub: '0.75rem' },
    medium: { main: '1.125rem', sub: '0.875rem' },
    large: { main: '1.5rem', sub: '1rem' },
  };

  const hasDiscount = originalAmount && originalAmount > amount;

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap' }}>
      {hasDiscount && (
        <Typography
          component="span"
          sx={{
            fontSize: fontSize[size].sub,
            color: 'text.secondary',
            textDecoration: 'line-through',
          }}
        >
          {locale === 'ar' ? `${formatAmount(originalAmount)} ${symbol}` : `${symbol} ${formatAmount(originalAmount)}`}
        </Typography>
      )}
      <Typography
        component="span"
        fontWeight={600}
        sx={{
          fontSize: fontSize[size].main,
          color: hasDiscount ? 'secondary.main' : 'text.primary',
        }}
      >
        {locale === 'ar' ? `${formattedAmount} ${symbol}` : `${symbol} ${formattedAmount}`}
      </Typography>
      {perNight && (
        <Typography
          component="span"
          color="text.secondary"
          sx={{ fontSize: fontSize[size].sub }}
        >
          {locale === 'ar' ? '/ ليلة' : '/ night'}
        </Typography>
      )}
    </Box>
  );
};

export default PriceDisplay;
