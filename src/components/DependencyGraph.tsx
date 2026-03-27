'use client';

import { useState } from 'react';
import type { DepartmentDependency } from '@/lib/types';

interface Props {
  departments: string[];
  dependencies: DepartmentDependency[];
}

export default function DependencyGraph({ departments, dependencies }: Props) {
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const cx = 300;
  const cy = 200;
  const radius = 150;

  // Arrange departments in a circle
  const nodes = departments.map((name, i) => {
    const angle = (2 * Math.PI * i) / departments.length - Math.PI / 2;
    return {
      name,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const getNode = (name: string) => nodes.find((n) => n.name === name);

  function isConnected(deptName: string) {
    if (!highlighted) return false;
    return dependencies.some(
      (d) =>
        (d.sourceDepartmentName === highlighted && d.targetDepartmentName === deptName) ||
        (d.targetDepartmentName === highlighted && d.sourceDepartmentName === deptName)
    );
  }

  function handleClick(name: string) {
    setHighlighted((prev) => (prev === name ? null : name));
  }

  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="28"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={highlighted ? '#94a3b8' : '#64748b'}
          />
        </marker>
        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="28"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
        </marker>
      </defs>

      {/* Edges */}
      {dependencies.map((dep) => {
        const source = getNode(dep.sourceDepartmentName);
        const target = getNode(dep.targetDepartmentName);
        if (!source || !target) return null;

        const active =
          highlighted &&
          (dep.sourceDepartmentName === highlighted ||
            dep.targetDepartmentName === highlighted);

        return (
          <line
            key={dep.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={active ? '#059669' : highlighted ? '#e2e8f0' : '#94a3b8'}
            strokeWidth={active ? 2.5 : 1.5}
            markerEnd={active ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const active = highlighted === node.name;
        const connected = isConnected(node.name);
        const dimmed = highlighted && !active && !connected;

        return (
          <g
            key={node.name}
            onClick={() => handleClick(node.name)}
            className="cursor-pointer"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={24}
              fill={active ? '#059669' : connected ? '#d1fae5' : '#f1f5f9'}
              stroke={active ? '#047857' : connected ? '#059669' : '#cbd5e1'}
              strokeWidth={2}
              opacity={dimmed ? 0.4 : 1}
            />
            <text
              x={node.x}
              y={node.y + 38}
              textAnchor="middle"
              className="text-xs font-medium"
              fill={dimmed ? '#94a3b8' : '#334155'}
            >
              {node.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
