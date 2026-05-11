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
  X
} from "lucide-react";
import { userApi } from "../api/user";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
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

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.listApiKeys();
      if (response.success) setApiKeys(response.data.keys);
    } catch (error) {
      toast.error("Failed to fetch API keys");
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
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    try {
      const response = await userApi.createApiKey({ name: newKeyName });
      if (response.success) {
        const fullKey = response.data.key?.key || "";
        setNewlyCreatedKey(fullKey);
        setNewKeyName("");
        fetchApiKeys();
      }
    } catch (error) {
      toast.error("Failed to generate API key");
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
    } catch (error) {
      toast.error("Failed to revoke key");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="text-primary" size={20} />
          <h2 className="text-xl font-bold">Profile Settings</h2>
        </div>
        <Card className="glass border-border/50">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email} disabled className="opacity-50" />
              </div>
            </div>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* API Keys Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Key className="text-primary" size={20} />
          <h2 className="text-xl font-bold">API Management</h2>
        </div>
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Access Keys</CardTitle>
            <CardDescription>Use these keys to interact with the AgentBuilder API programmatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Input 
                placeholder="Key name (e.g. Production)" 
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <Button onClick={handleCreateKey} className="whitespace-nowrap gap-2">
                <Plus size={18} />
                Generate Key
              </Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : apiKeys.length > 0 ? (
                apiKeys.map((key) => (
                  <div key={key.id} className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between group">
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {key.key.substring(0, 8)}••••••••••••••••
                        </code>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                          Created {format(new Date(key.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => copyToClipboard(key.key, key.id)}
                      >
                        {copiedId === key.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 italic">No API keys generated yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="text-red-500" size={20} />
          <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
        </div>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-red-500">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1">This will permanently delete all your agents, runs, and associated data.</p>
            </div>
            <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
          </CardContent>
        </Card>
      </section>
      {/* New Key Dialog */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">API Key Generated</h3>
              <button onClick={dismissKey} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
              <p className="text-xs text-amber-400 font-medium mb-1">
                <Eye size={14} className="inline mr-1" />
                Copy this key now. You won't be able to see it again.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50 border border-border mb-4">
              <code className="text-xs font-mono break-all">{newlyCreatedKey}</code>
            </div>
            <Button
              className="w-full gap-2"
              onClick={() => {
                navigator.clipboard.writeText(newlyCreatedKey);
                toast.success("Key copied to clipboard!");
                dismissKey();
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
