import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  containerClassName?: string;
  /** Icon rendered on the left side of the input */
  leftIcon?: React.ReactNode;
  /** Node rendered on the right side of the input (e.g. show/hide button) */
  rightAction?: React.ReactNode;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, containerClassName, type, label, error, id, leftIcon, rightAction, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;

    return (
      <div className={cn("relative", containerClassName)}>
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          placeholder=" "
          className={cn(
            "peer flex h-14 w-full rounded-md border border-input bg-background text-base ring-offset-background",
            "placeholder-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "transition-colors duration-200",
            // Vertical padding: top heavy so text sits in lower half when no label is floating
            "pt-5 pb-2",
            // Horizontal padding accounts for optional icons
            leftIcon ? "pl-10 pr-3" : "px-3",
            rightAction && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          {...props}
        />

        <label
          htmlFor={inputId}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none",
            "transition-all duration-200 ease-in-out",
            "text-base md:text-sm leading-none",
            // Offset label left to align with input text
            leftIcon ? "left-10" : "left-3",
            // Float label to top when focused or filled
            "peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-focus:text-lavender-deep peer-focus:font-medium",
            "peer-[&:not(:placeholder-shown)]:top-3.5 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[0.7rem] peer-[&:not(:placeholder-shown)]:text-muted-foreground peer-[&:not(:placeholder-shown)]:font-medium",
          )}
        >
          {label}
        </label>

        {rightAction && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightAction}
          </span>
        )}

        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  },
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
