import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  LinkedIn as LinkedInIcon,
  WorkspacePremium as CertificateIcon,
} from '@mui/icons-material';
import { certificates } from '../data/mockData';

export default function CertificatesPage() {
  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Certificates
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
        </Typography>

        {certificates.length > 0 ? (
          <Grid container spacing={3}>
            {certificates.map((cert) => (
              <Grid size={{ xs: 12, md: 6 }} key={cert.id}>
                <Card>
                  {/* Certificate Preview */}
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 4,
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative Elements */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -30,
                        left: -30,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)',
                      }}
                    />

                    <CertificateIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>
                      Certificate of Completion
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                      {cert.courseName}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                      Awarded to <strong>{cert.studentName}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                      Instructor: {cert.teacherName}
                    </Typography>
                  </Box>

                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Credential ID
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {cert.credentialId}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {new Date(cert.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LinkedInIcon />}
                      >
                        Add to LinkedIn
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ShareIcon />}
                      >
                        Share
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <CertificateIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No certificates yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Complete a course to earn your first certificate!
              </Typography>
              <Button component={Link} to="/my-courses" variant="contained">
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
