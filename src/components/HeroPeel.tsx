import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal, MoveVertical } from "lucide-react";

type PeelVideo = {
  src: string;
  poster: string;
};

/**
 * Shared inset frame for the peel surface and the overlay labels/CTAs so corners
 * align. Full-bleed width on mobile; insets on desktop so the clip can diffuse
 * into the surrounding texture.
 */
export const PEEL_FRAME =
  "left-0 right-0 top-[12%] bottom-[9%] md:left-[7%] md:right-[7%] md:top-[9%] md:bottom-[6.5%]";

/**
 * Inner frame for the video surface itself. On desktop it is sized natively
 * ~25% smaller than {@link PEEL_FRAME} (centered) instead of using a CSS
 * `transform: scale()`, so the 1916px source is downscaled in a single pass and
 * stays crisp on hi-DPI screens (a transform would rasterize at the full layout
 * size and then resample again, softening the video). Full-bleed on mobile.
 */
export const PEEL_FRAME_VIDEO =
  "left-0 right-0 top-[12%] bottom-[9%] md:left-[17.75%] md:right-[17.75%] md:top-[19.5%] md:bottom-[17%]";

/**
 * Full-bleed "peel" surface: stacks two looping clips and clips the top one
 * along a draggable seam that peels back to reveal the second. The seam is a
 * vertical diagonal on desktop (drag left/right) and a horizontal diagonal on
 * mobile (drag up/down) so it reads well in portrait.
 *
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
  // true = vertical seam (desktop), false = horizontal seam (mobile portrait)
  const [vertical, setVertical] = useState(true);
  const verticalRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      verticalRef.current = mq.matches;
      setVertical(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const apply = useCallback(
    (raw: number) => {
      const p = Math.min(92, Math.max(8, raw));
      posRef.current = p;
      const a = p + tilt;
      const b = p - tilt;
      if (verticalRef.current) {
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
          glowRef.current.style.top = "";
        }
      } else {
        const clip = `polygon(0% 0%, 100% 0%, 100% ${b}%, 0% ${a}%)`;
        if (topRef.current) {
          topRef.current.style.clipPath = clip;
          topRef.current.style.setProperty("-webkit-clip-path", clip);
        }
        if (lineRef.current) {
          lineRef.current.setAttribute("x1", "0");
          lineRef.current.setAttribute("y1", String(a));
          lineRef.current.setAttribute("x2", "100");
          lineRef.current.setAttribute("y2", String(b));
        }
        if (handleRef.current) {
          handleRef.current.style.top = `${p}%`;
          handleRef.current.style.left = "50%";
        }
        if (glowRef.current) {
          glowRef.current.style.top = `${p}%`;
          glowRef.current.style.left = "";
        }
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
    if (verticalRef.current) {
      const deg = (Math.atan2(-2 * (tilt / 100) * w, h) * 180) / Math.PI;
      g.style.transform = `skewX(${deg}deg)`;
    } else {
      const deg = (Math.atan2(-2 * (tilt / 100) * h, w) * 180) / Math.PI;
      g.style.transform = `skewY(${deg}deg)`;
    }
  }, [tilt]);

  useEffect(() => {
    apply(posRef.current);
    updateSkew();
  }, [apply, updateSkew, vertical]);

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
    (clientX: number, clientY: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (verticalRef.current) {
        apply(((clientX - rect.left) / rect.width) * 100);
      } else {
        apply(((clientY - rect.top) / rect.height) * 100);
      }
    },
    [apply],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      setFromClient(e.clientX, e.clientY);
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

  const startDrag = (clientX: number, clientY: number) => {
    setAuto(false);
    draggingRef.current = true;
    setFromClient(clientX, clientY);
  };

  const initialClip = vertical
    ? "polygon(0% 0%, 65% 0%, 51% 100%, 0% 100%)"
    : "polygon(0% 0%, 100% 0%, 100% 51%, 0% 65%)";
  // Fades all four edges to transparent so the clip melts into the texture.
  const edgeMask =
    "linear-gradient(to right, transparent, #000 11%, #000 89%, transparent), linear-gradient(to bottom, transparent, #000 11%, #000 89%, transparent)";

  return (
    <div
      ref={wrapRef}
      onPointerDown={(e) => {
        // On mobile (horizontal seam) let touches scroll the page; the handle
        // initiates the peel instead.
        if (e.pointerType === "touch" && !verticalRef.current) return;
        startDrag(e.clientX, e.clientY);
      }}
      className={`group absolute ${PEEL_FRAME_VIDEO} touch-pan-y select-none overflow-hidden ${
        vertical ? "cursor-ew-resize" : "cursor-ns-resize"
      }`}
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

      {/* Techy trailing glow — a diffused pink→blue wash riding just past the
          seam, screen-blended over the revealed clip. */}
      <div
        ref={glowRef}
        className={`pointer-events-none absolute z-[1] opacity-80 mix-blend-screen ${
          vertical
            ? "inset-y-0 w-[30%] [will-change:left]"
            : "inset-x-0 h-[30%] [will-change:top]"
        }`}
        style={{
          left: vertical ? "58%" : undefined,
          top: vertical ? undefined : "58%",
          background: vertical
            ? "linear-gradient(to right, rgba(244,63,148,0.5) 0%, rgba(244,63,148,0.18) 36%, rgba(244,63,148,0) 72%)"
            : "linear-gradient(to bottom, rgba(244,63,148,0.5) 0%, rgba(244,63,148,0.18) 36%, rgba(244,63,148,0) 72%)",
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

      {/* Drag handle — simple round overlay; on mobile it also captures the
          vertical drag (touch-action none) so the surface can still scroll. */}
      <div
        ref={handleRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          startDrag(e.clientX, e.clientY);
        }}
        className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 touch-none"
        style={{ left: "58%" }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-black/30 text-white shadow-[0_2px_14px_rgba(0,0,0,0.55)] backdrop-blur-sm transition group-hover:scale-105">
          {vertical ? <MoveHorizontal size={16} /> : <MoveVertical size={16} />}
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
