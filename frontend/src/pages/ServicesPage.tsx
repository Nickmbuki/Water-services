import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, MapPin, MessageCircle, Phone, Truck, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const whatsappPrimary = "https://wa.me/254782602171";

const deliveryDetails = [
  "Bulk water bowser delivery only",
  "Delivery requests for homes, estates, businesses, institutions, and sites",
  "Location search and current location support on the request form",
  "Dispatch confirmation by phone or WhatsApp"
];

export const ServicesPage = () => {
  const servicesQuery = useQuery({ queryKey: ["services"], queryFn: () => api.services() });
  const service = servicesQuery.data?.services[0];

  return (
    <main className="bg-muted/60">
      <section className="bg-slate-950 py-14 text-white">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-secondary">
              <Truck className="h-4 w-4" />
              Order bulk water
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Schedule a water bowser delivery
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              One clear request form for clean bulk water delivery across Nairobi and Kiambu. Submit your location,
              preferred delivery time, budget estimate, and access notes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {service ? (
                <Link to={`/checkout/${service.id}`}>
                  <Button size="lg" type="button">
                    <CalendarClock className="h-5 w-5" />
                    Start Delivery Request
                  </Button>
                </Link>
              ) : null}
              <a href={whatsappPrimary} target="_blank" rel="noreferrer">
                <Button size="lg" type="button" variant="secondary">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Dispatch
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-2xl"
          >
            <img
              className="h-72 w-full object-cover"
              src="/images/water-bowser/water-bowser-landing.jpg"
              alt="Water bowser tanker truck"
            />
            <div className="p-5">
              <p className="text-sm font-semibold text-secondary">{service?.name ?? "Bulk Water Bowser Delivery"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {service?.description ??
                  "Clean bulk water delivered by water bowser truck for homes, estates, apartments, businesses, institutions, and construction sites."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">What the request covers</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {deliveryDetails.map((detail, index) => (
                <motion.div
                  key={detail}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-md bg-muted p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-6 text-slate-700">{detail}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <Waves className="mb-4 h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">Dispatch contacts</h2>
            <div className="mt-4 space-y-3 text-sm">
              <a className="flex items-center gap-3 rounded-md bg-muted p-3 font-semibold text-slate-800" href="tel:0782602171">
                <Phone className="h-4 w-4 text-primary" />
                0782 602171
              </a>
              <a className="flex items-center gap-3 rounded-md bg-muted p-3 font-semibold text-slate-800" href="tel:0797608086">
                <Phone className="h-4 w-4 text-primary" />
                0797 608086
              </a>
              <p className="flex items-start gap-3 rounded-md bg-primary/10 p-3 leading-6 text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Office: Nairobi, Kenya. Service areas: Nairobi County and Kiambu County.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};
