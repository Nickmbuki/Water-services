import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, Droplets, MapPin, Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1578496479763-c21c718af028?auto=format&fit=crop&w=2200&q=85";
const wellImage = "/images/well-digging/well-digging-1.jpg";
const plumbingImage =
  "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1400&q=80";
const deliveryImage =
  "https://images.unsplash.com/photo-1578496479763-c21c718af028?auto=format&fit=crop&w=1400&q=80";

const services = [
  {
    title: "Water Delivery",
    image: deliveryImage,
    items: ["Water tanker bulk delivery", "Emergency water supply", "Home delivery", "Business delivery"]
  },
  {
    title: "Well Services",
    image: wellImage,
    items: ["Well drilling", "Well inspection", "Pump installation", "Well rehabilitation"]
  },
  {
    title: "Plumbing Services",
    image: plumbingImage,
    items: ["Home plumbing", "Commercial plumbing", "Leak repair", "Tank installation"]
  }
];

export const HomePage = () => (
  <main>
    <section className="relative min-h-[82vh] overflow-hidden">
      <img className="absolute inset-0 h-full w-full object-cover" src={heroImage} alt="Water bowser truck delivering bulk clean water" />
      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="container-shell relative flex min-h-[82vh] items-center pb-16 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl text-white"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
            <MapPin className="h-4 w-4 text-secondary" />
            Nairobi County and Kiambu County
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Clean Water & Well Solutions Across Nairobi & Kiambu
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
            Reliable bulk water delivery, well drilling and plumbing services.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services">
              <Button size="lg" type="button">
                Order Water
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="secondary" type="button">
                Request Service
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="bg-white py-14">
      <div className="container-shell grid gap-5 md:grid-cols-3">
        {[
          ["24/7 Emergency Supply", "Fast response when your home, business, or site runs dry."],
          ["Certified Well Teams", "Well drilling, inspection, rehabilitation, and pump installation."],
          ["Nairobi Office Support", "Call 0782 602171 or 0797 608086 for dispatch coordination."]
        ].map(([title, text]) => (
          <div key={title} className="rounded-lg border border-border p-6">
            <CheckCircle2 className="mb-4 h-7 w-7 text-accent" />
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-muted py-16">
      <div className="container-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Core services</p>
            <h2 className="mt-2 text-3xl font-bold">Complete clean water services</h2>
          </div>
          <Link className="font-semibold text-primary" to="/services">
            Browse all services
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="overflow-hidden rounded-lg border border-border bg-white">
              <img className="h-56 w-full object-cover" src={service.image} alt={service.title} />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <img className="h-[420px] w-full rounded-lg object-cover" src={wellImage} alt="Well digging and drilling work" />
        <div>
          <Droplets className="mb-4 h-10 w-10 text-primary" />
          <h2 className="text-3xl font-bold">Well drilling, inspection, pumps, and rehabilitation</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Technical teams handle site surveys, well digging and drilling coordination, safety checks, water level
            assessment, pump sizing, installation, and rehabilitation for homes, institutions, farms, and commercial
            sites.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-slate-950 py-16 text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Wrench className="mb-4 h-10 w-10 text-secondary" />
          <h2 className="text-3xl font-bold">Plumbing services for domestic and commercial water systems</h2>
          <p className="mt-4 leading-7 text-slate-300">
            From leak repair and tank installation to filtration systems and commercial pipework, the team keeps water
            infrastructure reliable after delivery.
          </p>
        </div>
        <img className="h-[420px] w-full rounded-lg object-cover" src={plumbingImage} alt="Professional plumbing service" />
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <img className="h-[420px] w-full rounded-lg object-cover" src={deliveryImage} alt="Water bowser truck delivery" />
        <div>
          <Building2 className="mb-4 h-10 w-10 text-accent" />
          <h2 className="text-3xl font-bold">Bulk water bowser delivery for homes, businesses, and sites</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Schedule water bowser truck deliveries for domestic tanks, construction sites, apartments, institutions, and
            commercial operations across Nairobi County and Kiambu County.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-muted py-16">
      <div className="container-shell">
        <h2 className="text-3xl font-bold">Trusted by property managers, families, and businesses</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["The tanker arrived on time and the team coordinated access with our caretaker.", "Apartment manager, Kilimani"],
            ["They inspected our well, replaced the pump, and restored supply within the week.", "School administrator, Kiambu"],
            ["The plumbing team fixed recurring leaks and installed a filtration system for our office.", "Operations lead, Westlands"]
          ].map(([quote, author]) => (
            <figure key={author} className="rounded-lg bg-white p-6 shadow-sm">
              <blockquote className="text-sm leading-6 text-slate-700">“{quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-primary">{author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-primary py-14 text-white">
      <div className="container-shell flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Contact dispatch and service scheduling</h2>
          <p className="mt-2 text-white/85">Physical office: Nairobi, Kenya. Serving Nairobi County and Kiambu County.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="tel:0782602171">
            <Button type="button" variant="secondary">
              <Phone className="h-4 w-4" />
              0782 602171
            </Button>
          </a>
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
