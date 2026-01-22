import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
  Box,
  Avatar,
  alpha,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export interface ActivityItem {
  id: string;
  type: 'asset_created' | 'asset_updated' | 'maintenance_completed' | 'maintenance_scheduled';
  title: string;
  description: string;
  timestamp: Date;
  assetId?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
}

function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  const getActivityConfig = (type: ActivityItem['type']) => {
    switch (type) {
      case 'asset_created':
        return {
          icon: <AddIcon sx={{ fontSize: 18 }} />,
          color: theme.palette.success,
          label: 'Created',
        };
      case 'asset_updated':
        return {
          icon: <EditIcon sx={{ fontSize: 18 }} />,
          color: theme.palette.info,
          label: 'Updated',
        };
      case 'maintenance_completed':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
          color: theme.palette.success,
          label: 'Completed',
        };
      case 'maintenance_scheduled':
        return {
          icon: <BuildIcon sx={{ fontSize: 18 }} />,
          color: theme.palette.warning,
          label: 'Scheduled',
        };
      default:
        return {
          icon: <EditIcon sx={{ fontSize: 18 }} />,
          color: { main: theme.palette.grey[500], light: theme.palette.grey[400], dark: theme.palette.grey[600] },
          label: 'Activity',
        };
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6">
            Recent Activity
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {displayedActivities.length === 0 ? (
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
              <HistoryIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            </Box>
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 0.5 }}>
              No Activity Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by adding your first asset.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {displayedActivities.map((activity, index) => {
              const config = getActivityConfig(activity.type);
              const isLast = index === displayedActivities.length - 1;

              return (
                <ListItem
                  key={activity.id}
                  sx={{
                    px: 0,
                    py: 1.5,
                    cursor: activity.assetId ? 'pointer' : 'default',
                    position: 'relative',
                    '&:hover': activity.assetId
                      ? {
                          '& .activity-content': {
                            bgcolor: alpha(theme.palette.grey[500], 0.04),
                          },
                        }
                      : {},
                  }}
                  onClick={() => {
                    if (activity.assetId) {
                      navigate(`/assets/${activity.assetId}`);
                    }
                  }}
                >
                  {/* Timeline line */}
                  {!isLast && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 19,
                        top: 48,
                        bottom: 0,
                        width: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.16),
                      }}
                    />
                  )}

                  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha(config.color.main, 0.12),
                        color: config.color.main,
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {config.icon}
                    </Avatar>

                    {/* Content */}
                    <Box
                      className="activity-content"
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        py: 0.5,
                        px: 1.5,
                        borderRadius: 1.5,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{ mb: 0.25 }}
                      >
                        {activity.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <TimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {dayjs(activity.timestamp).fromNow()}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
