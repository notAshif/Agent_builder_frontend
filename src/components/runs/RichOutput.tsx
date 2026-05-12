import { cn } from "../../lib/utils";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface ChartData {
  type: "bar" | "pie" | "line";
  title: string;
  labels: string[];
  datasets: { label: string; values: number[]; color?: string }[];
}

interface FormField {
  label: string;
  value: string;
  type?: "text" | "number" | "boolean";
}

interface StructuredOutput {
  type: "table" | "chart" | "form" | "text";
  data: TableData | ChartData | FormField[] | string;
  title?: string;
  [key: string]: unknown;
}

function isStructured(text: string): StructuredOutput | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && parsed.type) {
      return parsed as StructuredOutput;
    }
  } catch {}
  return null;
}

function TableView({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            {data.headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={cn("border-b border-border/50", ri % 2 === 0 && "bg-muted/10")}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-sm">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartView({ data }: { data: ChartData }) {
  const maxVal = Math.max(...data.datasets.flatMap((d) => d.values), 1);
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (data.type === "bar") {
    return (
      <div className="space-y-4">
        {data.datasets.map((ds, dsi) => (
          <div key={dsi} className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">{ds.label}</p>
            <div className="space-y-1.5">
              {ds.values.map((val, vi) => (
                <div key={vi} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-right text-muted-foreground shrink-0">{data.labels[vi]}</span>
                  <div className="flex-1 h-5 rounded bg-muted/30 overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{ width: `${(val / maxVal) * 100}%`, backgroundColor: ds.color || colors[dsi % colors.length] }}
                    />
                  </div>
                  <span className="w-10 text-xs font-mono text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.type === "pie") {
    const total = data.datasets[0]?.values.reduce((a, b) => a + b, 0) || 1;
    let cumulative = 0;
    return (
      <div className="flex items-center gap-6">
        <svg width="140" height="140" viewBox="0 0 32 32" className="shrink-0">
          {data.datasets[0]?.values.map((val, vi) => {
            const pct = val / total;
            const startAngle = (cumulative / total) * 360;
            cumulative += val;
            const endAngle = (cumulative / total) * 360;
            const x1 = 16 + 14 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 16 + 14 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 16 + 14 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 16 + 14 * Math.sin((endAngle * Math.PI) / 180);
            const largeArc = pct > 0.5 ? 1 : 0;
            return (
              <path
                key={vi}
                d={`M 16 16 L ${x1} ${y1} A 14 14 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={colors[vi % colors.length]}
                stroke="#1a1a2e"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
        <div className="space-y-1.5">
          {data.datasets[0]?.values.map((val, vi) => (
            <div key={vi} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: colors[vi % colors.length] }} />
              <span className="text-muted-foreground">{data.labels[vi]}</span>
              <span className="font-mono font-medium">{Math.round((val / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      Chart type "{data.type}" visualization
    </div>
  );
}

function FormView({ data }: { data: FormField[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {data.map((field, i) => (
        <div key={i} className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{field.label}</p>
          <div className="px-3 py-2 rounded-lg bg-muted/20 border border-border text-sm">
            {field.type === "boolean" ? (
              <span className={field.value === "true" ? "text-green-500" : "text-red-500"}>
                {field.value === "true" ? "Yes" : "No"}
              </span>
            ) : (
              field.value
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RichOutput({ text }: { text: string }) {
  const structured = isStructured(text);

  if (!structured) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
  }

  const knownKeys = new Set(["type", "data", "title"]);
  const extraFields = Object.entries(structured).filter(([k]) => !knownKeys.has(k));

  return (
    <div className="space-y-4">
      {structured.title && (
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{structured.title}</h3>
      )}
      {structured.type === "table" && <TableView data={structured.data as TableData} />}
      {structured.type === "chart" && <ChartView data={structured.data as ChartData} />}
      {structured.type === "form" && <FormView data={structured.data as FormField[]} />}
      {structured.type === "text" && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{String(structured.data)}</p>
      )}
      {extraFields.map(([key, val]) => (
        <div key={key} className="mt-3 p-3 rounded-lg bg-muted/20 border border-border/50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{key.replace(/_/g, " ")}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{String(val)}</p>
        </div>
      ))}
    </div>
  );
}
