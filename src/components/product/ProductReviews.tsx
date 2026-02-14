import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReviewForm from "./ReviewForm";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author_name: string;
  helpful_count: number;
  created_at: string;
  user_id: string;
  images: string[] | null;
}

interface ProductReviewsProps {
  productId: string;
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

interface ReviewCardProps {
  review: Review;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const ReviewCard = ({ review, isOwner, onEdit, onDelete }: ReviewCardProps) => {
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleHelpful = async () => {
    if (helpful) return;
    
    setHelpful(true);
    setHelpfulCount((prev) => prev + 1);
    
    await supabase
      .from("reviews")
      .update({ helpful_count: helpfulCount + 1 })
      .eq("id", review.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", review.id);
      if (error) throw error;
      toast.success("Review deleted");
      onDelete();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">{review.author_name}</span>
            <span className="inline-flex items-center gap-1 text-xs text-lavender-deep">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
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
            <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Edit review"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete review?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your review will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{review.content}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.images.map((image, index) => (
            <a
              key={index}
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-20 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <img src={image} alt={`Review image ${index + 1}`} className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}

      <button
        onClick={handleHelpful}
        disabled={helpful}
        className={cn(
          "inline-flex items-center gap-2 text-sm transition-colors",
          helpful ? "text-lavender-deep" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ThumbsUp className={cn("w-4 h-4", helpful && "fill-current")} />
        Helpful ({helpfulCount})
      </button>
    </div>
  );
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user, isEmailVerified } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [displayCount, setDisplayCount] = useState(5);

  const fetchReviews = async () => {
    if (user) {
      // Authenticated users can query the base table (includes user_id for ownership checks)
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } else {
      // Unauthenticated users use the public view (excludes user_id)
      const { data, error } = await supabase
        .from("public_reviews" as any)
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews((data as any[]).map(r => ({ ...r, user_id: "" })));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const distribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const userHasReviewed = user && reviews.some((r) => r.user_id === user.id);
  const displayedReviews = reviews.slice(0, displayCount);

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setShowForm(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleFormSuccess = () => {
    fetchReviews();
    setEditingReview(null);
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
            <div className="text-center p-6 rounded-2xl bg-secondary/30">
              <div className="text-5xl font-bold text-foreground mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= Math.round(averageRating)
                        ? "fill-lavender-deep text-lavender-deep"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={distribution[stars as keyof typeof distribution]}
                  total={reviews.length}
                />
              ))}
            </div>

            {user ? (
              !userHasReviewed && !editingReview && (
                isEmailVerified ? (
                  <Button variant="soft" className="w-full" onClick={() => setShowForm(true)}>
                    Write a Review
                  </Button>
                ) : (
                  <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Verify your email to write reviews
                    </p>
                  </div>
                )
              )
            ) : (
              <Button variant="soft" className="w-full" asChild>
                <Link to="/auth">Sign in to Review</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {(showForm || editingReview) && (
            <ReviewForm
              productId={productId}
              existingReview={editingReview}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <>
              {displayedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwner={user?.id === review.user_id}
                  onEdit={() => handleEditClick(review)}
                  onDelete={fetchReviews}
                />
              ))}

              {displayCount < reviews.length && (
                <div className="text-center pt-4">
                  <Button variant="glow" onClick={() => setDisplayCount((prev) => prev + 5)}>
                    Load More Reviews
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
