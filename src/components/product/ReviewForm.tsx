import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

const reviewSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  content: z.string().trim().min(10, "Review must be at least 10 characters").max(1000, "Review must be under 1000 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

interface ReviewFormProps {
  productId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, onClose, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = reviewSchema.safeParse({ title, content, rating });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title: title.trim(),
        content: content.trim(),
        author_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Anonymous",
      });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-medium text-foreground">Write a Review</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="space-y-2">
          <Label>Your Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    star <= (hoveredRating || rating)
                      ? "fill-lavender-deep text-lavender-deep"
                      : "fill-muted text-muted"
                  )}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="review-title">Review Title</Label>
          <Input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            maxLength={100}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="review-content">Your Review</Label>
          <Textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you like or dislike? What did you use this product for?"
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground text-right">{content.length}/1000</p>
          {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
        </div>

        <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
