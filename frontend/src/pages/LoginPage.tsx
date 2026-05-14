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
  email: z.string().email(),
  password: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await api.login(values);
      login(result.token, result.user);
      navigate(result.user.role === "admin" ? "/admin" : "/services");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Login failed. Please try again."
      });
    }
  });

  return (
    <main className="container-shell grid min-h-[70vh] place-items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <p className="text-sm text-muted-foreground">Use your customer or staff account to continue.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
            </div>
            {form.formState.errors.root ? <p className="text-sm text-red-600">{form.formState.errors.root.message}</p> : null}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New customer? <Link className="font-semibold text-primary" to="/register">Create account</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};
