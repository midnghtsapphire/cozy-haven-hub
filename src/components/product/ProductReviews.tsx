import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import type { Review } from "@/data/products";

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

const RatingBar = ({ stars, count, total }: { stars: number; count: number; total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-8">{stars}★</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-lavender-deep rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-8">{count}</span>
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [helpful, setHelpful] = useState(false);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-lavender-deep">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= review.rating
                      ? "fill-lavender-deep text-lavender-deep"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{review.date}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {review.content}
      </p>

      {/* Helpful */}
      <button
        onClick={() => setHelpful(!helpful)}
        className={cn(
          "inline-flex items-center gap-2 text-sm transition-colors",
          helpful ? "text-lavender-deep" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ThumbsUp className={cn("w-4 h-4", helpful && "fill-current")} />
        Helpful ({helpful ? review.helpful + 1 : review.helpful})
      </button>
    </div>
  );
};

const ProductReviews = ({ reviews, rating, reviewCount }: ProductReviewsProps) => {
  // Mock rating distribution
  const distribution = {
    5: Math.round(reviewCount * 0.7),
    4: Math.round(reviewCount * 0.2),
    3: Math.round(reviewCount * 0.07),
    2: Math.round(reviewCount * 0.02),
    1: Math.round(reviewCount * 0.01),
  };

  return (
    <section className="py-16 border-t border-border">
      <h2 className="text-3xl font-serif font-medium text-foreground mb-10">
        Customer Reviews
      </h2>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Overall Rating */}
            <div className="text-center p-6 rounded-2xl bg-secondary/30">
              <div className="text-5xl font-bold text-foreground mb-2">{rating}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= Math.round(rating)
                        ? "fill-lavender-deep text-lavender-deep"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviewCount} reviews
              </p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={distribution[stars as keyof typeof distribution]}
                  total={reviewCount}
                />
              ))}
            </div>

            {/* Write Review CTA */}
            <Button variant="soft" className="w-full">
              Write a Review
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {reviews.length < reviewCount && (
            <div className="text-center pt-4">
              <Button variant="glow">
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
