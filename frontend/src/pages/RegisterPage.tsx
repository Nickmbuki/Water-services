import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await api.register(values);
    login(result.token, result.user);
    navigate("/services");
  });

  return (
    <main className="container-shell grid min-h-[70vh] place-items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create customer account</CardTitle>
          <p className="text-sm text-muted-foreground">Order water, schedule borehole work, and track jobs online.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Register
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Have an account? <Link className="font-semibold text-primary" to="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};
