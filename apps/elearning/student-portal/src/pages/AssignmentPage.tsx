import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CloudUpload as UploadIcon,
  AttachFile as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as SubmittedIcon,
  Schedule as PendingIcon,
  Grade as GradeIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { assignments, courses } from '../data/mockData';

export default function AssignmentPage() {
  const { assignmentId } = useParams();

  const assignment = assignments.find(a => a.id === assignmentId);
  const course = courses.find(c => c.id === assignment?.courseId);

  const [textSubmission, setTextSubmission] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setShowConfirm(false);
    }, 2000);
  };

  if (!assignment) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Assignment not found</Typography>
      </Box>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const daysRemaining = Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={600}>{assignment.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {course?.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  icon={isOverdue ? <PendingIcon /> : <PendingIcon />}
                  label={isOverdue ? 'Overdue' : `Due in ${daysRemaining} days`}
                  color={isOverdue ? 'error' : 'warning'}
                  size="small"
                />
                <Chip
                  label={`${assignment.maxScore} points`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Already Submitted */}
      {(isSubmitted || assignment.submission) && (
        <Alert
          severity="success"
          icon={<SubmittedIcon />}
          sx={{ mb: 3 }}
          action={
            assignment.submission?.grade && (
              <Chip
                icon={<GradeIcon />}
                label={`${assignment.submission.grade}/${assignment.maxScore}`}
                color="success"
              />
            )
          }
        >
          <Typography fontWeight={600}>Assignment Submitted</Typography>
          <Typography variant="body2">
            Submitted on {new Date(assignment.submission?.submittedAt || new Date()).toLocaleString()}
          </Typography>
        </Alert>
      )}

      {/* Feedback */}
      {assignment.submission?.feedback && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Instructor Feedback
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">{assignment.submission.feedback}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Instructions */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Instructions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {assignment.instructions}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Requirements
            </Typography>
            <List dense>
              {assignment.requirements?.map((req, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>

            {assignment.resources && assignment.resources.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Resources
                </Typography>
                <List dense>
                  {assignment.resources.map((resource, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end">
                          <DownloadIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <FileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.name}
                        secondary={resource.size}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        </Card>

        {/* Submission Area */}
        {!isSubmitted && !assignment.submission && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Your Submission
              </Typography>

              {assignment.submissionType === 'text' || assignment.submissionType === 'both' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Type your answer here..."
                  value={textSubmission}
                  onChange={(e) => setTextSubmission(e.target.value)}
                  sx={{ mb: 3 }}
                />
              ) : null}

              {assignment.submissionType === 'file' || assignment.submissionType === 'both' ? (
                <>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      mb: 2,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                      },
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileUpload}
                    />
                    <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>
                      Drop files here or click to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported formats: PDF, DOC, DOCX, ZIP (Max 10MB)
                    </Typography>
                  </Box>

                  {uploadedFiles.length > 0 && (
                    <List>
                      {uploadedFiles.map((file, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            mb: 1,
                          }}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <FileIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={file.name}
                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </>
              ) : null}

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={
                  (assignment.submissionType === 'text' && !textSubmission) ||
                  (assignment.submissionType === 'file' && uploadedFiles.length === 0) ||
                  (assignment.submissionType === 'both' && !textSubmission && uploadedFiles.length === 0)
                }
                onClick={() => setShowConfirm(true)}
              >
                Submit Assignment
              </Button>

              {isOverdue && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This assignment is past due. Late submissions may receive reduced points.
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Submit Assignment?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this assignment? You won't be able to modify your submission after this.
          </Typography>
          {isSubmitting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Uploading your submission...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
