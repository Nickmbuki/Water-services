import { Droplets, MapPin, Phone } from "lucide-react";

export const Footer = () => (
  <footer className="bg-slate-950 text-white">
    <div className="container-shell grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
      <div>
        <div className="mb-4 flex items-center gap-3 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary">
            <Droplets className="h-6 w-6" />
          </span>
          Nairobi Kiambu Water Services
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-300">
          Bulk water delivery, well drilling, plumbing, tank installation, and filtration systems for homes,
          institutions, and businesses.
        </p>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Service Areas</h3>
        <p className="flex items-center gap-2 text-sm text-slate-200">
          <MapPin className="h-4 w-4 text-secondary" />
          Nairobi County
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-200">
          <MapPin className="h-4 w-4 text-secondary" />
          Kiambu County
        </p>
        <p className="mt-2 text-sm text-slate-300">Physical office: Nairobi, Kenya</p>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
        <a className="flex items-center gap-2 text-sm text-slate-100" href="tel:0782602171">
          <Phone className="h-4 w-4 text-secondary" />
          0782 602171
        </a>
        <a className="mt-2 flex items-center gap-2 text-sm text-slate-100" href="tel:0797608086">
          <Phone className="h-4 w-4 text-secondary" />
          0797 608086
        </a>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
      © 2026 Nairobi Kiambu Water Services. All rights reserved.
    </div>
  </footer>
);
