import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const ScrollCard = ({ children, index, className }: ScrollCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto",
        className
      )}
      style={{
        top: '100px',
        zIndex: 10 + index,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollCard;