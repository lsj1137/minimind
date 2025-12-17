// src/components/Connection.tsx
import React, { useState } from "react";
import { type NodeData } from "../types/mindmap";

interface ConnectionProps {
  nodes: NodeData[];
  fromId: string;
  toId: string;
  onDisconnect: (fromId: string, toId: string) => void;
}

function Connection({ nodes, fromId, toId, onDisconnect }: ConnectionProps) {
  const fromNode = nodes.find((n) => n.id === fromId);
  const toNode = nodes.find((n) => n.id === toId);
  const [isHovered, setIsHovered] = useState(false);
  // 타입을 통해 null 체크가 필수임을 알 수 있어 안정성이 높아집니다.
  if (!fromNode || !toNode) return null;

  // 연결선 좌표
  const x1 = fromNode.x;
  const y1 = fromNode.y;
  const x2 = toNode.x;
  const y2 = toNode.y;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke="#555"
        strokeWidth="2"
      />
      {/* 이벤트 감지 영역 (히트박스 확장) */}
      {/* 두꺼운 투명 선을 추가하여 마우스를 올리기 쉽도록 합니다. */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth="15"
        style={{ cursor: "pointer" }}
      />
      {/* 삭제 버튼 (호버 시 중앙에 표시) */}
      {isHovered && (
        <g
          transform={`translate(${midX}, ${midY})`}
          onClick={(e) => {
            e.stopPropagation(); // 드래그 등 다른 이벤트 방지
            onDisconnect(fromId, toId);
          }}
          style={{ cursor: "pointer" }}
        >
          {/* 버튼 배경 (흰색 원) */}
          <circle
            r="10"
            fill="#FFFFFF"
            stroke="#F08080" // 연한 빨간색 테두리
            strokeWidth="1"
          />
          {/* 'X' 표시 텍스트 */}
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F08080"
            fontSize="10"
            style={{ pointerEvents: "none" }} // 텍스트가 클릭을 방해하지 않도록
          >
            X
          </text>
        </g>
      )}
    </g>
  );
}

export default Connection;
