import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Cpu, Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[150px] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white mb-4 shadow-lg shadow-[#6366f1]/30">
            <Cpu size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">AgentBuilder</h1>
          <p className="text-slate-400 mt-2">Reset your password</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-6 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 size={32} className="text-emerald-400" />
              </motion.div>
              <p className="text-sm text-slate-400">
                If an account with that email exists, a password reset link has been sent.
              </p>
              <Link to="/auth/login">
                <Button variant="secondary" className="gap-2">
                  <ArrowLeft size={16} />
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Forgot Password</h2>
              <p className="text-sm text-slate-400 mb-6">Enter your email and we'll send you a reset link</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={`pl-10 ${errors.email ? "border-red-500" : "border-white/10"}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
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
            </>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-slate-400">
          <Link to="/auth/login" className="text-[#6366f1] font-medium hover:text-[#8b5cf6] transition-colors inline-flex items-center gap-1">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}