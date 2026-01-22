import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  alpha,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
  NotificationsActive as NotificationIcon,
} from '@mui/icons-material';
import { AlertItem } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface AlertsWidgetProps {
  alerts: AlertItem[];
  title?: string;
  maxItems?: number;
}

function AlertsWidget({ alerts, title = 'Alerts', maxItems = 5 }: AlertsWidgetProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  const getAlertConfig = (type: AlertItem['type'], severity: AlertItem['severity']) => {
    if (type === 'maintenance_overdue' || severity === 'high') {
      return {
        icon: <ErrorIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.error,
        bgColor: alpha(theme.palette.error.main, 0.08),
      };
    }
    if (severity === 'medium') {
      return {
        icon: <WarningIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.warning,
        bgColor: alpha(theme.palette.warning.main, 0.08),
      };
    }
    return {
      icon: <ScheduleIcon sx={{ fontSize: 20 }} />,
      color: theme.palette.info,
      bgColor: alpha(theme.palette.info.main, 0.08),
    };
  };

  const getSeverityChipConfig = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'high':
        return {
          color: theme.palette.error.main,
          bgcolor: alpha(theme.palette.error.main, 0.12),
        };
      case 'medium':
        return {
          color: theme.palette.warning.dark,
          bgcolor: alpha(theme.palette.warning.main, 0.12),
        };
      default:
        return {
          color: theme.palette.info.main,
          bgcolor: alpha(theme.palette.info.main, 0.12),
        };
    }
  };

  const getTypeLabel = (type: AlertItem['type']) => {
    switch (type) {
      case 'maintenance_overdue':
        return 'Overdue';
      case 'maintenance_due':
        return 'Due Soon';
      case 'warranty_expiring':
        return 'Warranty';
      default:
        return type;
    }
  };

  const displayedAlerts = alerts.slice(0, maxItems);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h6">
              {title}
            </Typography>
            {alerts.length > 0 && (
              <Chip
                size="small"
                label={alerts.length}
                sx={{
                  height: 24,
                  minWidth: 24,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.error.main, 0.12),
                  color: theme.palette.error.main,
                }}
              />
            )}
          </Stack>
        }
        action={
          alerts.length > maxItems && (
            <Button
              size="small"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate('/maintenance')}
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
            >
              View All
            </Button>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {displayedAlerts.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.grey[500], 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              <NotificationIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            </Box>
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 0.5 }}>
              All Clear!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No maintenance alerts at this time.
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {displayedAlerts.map((alert) => {
              const config = getAlertConfig(alert.type, alert.severity);
              const chipConfig = getSeverityChipConfig(alert.severity);

              return (
                <ListItem
                  key={alert.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: alpha(theme.palette.grey[500], 0.04),
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.grey[500], 0.08),
                      transform: 'translateX(4px)',
                    },
                  }}
                  onClick={() => navigate(`/assets/${alert.assetId}`)}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: config.bgColor,
                      color: config.color.main,
                    }}
                  >
                    {config.icon}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 0.5 }}
                    >
                      <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{ flex: 1 }}
                      >
                        {alert.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={getTypeLabel(alert.type)}
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          borderRadius: 1,
                          ...chipConfig,
                        }}
                      />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {alert.assetName}
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          width: 3,
                          height: 3,
                          borderRadius: '50%',
                          bgcolor: 'text.disabled',
                        }}
                      />
                      <TimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(alert.dueDate).fromNow()}
                      </Typography>
                    </Stack>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default AlertsWidget;
