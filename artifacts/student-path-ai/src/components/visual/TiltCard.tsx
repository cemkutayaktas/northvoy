import { ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Pointer-tracked 3D tilt wrapper. Renders a plain div on mobile/touch
 * (tilt needs a hovering pointer and costs GPU on low-end devices).
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const isMobile = useIsMobile();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 260, damping: 24 });
  const sy = useSpring(py, { stiffness: 260, damping: 24 });
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);

  if (isMobile) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn("[transform-style:preserve-3d] will-change-transform", className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
