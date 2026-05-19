import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingLabelTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
  ({ className, containerClassName, label, error, id, ...props }, ref) => {
    const autoId = React.useId();
    const textareaId = id ?? autoId;

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          id={textareaId}
          placeholder=" "
          className={cn(
            "peer flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 pt-6 pb-2 text-base ring-offset-background",
            "placeholder-transparent resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "transition-colors duration-200",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={textareaId}
          className={cn(
            "absolute left-3 top-4 text-muted-foreground pointer-events-none select-none",
            "transition-all duration-200 ease-in-out",
            "text-base md:text-sm leading-none",
            // Float label to top when focused or filled
            "peer-focus:top-2 peer-focus:text-[0.7rem] peer-focus:text-lavender-deep peer-focus:font-medium",
            "peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-[0.7rem] peer-[&:not(:placeholder-shown)]:text-muted-foreground peer-[&:not(:placeholder-shown)]:font-medium",
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  },
);
FloatingLabelTextarea.displayName = "FloatingLabelTextarea";

export { FloatingLabelTextarea };
