import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plane, Ship, Truck, ShieldCheck, Zap, PackageCheck, CheckCircle2,
  X, ArrowRight, Globe2, Home,
} from "lucide-react";
import {
  cargoTypes, calculatePrice, deliveryEstimate, generateCargoNumber,
  generateTrackingId, modeMeta, type ShipmentType, type ShippingMode,
} from "@/lib/mock";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Shipment — SpeedGo" },
      { name: "description", content: "Book domestic or international cargo with instant pricing and delivery estimates." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<ShipmentType>("domestic");
  const [sender, setSender] = useState("Bangalore, IN");
  const [receiver, setReceiver] = useState("Pune, IN");
  const [weight, setWeight] = useState(5);
  const [dims, setDims] = useState("30 x 20 x 15 cm");
  const [cargo, setCargo] = useState(cargoTypes[1]);
  const [fragile, setFragile] = useState(false);
  const [insurance, setInsurance] = useState(true);
  const [express, setExpress] = useState(false);
  const [mode, setMode] = useState<ShippingMode>("land");
  const [confirm, setConfirm] = useState<null | { id: string; cargoNum: string }>(null);

  const availableModes: ShippingMode[] = type === "domestic" ? ["air", "land"] : ["air", "water"];
  if (!availableModes.includes(mode)) {
    // auto-correct mode when toggling
    setTimeout(() => setMode(availableModes[0]), 0);
  }

  const price = useMemo(
    () => calculatePrice({ type, mode, weight, insurance, express }),
    [type, mode, weight, insurance, express]
  );
  const eta = deliveryEstimate(type, mode);

  const onConfirm = () => {
    const id = generateTrackingId();
    setConfirm({ id, cargoNum: generateCargoNumber(mode) });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="chip">New shipment</span>
          <h1 className="mt-4 text-4xl md:text-5xl">Book your cargo.</h1>
          <p className="mt-3 text-muted-foreground">Tell us what's moving and where. We'll handle the rest.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* FORM */}
          <div className="space-y-6">
            {/* Type toggle */}
            <div className="card-surface p-6">
              <Label>Shipment type</Label>
              <div className="mt-3 grid grid-cols-2 gap-2 p-1 rounded-full" style={{ backgroundColor: "var(--surface-2)" }}>
                {(["domestic", "international"] as ShipmentType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className="rounded-full py-2.5 text-sm font-medium capitalize transition"
                    style={
                      type === t
                        ? { backgroundColor: "var(--card)", color: "var(--foreground)", boxShadow: "var(--shadow-soft)" }
                        : { color: "var(--muted-foreground)" }
                    }
                  >
                    {t === "domestic" ? <Home className="inline h-4 w-4 mr-2" /> : <Globe2 className="inline h-4 w-4 mr-2" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="card-surface p-6 grid gap-5 md:grid-cols-2">
              <Field label="Sender address">
                <input className="input-field" value={sender} onChange={(e) => setSender(e.target.value)} />
              </Field>
              <Field label="Receiver address">
                <input className="input-field" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
              </Field>
            </div>

            {/* Package */}
            <div className="card-surface p-6">
              <Label>Package details</Label>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <Field label="Weight (kg)">
                  <input type="number" min={0.1} step={0.1} className="input-field" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
                </Field>
                <Field label="Dimensions">
                  <input className="input-field" value={dims} onChange={(e) => setDims(e.target.value)} />
                </Field>
                <Field label="Cargo type">
                  <select className="input-field" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                    {cargoTypes.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Handling">
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ backgroundColor: "var(--surface-2)" }}>
                    {[
                      { v: false, l: "Non-Fragile" },
                      { v: true, l: "Fragile" },
                    ].map((o) => (
                      <button
                        key={o.l}
                        onClick={() => setFragile(o.v)}
                        className="rounded-lg py-2 text-sm font-medium transition"
                        style={fragile === o.v ? { backgroundColor: "var(--card)", boxShadow: "var(--shadow-soft)" } : { color: "var(--muted-foreground)" }}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Toggle icon={<ShieldCheck className="h-4 w-4" />} label="Add insurance" sub="Covers loss & damage" on={insurance} onChange={setInsurance} />
                <Toggle icon={<Zap className="h-4 w-4" />} label="Express delivery" sub="Priority routing" on={express} onChange={setExpress} />
              </div>
            </div>

            {/* Shipping methods */}
            <div className="card-surface p-6">
              <Label>Shipping method</Label>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {availableModes.map((m) => (
                  <ModeCard key={m} m={m} active={mode === m} onClick={() => setMode(m)} eta={deliveryEstimate(type, m)} />
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="card-surface p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <Label>Payment method</Label>
                <p className="text-sm text-muted-foreground mt-1">Cash on Delivery (COD) — pay when it arrives.</p>
              </div>
              <span className="chip"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} /> COD selected</span>
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="card-surface p-7">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5" style={{ color: "var(--primary)" }} />
                <h3 className="text-lg font-semibold">Shipment summary</h3>
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <Row k="Type" v={type === "domestic" ? "Domestic" : "International"} />
                <Row k="From" v={sender} />
                <Row k="To" v={receiver} />
                <Row k="Method" v={`${modeMeta[mode].emoji} ${modeMeta[mode].label}`} />
                <Row k="Weight" v={`${weight} kg`} />
                <Row k="ETA" v={eta} />
              </dl>

              <div className="my-5 h-px" style={{ backgroundColor: "var(--border)" }} />

              <dl className="space-y-2 text-sm">
                <Row k="Base price" v={`$${price.base}`} />
                {price.customs > 0 && <Row k="Customs tax" v={`$${price.customs}`} />}
                {price.insurance > 0 && <Row k="Insurance" v={`$${price.insurance}`} />}
                {price.express > 0 && <Row k="Express fee" v={`$${price.express}`} />}
              </dl>

              <div className="mt-5 p-5 rounded-2xl flex items-baseline justify-between" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                <span className="text-sm opacity-80">Total</span>
                <span className="font-display text-3xl">${price.total}</span>
              </div>

              <button onClick={onConfirm} className="btn-primary w-full mt-5">
                Confirm Booking <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                You'll receive a tracking ID instantly.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {confirm && (
        <Modal onClose={() => setConfirm(null)}>
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-3xl">Booking confirmed</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your cargo is scheduled. Use your tracking ID to follow it live.
            </p>

            <div className="mt-6 card-surface p-5 text-left">
              <Row k="Tracking ID" v={<span className="font-mono font-semibold">{confirm.id}</span>} />
              <Row k="Cargo number" v={confirm.cargoNum} />
              <Row k="Method" v={`${modeMeta[mode].emoji} ${modeMeta[mode].label}`} />
              <Row k="From → To" v={`${sender} → ${receiver}`} />
              <Row k="ETA" v={eta} />
              <Row k="Total (COD)" v={`$${price.total}`} />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="btn-primary"
                onClick={() => navigate({ to: "/track", search: { id: confirm.id } as never })}
              >
                Track shipment <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/" className="btn-ghost">Back to home</Link>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}
function Toggle({ icon, label, sub, on, onChange }: { icon: React.ReactNode; label: string; sub: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition"
      style={{
        borderColor: on ? "var(--primary)" : "var(--border)",
        backgroundColor: on ? "color-mix(in oklab, var(--primary) 8%, var(--card))" : "var(--card)",
      }}
    >
      <span className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "var(--surface-2)" }}>{icon}</span>
        <span>
          <span className="block text-sm font-semibold">{label}</span>
          <span className="block text-xs text-muted-foreground">{sub}</span>
        </span>
      </span>
      <span
        className="h-5 w-9 rounded-full p-0.5 transition"
        style={{ backgroundColor: on ? "var(--primary)" : "var(--surface-2)" }}
      >
        <span
          className="block h-4 w-4 rounded-full bg-white transition"
          style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
        />
      </span>
    </button>
  );
}
function ModeCard({ m, active, onClick, eta }: { m: ShippingMode; active: boolean; onClick: () => void; eta: string }) {
  const meta = modeMeta[m];
  const Icon = m === "air" ? Plane : m === "water" ? Ship : Truck;
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border p-5 transition hover:-translate-y-0.5"
      style={{
        borderColor: active ? "var(--primary)" : "var(--border)",
        backgroundColor: active ? "color-mix(in oklab, var(--primary) 8%, var(--card))" : "var(--card)",
        boxShadow: active ? "var(--shadow-lift)" : "var(--shadow-soft)",
      }}
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
        <span className="text-xl">{meta.emoji}</span>
      </div>
      <p className="mt-4 font-semibold">{meta.label}</p>
      <p className="text-xs text-muted-foreground">{meta.speed} · ×{meta.multiplier}</p>
      <p className="mt-3 text-xs"><span className="text-muted-foreground">ETA:</span> <span className="font-medium">{eta}</span></p>
    </button>
  );
}
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-up" style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 35%, transparent)" }}>
      <div className="card-surface w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--surface-2)]">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
