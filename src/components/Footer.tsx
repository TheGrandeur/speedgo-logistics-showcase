import { Link } from "@tanstack/react-router";
import { Package, Twitter, Linkedin, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Package className="h-5 w-5" />
            </span>
            <span className="font-display text-xl">SpeedGo</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Modern logistics for a borderless world. Air, water and land cargo with live tracking, 24/7.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li><li>Careers</li><li>Press</li><li>Sustainability</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/book" className="hover:text-foreground">Book Shipment</Link></li>
            <li><Link to="/track" className="hover:text-foreground">Track Cargo</Link></li>
            <li>Shipping Modes</li>
            <li>Customs Support</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Connect</h4>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Instagram, Github].map((I, i) => (
              <span key={i} className="grid h-10 w-10 place-items-center rounded-full border hover:bg-[var(--surface-2)] transition" style={{ borderColor: "var(--border)" }}>
                <I className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border)" }}>
        <span>© 2026 SpeedGo Logistics. All rights reserved.</span>
        <span>Crafted with care for global trade.</span>
      </div>
    </footer>
  );
}
