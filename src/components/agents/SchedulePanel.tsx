import { useState, useEffect } from "react";
import { Clock, Play, Loader2, AlertCircle, Zap } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Label } from "../ui/Label";
import { toast } from "sonner";
import { format } from "date-fns";
import { scheduleApi, type ScheduleData } from "../../api/schedule";
import { agentApi } from "../../api/agent";
import { useNavigate } from "react-router-dom";

const PRESETS = [
  { label: "Every hour", value: "hourly" },
  { label: "Every 6 hours", value: "every 6" },
  { label: "Every 12 hours", value: "every 12" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

interface SchedulePanelProps {
  agentId: string;
}

export default function SchedulePanel({ agentId }: SchedulePanelProps) {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customCron, setCustomCron] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await scheduleApi.get(agentId);
        if (res.success) {
          setSchedule(res.data.schedule);
          if (res.data.schedule.scheduleCron) {
            const match = PRESETS.find((p) => p.value === res.data.schedule.scheduleCron);
            if (match) setSelectedPreset(match.value);
            else setCustomCron(res.data.schedule.scheduleCron);
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [agentId]);

  const handleToggle = async () => {
    if (!schedule) return;
    setSaving(true);
    try {
      const cron = selectedPreset || customCron || null;
      const res = await scheduleApi.update(agentId, {
        cron,
        enabled: !schedule.scheduleEnabled,
      });
      if (res.success) {
        setSchedule((prev) =>
          prev ? { ...prev, scheduleEnabled: !prev.scheduleEnabled, scheduleCron: cron } : prev
        );
        toast.success(!schedule.scheduleEnabled ? "Schedule activated" : "Schedule paused");
      }
    } catch {
      toast.error("Failed to update schedule");
    } finally {
      setSaving(false);
    }
  };

  const handlePresetChange = async (value: string) => {
    setSelectedPreset(value);
    setCustomCron("");
    setSaving(true);
    try {
      const res = await scheduleApi.update(agentId, { cron: value, enabled: true });
      if (res.success) {
        setSchedule((prev) =>
          prev ? { ...prev, scheduleCron: value, scheduleEnabled: true } : prev
        );
        toast.success(`Schedule set to: ${PRESETS.find((p) => p.value === value)?.label}`);
      }
    } catch {
      toast.error("Failed to set schedule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Clock size={16} />
              Scheduled Runs
            </CardTitle>
            <CardDescription>Automate agent execution on a schedule</CardDescription>
          </div>
          {schedule?.scheduleEnabled && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetChange(preset.value)}
              disabled={saving}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                selectedPreset === preset.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Custom cron (optional)</Label>
          <div className="flex gap-2">
            <input
              value={customCron}
              onChange={(e) => {
                setCustomCron(e.target.value);
                setSelectedPreset("");
              }}
              placeholder="e.g. 0 9 * * 1 (Mondays 9am)"
              className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs font-mono outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="space-y-1">
            {schedule?.nextScheduledRun && schedule.scheduleEnabled ? (
              <p className="text-xs text-muted-foreground">
                Next run:{" "}
                <span className="text-foreground font-medium">
                  {format(new Date(schedule.nextScheduledRun), "MMM d, HH:mm")}
                </span>
              </p>
            ) : schedule?.lastScheduledRun ? (
              <p className="text-xs text-muted-foreground">
                Last run:{" "}
                <span className="text-foreground font-medium">
                  {format(new Date(schedule.lastScheduledRun), "MMM d, HH:mm")}
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">No schedule configured</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                setRunning(true);
                try {
                  const res = await agentApi.run(agentId, { input: "Scheduled run" });
                  if (res.success) {
                    toast.success("Agent started");
                    navigate(`/runs/${res.data.run.id}`);
                  }
                } catch {
                  toast.error("Failed to start agent");
                } finally {
                  setRunning(false);
                }
              }}
              disabled={running}
              className="gap-1.5"
            >
              {running ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Run Now
            </Button>
            <Button
              size="sm"
              variant={schedule?.scheduleEnabled ? "outline" : "primary"}
              onClick={handleToggle}
              disabled={saving || !(selectedPreset || customCron)}
              className="gap-2"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : schedule?.scheduleEnabled ? (
                <AlertCircle size={14} />
              ) : (
                <Play size={14} />
              )}
              {schedule?.scheduleEnabled ? "Pause" : "Activate"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
