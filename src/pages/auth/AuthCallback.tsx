import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Finishing secure sign in...</p>
      </div>
    </div>
  );
}
