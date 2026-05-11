import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authApi, type OAuthProvider } from "../../api/auth";
import { Button } from "../ui/Button";

const providers: Array<{ id: OAuthProvider; label: string }> = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
];

function GoogleMark() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] font-black text-[#4285f4]">
      G
    </span>
  );
}

function GitHubMark() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">
      GH
    </span>
  );
}

export default function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

  const handleProviderSignIn = async (provider: OAuthProvider) => {
    setLoadingProvider(provider);
    try {
      const response = await authApi.getOAuthUrl(provider);
      if (response.success) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Could not start ${provider} sign in.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          className="gap-2 border-border/70 bg-background/70"
          disabled={loadingProvider !== null}
          onClick={() => handleProviderSignIn(provider.id)}
        >
          {loadingProvider === provider.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : provider.id === "github" ? (
            <GitHubMark />
          ) : (
            <GoogleMark />
          )}
          {provider.label}
        </Button>
      ))}
    </div>
  );
}
