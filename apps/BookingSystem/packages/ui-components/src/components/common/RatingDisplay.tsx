import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showCount?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  size = 'medium',
  showLabel = true,
  showCount = true,
}) => {
  const iconSize = {
    small: 14,
    medium: 18,
    large: 22,
  };

  const fontSize = {
    small: '0.75rem',
    medium: '0.875rem',
    large: '1rem',
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <StarIcon
        sx={{
          fontSize: iconSize[size],
          color: 'rating',
        }}
      />
      {showLabel && (
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ fontSize: fontSize[size] }}
        >
          {rating.toFixed(2)}
        </Typography>
      )}
      {showCount && reviewCount !== undefined && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: fontSize[size] }}
        >
          ({reviewCount})
        </Typography>
      )}
    </Box>
  );
};

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  readOnly?: boolean;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  label,
  size = 'medium',
  readOnly = false,
}) => {
  return (
    <Box>
      {label && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Rating
        value={value}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
        size={size}
        readOnly={readOnly}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" sx={{ opacity: 0.3 }} />}
      />
    </Box>
  );
};

export default RatingDisplay;
