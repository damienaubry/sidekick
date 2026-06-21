"use client";
// Sidekick submission deck — the house 3-slide convention (Team · Product · Demo).
// Full-screen, keyboard-driven (←/→/Space · 1-3 · Esc→/), reuses the app theme tokens.
// No icon library (inline SVG) so it carries no deps beyond the app's.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PoweredBy from "@/components/PoweredBy";

const SLIDES = [
  { id: "team", label: "Team", accent: "#18c2c2" },
  { id: "product", label: "Product", accent: "#e8a87c" },
  { id: "demo", label: "Demo", accent: "#0e8c8c" },
] as const;

export default function Deck() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const accent = SLIDES[i].accent;
  const go = useCallback((d: number) => setI((x) => Math.min(n - 1, Math.max(0, x + d))), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setI((x) => Math.min(n - 1, x + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setI((x) => Math.max(0, x - 1));
      } else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(n - 1);
      else if (e.key === "Escape") router.push("/");
      else if (/^[1-9]$/.test(e.key)) {
        const t = Number(e.key) - 1;
        if (t < n) setI(t);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, router]);

  return (
    <main className="fixed inset-0 select-none overflow-hidden bg-[#07090c] text-ink">
      <style>{`@keyframes deckfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.deck-fade{animation:deckfade .45s cubic-bezier(.22,.61,.36,1) both}`}</style>

      {/* grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,194,194,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(24,194,194,.035) 1px,transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(80% 80% at 50% 40%, #000, transparent 100%)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, #000, transparent 100%)",
        }}
      />
      {/* per-slide accent wash */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-700"
        style={{ background: `radial-gradient(58% 48% at 50% 0%, ${accent}22, transparent 70%)` }}
      />

      {/* slide body (key-remounts → fade-in) */}
      <div
        key={i}
        className="deck-fade absolute inset-0 flex flex-col px-8 pt-8 pb-24 lg:px-20 lg:pt-12 lg:pb-28"
      >
        <header className="flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SidekickMark />
            <span className="text-[13px] font-semibold tracking-wide">
              SIDEKICK <span className="font-normal text-muted">· remembers the people you love</span>
            </span>
          </div>
          <PoweredBy />
        </header>

        <div className="flex min-h-0 flex-1 items-center">
          {i === 0 && <TeamSlide accent={accent} />}
          {i === 1 && <ProductSlide />}
          {i === 2 && <DemoSlide accent={accent} />}
        </div>
      </div>

      <Footer i={i} n={n} accent={accent} go={go} jump={setI} exit={() => router.push("/")} />
    </main>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

function SidekickMark() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-md bg-accent text-[11px] font-bold text-bg">
      S
    </span>
  );
}

function Label({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: accent ?? "#5b6772" }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── slide 1 · team ───────────────────────── */

function TeamSlide({ accent }: { accent: string }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
      <div className="flex flex-col items-center gap-5">
        <div
          className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-2 lg:h-56 lg:w-56"
          style={{ borderColor: `${accent}66`, boxShadow: `0 0 60px ${accent}22` }}
        >
          {imgErr ? (
            <span className="font-mono text-5xl font-semibold text-muted">DA</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/founder.jpg"
              alt="Damien Aubry"
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold lg:text-3xl">Damien Aubry</div>
          <div
            className="mt-1 font-mono text-[12px] uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Solo Founder
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <Label>What I ship</Label>
        <p className="mt-3 text-3xl leading-snug text-balance lg:text-5xl">
          <span className="font-semibold">Sidekick</span> — the memory that hands you the perfect{" "}
          <span style={{ color: accent }}>gesture</span> for the people you love.
        </p>

        <ul className="mt-9 space-y-3.5 text-[16px] text-muted lg:text-xl">
          {[
            "Solo build · shipped in ~4h",
            "Built on how we actually forget the people we love",
            "Real temporal memory, live — HydraDB + Nebius",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── slide 2 · product ───────────────────────── */

function ProductSlide() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* the hero one-liner — verbs colored */}
      <h2 className="text-3xl leading-tight text-balance lg:text-5xl">
        Tell it about the people you love. It{" "}
        <span style={{ color: "#18c2c2" }}>remembers how they change</span>
        <br className="hidden lg:block" /> — and{" "}
        <span style={{ color: "#e8a87c" }}>hands you the perfect gesture.</span>
      </h2>

      <ul className="mt-9 space-y-4 text-[16px] lg:text-xl">
        {[
          {
            k: "Problem",
            accent: "#5b6772",
            t: <>We remember the people we love badly — tastes drift, the gift’s always generic.</>,
          },
          {
            k: "The gap",
            accent: "#5b6772",
            t: (
              <>
                Assistants forget between sessions.{" "}
                <span className="text-ink">They never notice how a person changed.</span>
              </>
            ),
          },
          {
            k: "Sidekick",
            accent: "#18c2c2",
            t: (
              <span className="text-ink">
                Writes dated memories → recalls the change → drafts the gesture that says{" "}
                <em>“I was paying attention.”</em>
              </span>
            ),
          },
        ].map((row) => (
          <li key={row.k} className="flex items-start gap-4">
            <span
              className="mt-1 w-[88px] shrink-0 font-mono text-[12px] uppercase tracking-wider"
              style={{ color: row.accent }}
            >
              {row.k}
            </span>
            <span className="text-muted">{row.t}</span>
          </li>
        ))}
      </ul>

      {/* sponsor cards — one per ★ sponsor, load-bearing reason verbatim from the prize map */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {[
          {
            name: "HydraDB",
            color: "#18c2c2",
            line: "Temporally-versioned recall — remembers how a person’s tastes evolved. Cut it → generic gifts, the wow dies.",
          },
          {
            name: "Nebius",
            color: "#b4ec51",
            line: "Synthesizes the recalled memories into one specific, thoughtful gesture. Cut it → nothing to draft.",
          },
        ].map((s) => (
          <div
            key={s.name}
            className="rounded-xl border bg-[#0c1014] p-4"
            style={{ borderColor: `${s.color}44` }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
              />
              <span className="text-[15px] font-semibold text-ink">{s.name}</span>
            </div>
            <p className="mt-2 text-[14px] leading-snug text-muted">{s.line}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[11px] text-muted/70">
        <code className="text-muted">@hydradb/sdk</code> recall + Nebius synthesis run live · a
        seeded path guarantees the demo never breaks.
      </p>
    </div>
  );
}

/* ───────────────────────── slide 3 · demo ───────────────────────── */

function DemoSlide({ accent }: { accent: string }) {
  const [videoFailed, setVideoFailed] = useState(false);
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
      {/* headline (fixed) */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <h2 className="text-xl font-semibold leading-tight lg:text-3xl">
          Her birthday’s next week — <span style={{ color: accent }}>the gift she actually wants, in ~15s.</span>
        </h2>
        <span className="shrink-0 rounded-full border border-border bg-[#070b14] px-3 py-1 font-mono text-[11px] text-muted">
          ≤ 2:00 · working product
        </span>
      </div>

      {/* media (flexes to fill remaining height — can't overflow) */}
      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-black shadow-[0_0_80px_rgba(0,0,0,.6)]">
        {videoFailed ? (
          <>
            <iframe src="/" title="Sidekick — live app" className="h-full w-full border-0" />
            <span
              className="pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold"
              style={{ background: `${accent}22`, color: accent }}
            >
              ● LIVE PRODUCT
            </span>
          </>
        ) : (
          <video
            src="/deck-demo.mp4"
            controls
            autoPlay
            muted
            playsInline
            loop
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {/* caption (fixed) — the money-shot; the speaker carries the rest */}
      <p className="mt-3 shrink-0 text-[14px] text-muted lg:text-[16px]">
        Type <span className="text-ink">“my sister’s birthday is next week”</span> → Sidekick proposes
        the <span className="font-semibold text-[#e8a87c]">matcha she raves about</span>, not the espresso
        grinder → because it caught she switched{" "}
        <span className="font-semibold text-[#18c2c2]">coffee → matcha</span> weeks ago.
      </p>
    </div>
  );
}

/* ───────────────────────── footer ───────────────────────── */

function Footer({
  i,
  n,
  accent,
  go,
  jump,
  exit,
}: {
  i: number;
  n: number;
  accent: string;
  go: (d: number) => void;
  jump: (i: number) => void;
  exit: () => void;
}) {
  return (
    <footer className="absolute inset-x-0 bottom-0 flex items-center justify-between px-8 py-5 lg:px-20">
      <div className="font-mono text-[12px] text-muted">
        <span className="text-ink">{String(i + 1).padStart(2, "0")}</span> /{" "}
        {String(n).padStart(2, "0")} · {SLIDES[i].label}
      </div>

      <div className="flex items-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => jump(idx)}
            aria-label={`Go to ${s.label}`}
            className="h-2 rounded-full transition-all"
            style={{ width: idx === i ? 22 : 8, background: idx === i ? accent : "#2a3540" }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <NavBtn onClick={() => go(-1)} disabled={i === 0} label="Previous">
          <IconArrow dir="left" />
        </NavBtn>
        <NavBtn onClick={() => go(1)} disabled={i === n - 1} label="Next">
          <IconArrow dir="right" />
        </NavBtn>
        <button
          onClick={exit}
          className="ml-1 flex items-center gap-1.5 rounded-md border border-border bg-[#070b14] px-3 py-1.5 text-[12px] text-muted transition-colors hover:text-ink"
        >
          <IconX /> Exit
        </button>
      </div>
    </footer>
  );
}

function NavBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-md border border-border bg-[#070b14] p-2 text-muted transition-colors hover:bg-surface2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* inline icons (no icon library) */
function IconArrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
