import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Bot, 
  Settings as SettingsIcon, 
  Wrench,
  Eye,
  Loader2,
  Sparkles,
  Route,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { toolApi } from "../../api/tool";
import { agentApi } from "../../api/agent";
import type { Tool } from "../../types";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Bot },
  { id: 2, title: "Configuration", icon: SettingsIcon },
  { id: 3, title: "Tools", icon: Wrench },
  { id: 4, title: "Review", icon: Eye },
];

type GeneratedBlueprint = {
  workflow: string[];
  memory: string[];
  monitoring: string[];
  selectedCategories: string[];
};

const PURPOSE_OPTIONS = [
  { value: "GENERAL", label: "General Purpose" },
  { value: "BUSINESS", label: "Business Strategy" },
  { value: "RESEARCH", label: "Scientific Research" },
  { value: "CUSTOMER_SUPPORT", label: "Customer Support" },
  { value: "DATA_ANALYSIS", label: "Data Analysis" },
  { value: "CODING", label: "Software Development" },
  { value: "CONTENT_CREATION", label: "Content Creation" },
];

const titleCase = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.includes(term));

const inferPurpose = (prompt: string) => {
  if (includesAny(prompt, ["support", "ticket", "customer", "helpdesk", "reply"])) return "CUSTOMER_SUPPORT";
  if (includesAny(prompt, ["research", "summarize", "web", "scrape", "source", "market"])) return "RESEARCH";
  if (includesAny(prompt, ["code", "debug", "sandbox", "script", "developer", "execute"])) return "CODING";
  if (includesAny(prompt, ["data", "csv", "analysis", "analytics", "report", "metric"])) return "DATA_ANALYSIS";
  if (includesAny(prompt, ["email", "blog", "copy", "content", "draft", "write"])) return "CONTENT_CREATION";
  if (includesAny(prompt, ["crm", "sales", "lead", "revenue", "business", "workflow"])) return "BUSINESS";
  return "GENERAL";
};

const inferToolCategories = (prompt: string, purpose: string) => {
  const categories = new Set<string>();

  if (includesAny(prompt, ["email", "draft", "inbox", "reply", "outbound"])) categories.add("EMAIL");
  if (includesAny(prompt, ["research", "web", "search", "scrape", "browser", "current"])) categories.add("WEB_SEARCH");
  if (includesAny(prompt, ["code", "execute", "sandbox", "python", "javascript", "typescript", "debug"])) categories.add("CODE_EXECUTIONS");
  if (includesAny(prompt, ["api", "webhook", "integration", "crm", "slack", "whatsapp", "external"])) categories.add("API_CALLS");
  if (includesAny(prompt, ["file", "pdf", "document", "csv", "upload", "spreadsheet"])) categories.add("FILE_PROCESSING");
  if (includesAny(prompt, ["database", "sql", "postgres", "query", "record"])) categories.add("DATABASE");

  if (purpose === "RESEARCH") categories.add("WEB_SEARCH");
  if (purpose === "CODING") categories.add("CODE_EXECUTIONS");
  if (purpose === "CUSTOMER_SUPPORT") {
    categories.add("EMAIL");
    categories.add("API_CALLS");
  }
  if (purpose === "DATA_ANALYSIS") {
    categories.add("CODE_EXECUTIONS");
    categories.add("FILE_PROCESSING");
  }
  if (purpose === "BUSINESS") categories.add("API_CALLS");

  return [...categories];
};

const buildAgentBlueprint = (rawPrompt: string, tools: Tool[]) => {
  const prompt = rawPrompt.trim();
  const normalized = prompt.toLowerCase();
  const purpose = inferPurpose(normalized);
  const selectedCategories = inferToolCategories(normalized, purpose);
  const matchingTools = tools.filter((tool) => selectedCategories.includes(tool.category));
  const nameSeed = titleCase(prompt.replace(/^(build|create|make|generate)\s+(an?\s+)?/i, ""));
  const name = `${nameSeed || "Autonomous"} Agent`;

  const workflow = [
    "Classify the incoming task and extract required inputs",
    matchingTools.length > 0
      ? `Route work through ${matchingTools.map((tool) => tool.name).join(", ")} as needed`
      : "Use direct model reasoning when no external tool is required",
    "Validate the result against the user's requested format and constraints",
    "Return a concise final answer with execution notes",
  ];

  const memory = [
    "Keep short-term task context for the current run",
    "Remember user preferences, reusable entities, and prior successful outputs",
    "Store only durable facts that help future executions",
  ];

  const monitoring = [
    "Track tool calls, latency, and token usage for every run",
    "Surface retryable failures with the failed step and input payload",
    "Mark execution state as queued, running, completed, or failed",
  ];

  const systemPrompt = [
    `You are ${name}, a production-grade AI agent built for this request: "${prompt}".`,
    "",
    "Operating principles:",
    "- Clarify ambiguous requirements only when needed to avoid an unsafe or low-quality result.",
    "- Use available tools deliberately and explain tool-dependent assumptions in the final response.",
    "- Prefer structured outputs, explicit next actions, and concise reasoning summaries.",
    "- Validate inputs before acting and fail gracefully with actionable error details.",
    "",
    "Workflow:",
    ...workflow.map((step, index) => `${index + 1}. ${step}.`),
  ].join("\n");

  return {
    name,
    purpose,
    description: `Autogenerated agent for: ${prompt}`,
    prompt: systemPrompt,
    toolIds: matchingTools.map((tool) => tool.id),
    config: {
      model: "gpt-4o",
      maxToken: purpose === "CODING" || purpose === "DATA_ANALYSIS" ? 8192 : 4096,
      temperature: purpose === "CONTENT_CREATION" ? 0.8 : purpose === "CODING" || purpose === "DATA_ANALYSIS" ? 0.3 : 0.6,
      workflow,
      memory,
      monitoring,
      generatedFrom: prompt,
    },
    blueprint: {
      workflow,
      memory,
      monitoring,
      selectedCategories,
    },
  };
};

