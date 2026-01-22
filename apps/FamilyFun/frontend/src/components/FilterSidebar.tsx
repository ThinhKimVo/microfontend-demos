import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import type { FilterOptions } from '../types';
import { DISTRICTS, AGE_GROUPS, TIME_SLOTS } from '../types';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  language?: 'en' | 'tc';
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  language = 'en',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleChange = (field: keyof FilterOptions, value: string | boolean) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      date: '',
      timeSlot: '',
      district: '',
      ageGroup: '',
      priceType: '',
      isSenFriendly: false,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== '' && v !== false && v !== undefined
  ).length;

  const filterContent = (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {language === 'en' ? 'Filters' : '篩選'}
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {!isMobile && (
          <Typography variant="h6" fontWeight={600}>
            <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'en' ? 'Filters' : '篩選'}
          </Typography>
        )}
        {activeFiltersCount > 0 && (
          <Button size="small" onClick={clearFilters}>
            {language === 'en' ? 'Clear all' : '清除全部'}
          </Button>
        )}
      </Box>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>
            {language === 'en' ? 'Date' : '日期'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            type="date"
            fullWidth
            size="small"
            value={filters.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>
            {language === 'en' ? 'Time Slot' : '時段'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {TIME_SLOTS.map((slot) => (
              <Chip
                key={slot.value}
                label={slot.label.split(' ')[0]}
                onClick={() =>
                  handleChange('timeSlot', filters.timeSlot === slot.value ? '' : slot.value)
                }
                color={filters.timeSlot === slot.value ? 'primary' : 'default'}
                variant={filters.timeSlot === slot.value ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>
            {language === 'en' ? 'District' : '地區'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>{language === 'en' ? 'Select District' : '選擇地區'}</InputLabel>
            <Select
              value={filters.district || ''}
              label={language === 'en' ? 'Select District' : '選擇地區'}
              onChange={(e) => handleChange('district', e.target.value)}
            >
              <MenuItem value="">
                <em>{language === 'en' ? 'All Districts' : '所有地區'}</em>
              </MenuItem>
              {DISTRICTS.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>
            {language === 'en' ? 'Age Group' : '年齡組'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>{language === 'en' ? 'Select Age' : '選擇年齡'}</InputLabel>
            <Select
              value={filters.ageGroup || ''}
              label={language === 'en' ? 'Select Age' : '選擇年齡'}
              onChange={(e) => handleChange('ageGroup', e.target.value)}
            >
              <MenuItem value="">
                <em>{language === 'en' ? 'All Ages' : '所有年齡'}</em>
              </MenuItem>
              {AGE_GROUPS.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>
            {language === 'en' ? 'Price' : '價格'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={language === 'en' ? 'Free' : '免費'}
              onClick={() =>
                handleChange('priceType', filters.priceType === 'free' ? '' : 'free')
              }
              color={filters.priceType === 'free' ? 'success' : 'default'}
              variant={filters.priceType === 'free' ? 'filled' : 'outlined'}
            />
            <Chip
              label={language === 'en' ? 'Paid' : '付費'}
              onClick={() =>
                handleChange('priceType', filters.priceType === 'paid' ? '' : 'paid')
              }
              color={filters.priceType === 'paid' ? 'primary' : 'default'}
              variant={filters.priceType === 'paid' ? 'filled' : 'outlined'}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.isSenFriendly || false}
              onChange={(e) => handleChange('isSenFriendly', e.target.checked)}
              color="info"
            />
          }
          label={
            <Typography variant="body2" fontWeight={500}>
              {language === 'en' ? 'SEN Friendly Only' : '只顯示SEN友善活動'}
            </Typography>
          }
        />
      </Box>

      {isMobile && (
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => setMobileOpen(false)}
        >
          {language === 'en' ? 'Apply Filters' : '套用篩選'}
          {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </Button>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setMobileOpen(true)}
          sx={{ mb: 2 }}
        >
          {language === 'en' ? 'Filters' : '篩選'}
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ ml: 1, height: 20 }}
            />
          )}
        </Button>
        <Drawer
          anchor="bottom"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '80vh',
            },
          }}
        >
          {filterContent}
        </Drawer>
      </>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        position: 'sticky',
        top: 80,
      }}
    >
      {filterContent}
    </Box>
  );
};

export default FilterSidebar;
