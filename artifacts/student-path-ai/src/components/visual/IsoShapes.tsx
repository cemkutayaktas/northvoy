import { cn } from "@/lib/utils";

/**
 * Hand-built isometric SVG shapes used as floating 3D-style decor.
 * Classic 2:1 isometric projection, three-face shading (light top,
 * mid left, dark right) so they read as solid objects on any background.
 */

export function IsoCube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden
      className={cn("drop-shadow-[0_18px_24px_rgba(30,58,138,0.35)]", className)}>
      <defs>
        <linearGradient id="isoCubeTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="isoCubeLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="isoCubeRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
      </defs>
      <polygon points="50,1 99,29 50,57 1,29" fill="url(#isoCubeTop)" />
      <polygon points="1,29 50,57 50,114 1,86" fill="url(#isoCubeLeft)" />
      <polygon points="50,57 99,29 99,86 50,114" fill="url(#isoCubeRight)" />
      <polygon points="50,1 99,29 50,57 1,29" fill="white" opacity="0.08" />
    </svg>
  );
}

export function IsoCap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden
      className={cn("drop-shadow-[0_20px_28px_rgba(30,58,138,0.4)]", className)}>
      <defs>
        <linearGradient id="isoCapTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="isoCapSideL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="isoCapSideR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3730a3" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="isoCapHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      {/* head base under the board */}
      <polygon points="70,52 104,70 70,88 36,70" fill="url(#isoCapHead)" />
      <polygon points="36,70 70,88 70,104 36,86" fill="url(#isoCapHead)" opacity="0.85" />
      <polygon points="70,88 104,70 104,86 70,104" fill="url(#isoCapHead)" opacity="0.7" />
      {/* mortarboard */}
      <polygon points="70,2 138,36 70,70 2,36" fill="url(#isoCapTop)" />
      <polygon points="2,36 70,70 70,80 2,46" fill="url(#isoCapSideL)" />
      <polygon points="70,70 138,36 138,46 70,80" fill="url(#isoCapSideR)" />
      <polygon points="70,2 138,36 70,70 2,36" fill="white" opacity="0.07" />
      {/* button + tassel */}
      <circle cx="70" cy="36" r="3.5" fill="#fbbf24" />
      <path d="M70 36 C 96 40, 112 48, 116 62" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="116" cy="66" r="4.5" fill="#f59e0b" />
    </svg>
  );
}

export function IsoBooks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden
      className={cn("drop-shadow-[0_16px_22px_rgba(30,58,138,0.32)]", className)}>
      <defs>
        <linearGradient id="isoBook1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="isoBook2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="isoBook3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* bottom book */}
      <polygon points="60,34 112,60 60,86 8,60" fill="url(#isoBook1)" />
      <polygon points="8,60 60,86 60,94 8,68" fill="#0369a1" />
      <polygon points="60,86 112,60 112,68 60,94" fill="#075985" />
      {/* middle book (slightly rotated offset) */}
      <polygon points="56,20 104,44 56,68 8,44" fill="url(#isoBook2)" />
      <polygon points="8,44 56,68 56,75 8,51" fill="#4338ca" />
      <polygon points="56,68 104,44 104,51 56,75" fill="#3730a3" />
      {/* top book */}
      <polygon points="62,4 106,26 62,48 18,26" fill="url(#isoBook3)" />
      <polygon points="18,26 62,48 62,55 18,33" fill="#6d28d9" />
      <polygon points="62,48 106,26 106,33 62,55" fill="#5b21b6" />
      <polygon points="62,4 106,26 62,48 18,26" fill="white" opacity="0.08" />
    </svg>
  );
}
