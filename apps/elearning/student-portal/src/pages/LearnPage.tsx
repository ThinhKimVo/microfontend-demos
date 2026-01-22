import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  IconButton,
  Checkbox,
  TextField,
  Chip,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayCircle as VideoIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Description as ResourceIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { courses, courseSections, discussions, enrollments } from '../data/mockData';

const DRAWER_WIDTH = 360;

const lessonTypeIcons = {
  video: VideoIcon,
  text: ArticleIcon,
  quiz: QuizIcon,
  assignment: AssignmentIcon,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function LearnPage() {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [tabValue, setTabValue] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const course = courses.find(c => c.slug === courseSlug);
  const sections = courseSections.filter(s => s.courseId === course?.id);
  const enrollment = enrollments.find(e => e.courseId === course?.id);
  const courseDiscussions = discussions.filter(d => d.courseId === course?.id);

  // Get all lessons flattened
  const allLessons = sections.flatMap(s => s.lessons);
  const currentLesson = lessonId
    ? allLessons.find(l => l.id === lessonId)
    : allLessons[0];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleMarkComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      setSnackbarMessage('Lesson marked as complete!');
      setSnackbarOpen(true);
    }
  };

  const handleCompleteAndContinue = () => {
    handleMarkComplete();
    // Navigate to next lesson
    if (currentLesson) {
      const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        navigate(`/learn/${courseSlug}/${nextLesson.id}`);
      } else {
        setSnackbarMessage('Congratulations! You completed the course!');
        setSnackbarOpen(true);
      }
    }
  };

  const handlePostQuestion = () => {
    if (questionText.trim()) {
      setSnackbarMessage('Question posted successfully!');
      setSnackbarOpen(true);
      setQuestionText('');
    }
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      setSnackbarMessage('Note saved successfully!');
      setSnackbarOpen(true);
    }
  };

  const handleDownloadResource = (resourceName: string) => {
    setSnackbarMessage(`Downloading ${resourceName}...`);
    setSnackbarOpen(true);
  };

  if (!course) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Course not found</Typography>
      </Box>
    );
  }

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Course Content
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {enrollment?.progress || 0}% complete
        </Typography>
      </Box>

      {/* Sections */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {sections.map((section) => (
          <Accordion key={section.id} defaultExpanded disableGutters elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'grey.200' }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {section.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {section.lessons.filter(l => l.isCompleted).length}/{section.lessons.length} lessons
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List dense disablePadding>
                {section.lessons.map((lesson) => {
                  const Icon = lessonTypeIcons[lesson.type];
                  const isActive = currentLesson?.id === lesson.id;
                  return (
                    <ListItemButton
                      key={lesson.id}
                      selected={isActive}
                      sx={{
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'grey.100',
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          borderLeft: '3px solid',
                          borderLeftColor: 'primary.main',
                        },
                      }}
                    >
                      <Checkbox
                        checked={lesson.isCompleted}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Icon fontSize="small" color={isActive ? 'primary' : 'action'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={lesson.title}
                        secondary={formatDuration(lesson.duration)}
                        slotProps={{
                          primary: {
                            variant: 'body2',
                            fontWeight: isActive ? 600 : 400,
                          },
                          secondary: { variant: 'caption' },
                        }}
                      />
                      {lesson.isCompleted && <CheckIcon color="success" fontSize="small" />}
                    </ListItemButton>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Sidebar - Desktop */}
      {!isMobile && sidebarOpen && (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'white',
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{ sx: { width: DRAWER_WIDTH } }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Video/Content Area */}
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            bgcolor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* Toggle Sidebar Button */}
          {!sidebarOpen && (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                position: 'absolute',
                left: 16,
                top: 16,
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {currentLesson?.type === 'video' && (
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <VideoIcon sx={{ fontSize: 64, opacity: 0.5, mb: 2 }} />
              <Typography variant="h6">Video Player</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {currentLesson.title}
              </Typography>
            </Box>
          )}

          {currentLesson?.type === 'text' && (
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <ArticleIcon sx={{ fontSize: 64, opacity: 0.5, mb: 2 }} />
              <Typography variant="h6">Reading Material</Typography>
            </Box>
          )}

          {currentLesson?.type === 'quiz' && (
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <QuizIcon sx={{ fontSize: 64, opacity: 0.5, mb: 2 }} />
              <Typography variant="h6">Quiz</Typography>
            </Box>
          )}

          {currentLesson?.type === 'assignment' && (
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 64, opacity: 0.5, mb: 2 }} />
              <Typography variant="h6">Assignment</Typography>
            </Box>
          )}
        </Box>

        {/* Content Below Video */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'grey.50' }}>
          <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                {currentLesson?.title}
              </Typography>
            </Box>

            <Tabs
              value={tabValue}
              onChange={(_, value) => setTabValue(value)}
              sx={{ px: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}
            >
              <Tab label="Overview" />
              <Tab label="Q&A" />
              <Tab label="Notes" />
              <Tab label="Resources" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    About this lesson
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentLesson?.description || 'No description available for this lesson.'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleCompleteAndContinue}
                    >
                      Complete & Continue
                    </Button>
                    <Button variant="outlined" onClick={handleMarkComplete}>
                      Mark as Complete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Q&A Tab */}
            <TabPanel value={tabValue} index={1}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Ask a Question
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type your question here..."
                    variant="outlined"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" endIcon={<SendIcon />} onClick={handlePostQuestion}>
                      Post Question
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {courseDiscussions.map((discussion) => (
                <Card key={discussion.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        component="img"
                        src={discussion.userAvatar}
                        sx={{ width: 40, height: 40, borderRadius: '50%' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {discussion.userName}
                          </Typography>
                          {discussion.isPinned && (
                            <Chip label="Pinned" size="small" color="primary" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {discussion.content}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ mt: 1, cursor: 'pointer' }}
                          onClick={() => setExpandedDiscussion(expandedDiscussion === discussion.id ? null : discussion.id)}
                        >
                          {discussion.replies.length} replies {expandedDiscussion === discussion.id ? '▲' : '▼'}
                        </Typography>
                        <Collapse in={expandedDiscussion === discussion.id}>
                          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'grey.200' }}>
                            {discussion.replies.map((reply, idx) => (
                              <Box key={idx} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {reply.userName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {reply.content}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </TabPanel>

            {/* Notes Tab */}
            <TabPanel value={tabValue} index={2}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Your Notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Take notes while watching..."
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleSaveNote}>
                      Save Note
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Resources Tab */}
            <TabPanel value={tabValue} index={3}>
              {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Downloadable Resources
                    </Typography>
                    <List>
                      {currentLesson.resources.map((resource) => (
                        <ListItemButton key={resource.id} sx={{ borderRadius: 1 }} onClick={() => handleDownloadResource(resource.name)}>
                          <ListItemIcon>
                            <ResourceIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={resource.name}
                            secondary={resource.type.toUpperCase()}
                          />
                          <IconButton onClick={(e) => { e.stopPropagation(); handleDownloadResource(resource.name); }}>
                            <DownloadIcon />
                          </IconButton>
                        </ListItemButton>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <ResourceIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No resources available for this lesson
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </TabPanel>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
