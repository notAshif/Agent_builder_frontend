import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Cpu, Loader2, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import OAuthButtons from "../../components/auth/OAuthButtons";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const features = [
  "Build unlimited AI agents",
  "Access to 40+ integrations",
  "Real-time execution monitoring",
  "Priority support"
];

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      if (response.success) {
        if (response.data.session?.access_token) {
          setAuth(response.data.user, response.data.session.access_token);
          toast.success("Account created! Welcome aboard.");
          navigate("/dashboard");
        } else {
          toast.success("Account created! Please check your email to verify, then sign in.");
          navigate("/auth/login");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10"
      >
        {/* Left Side - Features */}
        <div className="hidden lg:flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-[#6366f1]">
              <Cpu size={14} />
              Start building in minutes
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Join thousands of<br />
              <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                AI developers
              </span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Get started with AgentBuilder and unlock the power of autonomous AI agents.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            {/* Logo (Mobile) */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white mb-3 shadow-lg shadow-[#6366f1]/30">
                <Cpu size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white">AgentBuilder</h1>
            </div>

            {/* Auth Card */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
              <p className="text-sm text-slate-400 mb-6">Experience the power of automated AI agents</p>

              <OAuthButtons />

              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className={`pl-10 ${errors.name ? "border-red-500" : "border-white/10"}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
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

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      {...register("password")}
                      className={`pl-10 ${errors.password ? "border-red-500" : "border-white/10"}`}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#6366f1] font-medium hover:text-[#8b5cf6] transition-colors">
                Sign in
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center mt-4 text-xs text-slate-600">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-slate-500 hover:text-[#6366f1] transition-colors">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-slate-500 hover:text-[#6366f1] transition-colors">Privacy</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}