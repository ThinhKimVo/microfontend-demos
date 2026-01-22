import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Divider,
  Alert,
  Tab,
  CircularProgress,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DISTRICTS, AGE_GROUPS, TIME_SLOTS } from '../../types';

const SubmitEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('1');
  const [isExtracting, setIsExtracting] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [extractedData, setExtractedData] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    titleTC: '',
    description: '',
    descriptionTC: '',
    date: '',
    endDate: '',
    timeSlot: '',
    district: '',
    address: '',
    ageGroups: [] as string[],
    price: '',
    isFree: false,
    isSenFriendly: false,
    externalUrl: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const handleAgeGroupToggle = (age: string) => {
    const newAgeGroups = formData.ageGroups.includes(age)
      ? formData.ageGroups.filter((a) => a !== age)
      : [...formData.ageGroups, age];
    setFormData({ ...formData, ageGroups: newAgeGroups });
  };

  const [extractionError, setExtractionError] = useState<string | null>(null);

  const simulateUrlExtraction = (url: string) => {
    const lowerUrl = url.toLowerCase();

    // Simulate different event types based on URL patterns
    if (lowerUrl.includes('science') || lowerUrl.includes('stem') || lowerUrl.includes('lab')) {
      return {
        title: 'Kids Science Workshop',
        titleTC: '兒童科學工作坊',
        description: 'An exciting hands-on science workshop for children. Learn about chemistry, physics, and biology through fun experiments.',
        date: '2025-02-15',
        timeSlot: 'afternoon',
        district: 'Central & Western',
        address: 'Science Centre, 123 Main Street, Central',
        ageGroups: ['6-8 years', '9-12 years'],
        price: '280',
        isFree: false,
      };
    } else if (lowerUrl.includes('art') || lowerUrl.includes('paint') || lowerUrl.includes('craft')) {
      return {
        title: 'Creative Art Workshop for Kids',
        titleTC: '兒童創意藝術工作坊',
        description: 'Let your child explore their creativity through painting, drawing, and mixed media art projects.',
        date: '2025-02-20',
        timeSlot: 'morning',
        district: 'Wan Chai',
        address: 'Art Studio, 45 Queen\'s Road East, Wan Chai',
        ageGroups: ['3-5 years', '6-8 years'],
        price: '350',
        isFree: false,
      };
    } else if (lowerUrl.includes('music') || lowerUrl.includes('dance') || lowerUrl.includes('concert')) {
      return {
        title: 'Kids Music & Movement Class',
        titleTC: '兒童音樂律動班',
        description: 'Fun music and dance class for young children. Learn rhythm, coordination, and musical expression.',
        date: '2025-02-18',
        timeSlot: 'morning',
        district: 'Kowloon City',
        address: 'Music Academy, 78 Prince Edward Road',
        ageGroups: ['0-2 years', '3-5 years'],
        price: '200',
        isFree: false,
      };
    } else if (lowerUrl.includes('sport') || lowerUrl.includes('swim') || lowerUrl.includes('soccer') || lowerUrl.includes('gym')) {
      return {
        title: 'Junior Sports Camp',
        titleTC: '青少年運動營',
        description: 'Active sports program including swimming, soccer, basketball, and team building activities.',
        date: '2025-03-01',
        timeSlot: 'full_day',
        district: 'Sha Tin',
        address: 'Sports Complex, 100 Sha Tin Centre Street',
        ageGroups: ['6-8 years', '9-12 years', '13-15 years'],
        price: '450',
        isFree: false,
      };
    } else if (lowerUrl.includes('free') || lowerUrl.includes('library') || lowerUrl.includes('park')) {
      return {
        title: 'Family Story Time at the Park',
        titleTC: '親子公園故事時間',
        description: 'Free outdoor story reading session for families. Bring a blanket and enjoy stories under the trees.',
        date: '2025-02-22',
        timeSlot: 'morning',
        district: 'Yau Tsim Mong',
        address: 'Kowloon Park, Tsim Sha Tsui',
        ageGroups: ['0-2 years', '3-5 years', '6-8 years'],
        price: '0',
        isFree: true,
      };
    } else if (lowerUrl.includes('coding') || lowerUrl.includes('robot') || lowerUrl.includes('tech')) {
      return {
        title: 'Kids Coding & Robotics Workshop',
        titleTC: '兒童編程機械人工作坊',
        description: 'Introduction to coding and robotics for beginners. Build and program your own robot!',
        date: '2025-02-25',
        timeSlot: 'afternoon',
        district: 'Kwun Tong',
        address: 'Tech Hub, 200 Kwun Tong Road',
        ageGroups: ['9-12 years', '13-15 years'],
        price: '480',
        isFree: false,
      };
    } else {
      // Default extraction based on URL parsing
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      const titleFromPath = pathParts.length > 0
        ? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'Event from ' + urlObj.hostname;

      return {
        title: titleFromPath,
        titleTC: '',
        description: `Event details extracted from ${urlObj.hostname}. Please review and complete the information.`,
        date: '',
        timeSlot: '',
        district: '',
        address: '',
        ageGroups: [] as string[],
        price: '',
        isFree: false,
      };
    }
  };

  const handleExtractFromUrl = () => {
    if (!urlInput) return;
    setIsExtracting(true);
    setExtractionError(null);

    // Validate URL format
    try {
      new URL(urlInput);
    } catch {
      setIsExtracting(false);
      setExtractionError('Invalid URL format. Please enter a valid URL starting with http:// or https://');
      return;
    }

    // Simulate AI extraction with varying delay based on URL complexity
    const delay = 1500 + Math.random() * 1500; // 1.5-3 seconds

    setTimeout(() => {
      try {
        const extractedInfo = simulateUrlExtraction(urlInput);
        setFormData({
          ...formData,
          ...extractedInfo,
          externalUrl: urlInput,
        });
        setExtractedData(true);
        setIsExtracting(false);
        setTabValue('2');
      } catch {
        setIsExtracting(false);
        setExtractionError('Failed to extract event details. Please try again or enter details manually.');
      }
    }, delay);
  };

  const handleSaveDraft = () => {
    alert('Event saved as draft');
    navigate('/merchant/events');
  };

  const handleSubmit = () => {
    alert('Event submitted for review');
    navigate('/merchant/events');
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Submit New Event
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create your event manually or import from a URL using AI
      </Typography>

      <TabContext value={tabValue}>
        <Paper sx={{ mb: 3 }}>
          <TabList onChange={(_, val) => setTabValue(val)}>
            <Tab
              icon={<LinkIcon />}
              iconPosition="start"
              label="Import from URL"
              value="1"
            />
            <Tab
              icon={<EditIcon />}
              iconPosition="start"
              label="Manual Entry"
              value="2"
            />
          </TabList>
        </Paper>

        {/* URL Import Tab */}
        <TabPanel value="1" sx={{ p: 0 }}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AutoFixHighIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  AI-Powered Import
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paste your event URL and we'll extract the details automatically
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="https://example.com/event-page"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isExtracting}
              />
              <Button
                variant="contained"
                onClick={handleExtractFromUrl}
                disabled={!urlInput || isExtracting}
                sx={{ minWidth: 150 }}
              >
                {isExtracting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                    Extracting...
                  </>
                ) : (
                  'Extract'
                )}
              </Button>
            </Box>

            {extractionError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {extractionError}
              </Alert>
            )}

            {extractedData && !extractionError && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Event details extracted successfully! Review and edit the information below.
              </Alert>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                Try these example URLs to see the simulator in action:
              </Typography>
              <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, mb: 0 }}>
                <li>https://example.com/kids-science-workshop</li>
                <li>https://example.com/art-painting-class</li>
                <li>https://example.com/music-dance-class</li>
                <li>https://example.com/sports-camp</li>
                <li>https://example.com/free-park-event</li>
                <li>https://example.com/coding-robotics</li>
              </Typography>
            </Box>
          </Paper>
        </TabPanel>

        {/* Manual Entry Tab */}
        <TabPanel value="2" sx={{ p: 0 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Basic Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Event Title (English)"
                  value={formData.title}
                  onChange={handleChange('title')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Event Title (Traditional Chinese)"
                  value={formData.titleTC}
                  onChange={handleChange('titleTC')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description (English)"
                  value={formData.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description (Traditional Chinese)"
                  value={formData.descriptionTC}
                  onChange={handleChange('descriptionTC')}
                  multiline
                  rows={4}
                  placeholder="Optional"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Date, Time & Location
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                  InputLabelProps={{ shrink: true }}
                  helperText="Optional - for multi-day events"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Time Slot</InputLabel>
                  <Select
                    value={formData.timeSlot}
                    label="Time Slot"
                    onChange={handleSelectChange('timeSlot')}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <MenuItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>District</InputLabel>
                  <Select
                    value={formData.district}
                    label="District"
                    onChange={handleSelectChange('district')}
                  >
                    {DISTRICTS.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Address"
                  value={formData.address}
                  onChange={handleChange('address')}
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Age Groups
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {AGE_GROUPS.map((age) => (
                <Chip
                  key={age}
                  label={age}
                  onClick={() => handleAgeGroupToggle(age)}
                  color={formData.ageGroups.includes(age) ? 'primary' : 'default'}
                  variant={formData.ageGroups.includes(age) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pricing & Options
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Price (HKD)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange('price')}
                  disabled={formData.isFree}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>HK$</Typography>,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isFree}
                        onChange={handleCheckboxChange('isFree')}
                      />
                    }
                    label="This is a free event"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isSenFriendly}
                        onChange={handleCheckboxChange('isSenFriendly')}
                      />
                    }
                    label="SEN Friendly"
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Event Image
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Drag and drop an image here, or click to upload
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recommended: 1200x630px, max 5MB
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <TextField
              fullWidth
              label="External Event URL"
              value={formData.externalUrl}
              onChange={handleChange('externalUrl')}
              placeholder="https://example.com/your-event"
              helperText="Optional - Link to the original event page"
            />
          </Paper>
        </TabPanel>
      </TabContext>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 3,
        }}
      >
        <Button variant="outlined" onClick={handleSaveDraft}>
          Save as Draft
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit for Review
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitEventPage;
