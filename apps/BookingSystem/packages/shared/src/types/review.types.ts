export type ReviewerType = 'guest' | 'host';

export type ReviewStatus = 'pending_moderation' | 'published' | 'hidden';

export interface ReviewRatings {
  overall: number;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  location?: number;
  checkIn?: number;
  value?: number;
}

export interface Review {
  id: string;
  bookingId: string;
  propertyId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto?: string;
  revieweeId: string;
  reviewerType: ReviewerType;
  ratings: ReviewRatings;
  content: string;
  privateFeedback?: string;
  photos?: string[];
  response?: string;
  responseAt?: string;
  status: ReviewStatus;
  createdAt: string;
  publishedAt?: string;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
}

export interface ReviewRequest {
  bookingId: string;
  ratings: ReviewRatings;
  content: string;
  privateFeedback?: string;
  photos?: string[];
}
