import { useEffect, useState } from "react";
import {
  User,
  Key,
  ShieldAlert,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Eye,
  X,
  Camera
} from "lucide-react";
import { userApi } from "../api/user";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || "U")}&background=6366f1&color=fff&size=200`;

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.listApiKeys();
      if (response.success) setApiKeys(response.data.keys);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await userApi.updateProfile({ name: newName });
      if (response.success) {
        updateUser(response.data.user);
        toast.success("Profile updated!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    try {
      const response = await userApi.createApiKey({ name: newKeyName });
      if (response.success) {
        const fullKey = response.data.key?.key;
        if (fullKey) {
          setNewlyCreatedKey(fullKey);
        } else {
          toast.error("Key was created but the value is not visible. Check your API keys list.");
        }
        setNewKeyName("");
        fetchApiKeys();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to generate API key");
    }
  };

  const dismissKey = () => setNewlyCreatedKey(null);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("This will permanently delete all your agents, runs, and data. Are you sure?");
    if (!confirmed) return;
    toast.error("Account deletion is not yet available via UI. Contact support.");
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await userApi.deleteApiKey(id);
      if (response.success) {
        toast.success("API Key revoked");
        setApiKeys(apiKeys.filter(k => k.id !== id));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to revoke key");
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
            <User size={20} className="text-[#6366f1]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#6366f1]/30 bg-[#16161d]">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=200`;
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center border-2 border-[#0a0a0f]">
                <Camera size={12} />
              </div>
            </div>
            <div>
              <p className="font-bold text-lg text-white">{user?.name || "User"}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <p className="text-[10px] text-slate-600 mt-1">
                {user?.avatarUrl ? "OAuth avatar" : "Auto-generated avatar"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Full Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
                className="bg-[#16161d] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email Address</Label>
              <Input value={user?.email} disabled className="opacity-50 bg-[#16161d] border-white/10" />
            </div>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isUpdating} className="mt-6 gap-2">
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </section>

      {/* API Keys Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
            <Key size={20} className="text-[#6366f1]" />
          </div>
          <h2 className="text-2xl font-bold text-white">API Management</h2>
        </div>
        <div className="glass-card p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-white">Access Keys</CardTitle>
            <CardDescription className="text-slate-400">Use these keys to interact with the AgentBuilder API programmatically.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Key name (e.g. Production)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateKey()}
                className="bg-[#16161d] border-white/10"
              />
              <Button onClick={handleCreateKey} className="whitespace-nowrap gap-2 shrink-0">
                <Plus size={18} />
                Generate Key
              </Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="animate-spin text-slate-500" size={24} />
                </div>
              ) : apiKeys.length > 0 ? (
                apiKeys.map((key) => (
                  <div key={key.id} className="glass-card p-4 flex items-center justify-between group hover:border-[#6366f1]/30 transition-all">
                    <div>
                      <p className="font-medium text-white">{key.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {key.key ? (
                          <code className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400">
                            {key.key.substring(0, 8)}••••••••••••••••
                          </code>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Key hidden</span>
                        )}
                        <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">
                          Created {format(new Date(key.createAt || key.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {key.key && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(key.key, key.id)}
                        >
                          {copiedId === key.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-8 italic">No API keys generated yet. Create your first key above.</p>
              )}
            </div>
          </CardContent>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert size={20} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-400">Danger Zone</h2>
        </div>
        <div className="glass-card p-6 border border-red-500/20 bg-red-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-red-400">Delete Account</p>
              <p className="text-xs text-slate-400 mt-1">This will permanently delete all your agents, runs, and associated data.</p>
            </div>
            <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </div>
      </section>

      {/* New Key Dialog */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full glass-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white">API Key Generated</h3>
              <button onClick={dismissKey} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
              <p className="text-xs text-amber-400 font-medium mb-1">
                <Eye size={14} className="inline mr-1" />
                Copy this key now. You won't be able to see it again.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
              <code className="text-xs font-mono break-all text-slate-300">{newlyCreatedKey}</code>
            </div>
            <Button
              className="w-full gap-2"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(newlyCreatedKey);
                  toast.success("Key copied to clipboard!");
                  dismissKey();
                } catch {
                  toast.error("Failed to copy");
                }
              }}
            >
              <Copy size={16} />
              Copy Key & Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}