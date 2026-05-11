import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Cpu, Loader2, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword(data);
      if (response.success) {
        setSent(true);
        toast.success("Reset link sent if this email exists.");
      }
    } catch {
      toast.success("Reset link sent if this email exists.");
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-4 shadow-xl shadow-primary/20">
            <Cpu size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AgentBuilder</h1>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail size={32} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  If an account with that email exists, a password reset link has been sent.
                </p>
                <Link to="/auth/login">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft size={16} />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
