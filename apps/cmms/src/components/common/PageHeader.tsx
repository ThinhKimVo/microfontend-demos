import React from 'react'
import { Box, Typography, Breadcrumbs, Link, Button, SxProps, Theme } from '@mui/material'
import { NavigateNext as NavigateNextIcon, Add as AddIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  action?: {
    label: string
    icon?: React.ReactNode
    onClick: () => void
  }
  children?: React.ReactNode
  sx?: SxProps<Theme>
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
  children,
  sx,
}) => {
  const navigate = useNavigate()

  return (
    <Box sx={{ mb: 3, ...sx }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return isLast || !crumb.path ? (
              <Typography
                key={index}
                variant="body2"
                color={isLast ? 'text.primary' : 'text.secondary'}
                sx={{ fontWeight: isLast ? 500 : 400 }}
              >
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                component="button"
                variant="body2"
                color="text.secondary"
                underline="hover"
                onClick={() => navigate(crumb.path!)}
                sx={{ cursor: 'pointer' }}
              >
                {crumb.label}
              </Link>
            )
          })}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {children}
          {action && (
            <Button
              variant="contained"
              startIcon={action.icon || <AddIcon />}
              onClick={action.onClick}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {action.label}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PageHeader
