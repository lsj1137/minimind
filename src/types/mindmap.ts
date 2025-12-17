// src/types/mindmap.ts

// 노드 데이터 구조 정의
export interface NodeData {
  id: string;
  text: string;
  x: number;
  y: number;
  connections: string[]; // 연결된 다른 노드의 ID 리스트
  color?: string; // 노드 색상 (선택 사항)
}

// 드래그 중인 상태를 위한 구조 정의
export interface DragState {
  id: string; // 드래그 중인 노드의 ID
  offsetX: number; // 마우스 클릭 위치와 노드 중심의 X 오프셋
  offsetY: number; // 마우스 클릭 위치와 노드 중심의 Y 오프셋
  mode: "move" | "connect"; // 현재 이동 모드인지, 연결 모드인지 표시
}

// 연결 모드일 때 마우스 커서를 따라다닐 임시 선의 정보를 저장
export interface TempConnectionType {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}
