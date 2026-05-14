import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  location: z.string().min(3),
  scheduledDate: z.string().min(1),
  amount: z.string().min(1, "Enter an estimated amount").refine((value) => Number(value) > 0, {
    message: "Estimated amount must be greater than zero"
  }),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

const locationSuggestions = [
  "Westlands, Nairobi",
  "Kilimani, Nairobi",
  "Lavington, Nairobi",
  "Karen, Nairobi",
  "Langata, Nairobi",
  "Runda, Nairobi",
  "Kasarani, Nairobi",
  "Embakasi, Nairobi",
  "Industrial Area, Nairobi",
  "Ruaka, Kiambu",
  "Ruiru, Kiambu",
  "Thika, Kiambu",
  "Kikuyu, Kiambu",
  "Kiambu Town",
  "Juja, Kiambu",
  "Limuru, Kiambu"
];

export const CheckoutPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const serviceQuery = useQuery({ queryKey: ["service", params.id], queryFn: () => api.service(params.id ?? ""), enabled: Boolean(params.id) });
  const service = serviceQuery.data?.service;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { location: "", scheduledDate: "", amount: "", notes: "" }
  });

  const filteredLocations = useMemo(() => {
    if (!locationQuery.trim()) return locationSuggestions.slice(0, 6);
    return locationSuggestions
      .filter((location) => location.toLowerCase().includes(locationQuery.toLowerCase()))
      .slice(0, 6);
  }, [locationQuery]);

  const submitDetails = form.handleSubmit(async (values) => {
    if (!service) return;
    const amount = Number(values.amount);
    const order = await api.createOrder({
      serviceId: service.id,
      amount,
      location: values.notes ? `${values.location}. Notes: ${values.notes}` : values.location,
      scheduledDate: new Date(values.scheduledDate).toISOString()
    });
    navigate(`/account?created=${order.order.id}`);
  });

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Current location is not available in this browser.");
      return;
    }
    setLocationMessage("Getting current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = `Current location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        form.setValue("location", location, { shouldValidate: true });
        setLocationQuery(location);
        setLocationMessage("Current location added to the request.");
      },
      () => setLocationMessage("Could not get current location. Please allow location access or type your location.")
    );
  };

  if (serviceQuery.isLoading) return <main className="container-shell py-16">Loading checkout...</main>;
  if (!service) return <main className="container-shell py-16">Service not found.</main>;

  return (
    <main className="bg-muted/60 py-12">
      <div className="container-shell grid gap-8 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Schedule service details</CardTitle>
            <p className="text-sm text-muted-foreground">Submit your request and our team will confirm dispatch details.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submitDetails}>
              <div className="relative space-y-2">
                <Label>Delivery or service location</Label>
                <Input
                  placeholder="Search Nairobi or Kiambu locations"
                  {...form.register("location", {
                    onBlur: () => window.setTimeout(() => setShowSuggestions(false), 120),
                    onChange: (event) => {
                      setLocationQuery(event.target.value);
                      setShowSuggestions(true);
                    }
                  })}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions ? (
                  <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-white shadow-soft">
                    {filteredLocations.map((location) => (
                      <button
                        key={location}
                        type="button"
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          form.setValue("location", location, { shouldValidate: true });
                          setLocationQuery(location);
                          setShowSuggestions(false);
                        }}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                ) : null}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={useCurrentLocation}>
                  Use current location
                </Button>
                {locationMessage ? <p className="text-xs text-muted-foreground">{locationMessage}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Scheduled date and time</Label>
                <Input type="datetime-local" {...form.register("scheduledDate")} />
              </div>
              <div className="space-y-2">
                <Label>Estimated budget</Label>
                <Input type="number" min="1" step="1" placeholder="Enter estimated amount in KES" {...form.register("amount")} />
                <p className="text-xs text-muted-foreground">Use this as a planning estimate. Final billing will be confirmed by dispatch.</p>
              </div>
              <div className="space-y-2">
                <Label>Instructions</Label>
                <Textarea placeholder="Tank size, access notes, emergency details, well notes..." {...form.register("notes")} />
              </div>
              <Button type="submit" size="lg">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card className="overflow-hidden">
            <img className="h-56 w-full object-cover" src={service.imageUrl} alt={service.name} />
            <CardContent className="p-5">
              <h1 className="text-2xl font-bold">{service.name}</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
              <div className="mt-5 rounded-md bg-primary/10 p-4">
                <p className="text-sm text-primary">Request first, confirmation next</p>
                <p className="mt-1 text-sm text-slate-700">Our team will confirm pricing, timing, and dispatch details.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-sm leading-6 text-muted-foreground">
              For urgent bulk water delivery, include estate access notes, tank size, and any landmark that helps dispatch
              reach you quickly.
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
};
