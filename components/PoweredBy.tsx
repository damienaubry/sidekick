// Sponsor credit strip — the single source of truth for who powered Sidekick.
// Logos are VENDORED locally (public/sponsors/*.svg) so a live demo never depends on the
// network; each is an alpha SVG dropped into a fixed 16x16 slot via CSS mask and tinted to the
// brand color (dimmed at rest, full color + soft glow on hover). Brand colors are approximations.

interface Sponsor {
  name: string;
  color: string; // brand color — the only color in the strip
  logo: string; // local vendored svg
  href: string;
  role: string; // one line on what it powers (also the hover title)
}

const SPONSORS: Sponsor[] = [
  {
    name: "HydraDB",
    color: "#18c2c2", // teal (brand approximation; logo hand-drawn + vendored locally)
    logo: "/sponsors/hydradb.svg",
    href: "https://hydradb.com",
    role: "Temporally-versioned memory — recalls how a person's tastes evolved",
  },
  {
    name: "Nebius",
    color: "#b4ec51", // lime (brand approximation; logo hand-drawn + vendored locally)
    logo: "/sponsors/nebius.svg",
    href: "https://nebius.ai",
    role: "Open-model inference — synthesizes recalled memories into the gesture",
  },
];

export default function PoweredBy({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 backdrop-blur-sm ${className}`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted/70">
        powered by
      </span>
      <div className="flex items-center gap-3">
        {SPONSORS.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3">
            {i > 0 && <span className="h-3.5 w-px bg-border" />}
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              title={`${s.name} — ${s.role}`}
              className="group flex items-center gap-1.5"
              style={{ "--brand": s.color } as React.CSSProperties}
            >
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_6px_var(--brand))]"
                style={{
                  backgroundColor: "var(--brand)",
                  WebkitMaskImage: `url(${s.logo})`,
                  maskImage: `url(${s.logo})`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <span className="border-b border-transparent text-[12px] font-semibold text-ink/90 transition-colors group-hover:[border-color:var(--brand)]">
                {s.name}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
