import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock, Droplets, Hammer, Truck, Wrench } from "lucide-react";
import { api, type Service, type ServiceCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type VisibleCategory = ServiceCategory;

const categories: Array<{ id: "all" | VisibleCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "delivery", label: "Water delivery" },
  { id: "borehole", label: "Well services" },
  { id: "plumbing", label: "Plumbing" }
];

const icons = {
  delivery: Truck,
  borehole: Hammer,
  plumbing: Wrench
};

const categoryLabels: Record<VisibleCategory, string> = {
  delivery: "delivery",
  borehole: "well service",
  plumbing: "plumbing"
};

const ServiceCard = ({ service }: { service: Service }) => {
  const category = service.category as VisibleCategory;
  const Icon = icons[category];
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <Card className="h-full overflow-hidden shadow-sm">
        <img className="h-52 w-full object-cover" src={service.imageUrl} alt={service.name} />
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold capitalize text-primary">
              <Icon className="h-4 w-4" />
              {categoryLabels[category]}
            </span>
            <span className="font-bold text-primary">Request quote</span>
          </div>
          <h2 className="text-xl font-semibold">{service.name}</h2>
          <p className="mt-2 min-h-20 text-sm leading-6 text-muted-foreground">{service.description}</p>
          <Link to={`/checkout/${service.id}`}>
            <Button type="button" className="mt-5 w-full">
              <CalendarClock className="h-4 w-4" />
              Schedule Request
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ServicesPage = () => {
  const [category, setCategory] = useState<"all" | VisibleCategory>("all");
  const servicesQuery = useQuery({ queryKey: ["services"], queryFn: () => api.services() });

  const filtered = useMemo(() => {
    const services = servicesQuery.data?.services ?? [];
    return category === "all" ? services : services.filter((service) => service.category === category);
  }, [category, servicesQuery.data?.services]);

  return (
    <main className="bg-muted/60 py-12">
      <div className="container-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Droplets className="h-4 w-4" />
              Online ordering
            </p>
            <h1 className="mt-2 text-4xl font-bold">Choose a water service</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Select bulk water delivery, emergency supply, well drilling, pump installation, leak repair, or tank installation.
              Submit your request online and our team will confirm dispatch details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={category === item.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {servicesQuery.isLoading ? <p>Loading services...</p> : null}
        {servicesQuery.isError ? <p className="text-red-600">Could not load services.</p> : null}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </main>
  );
};
