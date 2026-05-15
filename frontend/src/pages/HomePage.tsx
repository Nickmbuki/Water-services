import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Waves
} from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage = "/images/water-bowser/water-bowser-landing.jpg";
const deliveryImage = "/images/water-bowser/water-bowser-business.jpg";
const closeupImage = "/images/water-bowser/water-bowser-emergency.jpg";

const whatsappPrimary = "https://wa.me/254782602171";
const whatsappSecondary = "https://wa.me/254797608086";

const trustItems = [
  ["Bulk water only", "One focused operation built around bowser dispatch."],
  ["Nairobi & Kiambu", "Local delivery coverage with Nairobi-based coordination."],
  ["Clear communication", "Call or WhatsApp before, during, and after dispatch."]
];

const process = [
  ["Share location", "Search your estate, road, landmark, or send current location."],
  ["Choose timing", "Select a delivery day and time that works for your tank or site."],
  ["Confirm dispatch", "The team calls or messages to confirm volume, access, and final cost."],
  ["Receive water", "The bowser arrives for clean bulk water delivery."]
];

export const HomePage = () => (
  <main className="bg-white">
    <section className="relative isolate min-h-[86vh] overflow-hidden bg-slate-950">
      <motion.img
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        src={heroImage}
        alt="Water bowser truck prepared for bulk water delivery"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.92),rgba(8,47,73,0.72),rgba(15,23,42,0.2))]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="container-shell relative flex min-h-[86vh] items-center pb-24 pt-24">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-white"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur">
              <Truck className="h-4 w-4 text-secondary" />
              Bulk water bowser delivery
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Clean Bulk Water Delivered When Your Tanks Need It
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              A focused water bowser delivery service for homes, estates, apartments, businesses, institutions, and sites
              across Nairobi and Kiambu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services">
                <Button size="lg" type="button">
                  Order Water
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href={whatsappPrimary} target="_blank" rel="noreferrer">
                <Button size="lg" variant="secondary" type="button">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Dispatch
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="rounded-lg border border-white/20 bg-white/12 p-5 text-white shadow-2xl backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Dispatch desk</p>
            <div className="mt-4 space-y-3">
              <a className="flex items-center gap-3 rounded-md bg-white/10 p-3 transition hover:bg-white/20" href="tel:0782602171">
                <Phone className="h-5 w-5 text-secondary" />
                <span>
                  <span className="block text-sm text-white/70">Primary line</span>
                  <span className="font-bold">0782 602171</span>
                </span>
              </a>
              <a className="flex items-center gap-3 rounded-md bg-white/10 p-3 transition hover:bg-white/20" href="tel:0797608086">
                <Phone className="h-5 w-5 text-secondary" />
                <span>
                  <span className="block text-sm text-white/70">Second line</span>
                  <span className="font-bold">0797 608086</span>
                </span>
              </a>
              <a
                className="flex items-center gap-3 rounded-md bg-secondary p-3 font-bold text-secondary-foreground transition hover:bg-secondary/90"
                href={whatsappSecondary}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                Send WhatsApp Message
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>

    <section className="-mt-12 pb-12">
      <div className="container-shell relative z-10 grid gap-4 md:grid-cols-3">
        {trustItems.map(([title, text], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="rounded-lg border border-border bg-white p-5 shadow-soft"
          >
            <CheckCircle2 className="mb-4 h-6 w-6 text-accent" />
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative">
          <img className="h-[440px] w-full rounded-lg object-cover shadow-soft" src={deliveryImage} alt="Water bowser delivery hose and truck detail" />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-5 left-5 rounded-lg bg-white p-4 shadow-soft"
          >
            <p className="text-sm text-muted-foreground">Service focus</p>
            <p className="mt-1 text-xl font-bold text-primary">Bulk bowser delivery</p>
          </motion.div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Built for water delivery</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Simple ordering. Fast communication. Reliable dispatch.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Customers should not have to guess what the company does. The platform is now centered on one job: receive a
            bulk water delivery request, capture the correct location and schedule, then make dispatch communication easy.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [MapPin, "Map-style location search"],
              [CalendarClock, "Scheduled day and time"],
              [MessageCircle, "WhatsApp communication"],
              [ShieldCheck, "Admin delivery tracking"]
            ].map(([Icon, text]) => (
              <div key={String(text)} className="flex items-center gap-3 rounded-md bg-muted p-4 text-sm font-semibold text-slate-700">
                <Icon className="h-5 w-5 text-primary" />
                {String(text)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-muted py-16">
      <div className="container-shell">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Customer flow</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">From low tank to confirmed delivery</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {process.map(([title, text], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-lg border border-border bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-slate-950 py-16 text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Communication channels</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Customers can reach dispatch without friction</h2>
          <p className="mt-4 leading-7 text-slate-300">
            Every critical page keeps the phone numbers visible. Customers can call, WhatsApp, submit a location, add gate
            directions, and track delivery requests after logging in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="tel:0782602171">
              <Button type="button" variant="secondary">
                <Phone className="h-4 w-4" />
                0782 602171
              </Button>
            </a>
            <a href={whatsappPrimary} target="_blank" rel="noreferrer">
              <Button type="button" variant="outline" className="bg-white text-primary hover:bg-muted">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [Clock3, "Delivery schedule", "Capture preferred day and time before dispatch."],
            [MapPin, "Precise location", "Use search suggestions or current location."],
            [Waves, "Bulk supply", "Focused on clean water bowser delivery only."],
            [Truck, "Admin visibility", "Operators can monitor and update delivery status."]
          ].map(([Icon, title, text]) => (
            <motion.div
              key={String(title)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4 }}
              className="rounded-lg border border-white/10 bg-white/5 p-5"
            >
              <Icon className="mb-4 h-6 w-6 text-secondary" />
              <h3 className="font-semibold">{String(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{String(text)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container-shell grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Ready to dispatch</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Request bulk water delivery in minutes</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Serving Nairobi County and Kiambu County from Nairobi, Kenya. Submit the order form or call the team directly
            for urgent coordination.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/services">
              <Button type="button" size="lg">
                Order Water
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:0797608086">
              <Button type="button" size="lg" variant="outline">
                <Phone className="h-5 w-5" />
                0797 608086
              </Button>
            </a>
          </div>
        </div>
        <img className="h-72 w-full rounded-lg object-cover shadow-soft" src={closeupImage} alt="Water bowser truck delivery equipment" />
      </div>
    </section>
  </main>
);
