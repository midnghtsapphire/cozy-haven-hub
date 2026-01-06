import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EmailVerificationBanner = () => {
  const { user, isEmailVerified, resendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || isEmailVerified || dismissed) return null;

  const handleResend = async () => {
    setIsResending(true);
    const { error } = await resendVerificationEmail();
    
    if (error) {
      toast.error("Failed to resend verification email");
    } else {
      toast.success("Verification email sent! Check your inbox.");
    }
    setIsResending(false);
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please verify your email address to access all features.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending}
              className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Resend email"
              )}
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
