import React from 'react';
import { Card, CardContent, Box, Typography, alpha, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  onClick?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  onClick,
  trend,
}: SummaryCardProps) {
  const theme = useTheme();

  const colorMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    info: theme.palette.info,
  };

  const selectedColor = colorMap[color];

  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 24px -4px ${alpha(selectedColor.main, 0.16)}`,
            }
          : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(selectedColor.lighter || selectedColor.light, 0.2)} 0%, ${alpha(selectedColor.light, 0.04)} 100%)`,
          zIndex: 0,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                mb: 2,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: trend ? 1.5 : 0.5,
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>

            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend.isPositive ? (
                  <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 20, color: 'error.main' }} />
                )}
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  than last week
                </Typography>
              </Box>
            )}

            {subtitle && !trend && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${selectedColor.light} 0%, ${selectedColor.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedColor.contrastText,
              flexShrink: 0,
              boxShadow: `0 8px 16px 0 ${alpha(selectedColor.main, 0.24)}`,
              '& .MuiSvgIcon-root': {
                fontSize: 28,
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>

      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: alpha(selectedColor.main, 0.08),
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: alpha(selectedColor.main, 0.04),
          zIndex: 0,
        }}
      />
    </Card>
  );
}

export default SummaryCard;
