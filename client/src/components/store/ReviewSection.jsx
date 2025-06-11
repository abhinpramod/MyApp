// components/store/ReviewSection.jsx
import { 
  Box, 
  Typography, 
  Divider, 
  Rating, 
  TextField, 
  Button,
  Avatar,
  Paper
} from "@mui/material";
import { useState } from "react";
import { format } from "date-fns";

const ReviewSection = ({ reviews, storeId, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const handleSubmit = () => {
    onSubmitReview({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <Box>
      {/* Add Review Form */}
      {!hasReviewed && (
        <Paper className="p-4 mb-6">
          <Typography variant="h6" className="mb-3">
            Add Your Review
          </Typography>
          <Box className="mb-3">
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              precision={0.5}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!rating}
          >
            Submit Review
          </Button>
        </Paper>
      )}

      {/* Reviews List */}
      <Typography variant="h6" className="mb-4">
        Customer Reviews
      </Typography>
      
      {reviews.length === 0 ? (
        <Typography>No reviews yet</Typography>
      ) : (
        <Box>
          {reviews.map((review) => (
            <Box key={review._id} className="mb-4">
              <Box className="flex items-center mb-2">
                <Avatar className="mr-2">
                  {review.userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" className="font-medium">
                    {review.userName}
                  </Typography>
                  <Box className="flex items-center">
                    <Rating value={review.rating} precision={0.5} readOnly />
                    <Typography variant="caption" className="ml-1 text-gray-600">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {review.comment && (
                <Typography variant="body1" className="ml-10">
                  {review.comment}
                </Typography>
              )}
              <Divider className="my-3" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReviewSection;