import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, Droplets, MapPin, Phone, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const points = [
  "Bulk tanker delivery for homes, estates, businesses, schools, and sites",
  "Scheduled delivery date and time",
  "Nairobi County and Kiambu County coverage",
  "Dispatch confirmation by phone"
];

export const ServicesPage = () => {
  const servicesQuery = useQuery({ queryKey: ["services"], queryFn: () => api.services() });
  const service = servicesQuery.data?.services[0];

  return (
    <main className="bg-muted/60 py-12">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <section>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Truck className="h-4 w-4" />
              Bulk water delivery
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Order clean water by bowser truck
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              A simple request form for bulk water delivery across Nairobi and Kiambu. Tell us where to deliver, when you
              need it, and your estimated budget. Dispatch will confirm the final delivery details.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {points.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="flex items-start gap-3 rounded-lg border border-border bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-6 text-slate-700">{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {service ? (
                <Link to={`/checkout/${service.id}`}>
                  <Button size="lg" type="button">
                    <CalendarClock className="h-5 w-5" />
                    Schedule Water Delivery
                  </Button>
                </Link>
              ) : null}
              <a href="tel:0782602171">
                <Button size="lg" type="button" variant="outline">
                  <Phone className="h-5 w-5" />
                  Call Dispatch
                </Button>
              </a>
            </div>
          </section>

          <Card className="overflow-hidden shadow-soft">
            <img
              className="h-72 w-full object-cover"
              src="/images/water-bowser/water-bowser-bulk.jpg"
              alt="Water bowser tanker truck"
            />
            <CardContent className="p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                <Droplets className="h-4 w-4" />
                One focused service
              </div>
              <h2 className="text-2xl font-bold">{service?.name ?? "Bulk Water Bowser Delivery"}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {service?.description ??
                  "Clean bulk water delivered by water bowser truck for homes, estates, apartments, businesses, institutions, and construction sites."}
              </p>
              <div className="mt-5 rounded-lg bg-muted p-4 text-sm leading-6 text-slate-700">
                <MapPin className="mb-2 h-5 w-5 text-primary" />
                Serving Nairobi County and Kiambu County from Nairobi, Kenya.
              </div>
            </CardContent>
          </Card>
        </div>

        {servicesQuery.isLoading ? <p className="mt-6 text-muted-foreground">Loading delivery service...</p> : null}
        {servicesQuery.isError ? <p className="mt-6 text-red-600">Could not load the delivery service.</p> : null}
      </div>
    </main>
  );
};
