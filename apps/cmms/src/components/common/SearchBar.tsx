import React from 'react'
import { TextField, InputAdornment, TextFieldProps } from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'

interface SearchBarProps extends Omit<TextFieldProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  ...props
}) => {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      sx={{
        minWidth: 250,
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
        },
        ...props.sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      {...props}
    />
  )
}

export default SearchBar
