import React from 'react';
import { Button, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface LanguageToggleProps {
  currentLanguage: 'en' | 'ar';
  onLanguageChange: (language: 'en' | 'ar') => void;
  variant?: 'button' | 'icon' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
  variant = 'button',
  size = 'medium',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (language: 'en' | 'ar') => {
    onLanguageChange(language);
    handleClose();
  };

  const languages = [
    { code: 'en' as const, label: 'English', nativeLabel: 'English' },
    { code: 'ar' as const, label: 'Arabic', nativeLabel: 'العربية' },
  ];

  const currentLang = languages.find((l) => l.code === currentLanguage);

  if (variant === 'icon') {
    return (
      <>
        <IconButton
          onClick={handleClick}
          size={size}
          aria-label="Select language"
        >
          <LanguageIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              selected={lang.code === currentLanguage}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">{lang.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {lang.nativeLabel}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  if (variant === 'text') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code}>
            <Typography
              variant="body2"
              component="button"
              onClick={() => onLanguageChange(lang.code)}
              sx={{
                cursor: 'pointer',
                fontWeight: lang.code === currentLanguage ? 600 : 400,
                color: lang.code === currentLanguage ? 'primary.main' : 'text.secondary',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {lang.nativeLabel}
            </Typography>
            {index < languages.length - 1 && (
              <Typography color="text.secondary">|</Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  }

  return (
    <>
      <Button
        onClick={handleClick}
        size={size}
        startIcon={<LanguageIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: 'text.primary',
          textTransform: 'none',
        }}
      >
        {currentLang?.nativeLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            selected={lang.code === currentLanguage}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{lang.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {lang.nativeLabel}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageToggle;
