import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plane, Ship, Truck, MapPin, QrCode, Globe2, ShieldCheck, Zap,
  ArrowRight, Package, CheckCircle2, Radar,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpeedGo — Fast, Secure & Reliable Cargo Shipping" },
      { name: "description", content: "Domestic and international cargo shipping with live QR tracking, air, water and land options." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Modes />
      <Stats />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 20%, color-mix(in oklab, var(--accent) 30%, transparent), transparent), radial-gradient(40% 40% at 10% 80%, color-mix(in oklab, var(--primary) 20%, transparent), transparent)",
        }}
      />
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 md:py-28 md:gap-8 items-center">
        <div className="animate-fade-up">
          <span className="chip"><Radar className="h-3.5 w-3.5" /> Live tracking · 120+ countries</span>
          <h1 className="mt-6 text-5xl leading-[1.05] md:text-6xl">
            Fast, Secure &amp; Reliable<br />
            <span style={{ color: "var(--primary)" }}>Cargo Shipping.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            SpeedGo moves your freight across cities and continents — by air, water and land —
            with QR-based tracking at every checkpoint.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn-primary">Book Shipment <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/track" className="btn-ghost">Track Shipment</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: "var(--accent)" }} /> 99% on-time</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: "var(--accent)" }} /> Insured cargo</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: "var(--accent)" }} /> COD available</span>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative h-[440px] md:h-[520px]">
      {/* Big plate */}
      <div
        className="absolute inset-0 rounded-3xl border shadow-lift"
        style={{
          background:
            "linear-gradient(150deg, var(--surface) 0%, var(--surface-2) 100%)",
          borderColor: "var(--border)",
        }}
      />
      {/* Center cargo emoji blob */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-[180px] md:text-[220px] animate-float select-none drop-shadow-xl">📦</div>
      </div>

      {/* Floating card 1 */}
      <div className="absolute left-4 top-6 md:left-8 md:top-8 card-surface p-4 w-56 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>
            <Plane className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Air freight</p>
            <p className="text-sm font-semibold">PLN-7421 · In Transit</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
          <div className="h-full rounded-full" style={{ width: "68%", backgroundColor: "var(--primary)" }} />
        </div>
      </div>

      {/* Floating card 2 */}
      <div className="absolute right-4 bottom-8 md:right-8 md:bottom-12 card-surface p-4 w-60 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between">
          <span className="chip"><QrCode className="h-3 w-3" /> QR scan</span>
          <span className="text-xs text-muted-foreground">Dubai Customs</span>
        </div>
        <p className="mt-3 text-sm font-semibold">Customs Cleared ✓</p>
        <p className="text-xs text-muted-foreground">Next: London Heathrow</p>
      </div>

      {/* Floating tag */}
      <div className="absolute left-6 bottom-6 card-surface px-3 py-2 flex items-center gap-2 animate-fade-up" style={{ animationDelay: "0.45s" }}>
        <span className="h-2 w-2 rounded-full animate-pulse-dot" style={{ backgroundColor: "var(--accent)" }} />
        <span className="text-xs font-medium">Live · 2,481 active shipments</span>
      </div>
    </div>
  );
}

const features = [
  { icon: Radar, title: "Live Tracking", desc: "Real-time GPS + checkpoint scans." },
  { icon: Plane, title: "Air Cargo", desc: "Express jets, 120+ destinations." },
  { icon: Ship, title: "Water Cargo", desc: "Bulk freight via global ports." },
  { icon: Truck, title: "Land Transport", desc: "Door-to-door domestic delivery." },
  { icon: Globe2, title: "International", desc: "Customs handled end-to-end." },
  { icon: QrCode, title: "QR Tracking", desc: "Every parcel, every scan." },
  { icon: ShieldCheck, title: "Customs Handling", desc: "Paperwork on autopilot." },
  { icon: Zap, title: "Fast Delivery", desc: "Optimized multi-modal routes." },
];

function Features() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="chip">What we do</span>
          <h2 className="mt-4 text-4xl md:text-5xl">A complete logistics stack.</h2>
          <p className="mt-3 text-muted-foreground">From first scan to final delivery, SpeedGo handles every link in the chain.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={f.title} className="card-surface p-6 transition hover:-translate-y-1 hover:shadow-lift animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: "var(--surface-2)" }}>
                <f.icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { t: "Book Shipment", d: "Enter pickup, drop-off and parcel details." },
  { t: "Select Shipping Method", d: "Air, water or land — your call." },
  { t: "Package Gets QR Code", d: "Unique scannable identity for every box." },
  { t: "Cargo Moves Through Checkpoints", d: "Each scan updates status live." },
  { t: "Track Shipment Live", d: "Watch your cargo on the dashboard." },
  { t: "Delivered Successfully", d: "Signed, sealed, delivered." },
];

function HowItWorks() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--surface)" }}>
      <div className="container-x">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-xl">
            <span className="chip">How it works</span>
            <h2 className="mt-4 text-4xl md:text-5xl">Six steps. Zero friction.</h2>
          </div>
        </div>

        <ol className="mt-12 relative grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className="card-surface p-6 relative">
              <span className="absolute -top-3 left-6 chip font-display !text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", border: "none" }}>
                Step {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const modes = [
  { icon: Plane, emoji: "✈️", title: "Air Shipping", speed: "2–8 days", use: "Urgent, high-value freight", note: "Express jets to 120+ airports." },
  { icon: Ship,  emoji: "🚢", title: "Water Shipping", speed: "15–25 days", use: "Bulk, heavy or oversized cargo", note: "Economical multi-port routing." },
  { icon: Truck, emoji: "🚚", title: "Land Shipping", speed: "2–7 days", use: "Domestic door-to-door", note: "Daily fleet across all regions." },
];

function Modes() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="max-w-xl">
          <span className="chip">Shipping modes</span>
          <h2 className="mt-4 text-4xl md:text-5xl">Choose how it moves.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {modes.map((m) => (
            <div key={m.title} className="card-surface p-8 group transition hover:-translate-y-1 hover:shadow-lift overflow-hidden relative">
              <div className="text-6xl">{m.emoji}</div>
              <h3 className="mt-6 text-2xl font-display">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.note}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Speed</dt>
                  <dd className="mt-1 font-semibold">{m.speed}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Best for</dt>
                  <dd className="mt-1 font-semibold">{m.use}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, value };
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div ref={ref} className="card-surface p-8 text-center">
      <p className="font-display text-5xl" style={{ color: "var(--primary)" }}>
        {v.toLocaleString()}<span>{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--surface)" }}>
      <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={10000} suffix="+" label="Deliveries completed" />
        <Stat value={120} suffix="+" label="Countries served" />
        <Stat value={99} suffix="%" label="Delivery success rate" />
        <Stat value={24} suffix="/7" label="Live tracking support" />
      </div>
    </section>
  );
}
