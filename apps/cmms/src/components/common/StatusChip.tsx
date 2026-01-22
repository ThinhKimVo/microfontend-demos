import React from 'react'
import { Chip, ChipProps } from '@mui/material'
import {
  WORK_ORDER_STATUSES,
  ASSET_STATUSES,
  BUILDING_STATUSES,
  REQUEST_STATUSES,
  TECHNICIAN_STATUSES,
} from '../../utils/constants'

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string
  type?: 'workOrder' | 'asset' | 'building' | 'request' | 'technician'
}

const StatusChip: React.FC<StatusChipProps> = ({ status, type = 'workOrder', ...props }) => {
  const getStatusConfig = () => {
    let statusList
    switch (type) {
      case 'asset':
        statusList = ASSET_STATUSES
        break
      case 'building':
        statusList = BUILDING_STATUSES
        break
      case 'request':
        statusList = REQUEST_STATUSES
        break
      case 'technician':
        statusList = TECHNICIAN_STATUSES
        break
      default:
        statusList = WORK_ORDER_STATUSES
    }
    return statusList.find(s => s.value === status) || { label: status, color: '#757575' }
  }

  const config = getStatusConfig()

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: `${config.color}15`,
        color: config.color,
        fontWeight: 500,
        borderRadius: 1.5,
        ...props.sx,
      }}
      {...props}
    />
  )
}

export default StatusChip
