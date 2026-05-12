import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Handle,
  type Position,
  type NodeProps,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent } from '../ui/Card';
import { Loader2, CheckCircle2, XCircle, Brain, Terminal, AlertTriangle, Cpu } from 'lucide-react';

const nodeColors: Record<string, string> = {
  input: '#10b981',
  output: '#8b5cf6',
  tool: '#6366f1',
  default: '#6366f1',
};

function CustomNode({ data, type }: NodeProps) {
  const isRunning = data.status === 'running';
  const isCompleted = data.status === 'completed';
  const isFailed = data.status === 'failed';
  const isTool = type === 'tool' || data.label?.toString().startsWith('🔧');

  return (
    <div
      className={`px-4 py-2.5 rounded-xl shadow-lg border transition-all ${
        isRunning
          ? 'border-blue-400/50 bg-blue-500/10'
          : isCompleted
          ? 'border-green-500/30 bg-green-500/10'
          : isFailed
          ? 'border-red-500/30 bg-red-500/10'
          : 'border-border/50 bg-background/80 backdrop-blur'
      }`}
      style={{
        minWidth: 160,
        borderLeft: `3px solid ${isRunning ? '#3b82f6' : isCompleted ? '#10b981' : isFailed ? '#ef4444' : nodeColors[type ?? 'default'] || '#6366f1'}`,
      }}
    >
      <Handle type="target" position={'left' as Position} className="!bg-indigo-500 !w-2.5 !h-2.5 !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${
          isTool ? 'bg-indigo-500/10' : type === 'input' ? 'bg-emerald-500/10' : 'bg-purple-500/10'
        }`}>
          {isRunning ? (
            <Loader2 size={14} className="animate-spin text-blue-400" />
          ) : isCompleted ? (
            <CheckCircle2 size={14} className="text-green-400" />
          ) : isFailed ? (
            <XCircle size={14} className="text-red-400" />
          ) : isTool ? (
            <Terminal size={14} className="text-indigo-400" />
          ) : type === 'input' ? (
            <Brain size={14} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={14} className="text-purple-400" />
          )}
        </div>
        <div>
          <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">
            {data.label as string}
          </span>
          {typeof data.duration === 'string' && data.duration && (
            <p className="text-[9px] text-muted-foreground mt-0.5">{data.duration}</p>
          )}
        </div>
      </div>
      <Handle type="source" position={'right' as Position} className="!bg-indigo-500 !w-2.5 !h-2.5 !border-2 !border-background" />
    </div>
  );
}

const nodeTypes = {
  input: CustomNode,
  output: CustomNode,
  tool: CustomNode,
  model: CustomNode,
  agent: CustomNode,
  default: CustomNode,
};

export default function FlowVisualization({ data, runStatus, executions }: { data?: any; runStatus?: string; executions?: any[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const executionStatusMap = useMemo(() => {
    if (!executions) return {};
    const map: Record<string, string> = {};
    for (const ex of executions) {
      const name = ex.tool?.name || ex.toolName || '';
      const status = ex.status?.toLowerCase() || '';
      if (name) map[name] = status;
    }
    return map;
  }, [executions]);

  useEffect(() => {
    if (data) {
      const nodesData = data.node || data.nodes;
      const edgesData = data.edge || data.edges;
      if (nodesData && edgesData) {
        const enriched = nodesData.map((n: any) => {
          const label = (n.data?.label as string) ?? '';
          const toolName = label.replace('🔧 ', '');
          const execStatus = executionStatusMap[toolName];
          const isLast = n.type === 'output' && runStatus === 'running';
          return {
            ...n,
            data: {
              ...n.data,
              status: execStatus || (isLast ? 'running' : n.data?.status),
            },
          };
        });
        setNodes(enriched);
        setEdges(edgesData);
      }
    }
  }, [data, executionStatusMap, runStatus]);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Cpu size={16} className="text-primary" />
              Execution Flow
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time visualization of the agent's execution path through models and tools.
            </p>
          </div>
          {nodes.length > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
              {nodes.length} nodes
            </span>
          )}
        </div>
        <div className="h-[400px] w-full overflow-hidden rounded-xl border border-border/30 bg-black/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            colorMode="dark"
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background color="#333" gap={16} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
