import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  phase: number;
  speed: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let dots: Dot[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let time = 0;

    const colors = [
      { fill: "hsla(217, 91%, 60%, 0.8)", glow: "hsla(217, 91%, 60%, 0.4)" },   // Blue
      { fill: "hsla(262, 83%, 58%, 0.8)", glow: "hsla(262, 83%, 58%, 0.4)" },   // Purple
      { fill: "hsla(330, 81%, 60%, 0.8)", glow: "hsla(330, 81%, 60%, 0.4)" },   // Pink
      { fill: "hsla(199, 89%, 48%, 0.8)", glow: "hsla(199, 89%, 48%, 0.4)" },   // Cyan
      { fill: "hsla(173, 80%, 40%, 0.8)", glow: "hsla(173, 80%, 40%, 0.4)" },   // Teal
      { fill: "hsla(271, 76%, 53%, 0.8)", glow: "hsla(271, 76%, 53%, 0.4)" },   // Violet
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    const initDots = () => {
      const dotCount = Math.floor((canvas.width * canvas.height) / 6000);
      dots = [];
      
      for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        
        dots.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          radius: Math.random() * 3 + 1.5,
          color: colorSet.fill,
          glowColor: colorSet.glow,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.3,
        });
      }
    };

    const drawDot = (d: Dot) => {
      // Glow effect
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = d.glowColor;
      ctx.fill();
      
      // Main dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
    };

    const updateDot = (d: Dot) => {
      // Continuous floating animation
      const floatX = Math.sin(time * d.speed + d.phase) * 20;
      const floatY = Math.cos(time * d.speed * 0.8 + d.phase) * 15;
      
      // Target position with floating
      let targetX = d.originX + floatX;
      let targetY = d.originY + floatY;
      
      // Cursor interaction - push away
      const dx = d.x - mouseX;
      const dy = d.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      if (dist < maxDist && dist > 0) {
        const force = (maxDist - dist) / maxDist;
        const pushX = (dx / dist) * force * 80;
        const pushY = (dy / dist) * force * 80;
        targetX += pushX;
        targetY += pushY;
      }
      
      // Smooth movement towards target
      d.x += (targetX - d.x) * 0.08;
      d.y += (targetY - d.y) * 0.08;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;
      
      dots.forEach(d => {
        updateDot(d);
        drawDot(d);
      });
      
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default AnimatedBackground;
