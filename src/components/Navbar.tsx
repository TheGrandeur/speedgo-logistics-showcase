import { Link } from "@tanstack/react-router";
import { Moon, Sun, Package } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function Navbar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: "color-mix(in oklab, var(--background) 78%, transparent)", borderBottom: "1px solid var(--border)" }}>
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl shadow-soft" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Package className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight">SpeedGo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/book", label: "Book Shipment" },
            { to: "/track", label: "Track Cargo" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ style: { backgroundColor: "var(--surface-2)", color: "var(--foreground)" } }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--surface)] transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border transition hover:bg-[var(--surface)]"
            style={{ borderColor: "var(--border)" }}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <Link to="/book" className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-xs">
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
