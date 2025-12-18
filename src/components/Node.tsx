// src/components/Node.tsx
import React, { useState, type MouseEvent } from "react";
import { type NodeData } from "../types/mindmap";

const ROOT_ID = "ROOT";
const NODE_WIDTH = 150; // 노드 너비
const NODE_HEIGHT = 60; // 노드 높이

interface NodeProps {
  data: NodeData;
  // 드래그 시작 시 호출될 함수 (매개변수에 마우스 이벤트와 노드 ID 명시)
  onNodeMouseDown: (e: MouseEvent, id: string) => void;
  isEditing: boolean; // 편집 상태
  isDragging: boolean; // 드래그 상태
  onNodeDoubleClick: (id: string) => void; // 더블 클릭 이벤트
  onTextUpdate: (id: string, newText: string) => void; // 텍스트 수정 완료 이벤트
  onDelete: (id: string) => void; // 삭제 함수
  style?: React.CSSProperties; // 임의의 스타일을 적용할 수 있도록 허용
}

function Node({
  data,
  isEditing,
  isDragging,
  onNodeMouseDown,
  onNodeDoubleClick,
  onTextUpdate,
  onDelete,
  style,
}: NodeProps) {
  const [isHovered, setIsHovered] = useState(false); //호버 상태 관리
  // 인풋 값 관리를 위한 로컬 상태
  const [editText, setEditText] = useState(data.text);

  const isRoot = data.id === ROOT_ID;

  // 텍스트 편집 완료 (Enter 키 누르거나, 포커스를 잃었을 때)
  const finishEditing = () => {
    if (editText !== data.text) {
      onTextUpdate(data.id, editText);
    } else {
      onTextUpdate(data.id, data.text); // 변경 없어도 편집 상태 해제
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEditing();
    }
  };

  return (
    <g
      transform={`translate(${data.x}, ${data.y})`}
      onMouseDown={(e: MouseEvent<SVGGElement>) => onNodeMouseDown(e, data.id)}
      onDoubleClick={() => onNodeDoubleClick(data.id)}
      onMouseEnter={() => setIsHovered(true)} // 호버 시작
      onMouseLeave={() => setIsHovered(false)} // 호버 종료
      style={{
        cursor: isRoot ? "default" : "grab",
        ...style,
      }}
    >
      {/* SVG 원과 텍스트 */}
      <rect
        x={-NODE_WIDTH / 2} // x, y를 중심으로 맞추기 위해 너비의 절반만큼 이동
        y={-NODE_HEIGHT / 2} // 높이의 절반만큼 이동
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx="10" // 모서리 둥글게 (Radius X)
        ry="10" // 모서리 둥글게 (Radius Y)
        fill={data.color || "#ADD8E6"} // 데이터의 color 속성 사용 (파스텔 톤 기본값)
        stroke="none" // border 제거
      />
      {/* 편집 중일 때와 아닐 때를 분기하여 렌더링 */}
      {isEditing ? (
        // --- 편집 모드: HTML Input 렌더링 ---
        <foreignObject
          x={-NODE_WIDTH / 2} // x, y 좌표를 노드 중심으로 맞춤
          y={-NODE_HEIGHT / 2}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
        >
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={finishEditing} // 포커스를 잃으면 편집 완료
            onKeyDown={handleKeyDown} // Enter 키 입력 시 편집 완료
            // 렌더링 직후 자동으로 포커스를 줍니다.
            autoFocus
            style={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              border: "1px solid red",
              background: "transparent",
              padding: 0,
              margin: 0,
              boxSizing: "border-box",
              fontSize: "18px",
            }}
          />
        </foreignObject>
      ) : (
        // --- 일반 모드: SVG 텍스트 렌더링 ---
        <text textAnchor="middle" dy=".3em" fill="#000" fontSize="18">
          {data.text}
        </text>
      )}
      {/* 삭제 버튼 (호버 중이고 ROOT 노드가 아닐 때만 렌더링) */}
      {isHovered && !isRoot && !isDragging && (
        <>
          {/* 1. 삭제 버튼 배경 (흰색 원) */}
          <circle
            // 노드 우측 상단 모서리 근처에 위치
            cx={NODE_WIDTH / 2 - 5}
            cy={-NODE_HEIGHT / 2 + 5}
            r="14" // 버튼 크기
            fill="#FFFFFF" // 흰색 배경
            stroke="none" // 보더 제거
            style={{ cursor: "pointer" }}
            // 이벤트 핸들러: 노드 드래그/클릭 이벤트 방지 및 삭제 실행
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
          />

          {/* 2. 'X' 표시 텍스트 */}
          <text
            x={NODE_WIDTH / 2 - 5}
            y={-NODE_HEIGHT / 2 + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            // 연한 빨간색 (요청하신 색상 톤)
            fill="#F08080"
            fontSize="14"
            style={{
              pointerEvents: "none", // 텍스트를 클릭해도 아래의 circle이 이벤트를 받도록 설정
              fontWeight: "bold",
            }}
            // 삭제 클릭 이벤트를 텍스트 요소가 받지 않도록 onClick 이벤트 핸들러 제거
          >
            X
          </text>
        </>
      )}
    </g>
  );
}

export default Node;
