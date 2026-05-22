// Mock dataset for SpeedGo prototype
export type ShippingMode = "air" | "water" | "land";
export type ShipmentType = "domestic" | "international";

export interface Shipment {
  id: string;
  type: ShipmentType;
  mode: ShippingMode;
  senderCity: string;
  receiverCity: string;
  status: string;
  estimatedDelivery: string;
  cargoNumber: string;
  weight: number;
  checkpoints: Checkpoint[];
  currentStep: number;
}

export interface Checkpoint {
  location: string;
  status: string;
  timestamp: string;
  done: boolean;
}

export const cargoTypes = [
  "Documents",
  "Electronics",
  "Apparel",
  "Perishables",
  "Machinery",
  "Furniture",
  "Pharmaceuticals",
  "Other",
];

export const modeMeta: Record<
  ShippingMode,
  { label: string; emoji: string; multiplier: number; speed: string }
> = {
  air:   { label: "Air Shipping",   emoji: "✈️", multiplier: 2.4, speed: "Fastest" },
  water: { label: "Water Shipping", emoji: "🚢", multiplier: 0.9, speed: "Economic" },
  land:  { label: "Land Shipping",  emoji: "🚚", multiplier: 1.2, speed: "Reliable" },
};

export function deliveryEstimate(type: ShipmentType, mode: ShippingMode) {
  if (type === "domestic" && mode === "air") return "2–4 days";
  if (type === "domestic" && mode === "land") return "4–7 days";
  if (type === "international" && mode === "air") return "5–8 days";
  if (type === "international" && mode === "water") return "15–25 days";
  return "5–10 days";
}

export function generateTrackingId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const num = Math.floor(100000 + Math.random() * 899999);
  return `SG-${rand(3)}-${num}`;
}

export function generateCargoNumber(mode: ShippingMode) {
  const prefix = mode === "air" ? "PLN" : mode === "water" ? "SHP" : "TRK";
  const n = Math.floor(1000 + Math.random() * 8999);
  return `${prefix}-${n}`;
}

const intlFlow = [
  "Booked", "Packed", "Shipped", "In Transit",
  "Customs Processing", "Customs Cleared",
  "Arrived at Destination", "Reached Nearest Hub",
  "Out for Delivery", "Delivered",
];
const domFlow = [
  "Booked", "Packed", "Shipped", "In Transit",
  "Arrived at Destination", "Reached Nearest Hub",
  "Out for Delivery", "Delivered",
];

export function flowFor(type: ShipmentType) {
  return type === "international" ? intlFlow : domFlow;
}

function makeCheckpoints(type: ShipmentType, mode: ShippingMode, current: number): Checkpoint[] {
  const cities = type === "international"
    ? ["Delhi Hub", "Mumbai Port", "Dubai Customs", "London Airport", "Berlin Hub", "Local Courier"]
    : ["Bangalore Hub", "Hyderabad Transit", "Pune Sort Facility", "Mumbai Hub", "Local Courier"];
  const flow = flowFor(type);
  const now = Date.now();
  return flow.map((status, i) => ({
    status,
    location: cities[i % cities.length],
    timestamp: new Date(now - (flow.length - i) * 86400000 * 0.6).toLocaleString(),
    done: i <= current,
  }));
}

export const mockShipments: Shipment[] = [
  {
    id: "SG-ABX-481209",
    type: "international",
    mode: "air",
    senderCity: "Delhi, IN",
    receiverCity: "London, UK",
    status: "Customs Processing",
    estimatedDelivery: "Nov 28, 2026",
    cargoNumber: "PLN-7421",
    weight: 12.5,
    currentStep: 4,
    checkpoints: makeCheckpoints("international", "air", 4),
  },
  {
    id: "SG-QRT-220915",
    type: "domestic",
    mode: "land",
    senderCity: "Bangalore, IN",
    receiverCity: "Pune, IN",
    status: "Out for Delivery",
    estimatedDelivery: "Tomorrow",
    cargoNumber: "TRK-3318",
    weight: 4.2,
    currentStep: 6,
    checkpoints: makeCheckpoints("domestic", "land", 6),
  },
  {
    id: "SG-MNK-554702",
    type: "international",
    mode: "water",
    senderCity: "Mumbai, IN",
    receiverCity: "Hamburg, DE",
    status: "In Transit",
    estimatedDelivery: "Dec 18, 2026",
    cargoNumber: "SHP-9082",
    weight: 320,
    currentStep: 3,
    checkpoints: makeCheckpoints("international", "water", 3),
  },
];

export function findShipment(id: string): Shipment | undefined {
  const trimmed = id.trim().toUpperCase();
  return mockShipments.find((s) => s.id.toUpperCase() === trimmed);
}

export interface PriceInput {
  type: ShipmentType;
  mode: ShippingMode;
  weight: number;
  insurance: boolean;
  express: boolean;
}
export function calculatePrice(p: PriceInput) {
  const base = Math.max(10, p.weight * 8) * modeMeta[p.mode].multiplier * (p.type === "international" ? 1.6 : 1);
  const customs = p.type === "international" ? base * 0.12 : 0;
  const insurance = p.insurance ? base * 0.05 + 5 : 0;
  const express = p.express ? base * 0.18 + 12 : 0;
  const total = base + customs + insurance + express;
  return {
    base: Math.round(base),
    customs: Math.round(customs),
    insurance: Math.round(insurance),
    express: Math.round(express),
    total: Math.round(total),
  };
}
