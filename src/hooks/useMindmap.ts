// src/hooks/useMindmap.ts

import { useState, useEffect, useCallback, type MouseEvent } from "react";
import {
  type NodeData,
  type DragState,
  type TempConnectionType,
} from "../types/mindmap";
import { createUniqueNodeId, initializeIdCounter } from "../utils/idGenerator";
import { getAngle, getColorByAngle } from "../utils/colorUtils";

// Local Storage 키 상수
const STORAGE_KEY = "minimind_mindmap_data";
const ROOT_ID = "ROOT";
const NODE_RADIUS = 50;

// --- 초기 상태를 Local Storage에서 불러오는 함수 ---
const getInitialNodes = (): NodeData[] => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as NodeData[];
        // 루트 노드가 있는지 확인하는 기본적인 유효성 검사
        if (parsedData.some((n) => n.id === ROOT_ID)) {
          // 최대 ID를 찾아 카운터 초기화
          const maxId = parsedData.reduce((max, node) => {
            if (node.id === ROOT_ID) return max;
            const idNumber = parseInt(node.id.replace("NODE-", "") || "0");
            return isNaN(idNumber) ? max : Math.max(max, idNumber);
          }, 0);

          initializeIdCounter(maxId);
          return parsedData;
        }
      } catch (e) {
        console.error("Local storage data corrupted:", e);
        // 에러 발생 시 기본값 반환
      }
    }
  }
  // 저장된 데이터가 없거나 유효하지 않으면 기본 노드 반환
  // 기본 노드 반환 시에도 카운터 0으로 초기화
  initializeIdCounter(0);
  return [
    {
      id: ROOT_ID,
      text: "중심 아이디어",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      connections: [],
      color: "#dedede",
    },
  ];
};

