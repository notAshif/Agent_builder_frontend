import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Cpu } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";

function getCallbackParam(name: string) {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  return hashParams.get(name) ?? searchParams.get(name);
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const finishOAuth = async () => {
      const accessToken = getCallbackParam("access_token");
      const error = getCallbackParam("error_description") ?? getCallbackParam("error");

      if (error) {
        toast.error(error);
        navigate("/auth/login", { replace: true });
        return;
      }

      if (!accessToken) {
        toast.error("OAuth callback did not include an access token.");
        navigate("/auth/login", { replace: true });
        return;
      }

      localStorage.setItem("access_token", accessToken);

      try {
        const response = await authApi.syncOAuthUser();
        if (response.success) {
          setAuth(response.data.user, accessToken);
          toast.success("Signed in successfully!");
          navigate("/dashboard", { replace: true });
        }
      } catch (syncError: any) {
        localStorage.removeItem("access_token");
        toast.error(syncError.response?.data?.message || "Could not finish OAuth sign in.");
        navigate("/auth/login", { replace: true });
      }
    };

    finishOAuth();
  }, [navigate, setAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[150px] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white shadow-xl shadow-[#6366f1]/30"
        >
          <Cpu size={32} />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
          <p className="text-sm text-slate-400">Finishing secure sign in...</p>
        </div>
      </motion.div>
    </div>
  );
}