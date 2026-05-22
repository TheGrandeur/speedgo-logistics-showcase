import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, MapPin, Plane, Ship, Truck, Package, Clock, QrCode,
  CheckCircle2, Circle, Loader2, AlertCircle,
} from "lucide-react";
import { findShipment, flowFor, mockShipments, modeMeta, type Shipment } from "@/lib/mock";

type TrackSearch = { id?: string };

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>): TrackSearch => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Cargo — SpeedGo" },
      { name: "description", content: "Live shipment tracking dashboard for SpeedGo cargo." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const search = Route.useSearch();
  const [query, setQuery] = useState(search.id ?? "SG-ABX-481209");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (id: string) => {
    setLoading(true);
    setError(null);
    setShipment(null);
    setTimeout(() => {
      const s = findShipment(id);
      if (!s) setError("No shipment found with that ID. Try one of the demo IDs below.");
      setShipment(s ?? null);
      setLoading(false);
    }, 700);
  };

  useEffect(() => { run(query); /* eslint-disable-next-line */ }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="chip">Live tracking</span>
          <h1 className="mt-4 text-4xl md:text-5xl">Where's your cargo?</h1>
          <p className="mt-3 text-muted-foreground">Enter your SpeedGo tracking ID to see live checkpoint updates.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); run(query); }}
          className="mt-8 card-surface p-3 flex flex-col sm:flex-row gap-2"
        >
          <div className="flex items-center gap-3 flex-1 px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. SG-ABX-481209"
              className="flex-1 bg-transparent py-3 outline-none text-base font-mono tracking-wider"
            />
          </div>
          <button type="submit" className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Track
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground">Try:</span>
          {mockShipments.map((s) => (
            <button key={s.id} onClick={() => { setQuery(s.id); run(s.id); }} className="chip font-mono hover:bg-[var(--surface-2)]">
              {s.id}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading && <SkeletonDash />}
          {error && !loading && (
            <div className="card-surface p-8 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <p>{error}</p>
            </div>
          )}
          {shipment && !loading && <Dashboard s={shipment} />}
        </div>
      </div>
    </section>
  );
}

function Dashboard({ s }: { s: Shipment }) {
  const ModeIcon = s.mode === "air" ? Plane : s.mode === "water" ? Ship : Truck;
  const flow = useMemo(() => flowFor(s.type), [s.type]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] animate-fade-up">
      {/* MAIN COLUMN */}
      <div className="space-y-6">
        {/* Status hero */}
        <div className="card-surface p-7 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
          />
          <div className="flex items-start justify-between flex-wrap gap-4 relative">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Current status</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">{s.status}</h2>
              <p className="mt-3 text-sm text-muted-foreground">ETA · <span className="font-semibold text-foreground">{s.estimatedDelivery}</span></p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>
              <span className="h-2 w-2 rounded-full bg-current animate-pulse-dot" />
              <span className="text-sm font-semibold">Live</span>
            </div>
          </div>

          {/* Progress bar */}
          <ProgressBar flow={flow} current={s.currentStep} />
        </div>

        {/* Timeline */}
        <div className="card-surface p-7">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2"><QrCode className="h-5 w-5" /> Checkpoint timeline</h3>
            <span className="chip">{s.checkpoints.filter(c => c.done).length} / {s.checkpoints.length} scans</span>
          </div>

          <ol className="mt-6 relative">
            <span aria-hidden className="absolute left-[14px] top-2 bottom-2 w-px" style={{ backgroundColor: "var(--border)" }} />
            {s.checkpoints.map((c, i) => {
              const active = i === s.currentStep;
              return (
                <li key={i} className="relative pl-10 pb-6 last:pb-0">
                  <span
                    className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full"
                    style={{
                      backgroundColor: c.done ? "var(--primary)" : "var(--surface-2)",
                      color: c.done ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      border: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    }}
                  >
                    {c.done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{c.status}</p>
                    <span className="text-xs text-muted-foreground">{c.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {c.location}
                  </p>
                  {active && (
                    <span className="mt-2 inline-flex chip">
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: "var(--accent)" }} />
                      Currently here
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* SIDE: Summary card */}
      <aside className="space-y-6 lg:sticky lg:top-24 self-start">
        <div className="card-surface p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: "var(--surface-2)" }}>
              <ModeIcon className="h-5 w-5" style={{ color: "var(--primary)" }} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{modeMeta[s.mode].label}</p>
              <p className="font-mono font-semibold">{s.id}</p>
            </div>
          </div>

          <div className="my-5 h-px" style={{ backgroundColor: "var(--border)" }} />

          <dl className="space-y-3 text-sm">
            <Row k="Shipment type" v={s.type === "domestic" ? "Domestic" : "International"} />
            <Row k="From" v={s.senderCity} />
            <Row k="To" v={s.receiverCity} />
            <Row k="Estimated delivery" v={s.estimatedDelivery} />
            <Row k="Weight" v={`${s.weight} kg`} />
            <Row k={s.mode === "air" ? "Plane number" : s.mode === "water" ? "Ship number" : "Truck number"} v={<span className="font-mono">{s.cargoNumber}</span>} />
          </dl>
        </div>

        <div className="card-surface p-6">
          <h4 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4" /> Need help?</h4>
          <p className="mt-2 text-sm text-muted-foreground">Our 24/7 support team can intervene with customs, re-routing, or hold-on-delivery requests.</p>
          <Link to="/" className="btn-ghost w-full mt-4 !py-2.5 !text-xs">Contact support</Link>
        </div>
      </aside>
    </div>
  );
}

function ProgressBar({ flow, current }: { flow: string[]; current: number }) {
  const pct = ((current + 1) / flow.length) * 100;
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span><Clock className="inline h-3 w-3 mr-1" />Booked</span>
        <span>{Math.round(pct)}% complete</span>
        <span>Delivered</span>
      </div>
      <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
        />
      </div>
      <div className="mt-4 hidden md:grid" style={{ gridTemplateColumns: `repeat(${flow.length}, minmax(0,1fr))` }}>
        {flow.map((label, i) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span
              className="h-3 w-3 rounded-full transition"
              style={{
                backgroundColor: i <= current ? "var(--primary)" : "var(--surface-2)",
                outline: i === current ? `4px solid color-mix(in oklab, var(--accent) 40%, transparent)` : "none",
              }}
            />
            <span className="mt-2 text-[10px] leading-tight text-muted-foreground max-w-[80px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}

function SkeletonDash() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card-surface p-7 space-y-4">
        <div className="shimmer h-8 w-40 rounded-lg" />
        <div className="shimmer h-12 w-72 rounded-lg" />
        <div className="shimmer h-2 w-full rounded-full mt-6" />
        <div className="grid grid-cols-8 gap-2 mt-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="shimmer h-3 rounded-full" />)}
        </div>
      </div>
      <div className="card-surface p-7 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="shimmer h-5 w-full rounded" />)}
      </div>
    </div>
  );
}