export function useMindmap() {
  // --- 상태 관리 ---
  const [nodes, setNodes] = useState<NodeData[]>(() => getInitialNodes());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [tempConnection, setTempConnection] =
    useState<TempConnectionType | null>(null);
  const [ghostNodeData, setGhostNodeData] = useState<NodeData | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // 토스트 표시 함수 정의
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  }, []);

  // --- 유틸리티 및 계산 로직 ---

  const updateNodeColors = useCallback(
    (currentNodes: NodeData[]): NodeData[] => {
      const rootNode = currentNodes.find((n) => n.id === ROOT_ID);
      if (!rootNode) return currentNodes;

      return currentNodes.map((node) => {
        if (node.id === ROOT_ID) return node;

        const angle = getAngle(rootNode.x, rootNode.y, node.x, node.y);
        const newColor = getColorByAngle(angle);

        return { ...node, color: newColor };
      });
    },
    []
  );

  // --- CRUD 및 비즈니스 로직 ---

  // 노드 삭제 (Delete)
  const deleteNode = useCallback(
    (id: string) => {
      if (id === ROOT_ID) return;

      setNodes((prevNodes) =>
        updateNodeColors(
          // 색상 재계산 로직을 체인에 포함
          prevNodes
            .filter((node) => node.id !== id)
            .map((node) => ({
              ...node,
              connections: node.connections.filter((connId) => connId !== id),
            }))
        )
      );
    },
    [updateNodeColors]
  );

  // 연결 끊기 (Disconnect)
  const handleDisconnect = useCallback(
    (fromId: string, toId: string) => {
      setNodes((prevNodes) =>
        updateNodeColors(
          prevNodes.map((node) => {
            if (node.id === fromId) {
              return {
                ...node,
                connections: node.connections.filter(
                  (connId) => connId !== toId
                ),
              };
            }
            return node;
          })
        )
      );
    },
    [updateNodeColors]
  );

  // 텍스트 업데이트 (Update Text)
  const handleTextUpdate = useCallback((id: string, newText: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, text: newText } : node
      )
    );
    setEditingNodeId(null);
  }, []);

  // 노드 추가 (Create)
  const handleAddNode = useCallback(() => {
    const newId = createUniqueNodeId();

    setNodes((prevNodes) => {
      const rootNode = prevNodes.find((n) => n.id === ROOT_ID);
      if (!rootNode) return prevNodes;

      const newX = rootNode.x + 150;
      const newY = rootNode.y + Math.random() * 50 - 25;

      const angle = getAngle(rootNode.x, rootNode.y, newX, newY);
      const newColor = getColorByAngle(angle);

      const newNode: NodeData = {
        id: newId,
        text: "새 노드",
        x: newX,
        y: newY,
        connections: [],
        color: newColor,
      };
      const updatedNodes = [...prevNodes, newNode];
      return updateNodeColors(updatedNodes);
    });
  }, [updateNodeColors]);

  // --- 4. 드래그/마우스 핸들러 ---

  const handleNodeDoubleClick = useCallback(
    (id: string) => {
      if (!dragState) {
        setEditingNodeId(id);
      }
    },
    [dragState]
  );

  const handleNodeMouseDown = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const nodeToDrag = nodes.find((n) => n.id === id);

    if (!nodeToDrag) return;

    const mode = e.shiftKey ? "connect" : "move";

    if (id === ROOT_ID && mode === "move") return;
    if (editingNodeId) return;

    setDragState({
      id: id,
      offsetX: e.clientX - nodeToDrag.x,
      offsetY: e.clientY - nodeToDrag.y,
      mode: mode,
    });
  };

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!dragState) return;

      const currentX = e.clientX;
      const currentY = e.clientY;
      const offsetX = dragState.offsetX;
      const offsetY = dragState.offsetY;

      if (dragState.mode === "move") {
        setNodes((prevNodes) => {
          const updatedNodes = prevNodes.map((node) =>
            node.id === dragState.id
              ? { ...node, x: currentX - offsetX, y: currentY - offsetY }
              : node
          );
          return updateNodeColors(updatedNodes);
        });
      } else if (dragState.mode === "connect") {
        const fromNode = nodes.find((n) => n.id === dragState.id);
        if (fromNode) {
          setTempConnection({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: currentX,
            toY: currentY,
          });
          setGhostNodeData({
            ...fromNode,
            x: currentX,
            y: currentY,
          } as NodeData);
        }
      }
    },
    [dragState, nodes, updateNodeColors]
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
      if (dragState && dragState.mode === "connect") {
        const dropX = e.clientX;
        const dropY = e.clientY;
        const startNodeId = dragState.id;

        const targetNode = nodes.find((node) => {
          if (node.id === startNodeId) return false;

          // 충돌 감지 (사각형 노드에 맞춰 충돌 감지 로직 개선 필요할 수 있으나, 현재 원형 반경 기준 유지)
          const dx = dropX - node.x;
          const dy = dropY - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          return distance < NODE_RADIUS; // NODE_RADIUS는 50으로 정의됨
        });

        if (targetNode) {
          const targetId = targetNode.id;
          const startNode = nodes.find((n) => n.id === startNodeId);
          if (startNode && !startNode.connections.includes(targetId)) {
            setNodes((prevNodes) =>
              updateNodeColors(
                prevNodes.map((node) => {
                  if (node.id === startNodeId) {
                    return {
                      ...node,
                      connections: [...node.connections, targetId],
                    };
                  }
                  return node;
                })
              )
            );
          }
        }
      }

      setGhostNodeData(null);
      setTempConnection(null);
      setDragState(null);
    },
    [dragState, nodes, updateNodeColors]
  );

  // --- Effect (DOM 이벤트 및 리사이즈) ---

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (dragState) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, handleMouseMove, handleMouseUp]);

  // --- 툴바 기능 핸들러 ---

  // Local Storage에 저장
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
      showToast("상태가 저장되었습니다.");
    } catch (e) {
      console.error("Failed to save to local storage", e);
      showToast("상태 저장 실패");
    }
  }, [nodes]);

  // 파일로 저장 (Export)
  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(nodes);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileName = "minimind_export.json";

      // 임시 <a> 태그를 생성하여 다운로드 실행
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
    } catch (e) {
      showToast("파일 내보내기 실패");
    }
  }, [nodes]);

  // 파일 불러오기 (Import): UI 로직은 App.tsx에 위임
  const handleImport = useCallback(() => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    } else {
      showToast("파일을 불러올 수 없습니다");
      console.error("file-input element not found");
    }
  }, []);

  // 파일 불러오기 처리 (Import Data)
  const handleImportData = useCallback(
    (fileContents: string) => {
      try {
        const importedNodes: NodeData[] = JSON.parse(fileContents);

        // 유효성 검사: 필수 속성 및 ROOT 노드 존재 여부 확인
        if (
          !Array.isArray(importedNodes) ||
          !importedNodes.some((n) => n.id === ROOT_ID)
        ) {
          throw new Error("Invalid file format.");
        }

        // 불러온 데이터에서 최대 ID를 찾아 카운터 초기화
        const maxId = importedNodes.reduce((max, node) => {
          if (node.id === ROOT_ID) return max;
          const idNumber = parseInt(node.id.replace("NODE-", "") || "0");
          return isNaN(idNumber) ? max : Math.max(max, idNumber);
        }, 0);
        initializeIdCounter(maxId);

        // 불러온 데이터를 적용하고 색상 업데이트
        setNodes(updateNodeColors(importedNodes));
        showToast("파일을 성공적으로 불러왔습니다");
      } catch (e) {
        console.error("Import failed:", e);
        showToast(
          "파일 불러오기 실패: 파일 형식이 유효하지 않거나 손상되었습니다."
        );
      }
    },
    [updateNodeColors]
  );

  // 단축키로 실행할 수 있는 함수들을 객체로 묶음
  const shortcuts = {
    handleAddNode,
    handleSave,
    handleExport,
    handleImport,
  };

  // 훅에서 필요한 모든 상태와 핸들러를 반환
  return {
    nodes,
    toastMessage,
    tempConnection,
    ghostNodeData,
    editingNodeId,
    dragState,
    handleAddNode,
    handleNodeMouseDown,
    handleNodeDoubleClick,
    handleTextUpdate,
    deleteNode,
    handleDisconnect,
    handleSave,
    handleExport,
    handleImport,
    handleImportData,
    shortcuts,
  };
}
