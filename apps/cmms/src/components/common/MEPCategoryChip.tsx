import React from 'react'
import { Chip, ChipProps } from '@mui/material'
import {
  AcUnit as HVACIcon,
  ElectricalServices as ElectricalIcon,
  WaterDrop as PlumbingIcon,
  LocalFireDepartment as FireIcon,
  Elevator as ElevatorIcon,
  SettingsRemote as BMSIcon,
  WbSunny as SolarIcon,
} from '@mui/icons-material'
import { MEP_CATEGORIES } from '../../utils/constants'
import { MEPCategory } from '../../types'

interface MEPCategoryChipProps extends Omit<ChipProps, 'color'> {
  category: MEPCategory
  showIcon?: boolean
}

const MEPCategoryChip: React.FC<MEPCategoryChipProps> = ({ category, showIcon = true, ...props }) => {
  const config = MEP_CATEGORIES.find(c => c.value === category) || { label: category, color: '#757575' }

  const getIcon = () => {
    if (!showIcon) return undefined
    const iconSx = { fontSize: 16 }
    switch (category) {
      case 'HVAC':
        return <HVACIcon sx={iconSx} />
      case 'Electrical':
        return <ElectricalIcon sx={iconSx} />
      case 'Plumbing':
        return <PlumbingIcon sx={iconSx} />
      case 'Fire':
        return <FireIcon sx={iconSx} />
      case 'Elevator':
        return <ElevatorIcon sx={iconSx} />
      case 'BMS':
        return <BMSIcon sx={iconSx} />
      case 'Solar':
        return <SolarIcon sx={iconSx} />
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

export default MEPCategoryChip
