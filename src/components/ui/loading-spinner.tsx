import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ 
  size = "md", 
  className, 
  ...props 
}: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };
  
  return (
    <div className="flex items-center justify-center" {...props}>
      <div 
        className={cn(
          "rounded-full border-t-transparent animate-spin",
          sizeClass[size],
          "border-primary",
          className
        )}
      />
    </div>
  );
}; 