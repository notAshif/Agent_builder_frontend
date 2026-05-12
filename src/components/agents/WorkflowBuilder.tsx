import { useState } from "react";
import { Plus, Trash2, Play, ChevronRight, Loader2, GitBranch } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface WorkflowStep {
  id: string;
  label: string;
  agentId: string;
  input: string;
  dependsOn?: string;
  condition?: { field: string; operator: "equals" | "contains" | "exists"; value: string };
  fallback?: { agentId: string; input: string };
}

interface WorkflowBuilderProps {
  agents: { id: string; name: string }[];
  onExecute: (workflow: any) => void;
  executing?: boolean;
}

let stepCounter = 0;
const genId = () => `step_${++stepCounter}`;

export default function WorkflowBuilder({ agents, onExecute, executing }: WorkflowBuilderProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: genId(),
      label: `Step ${steps.length + 1}`,
      agentId: agents[0]?.id || "",
      input: "{{prev." + (steps[steps.length - 1]?.id || "input") + ".output}}",
    };
    setSteps([...steps, newStep]);
    setActiveStep(newStep.id);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
    if (activeStep === id) setActiveStep(null);
  };

  const updateStep = (id: string, field: string, value: any) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const updateCondition = (id: string, field: string, value: any) => {
    setSteps(
      steps.map((s) =>
        s.id === id
          ? { ...s, condition: { ...(s.condition || { field: "", operator: "contains" as const, value: "" }), [field]: value } }
          : s
      )
    );
  };

  const toggleCondition = (id: string) => {
    setSteps(
      steps.map((s) =>
        s.id === id
          ? { ...s, condition: s.condition ? undefined : { field: "", operator: "contains" as const, value: "" } }
          : s
      )
    );
  };

  const toggleFallback = (id: string) => {
    setSteps(
      steps.map((s) =>
        s.id === id
          ? { ...s, fallback: s.fallback ? undefined : { agentId: agents[0]?.id || "", input: "{{prev.input.output}}" } }
          : s
      )
    );
  };

  const handleExecute = () => {
    if (steps.length === 0) {
      toast.error("Add at least one step");
      return;
    }
    const valid = steps.every((s) => s.agentId && s.input);
    if (!valid) {
      toast.error("Fill in all step fields");
      return;
    }
    onExecute({ steps, maxIterations: 10 });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <GitBranch size={16} />
              Multi-Agent Workflow
            </CardTitle>
            <CardDescription>Chain multiple agents with conditional branching</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={addStep} className="gap-1">
              <Plus size={14} /> Add Step
            </Button>
            <Button size="sm" onClick={handleExecute} disabled={executing || steps.length === 0} className="gap-1">
              {executing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Run Workflow
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.length === 0 && (
          <p className="text-sm text-muted-foreground italic py-4 text-center">
            No workflow steps defined. Add steps to chain multiple agents together.
          </p>
        )}
        {steps.map((step, i) => (
          <div key={step.id}>
            {i > 0 && (
              <div className="flex items-center gap-2 py-1 pl-4">
                <div className="h-4 w-0.5 bg-border" />
                <ChevronRight size={12} className="text-muted-foreground" />
                {step.condition && (
                  <Badge variant="outline" className="text-[9px]">
                    if: {step.condition.field} {step.condition.operator} {step.condition.value}
                  </Badge>
                )}
              </div>
            )}
            <div
              className={cn(
                "rounded-xl border-2 p-4 transition-all cursor-pointer",
                activeStep === step.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              )}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-sm">{step.label}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeStep(step.id); }} className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>

              {activeStep === step.id && (
                <div className="space-y-3 mt-3 pt-3 border-t border-border">
                  <div className="space-y-1">
                    <Label className="text-xs">Step Label</Label>
                    <Input value={step.label} onChange={(e) => updateStep(step.id, "label", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Agent</Label>
                    <Select value={step.agentId} onChange={(e) => updateStep(step.id, "agentId", e.target.value)}>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Input Template</Label>
                    <Textarea
                      value={step.input}
                      onChange={(e) => updateStep(step.id, "input", e.target.value)}
                      placeholder="{{prev.step_id.output}} or custom text"
                      rows={2}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Use {"{{prev.step_id.output}}"} to reference previous step output
                    </p>
                  </div>

                  {i > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCondition(step.id); }}
                          className={cn(
                            "text-xs px-2 py-1 rounded border transition-colors",
                            step.condition ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground"
                          )}
                        >
                          + Condition
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFallback(step.id); }}
                          className={cn(
                            "text-xs px-2 py-1 rounded border transition-colors",
                            step.fallback ? "border-amber-500 text-amber-500 bg-amber-500/5" : "border-border text-muted-foreground"
                          )}
                        >
                          + Fallback
                        </button>
                      </div>

                      {step.condition && (
                        <div className="grid grid-cols-3 gap-2 p-2 rounded bg-muted/20">
                          <Input
                            placeholder="Field"
                            value={step.condition.field}
                            onChange={(e) => updateCondition(step.id, "field", e.target.value)}
                            className="text-xs"
                          />
                          <Select value={step.condition.operator} onChange={(e) => updateCondition(step.id, "operator", e.target.value)} className="text-xs">
                            <option value="equals">equals</option>
                            <option value="contains">contains</option>
                            <option value="exists">exists</option>
                          </Select>
                          <Input
                            placeholder="Value"
                            value={step.condition.value}
                            onChange={(e) => updateCondition(step.id, "value", e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      )}

                      {step.fallback && (
                        <div className="grid grid-cols-2 gap-2 p-2 rounded bg-amber-500/5 border border-amber-500/20">
                          <div>
                            <Label className="text-[10px]">Fallback Agent</Label>
                            <Select value={step.fallback.agentId} onChange={(e) => updateStep(step.id, "fallback", { ...step.fallback!, agentId: e.target.value })} className="text-xs">
                              {agents.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                            </Select>
                          </div>
                          <div>
                            <Label className="text-[10px]">Fallback Input</Label>
                            <Input value={step.fallback.input} onChange={(e) => updateStep(step.id, "fallback", { ...step.fallback!, input: e.target.value })} className="text-xs" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
