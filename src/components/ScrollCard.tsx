import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const ScrollCard = ({ children, index, className }: ScrollCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Each card stacks with a small peek of the card above
  const topOffset = 100 + index * 20;

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: 10 + index,
      }}
    >
      <div className="relative">
        {/* Shadow for depth effect */}
        <div 
          className="absolute inset-0 rounded-3xl bg-black/5 blur-xl -z-10"
          style={{ transform: 'translateY(10px)' }}
        />
        {children}
      </div>
    </div>
  );
};

export default ScrollCard;