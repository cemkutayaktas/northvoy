import { cn } from "@/lib/utils";

/**
 * Decorative blurred gradient spheres with a slow drift, giving sections a
 * sense of depth. Pure CSS animation (see index.css), pointer-events: none,
 * theme-aware via primary/secondary tokens, and disabled for users who
 * prefer reduced motion.
 */
export function FloatingOrbs({ className, intensity = "subtle" }: { className?: string; intensity?: "subtle" | "bold" }) {
  const alpha = intensity === "bold" ? "0.22" : "0.12";
  const alpha2 = intensity === "bold" ? "0.16" : "0.09";
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div
        className="absolute -top-16 -left-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl animate-float-slow"
        style={{ background: `radial-gradient(circle at 35% 35%, hsl(var(--primary) / ${alpha}), transparent 70%)` }}
      />
      <div
        className="absolute top-1/3 -right-12 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl animate-float-slower"
        style={{ background: `radial-gradient(circle at 60% 40%, hsl(var(--secondary) / ${alpha2}), transparent 70%)` }}
      />
      <div
        className="absolute -bottom-20 left-1/4 w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-3xl animate-float-slow"
        style={{ background: `radial-gradient(circle at 50% 50%, hsl(255 85% 65% / ${alpha2}), transparent 70%)`, animationDelay: "-6s" }}
      />
    </div>
  );
}
