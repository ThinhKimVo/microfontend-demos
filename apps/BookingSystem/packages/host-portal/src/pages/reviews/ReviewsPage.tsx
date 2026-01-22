import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid2 as Grid,
  Avatar,
  Rating,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Star,
  Reply,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockReviews, mockProperties } from '@staygcc/shared/mock-data';
import { useLocale } from '../../contexts/LocaleContext';
import { formatDate } from '@staygcc/shared/utils';

const ReviewsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLocale();

  const [tabValue, setTabValue] = useState(0);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const reviews = mockReviews;
  const pendingReplies = reviews.filter((r) => !r.response);
  const respondedReviews = reviews.filter((r) => r.response);

  // Mock rating summary
  const ratingSummary = {
    average: 4.8,
    total: 156,
    breakdown: {
      5: 120,
      4: 25,
      3: 8,
      2: 2,
      1: 1,
    },
    categories: {
      cleanliness: 4.9,
      communication: 4.8,
      checkIn: 4.9,
      accuracy: 4.7,
      location: 4.8,
      value: 4.6,
    },
  };

  const handleReply = (reviewId: string) => {
    setSelectedReview(reviewId);
    setReplyDialogOpen(true);
  };

  const submitReply = () => {
    console.log('Submitting reply for review:', selectedReview, 'Reply:', replyText);
    setReplyDialogOpen(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const renderReviewCard = (review: typeof reviews[0]) => {
    const property = mockProperties.find((p) => p.id === review.propertyId);
    const title = language === 'ar' ? property?.titleAr : property?.titleEn;
    const comment = review.content;

    return (
      <Card key={review.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48 }}>
                  {review.reviewerName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {review.reviewerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(review.createdAt, 'PP', language)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {title}
              </Typography>
              <Rating value={review.ratings.overall} readOnly size="small" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.primary">
                {comment}
              </Typography>
              {review.response && (
                <Paper sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    {t('host:reviews.yourResponse')}
                  </Typography>
                  <Typography variant="body2">
                    {review.response}
                  </Typography>
                </Paper>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Box sx={{ mb: 2 }}>
                  {['cleanliness', 'communication', 'checkIn', 'accuracy', 'location', 'value'].map((cat) => (
                    <Box key={cat} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t(`host:reviews.${cat}`)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                        <Typography variant="caption">
                          {review.ratings[cat as keyof typeof review.ratings]}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                {!review.response && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Reply />}
                    onClick={() => handleReply(review.id)}
                  >
                    {t('host:reviews.reply')}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        {t('host:navigation.reviews')}
      </Typography>

      {/* Rating Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={600} color="primary">
                {ratingSummary.average}
              </Typography>
              <Rating value={ratingSummary.average} readOnly precision={0.1} sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {ratingSummary.total} {t('host:reviews.reviews')}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('host:reviews.ratingBreakdown')}
            </Typography>
            {[5, 4, 3, 2, 1].map((stars) => (
              <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 20 }}>
                  {stars}
                </Typography>
                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                <LinearProgress
                  variant="determinate"
                  value={(ratingSummary.breakdown[stars as keyof typeof ratingSummary.breakdown] / ratingSummary.total) * 100}
                  sx={{ flex: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                  {ratingSummary.breakdown[stars as keyof typeof ratingSummary.breakdown]}
                </Typography>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('host:reviews.categoryRatings')}
            </Typography>
            {Object.entries(ratingSummary.categories).map(([category, rating]) => (
              <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">
                  {t(`host:reviews.${category}`)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                  <Typography variant="body2" fontWeight={500}>
                    {rating}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>

      {/* Reviews List */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`${t('host:reviews.pendingReply')} (${pendingReplies.length})`} />
          <Tab label={`${t('host:reviews.responded')} (${respondedReviews.length})`} />
          <Tab label={`${t('host:reviews.all')} (${reviews.length})`} />
        </Tabs>
      </Paper>

      {tabValue === 0 && pendingReplies.map(renderReviewCard)}
      {tabValue === 1 && respondedReviews.map(renderReviewCard)}
      {tabValue === 2 && reviews.map(renderReviewCard)}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('host:reviews.replyToReview')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('host:reviews.replyTip')}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={t('host:reviews.replyPlaceholder')}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>{t('common:actions.cancel')}</Button>
          <Button variant="contained" onClick={submitReply} disabled={!replyText.trim()}>
            {t('host:reviews.submitReply')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewsPage;
