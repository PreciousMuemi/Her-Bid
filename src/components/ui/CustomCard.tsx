
import { cn } from "@/lib/utils";
import React from "react";

interface CustomCardProps {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function CustomCard({ className, children, hoverEffect = false }: CustomCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        hoverEffect && "transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CustomCardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomCardHeader({ className, children }: CustomCardHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>{children}</div>;
}

interface CustomCardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomCardTitle({ className, children }: CustomCardTitleProps) {
  return <h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)}>{children}</h3>;
}

interface CustomCardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomCardDescription({ className, children }: CustomCardDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

interface CustomCardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomCardContent({ className, children }: CustomCardContentProps) {
  return <div className={cn("pt-0", className)}>{children}</div>;
}

interface CustomCardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomCardFooter({ className, children }: CustomCardFooterProps) {
  return <div className={cn("flex items-center pt-4", className)}>{children}</div>;
}
