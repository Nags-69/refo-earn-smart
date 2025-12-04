import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const ScrollCard = ({ children, index, className }: ScrollCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky top-20 w-full max-w-5xl mx-auto transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-20 scale-95",
        className
      )}
      style={{
        zIndex: 10 + index,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollCard;
