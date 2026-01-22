import React, { useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventCard from '../../components/EventCard';
import FilterSidebar from '../../components/FilterSidebar';
import { mockEvents } from '../../data/mockData';
import type { FilterOptions } from '../../types';

interface EventsPageProps {
  language?: 'en' | 'tc';
}

const EventsPage: React.FC<EventsPageProps> = ({ language = 'en' }) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const filteredEvents = useMemo(() => {
    let result = [...mockEvents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.district.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (filters.date) {
      result = result.filter((e) => e.date === filters.date);
    }

    // Time slot filter
    if (filters.timeSlot) {
      result = result.filter((e) => e.timeSlot === filters.timeSlot);
    }

    // District filter
    if (filters.district) {
      result = result.filter((e) => e.district === filters.district);
    }

    // Age group filter
    if (filters.ageGroup) {
      result = result.filter((e) => e.ageGroup.includes(filters.ageGroup!));
    }

    // Price filter
    if (filters.priceType === 'free') {
      result = result.filter((e) => e.isFree);
    } else if (filters.priceType === 'paid') {
      result = result.filter((e) => !e.isFree);
    }

    // SEN friendly filter
    if (filters.isSenFriendly) {
      result = result.filter((e) => e.isSenFriendly);
    }

    // Sorting
    switch (sortBy) {
      case 'date':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    return result;
  }, [mockEvents, filters, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== '' && v !== false && v !== undefined
  ).length;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', py: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {language === 'en' ? 'All Events' : '所有活動'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {language === 'en'
              ? `Discover ${filteredEvents.length} family-friendly events in Hong Kong`
              : `探索香港 ${filteredEvents.length} 個親子活動`}
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder={language === 'en' ? 'Search events...' : '搜索活動...'}
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{language === 'en' ? 'Sort by' : '排序'}</InputLabel>
              <Select
                value={sortBy}
                label={language === 'en' ? 'Sort by' : '排序'}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date">
                  {language === 'en' ? 'Date (Upcoming)' : '日期（即將舉行）'}
                </MenuItem>
                <MenuItem value="popular">
                  {language === 'en' ? 'Most Popular' : '最受歡迎'}
                </MenuItem>
                <MenuItem value="price-low">
                  {language === 'en' ? 'Price: Low to High' : '價格：由低至高'}
                </MenuItem>
                <MenuItem value="price-high">
                  {language === 'en' ? 'Price: High to Low' : '價格：由高至低'}
                </MenuItem>
              </Select>
            </FormControl>

            {activeFiltersCount > 0 && (
              <Chip
                label={
                  language === 'en'
                    ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`
                    : `${activeFiltersCount} 個篩選條件`
                }
                color="primary"
                variant="outlined"
                onDelete={() => setFilters({})}
              />
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FilterSidebar
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
              language={language}
            />
          </Grid>

          {/* Events Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            {paginatedEvents.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {paginatedEvents.map((event) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={event.id}>
                      <EventCard event={event} language={language} />
                    </Grid>
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 5,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 10,
                  bgcolor: 'white',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {language === 'en' ? 'No events found' : '找不到活動'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {language === 'en'
                    ? 'Try adjusting your filters or search query'
                    : '嘗試調整篩選條件或搜索關鍵字'}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventsPage;
