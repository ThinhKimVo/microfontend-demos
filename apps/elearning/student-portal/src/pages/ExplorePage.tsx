import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  InputBase,
  Paper,
  alpha,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import CourseCard from '../components/common/CourseCard';
import { courses, categories } from '../data/mockData';

const levels = ['beginner', 'intermediate', 'advanced'];

export default function ExplorePage() {
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'popular');

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(c => c.category.slug === selectedCategory);
    }

    // Level filter
    if (selectedLevels.length > 0) {
      result = result.filter(c => selectedLevels.includes(c.level));
    }

    // Price filter
    if (priceFilter === 'free') {
      result = result.filter(c => c.price === 0);
    } else if (priceFilter === 'paid') {
      result = result.filter(c => c.price > 0);
    }

    // Rating filter
    if (ratingFilter > 0) {
      result = result.filter(c => c.rating >= ratingFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedLevels, priceFilter, ratingFilter, sortBy]);

  const handleLevelChange = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLevels([]);
    setPriceFilter('all');
    setRatingFilter(0);
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLevels.length > 0 || priceFilter !== 'all' || ratingFilter > 0;

  const currentCategory = categories.find(c => c.slug === selectedCategory);

  const FilterContent = () => (
    <Box sx={{ p: isMobile ? 2.5 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Filters
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setMobileFilterOpen(false)}
            sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Search in Filters */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          pl: 2,
          bgcolor: 'grey.100',
          borderRadius: 2,
          mb: 3,
          border: '1px solid',
          borderColor: 'transparent',
          transition: 'all 0.2s ease',
          '&:focus-within': {
            bgcolor: 'white',
            borderColor: 'primary.main',
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <SearchIcon sx={{ color: 'grey.500', mr: 1.5, fontSize: 20 }} />
        <InputBase
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, fontSize: '0.875rem' }}
        />
        {searchQuery && (
          <IconButton size="small" onClick={() => setSearchQuery('')}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Paper>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
          Category
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.slug}>
                {cat.name} ({cat.courseCount})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Level Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
          Level
        </Typography>
        <FormGroup>
          {levels.map(level => (
            <FormControlLabel
              key={level}
              control={
                <Checkbox
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleLevelChange(level)}
                  size="small"
                  sx={{ py: 0.75 }}
                />
              }
              label={
                <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                  {level}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Price Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
          Price
        </Typography>
        <RadioGroup value={priceFilter} onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}>
          <FormControlLabel
            value="all"
            control={<Radio size="small" sx={{ py: 0.75 }} />}
            label={<Typography variant="body2" fontWeight={500}>All Prices</Typography>}
          />
          <FormControlLabel
            value="free"
            control={<Radio size="small" sx={{ py: 0.75 }} />}
            label={<Typography variant="body2" fontWeight={500}>Free</Typography>}
          />
          <FormControlLabel
            value="paid"
            control={<Radio size="small" sx={{ py: 0.75 }} />}
            label={<Typography variant="body2" fontWeight={500}>Paid</Typography>}
          />
        </RadioGroup>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Rating Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          Minimum Rating
        </Typography>
        <Slider
          value={ratingFilter}
          onChange={(_, value) => setRatingFilter(value as number)}
          min={0}
          max={5}
          step={0.5}
          marks={[
            { value: 0, label: 'Any' },
            { value: 3, label: '3+' },
            { value: 4, label: '4+' },
            { value: 4.5, label: '4.5+' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mx: 1 }}
        />
      </Box>

      {hasActiveFilters && (
        <Button
          fullWidth
          variant="outlined"
          onClick={clearFilters}
          startIcon={<ClearIcon />}
          sx={{ borderRadius: 2 }}
        >
          Clear All Filters
        </Button>
      )}

      {isMobile && (
        <Button
          fullWidth
          variant="contained"
          onClick={() => setMobileFilterOpen(false)}
          sx={{ mt: 2, borderRadius: 2, py: 1.5 }}
        >
          Show {filteredCourses.length} Results
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: { xs: 3, sm: 4, md: 5 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            fontWeight={800} 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' } }}
          >
            {currentCategory ? currentCategory.name : 'Explore Courses'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {filteredCourses.length} courses found
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid size={{ xs: 12, md: 3 }}>
              <Card 
                sx={{ 
                  position: 'sticky', 
                  top: 85,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <TuneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={700}>
                      Filters
                    </Typography>
                  </Box>
                  <FilterContent />
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Course Grid */}
          <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
            {/* Sort & Filter Bar */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Active Filters */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
                {selectedCategory && (
                  <Chip
                    label={currentCategory?.name}
                    onDelete={() => setSelectedCategory('')}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      '& .MuiChip-deleteIcon': { color: 'primary.main' }
                    }}
                  />
                )}
                {selectedLevels.map(level => (
                  <Chip
                    key={level}
                    label={level}
                    onDelete={() => handleLevelChange(level)}
                    size="small"
                    sx={{ 
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: 'secondary.main',
                      '& .MuiChip-deleteIcon': { color: 'secondary.main' }
                    }}
                  />
                ))}
                {priceFilter !== 'all' && (
                  <Chip
                    label={priceFilter === 'free' ? 'Free' : 'Paid'}
                    onDelete={() => setPriceFilter('all')}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      '& .MuiChip-deleteIcon': { color: 'success.main' }
                    }}
                  />
                )}
                {ratingFilter > 0 && (
                  <Chip
                    label={`${ratingFilter}+ Rating`}
                    onDelete={() => setRatingFilter(0)}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: 'warning.dark',
                      '& .MuiChip-deleteIcon': { color: 'warning.dark' }
                    }}
                  />
                )}
              </Box>

              {/* Mobile Filter Button */}
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setMobileFilterOpen(true)}
                  sx={{ borderRadius: 2, flexShrink: 0 }}
                >
                  Filters
                </Button>
              )}

              {/* Sort Dropdown */}
              <FormControl size="small" sx={{ minWidth: { xs: 140, sm: 160 } }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="popular">Most Popular</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {filteredCourses.map(course => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id}>
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ textAlign: 'center', py: { xs: 6, sm: 8 }, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    No courses found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                    Try adjusting your filters or search query to find what you're looking for
                  </Typography>
                  <Button variant="outlined" onClick={clearFilters} sx={{ borderRadius: 2 }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{ 
          sx: { 
            width: { xs: '85%', sm: 320 },
            maxWidth: 360,
          } 
        }}
      >
        <FilterContent />
      </Drawer>
    </Box>
  );
}
