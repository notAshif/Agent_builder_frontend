import { useEffect } from 'react';
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
import { Bot, Cpu, Wrench, ArrowRightFromLine } from 'lucide-react';
import type { Agent } from '../../types';
import { getModelInfo } from '../../lib/models';

const providerColors: Record<string, string> = {
  openai: '#10a37f',
  anthropic: '#d4a574',
  gemini: '#4285f4',
  openrouter: '#8b5cf6',
};

function AgentNode({ data }: NodeProps) {
  return (
    <div className="px-5 py-3 rounded-xl shadow-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 min-w-[200px]">
      <Handle type="target" position={'left' as Position} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <Bot size={20} />
        </div>
        <div>
          <p className="text-sm font-bold">{data.label as string}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{data.model as string}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Provider</span>
        <span
          className="text-[10px] px-2 py-0.5 rounded font-bold"
          style={{
            backgroundColor: `${data.providerColor as string}15`,
            color: data.providerColor as string,
          }}
        >
          {data.provider as string}
        </span>
      </div>
      <Handle type="source" position={'right' as Position} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function ToolNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2.5 rounded-xl shadow-md border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent min-w-[180px]">
      <Handle type="target" position={'left' as Position} className="!bg-indigo-500 !w-2.5 !h-2.5 !border-2 !border-background" />
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
          <Wrench size={14} />
        </div>
        <div>
          <p className="text-xs font-semibold">{data.label as string}</p>
          <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-2 max-w-[140px]">{data.description as string}</p>
        </div>
      </div>
      <Handle type="source" position={'right' as Position} className="!bg-indigo-500 !w-2.5 !h-2.5 !border-2 !border-background" />
    </div>
  );
}

function TerminalNode({ data }: NodeProps) {
  return (
    <div className="px-5 py-3 rounded-xl shadow-lg border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 min-w-[120px]">
      <Handle type="target" position={'left' as Position} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400">
          {data.icon === 'output' ? <ArrowRightFromLine size={16} /> : <Cpu size={16} />}
        </div>
        <span className="text-sm font-bold">{data.label as string}</span>
      </div>
      <Handle type="source" position={'right' as Position} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  terminal: TerminalNode,
};

export default function AgentLogicGraph({ agent }: { agent: Agent }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const modelInfo = getModelInfo(agent.config.model);

  useEffect(() => {
    const result: Node[] = [];
    const edgeList: Edge[] = [];
    const tools = agent.tools ?? [];

    const toolCount = tools.length;
    const toolGapY = toolCount > 1 ? 130 : 0;
    const startY = toolCount > 1 ? -((toolCount - 1) * toolGapY) / 2 : 0;

    result.push({
      id: 'input',
      type: 'terminal',
      position: { x: -450, y: 0 },
      data: { label: 'Input', icon: 'input' },
    });

    edgeList.push({
      id: 'e-input-agent',
      source: 'input',
      target: 'agent',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 },
    });

    result.push({
      id: 'agent',
      type: 'agent',
      position: { x: -200, y: -40 },
      data: {
        label: agent.name,
        model: modelInfo.label,
        provider: modelInfo.badge,
        providerColor: providerColors[modelInfo.provider] || '#6366f1',
      },
    });

    tools.forEach((t, i) => {
      const toolId = `tool-${t.tool.id}`;
      result.push({
        id: toolId,
        type: 'tool',
        position: { x: 120, y: startY + i * toolGapY },
        data: {
          label: t.tool.name,
          description: t.tool.description || '',
        },
      });

      edgeList.push({
        id: `e-agent-${toolId}`,
        source: 'agent',
        target: toolId,
        style: { stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 3' },
      });
    });

    result.push({
      id: 'output',
      type: 'terminal',
      position: { x: toolCount > 0 ? 420 : 220, y: 0 },
      data: { label: 'Output', icon: 'output' },
    });

    if (toolCount > 0) {
      tools.forEach((t) => {
        edgeList.push({
          id: `e-${t.tool.id}-output`,
          source: `tool-${t.tool.id}`,
          target: 'output',
          style: { stroke: '#8b5cf6', strokeWidth: 1.5, strokeDasharray: '4 3' },
        });
      });
    } else {
      edgeList.push({
        id: 'e-agent-output',
        source: 'agent',
        target: 'output',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
      });
    }

    setNodes(result);
    setEdges(edgeList);
  }, [agent, modelInfo]);

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Cpu size={16} className="text-primary" />
                Agent Architecture
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Visual representation of how the agent routes input through the model and tools.
              </p>
            </div>
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
    </div>
  );
}
