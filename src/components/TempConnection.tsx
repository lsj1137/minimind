// src/components/TempConnection.tsx
import { type TempConnectionType } from "../types/mindmap";

interface TempConnectionProps {
  data: TempConnectionType | null;
}

function TempConnection({ data }: TempConnectionProps) {
  if (!data) return null;

  return (
    <line
      x1={data.fromX}
      y1={data.fromY}
      x2={data.toX}
      y2={data.toY}
      stroke="red" // 임시 선은 눈에 띄게 빨간색으로 표시합니다.
      strokeWidth="2"
      strokeDasharray="5,5" // 점선으로 표시
    />
  );
}

export default TempConnection;
