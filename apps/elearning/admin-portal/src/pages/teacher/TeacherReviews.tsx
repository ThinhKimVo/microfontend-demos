import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  TextField,
  Button,
  Rating,
} from '@mui/material';
import { Reply as ReplyIcon } from '@mui/icons-material';
import { reviews, teacherDashboardStats } from '../../data/mockData';

export default function TeacherReviews() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Reviews
      </Typography>

      <Grid container spacing={3}>
        {/* Stats */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {teacherDashboardStats.averageRating}
              </Typography>
              <Rating value={teacherDashboardStats.averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700}>
                {teacherDashboardStats.totalReviews.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                92%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5-Star Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700}>
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Response
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews List */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Reviews
              </Typography>
              {reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{
                    py: 3,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ width: 44, height: 44 }}>{review.userName[0]}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {review.userName}
                        </Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {review.courseName} • {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>

                      {review.teacherResponse && (
                        <Box sx={{ mt: 2, ml: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="caption" color="primary" fontWeight={600}>
                            Your Response
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {review.teacherResponse}
                          </Typography>
                        </Box>
                      )}

                      {replyingTo === review.id ? (
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Write your response..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            multiline
                            rows={2}
                          />
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => { setReplyingTo(null); setReplyText(''); }}
                            >
                              Submit
                            </Button>
                            <Button
                              size="small"
                              onClick={() => { setReplyingTo(null); setReplyText(''); }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        !review.teacherResponse && (
                          <Button
                            size="small"
                            startIcon={<ReplyIcon />}
                            onClick={() => setReplyingTo(review.id)}
                            sx={{ mt: 1 }}
                          >
                            Reply
                          </Button>
                        )
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
