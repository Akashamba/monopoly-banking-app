import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status: string;
}

const statusClasses: Record<string, string> = {
  waiting:
    "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
  ongoing: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  neutral: "",
};

function Badge({ className, variant, status, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className,
        statusClasses[status]
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
