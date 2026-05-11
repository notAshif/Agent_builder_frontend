import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '../ui/Card';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'User Input' }, type: 'input', style: { background: '#10b981', color: '#fff', borderRadius: '12px' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Thinking...' }, style: { background: '#6366f1', color: '#fff', borderRadius: '12px' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: 'Response' }, type: 'output', style: { background: '#8b5cf6', color: '#fff', borderRadius: '12px' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function FlowVisualization({ data }: { data?: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (data) {
      const nodesData = data.node || data.nodes;
      const edgesData = data.edge || data.edges;
      if (nodesData && edgesData) {
        setNodes(nodesData);
        setEdges(edgesData);
      }
    }
  }, [data]);

  return (
    <Card className="h-[400px] w-full overflow-hidden border-border/50 bg-black/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode="dark"
      >
        <Background color="#333" gap={16} />
        <Controls />
      </ReactFlow>
    </Card>
  );
}
