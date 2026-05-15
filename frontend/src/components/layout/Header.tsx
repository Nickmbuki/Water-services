import { Link, NavLink } from "react-router-dom";
import { LogOut, MessageCircle, Phone, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navLink = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition ${isActive ? "text-primary" : "text-slate-700 hover:text-primary"}`;

export const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="container-shell flex min-h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 font-bold text-primary">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
            <Waves className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            Bowser Water
            <span className="block text-xs font-semibold text-slate-500">Nairobi & Kiambu</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/services" className={navLink}>
            Order Water
          </NavLink>
          <NavLink to="/account" className={navLink}>
            Orders
          </NavLink>
          {user?.role === "admin" ? (
            <NavLink to="/admin" className={navLink}>
              Admin
            </NavLink>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          <a className="hidden items-center gap-2 text-sm font-semibold text-slate-700 lg:flex" href="tel:0782602171">
            <Phone className="h-4 w-4 text-primary" />
            0782 602171
          </a>
          <a
            className="hidden h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-white transition hover:bg-accent/90 sm:inline-flex"
            href="https://wa.me/254782602171"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          {user ? (
            <Button type="button" variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