export default function NewAgent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [naturalPrompt, setNaturalPrompt] = useState("");
  const [blueprint, setBlueprint] = useState<GeneratedBlueprint | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purpose: "GENERAL",
    prompt: "",
    config: {
      model: "gpt-4o",
      maxToken: 4096,
      temperature: 0.7,
    },
    toolIds: [] as string[],
  });

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await toolApi.list();
        if (response.success) setTools(response.data.tools);
      } catch {
        toast.error("Failed to load tools");
      } finally {
        setIsLoadingTools(false);
      }
    };
    fetchTools();
  }, []);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const canProceed = currentStep !== 1 || (formData.name.trim().length > 0 && formData.prompt.trim().length > 0);

  const generateFromPrompt = () => {
    if (!naturalPrompt.trim()) {
      toast.error("Describe the agent you want to build first");
      return;
    }

    const generated = buildAgentBlueprint(naturalPrompt, tools);
    setFormData({
      name: generated.name,
      description: generated.description,
      purpose: generated.purpose,
      prompt: generated.prompt,
      config: generated.config,
      toolIds: generated.toolIds,
    });
    setBlueprint(generated.blueprint);
    toast.success(
      generated.toolIds.length > 0
        ? `Blueprint generated with ${generated.toolIds.length} tool${generated.toolIds.length === 1 ? "" : "s"}`
        : "Blueprint generated"
    );
  };

  const toggleTool = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      toolIds: prev.toolIds.includes(toolId)
        ? prev.toolIds.filter(id => id !== toolId)
        : [...prev.toolIds, toolId]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.prompt.trim()) {
      toast.error("Agent name and core prompt are required");
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await agentApi.create(formData);
      if (response.success) {
        toast.success("Agent created successfully!");
        navigate(`/agents/${response.data.agent.id}`);
      }
    } catch {
      toast.error("Failed to create agent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Prompt-to-Agent Builder</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create an agent from intent</h2>
          <p className="text-muted-foreground mt-2">
            Describe the agent once, then refine the generated architecture before saving.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-4">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  currentStep === step.id ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : 
                  currentStep > step.id ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                )}
              >
                {currentStep > step.id ? <Check size={20} /> : <step.icon size={20} />}
              </div>
              <span className={cn(
                "text-xs font-medium",
                currentStep === step.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-4 transition-colors duration-300",
                currentStep > step.id ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      <Card className="glass overflow-hidden border-border/50">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-primary">
                          <Sparkles size={16} />
                          <h3 className="font-semibold">Describe what to build</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          The builder will infer purpose, tools, workflow, memory, and run monitoring.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="shrink-0 gap-2"
                        onClick={generateFromPrompt}
                        disabled={isLoadingTools}
                      >
                        {isLoadingTools ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Generate
                      </Button>
                    </div>
                    <Textarea
                      className="min-h-[110px] bg-background/70"
                      placeholder='Build an agent that drafts emails from customer support tickets and checks CRM context first'
                      value={naturalPrompt}
                      onChange={(e) => setNaturalPrompt(e.target.value)}
                    />
                    {blueprint && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-lg border border-border bg-background/60 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <Route size={14} className="text-primary" />
                            Workflow
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">{blueprint.workflow.length} generated stages</p>
                        </div>
                        <div className="rounded-lg border border-border bg-background/60 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <ShieldCheck size={14} className="text-green-500" />
                            Memory
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">{blueprint.memory.length} context policies</p>
                        </div>
                        <div className="rounded-lg border border-border bg-background/60 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <RefreshCw size={14} className="text-blue-400" />
                            Monitoring
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">{blueprint.monitoring.length} observability hooks</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Agent Name</Label>
                    <Input 
                      placeholder="e.g. Research Assistant" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Briefly describe what this agent does..." 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Select 
                      value={formData.purpose}
                      onChange={e => setFormData({...formData, purpose: e.target.value})}
                    >
                      {PURPOSE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Core Prompt / Instructions</Label>
                    <Textarea 
                      className="min-h-[200px]"
                      placeholder="You are an expert research assistant. Your goal is to..." 
                      value={formData.prompt}
                      onChange={e => setFormData({...formData, prompt: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Model</Label>
                    <Select 
                      value={formData.config.model}
                      onChange={e => setFormData({...formData, config: {...formData.config, model: e.target.value}})}
                    >
                      <option value="gpt-4o">GPT-4o (Recommended)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Tokens ({formData.config.maxToken})</Label>
                    <Input 
                      type="range" min="256" max="16000" step="256"
                      value={formData.config.maxToken}
                      onChange={e => setFormData({...formData, config: {...formData.config, maxToken: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature ({formData.config.temperature})</Label>
                    <Input 
                      type="range" min="0" max="1" step="0.1"
                      value={formData.config.temperature}
                      onChange={e => setFormData({...formData, config: {...formData.config, temperature: parseFloat(e.target.value)}})}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest px-1">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Available Tools</h3>
                  {isLoadingTools ? (
                    <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                      Loading tools...
                    </div>
                  ) : tools.length > 0 ? (
                    <>
                      {blueprint && (
                        <div className="rounded-xl border border-border bg-muted/20 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">Generated tool route</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Categories: {blueprint.selectedCategories.length > 0 ? blueprint.selectedCategories.join(", ") : "No external tools inferred"}
                              </p>
                            </div>
                            <Badge variant="secondary">{formData.toolIds.length} selected</Badge>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tools.map(tool => (
                        <div 
                          key={tool.id}
                          onClick={() => toggleTool(tool.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all cursor-pointer select-none group",
                            formData.toolIds.includes(tool.id) 
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{tool.name}</span>
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              formData.toolIds.includes(tool.id) ? "bg-primary border-primary text-white" : "border-border group-hover:border-primary/50"
                            )}>
                              {formData.toolIds.includes(tool.id) && <Check size={12} />}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                          <Badge variant="secondary" className="mt-3 text-[10px]">
                            {tool.category}
                          </Badge>
                        </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-border bg-muted/30 p-10 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                        <Wrench size={24} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mb-1">No tools available</p>
                      <p className="text-xs text-muted-foreground">
                        Tools are loaded from the database. Make sure the backend has been started with seed data.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-[10px] uppercase tracking-widest">Name</Label>
                        <p className="font-semibold text-lg">{formData.name || "Untitled Agent"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-[10px] uppercase tracking-widest">Purpose</Label>
                        <p className="font-medium capitalize">{formData.purpose.toLowerCase().replace("_", " ")}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-[10px] uppercase tracking-widest">Configuration</Label>
                        <div className="flex gap-4 mt-1">
                          <Badge variant="outline">{formData.config.model}</Badge>
                          <Badge variant="outline">Temp: {formData.config.temperature}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-[10px] uppercase tracking-widest">Selected Tools</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.toolIds.length > 0 ? (
                          formData.toolIds.map(id => {
                            const tool = tools.find(t => t.id === id);
                            return <Badge key={id} variant="secondary">{tool?.name}</Badge>;
                          })
                        ) : (
                          <span className="text-sm text-muted-foreground italic">No tools selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-[10px] uppercase tracking-widest">Core Prompt</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-xl text-sm italic border border-border">
                      {formData.prompt || "No instructions provided."}
                    </div>
                  </div>
                  {blueprint && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workflow</p>
                        <div className="mt-3 space-y-2">
                          {blueprint.workflow.map((step, index) => (
                            <p key={step} className="text-xs text-muted-foreground">
                              <span className="text-foreground">{index + 1}.</span> {step}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Memory</p>
                        <div className="mt-3 space-y-2">
                          {blueprint.memory.map((item) => (
                            <p key={item} className="text-xs text-muted-foreground">{item}</p>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Monitoring</p>
                        <div className="mt-3 space-y-2">
                          {blueprint.monitoring.map((item) => (
                            <p key={item} className="text-xs text-muted-foreground">{item}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1 || isLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => {
                  if (!canProceed) {
                    toast.error("Generate or enter an agent name and core prompt first");
                    return;
                  }
                  nextStep();
                }}
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  "Create Agent"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
