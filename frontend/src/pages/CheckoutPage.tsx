import { useEffect, useMemo, useState } from "react";
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

type LocationOption = {
  label: string;
  source: "popular" | "map";
};

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const popularLocations = [
  "Nairobi CBD, Nairobi",
  "Westlands, Nairobi",
  "Parklands, Nairobi",
  "Highridge, Nairobi",
  "Spring Valley, Nairobi",
  "Kilimani, Nairobi",
  "Hurlingham, Nairobi",
  "Lavington, Nairobi",
  "Kileleshwa, Nairobi",
  "Upper Hill, Nairobi",
  "Karen, Nairobi",
  "Hardy, Nairobi",
  "Langata, Nairobi",
  "Runda, Nairobi",
  "Gigiri, Nairobi",
  "Muthaiga, Nairobi",
  "Ridgeways, Nairobi",
  "Kasarani, Nairobi",
  "Roysambu, Nairobi",
  "Zimmerman, Nairobi",
  "Githurai 44, Nairobi",
  "Githurai 45, Nairobi",
  "Kahawa West, Nairobi",
  "Kahawa Sukari, Kiambu",
  "Kahawa Wendani, Kiambu",
  "Ruaraka, Nairobi",
  "Embakasi, Nairobi",
  "Donholm, Nairobi",
  "Umoja, Nairobi",
  "Buruburu, Nairobi",
  "Komarock, Nairobi",
  "Kayole, Nairobi",
  "Ruai, Nairobi",
  "Utawala, Nairobi",
  "Njiru, Nairobi",
  "Industrial Area, Nairobi",
  "South B, Nairobi",
  "South C, Nairobi",
  "Makadara, Nairobi",
  "Eastleigh, Nairobi",
  "Pangani, Nairobi",
  "Ngara, Nairobi",
  "Kariobangi, Nairobi",
  "Dandora, Nairobi",
  "Baba Dogo, Nairobi",
  "Kiambu Town, Kiambu",
  "Ruaka, Kiambu",
  "Ndenderu, Kiambu",
  "Gachie, Kiambu",
  "Banana, Kiambu",
  "Karura, Kiambu",
  "Kiambaa, Kiambu",
  "Githunguri, Kiambu",
  "Ruiru, Kiambu",
  "Membley, Kiambu",
  "Kamakis, Kiambu",
  "Tatu City, Kiambu",
  "Thika, Kiambu",
  "Juja, Kiambu",
  "Kenyatta Road, Kiambu",
  "Kikuyu, Kiambu",
  "Kinoo, Kiambu",
  "Uthiru, Kiambu",
  "Kabete, Kiambu",
  "Wangige, Kiambu",
  "Muguga, Kiambu",
  "Limuru, Kiambu",
  "Tigoni, Kiambu",
  "Redhill, Kiambu",
  "Rosslyn, Kiambu",
  "Two Rivers, Kiambu",
  "Karuri, Kiambu",
  "Ndumberi, Kiambu",
  "Tinganga, Kiambu",
  "Gatundu, Kiambu",
  "Kimunyu, Kiambu",
  "Lari, Kiambu",
  "Kijabe, Kiambu"
];

const asLocation = (label: string, source: LocationOption["source"]): LocationOption => ({ label, source });

const uniqueLocations = (locations: LocationOption[]) => {
  const seen = new Set<string>();
  return locations.filter((location) => {
    const key = location.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const CheckoutPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [mapLocations, setMapLocations] = useState<LocationOption[]>([]);
  const [searchingLocations, setSearchingLocations] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const serviceQuery = useQuery({ queryKey: ["service", params.id], queryFn: () => api.service(params.id ?? ""), enabled: Boolean(params.id) });
  const service = serviceQuery.data?.service;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { location: "", scheduledDate: "", amount: "", notes: "" }
  });

  useEffect(() => {
    const query = locationQuery.trim();
    if (query.length < 3) {
      setMapLocations([]);
      setSearchingLocations(false);
      setLocationError(null);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchingLocations(true);
      setLocationError(null);
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", "8");
        url.searchParams.set("countrycodes", "ke");
        url.searchParams.set("q", `${query}, Nairobi Kiambu Kenya`);
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Location search failed");
        const results = (await response.json()) as NominatimResult[];
        setMapLocations(
          results
            .filter((result) => result.display_name.toLowerCase().includes("kenya"))
            .map((result) => asLocation(result.display_name, "map"))
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setLocationError("Map search is temporarily unavailable. Showing common service areas.");
        }
      } finally {
        setSearchingLocations(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locationQuery]);

  const filteredLocations = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    const popularMatches = popularLocations
      .filter((location) => !query || location.toLowerCase().includes(query))
      .map((location) => asLocation(location, "popular"));
    return uniqueLocations([...mapLocations, ...popularMatches]).slice(0, 10);
  }, [locationQuery, mapLocations]);

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
      async (position) => {
        const coordinates = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        let location = `Current location: ${coordinates}`;
        try {
          const url = new URL("https://nominatim.openstreetmap.org/reverse");
          url.searchParams.set("format", "json");
          url.searchParams.set("lat", String(position.coords.latitude));
          url.searchParams.set("lon", String(position.coords.longitude));
          const response = await fetch(url);
          if (response.ok) {
            const result = (await response.json()) as Partial<NominatimResult>;
            if (result.display_name) {
              location = `${result.display_name} (${coordinates})`;
            }
          }
        } catch {
          location = `Current location: ${coordinates}`;
        }
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
                  placeholder="Search Nairobi, Kiambu, estate, road, landmark..."
                  {...form.register("location", {
                    onBlur: () => window.setTimeout(() => setShowSuggestions(false), 160),
                    onChange: (event) => {
                      setLocationQuery(event.target.value);
                      setShowSuggestions(true);
                    }
                  })}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions ? (
                  <div className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md border border-border bg-white shadow-soft">
                    {searchingLocations ? <div className="px-3 py-2 text-sm text-muted-foreground">Searching map locations...</div> : null}
                    {filteredLocations.map((location) => (
                      <button
                        key={`${location.source}-${location.label}`}
                        type="button"
                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          form.setValue("location", location.label, { shouldValidate: true });
                          setLocationQuery(location.label);
                          setShowSuggestions(false);
                        }}
                      >
                        <span>{location.label}</span>
                        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                          {location.source === "map" ? "Map" : "Area"}
                        </span>
                      </button>
                    ))}
                    {!searchingLocations && filteredLocations.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Keep typing, or use current location.</div>
                    ) : null}
                  </div>
                ) : null}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={useCurrentLocation}>
                  Use current location
                </Button>
                {locationMessage ? <p className="text-xs text-muted-foreground">{locationMessage}</p> : null}
                {locationError ? <p className="text-xs text-muted-foreground">{locationError}</p> : null}
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
                <Textarea placeholder="Tank size, access notes, delivery urgency, gate directions..." {...form.register("notes")} />
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
