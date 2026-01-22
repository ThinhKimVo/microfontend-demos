import React from 'react'
import { Chip, ChipProps } from '@mui/material'
import {
  PriorityHigh as CriticalIcon,
  ArrowUpward as HighIcon,
  Remove as MediumIcon,
  ArrowDownward as LowIcon,
} from '@mui/icons-material'
import { PRIORITIES } from '../../utils/constants'
import { Priority } from '../../types'

interface PriorityChipProps extends Omit<ChipProps, 'color'> {
  priority: Priority
  showIcon?: boolean
}

const PriorityChip: React.FC<PriorityChipProps> = ({ priority, showIcon = true, ...props }) => {
  const config = PRIORITIES.find(p => p.value === priority) || { label: priority, color: '#757575' }

  const getIcon = () => {
    if (!showIcon) return undefined
    switch (priority) {
      case 'Critical':
        return <CriticalIcon sx={{ fontSize: 16 }} />
      case 'High':
        return <HighIcon sx={{ fontSize: 16 }} />
      case 'Medium':
        return <MediumIcon sx={{ fontSize: 16 }} />
      case 'Low':
        return <LowIcon sx={{ fontSize: 16 }} />
      default:
        return undefined
    }
  }

  return (
    <Chip
      icon={getIcon()}
      label={config.label}
      size="small"
      sx={{
        bgcolor: `${config.color}15`,
        color: config.color,
        fontWeight: 500,
        borderRadius: 1.5,
        '& .MuiChip-icon': {
          color: config.color,
        },
        ...props.sx,
      }}
      {...props}
    />
  )
}

export default PriorityChip
