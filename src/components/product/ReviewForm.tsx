import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelTextarea } from "@/components/ui/floating-label-textarea";
import { Label } from "@/components/ui/label";
import { Star, X, ImagePlus, Loader2 } from "lucide-react";
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

interface ExistingReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  images: string[] | null;
}

interface ReviewFormProps {
  productId: string;
  existingReview?: ExistingReview | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, existingReview, onClose, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [content, setContent] = useState(existingReview?.content || "");
  const [existingImages, setExistingImages] = useState<string[]>(existingReview?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!existingReview;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title);
      setContent(existingReview.content);
      setExistingImages(existingReview.images || []);
    }
  }, [existingReview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    const totalImages = existingImages.length + newImages.length + validFiles.length;
    if (totalImages > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setNewImages((prev) => [...prev, ...validFiles]);
    
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!user || newImages.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of newImages) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("review-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }
    } finally {
      setIsUploading(false);
    }

    return uploadedUrls;
  };

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
      const newImageUrls = await uploadImages();
      const allImages = [...existingImages, ...newImageUrls];

      // Validate all image URLs are from trusted storage
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const invalidImages = allImages.filter(url => !url.startsWith(supabaseUrl));
      if (invalidImages.length > 0) {
        toast.error("Invalid image URLs detected. Only uploaded images are allowed.");
        setIsSubmitting(false);
        return;
      }

      if (isEditing) {
        const { error } = await supabase
          .from("reviews")
          .update({
            rating,
            title: title.trim(),
            content: content.trim(),
            images: allImages,
          })
          .eq("id", existingReview.id);

        if (error) throw error;
        toast.success("Review updated successfully!");
      } else {
        const { error } = await supabase.from("reviews").insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title.trim(),
          content: content.trim(),
          author_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Anonymous",
          images: allImages,
        });

        if (error) throw error;
        toast.success("Review submitted successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-medium text-foreground">
          {isEditing ? "Edit Review" : "Write a Review"}
        </h3>
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
        <FloatingLabelInput
          id="review-title"
          label="Review Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          error={errors.title}
        />

        {/* Content */}
        <div>
          <FloatingLabelTextarea
            id="review-content"
            label="Your Review"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={1000}
            error={errors.content}
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{content.length}/1000</p>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <Label>Photos (optional)</Label>
          <div className="flex flex-wrap gap-3">
            {/* Existing images */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                <img src={url} alt="Review" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            {/* New image previews */}
            {newImagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            {totalImages < 4 && (
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-lavender-deep hover:bg-secondary/50 transition-colors">
                <ImagePlus className="w-6 h-6 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Max 4 images, 5MB each</p>
        </div>

        <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {isUploading ? "Uploading images..." : "Saving..."}
            </>
          ) : isEditing ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
