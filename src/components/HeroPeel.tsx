import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

type PeelVideo = {
  src: string;
  poster: string;
};

/**
 * Shared inset frame for the overlay labels/CTAs so corners align with the
 * video. Full-bleed width on mobile; insets on desktop.
 */
export const PEEL_FRAME =
  "left-0 right-0 top-[12%] bottom-[9%] md:left-[7%] md:right-[7%] md:top-[9%] md:bottom-[6.5%]";

/**
 * Desktop frame for the video surface — sized natively (no CSS transform) so the
 * 1916px source downscales in a single pass and stays crisp on hi-DPI screens.
 * Used by the task tags so they align with the video. On mobile the video is laid
 * out as a landscape band in normal flow (see Hero), not via this frame.
 */
export const PEEL_FRAME_VIDEO =
  "left-0 right-0 top-[12%] bottom-[9%] md:left-[17.75%] md:right-[17.75%] md:top-[19.5%] md:bottom-[17%]";

/**
 * "Peel" surface: stacks two looping clips and clips the top one along a
 * draggable diagonal seam that peels back to reveal the second. The seam is a
 * vertical diagonal (drag left/right) on every screen — on mobile this is a
 * landscape band, so a left/right peel reads naturally and never fights the
 * page's vertical scroll.
 *
 * Fills its parent (absolute inset-0); the parent controls placement/size.
 * The seam is driven by direct DOM writes inside one rAF loop (no React render
 * per frame) so dragging and the auto-sweep stay perfectly smooth.
 */
export function HeroPeel({
  top,
  bottom,
  tilt = 7,
}: {
  top: PeelVideo;
  bottom: PeelVideo;
  /** Diagonal lean of the seam, in % of the cross axis. */
  tilt?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(58);
  const draggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [auto, setAuto] = useState(true);

  const apply = useCallback(
    (raw: number) => {
      const p = Math.min(92, Math.max(8, raw));
      posRef.current = p;
      const a = p + tilt;
      const b = p - tilt;
      const clip = `polygon(0% 0%, ${a}% 0%, ${b}% 100%, 0% 100%)`;
      if (topRef.current) {
        topRef.current.style.clipPath = clip;
        topRef.current.style.setProperty("-webkit-clip-path", clip);
      }
      if (lineRef.current) {
        lineRef.current.setAttribute("x1", String(a));
        lineRef.current.setAttribute("y1", "0");
        lineRef.current.setAttribute("x2", String(b));
        lineRef.current.setAttribute("y2", "100");
      }
      if (handleRef.current) {
        handleRef.current.style.left = `${p}%`;
        handleRef.current.style.top = "50%";
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${p}%`;
      }
    },
    [tilt],
  );

  // Skew the glow band so it sits exactly parallel to the diagonal seam,
  // computed from the real element dimensions (the % tilt maps to different
  // visual angles depending on aspect ratio).
  const updateSkew = useCallback(() => {
    const el = wrapRef.current;
    const g = glowRef.current;
    if (!el || !g) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const deg = (Math.atan2(-2 * (tilt / 100) * w, h) * 180) / Math.PI;
    g.style.transform = `skewX(${deg}deg)`;
  }, [tilt]);

  useEffect(() => {
    apply(posRef.current);
    updateSkew();
  }, [apply, updateSkew]);

  useEffect(() => {
    const onResize = () => updateSkew();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateSkew]);

  useEffect(() => {
    if (!auto) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let start: number | null = null;
    const loop = (t: number) => {
      if (start == null) start = t;
      const elapsed = (t - start) / 1000;
      const phase = (Math.sin((elapsed / 6) * Math.PI) + 1) / 2;
      apply(14 + phase * 72);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [auto, apply]);

  const setFromClient = useCallback(
    (clientX: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      apply(((clientX - rect.left) / rect.width) * 100);
    },
    [apply],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      setFromClient(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClient]);

  const startDrag = (clientX: number) => {
    setAuto(false);
    draggingRef.current = true;
    setFromClient(clientX);
  };

  const initialClip = "polygon(0% 0%, 65% 0%, 51% 100%, 0% 100%)";
  // Fades all four edges to transparent so the clip melts into the texture.
  const edgeMask =
    "linear-gradient(to right, transparent, #000 11%, #000 89%, transparent), linear-gradient(to bottom, transparent, #000 11%, #000 89%, transparent)";

  return (
    <div
      ref={wrapRef}
      onPointerDown={(e) => startDrag(e.clientX)}
      className="group absolute inset-0 cursor-ew-resize touch-pan-y select-none overflow-hidden"
    >
      {/* Masked stack — videos + accents fade at every edge so the clip
          diffuses into the purple grid texture behind it. */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: edgeMask,
          maskImage: edgeMask,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {/* Bottom (revealed) clip */}
        <PeelLayer video={bottom} />

        {/* Top (clipped) clip */}
        <div
          ref={topRef}
          className="absolute inset-0 [will-change:clip-path]"
          style={{ clipPath: initialClip, WebkitClipPath: initialClip }}
        >
          <PeelLayer video={top} />
        </div>

        {/* Super-slight white blend lifting the left clip */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-white/[0.06] to-transparent mix-blend-overlay" />

        {/* Two diagonal dark corner triangles (top-left + bottom-right) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_18%,rgba(0,0,0,0.4)_28%,transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(315deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_18%,rgba(0,0,0,0.4)_28%,transparent_42%)]" />
      </div>

      {/* Techy trailing glow — a diffused pink wash riding just past the seam,
          screen-blended over the revealed clip. */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-y-0 z-[1] w-[30%] opacity-80 mix-blend-screen [will-change:left]"
        style={{
          left: "58%",
          background:
            "linear-gradient(to right, rgba(244,63,148,0.5) 0%, rgba(244,63,148,0.18) 36%, rgba(244,63,148,0) 72%)",
          filter: "blur(50px)",
        }}
      />

      {/* Diagonal seam line */}
      <svg
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full [will-change:transform]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          ref={lineRef}
          x1={65}
          y1={0}
          x2={51}
          y2={100}
          stroke="white"
          strokeWidth={0.45}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.65))" }}
        />
      </svg>

      {/* Drag handle — round overlay; captures the horizontal peel drag. */}
      <div
        ref={handleRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          startDrag(e.clientX);
        }}
        className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 touch-none"
        style={{ left: "58%" }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-black/30 text-white shadow-[0_2px_14px_rgba(0,0,0,0.55)] backdrop-blur-sm transition group-hover:scale-105">
          <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  );
}

// Skip the brief stationary moment at the very start of each clip.
const PEEL_START = 3;

function PeelLayer({ video }: { video: PeelVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  const seekToStart = () => {
    const v = ref.current;
    if (!v) return;
    if (v.duration > PEEL_START && v.currentTime < PEEL_START) {
      try {
        v.currentTime = PEEL_START;
      } catch {
        /* ignore seek errors before metadata is ready */
      }
    }
  };

  return (
    <video
      ref={ref}
      src={video.src}
      poster={video.poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedMetadata={seekToStart}
      onEnded={() => {
        const v = ref.current;
        if (!v) return;
        v.currentTime = PEEL_START;
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }}
      className="pointer-events-none h-full w-full object-cover"
      style={{ filter: "saturate(1.05) contrast(1.02)" }}
    />
  );
}
