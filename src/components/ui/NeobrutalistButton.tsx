import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const NeobrutalistButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#00f7ff] text-black border-2 border-black shadow-neobrutalist hover:shadow-neobrutalist-hover active:translate-x-0.5 active:translate-y-0.5",
      secondary: "bg-[#6b00ff] text-white border-2 border-black shadow-neobrutalist hover:shadow-neobrutalist-hover active:translate-x-0.5 active:translate-y-0.5",
      outline: "bg-transparent text-white border-2 border-white/20 hover:bg-white/10 active:scale-95",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base font-bold",
      lg: "px-8 py-4 text-lg font-black",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

NeobrutalistButton.displayName = "NeobrutalistButton";

export { NeobrutalistButton };
