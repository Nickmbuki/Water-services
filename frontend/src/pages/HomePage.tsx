import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Droplets, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage = "/images/water-bowser/water-bowser-hero.jpg";
const deliveryImage = "/images/water-bowser/water-bowser-bulk.jpg";
const detailImage = "/images/water-bowser/water-bowser-business.jpg";

const stats = [
  ["Nairobi", "Physical office and dispatch coordination"],
  ["Nairobi & Kiambu", "Focused delivery coverage"],
  ["0782 602171", "Primary customer line"]
];

const steps = [
  ["Request", "Enter your location, schedule, and estimated delivery budget."],
  ["Confirm", "Dispatch calls to confirm access, timing, and final pricing."],
  ["Deliver", "A water bowser truck delivers clean bulk water to your tank or site."]
];

export const HomePage = () => (
  <main>
    <section className="relative min-h-[82vh] overflow-hidden">
      <img className="absolute inset-0 h-full w-full object-cover" src={heroImage} alt="Clean water bowser truck" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.86),rgba(15,23,42,0.5),rgba(2,6,23,0.14))]" />
      <div className="container-shell relative flex min-h-[82vh] items-center pb-16 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl text-white"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
            <Truck className="h-4 w-4 text-secondary" />
            Bulk water bowser delivery
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Clean Bulk Water Delivery Across Nairobi & Kiambu
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
            Reliable water bowser truck delivery for homes, estates, apartments, businesses, institutions, and sites.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services">
              <Button size="lg" type="button">
                Order Water
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:0782602171">
              <Button size="lg" variant="secondary" type="button">
                <Phone className="h-5 w-5" />
                Call 0782 602171
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="bg-white py-12">
      <div className="container-shell grid gap-4 md:grid-cols-3">
        {stats.map(([title, text], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="rounded-lg border border-border p-5 shadow-sm"
          >
            <p className="text-xl font-bold text-primary">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="bg-muted py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">One simple service</p>
          <h2 className="mt-2 text-3xl font-bold">Bulk water delivered by bowser truck</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            The website is focused on a single customer action: request a clean bulk water delivery. Customers can schedule
            a date and time, search or send their location, add access notes, and submit the request for dispatch follow-up.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Domestic tanks", "Apartments and estates", "Business premises", "Construction sites"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <img className="h-[420px] w-full rounded-lg object-cover shadow-soft" src={deliveryImage} alt="Water bowser delivery truck" />
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container-shell">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold">Fast request, clear confirmation</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(([title, text], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-lg border border-border bg-white p-6 shadow-sm"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-primary text-lg font-bold text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-slate-950 py-16 text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <img className="h-[420px] w-full rounded-lg object-cover" src={detailImage} alt="Water bowser truck delivery detail" />
        <div>
          <Droplets className="mb-4 h-10 w-10 text-secondary" />
          <h2 className="text-3xl font-bold">Built for reliable bulk water delivery</h2>
          <p className="mt-4 leading-7 text-slate-300">
            The ordering flow keeps the essentials visible: delivery location, delivery time, customer contact, notes for
            dispatch, and order tracking after submission.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              [Clock, "Scheduled delivery windows"],
              [MapPin, "Location search and current location"],
              [ShieldCheck, "Admin order management"],
              [Truck, "Focused tanker dispatch"]
            ].map(([Icon, text]) => (
              <div key={String(text)} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <Icon className="h-5 w-5 text-secondary" />
                <span className="text-sm font-semibold">{String(text)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container-shell">
        <h2 className="text-3xl font-bold">Trusted for clean water supply</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["The bowser arrived on time and the team coordinated access with our caretaker.", "Apartment manager, Kilimani"],
            ["Clear communication, fair confirmation, and reliable delivery to our site.", "Site supervisor, Ruiru"],
            ["Simple ordering and quick dispatch support when our tanks were low.", "Homeowner, Kiambu"]
          ].map(([quote, author]) => (
            <figure key={author} className="rounded-lg bg-muted p-6">
              <blockquote className="text-sm leading-6 text-slate-700">"{quote}"</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-primary">{author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-primary py-14 text-white">
      <div className="container-shell flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Request bulk water delivery today</h2>
          <p className="mt-2 text-white/85">Physical office: Nairobi, Kenya. Serving Nairobi County and Kiambu County.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/services">
            <Button type="button" variant="secondary">
              Order Water
            </Button>
          </Link>
          <a href="tel:0797608086">
            <Button type="button" variant="outline" className="bg-white text-primary hover:bg-muted">
              <Phone className="h-4 w-4" />
              0797 608086
            </Button>
          </a>
        </div>
      </div>
    </section>
  </main>
);
