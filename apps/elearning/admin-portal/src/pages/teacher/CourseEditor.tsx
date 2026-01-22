import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
  Add as AddIcon,
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayCircle as VideoIcon,
  Article as TextIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { categories } from '../../data/mockData';

const steps = ['Basic Info', 'Curriculum', 'Settings', 'Publish'];

export default function CourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    level: 'beginner',
    price: '',
    language: 'English',
    thumbnail: '',
  });

  const [sections] = useState([
    {
      id: '1',
      title: 'Introduction',
      lessons: [
        { id: '1', title: 'Welcome to the Course', type: 'video', duration: 5 },
        { id: '2', title: 'Course Overview', type: 'video', duration: 10 },
      ],
    },
    {
      id: '2',
      title: 'Getting Started',
      lessons: [
        { id: '3', title: 'Setting Up', type: 'video', duration: 15 },
        { id: '4', title: 'First Steps', type: 'text', duration: 10 },
      ],
    },
  ]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setCourseData(prev => ({ ...prev, [field]: (e.target as HTMLInputElement).value }));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon fontSize="small" />;
      case 'text': return <TextIcon fontSize="small" />;
      case 'quiz': return <QuizIcon fontSize="small" />;
      case 'assignment': return <AssignmentIcon fontSize="small" />;
      default: return <VideoIcon fontSize="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/teacher/courses')}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<SaveIcon />} sx={{ mr: 1 }}>
          Save Draft
        </Button>
        <Button variant="contained" startIcon={<PublishIcon />}>
          Publish
        </Button>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Course Title"
                      value={courseData.title}
                      onChange={handleChange('title')}
                      placeholder="e.g., Complete React Developer Course"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Short Description"
                      value={courseData.shortDescription}
                      onChange={handleChange('shortDescription')}
                      placeholder="A brief summary of your course"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Full Description"
                      value={courseData.description}
                      onChange={handleChange('description')}
                      placeholder="Detailed description of what students will learn"
                      multiline
                      rows={6}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={courseData.categoryId}
                        label="Category"
                        onChange={(e) => setCourseData(prev => ({ ...prev, categoryId: e.target.value }))}
                      >
                        {categories.map(cat => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={courseData.level}
                        label="Level"
                        onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Price (USD)"
                      type="number"
                      value={courseData.price}
                      onChange={handleChange('price')}
                      placeholder="0 for free"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={courseData.language}
                        label="Language"
                        onChange={(e) => setCourseData(prev => ({ ...prev, language: e.target.value }))}
                      >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Course Curriculum
                  </Typography>
                  <Button startIcon={<AddIcon />} variant="outlined" size="small">
                    Add Section
                  </Button>
                </Box>

                {sections.map((section, sIndex) => (
                  <Box key={section.id} sx={{ mb: 3, bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <DragIcon sx={{ color: 'grey.400', cursor: 'grab' }} />
                      <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
                        Section {sIndex + 1}: {section.title}
                      </Typography>
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>

                    <List dense>
                      {section.lessons.map((lesson) => (
                        <ListItem
                          key={lesson.id}
                          sx={{
                            bgcolor: 'white',
                            mb: 1,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <DragIcon sx={{ color: 'grey.400', mr: 1, cursor: 'grab' }} />
                          {getLessonIcon(lesson.type)}
                          <ListItemText
                            primary={lesson.title}
                            secondary={`${lesson.duration} min`}
                            sx={{ ml: 1 }}
                          />
                          <Chip label={lesson.type} size="small" sx={{ mr: 1 }} />
                          <ListItemSecondaryAction>
                            <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                            <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>

                    <Button startIcon={<AddIcon />} size="small" sx={{ mt: 1 }}>
                      Add Lesson
                    </Button>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Course Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Certificate
                    </Typography>
                    <FormControl fullWidth>
                      <Select defaultValue="enabled">
                        <MenuItem value="enabled">Enable Certificate</MenuItem>
                        <MenuItem value="disabled">Disable Certificate</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Discussion Forum
                    </Typography>
                    <FormControl fullWidth>
                      <Select defaultValue="enabled">
                        <MenuItem value="enabled">Enable Discussion</MenuItem>
                        <MenuItem value="disabled">Disable Discussion</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {activeStep === 3 && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Ready to Publish?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Review your course and submit for approval. Our team will review it within 24-48 hours.
                </Typography>
                <Button variant="contained" size="large" startIcon={<PublishIcon />}>
                  Submit for Review
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Course Thumbnail
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '16/9',
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  cursor: 'pointer',
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Click to upload
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Course Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Sections</Typography>
                <Typography variant="body2" fontWeight={600}>{sections.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Lessons</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {sections.reduce((sum, s) => sum + s.lessons.length, 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Duration</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {sections.reduce((sum, s) => sum + s.lessons.reduce((lSum, l) => lSum + l.duration, 0), 0)} min
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(prev => prev - 1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length - 1))}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}
