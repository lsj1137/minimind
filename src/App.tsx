// src/App.tsx (리팩토링 후)

import Node from "./components/Node";
import Connection from "./components/Connection";
import Toolbar from "./components/Toolbar";
import TempConnection from "./components/TempConnection";
import { useMindmap } from "./hooks/useMindmap"; // 훅 임포트
import { useEffect, useState } from "react";
import { helpBtnStyle, resetBtnStyle, toastStyle } from "./style/appStyle";
import Help from "./components/Help";
import ResetModal from "./components/ResetModal";

function App() {
  // 모든 상태와 로직을 훅에서 가져옵니다.
  const {
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
  } = useMindmap();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // 초기화 모달 상태
  const [isHelpOpen, setIsHelpOpen] = useState(false); // 도움말 상태

  // 초기화 실행 함수
  const confirmReset = () => {
    localStorage.removeItem("minimind_mindmap_data"); // 저장소 비우기
    window.location.reload(); // 가장 확실한 초기화 방법
  };

  // 파일 선택 시 호출되는 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      handleImportData(contents);
    };
    reader.readAsText(file);

    // 파일 선택 후 input 값 초기화 (같은 파일을 다시 선택 가능하도록)
    event.target.value = "";
  };

  // --- [추가] 키보드 단축키 리스너 ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 텍스트 편집 중일 때는 단축키 무시
      if (e.target instanceof HTMLInputElement && e.target.type === "text") {
        return;
      }

      let handled = true;

      if (e.key === "c" || e.key === "C") {
        // 생성하기: C
        shortcuts.handleAddNode();
      } else if (e.ctrlKey && e.key === "s") {
        // 상태 저장: Ctrl + S
        e.preventDefault(); // 브라우저 저장 단축키 방지
        shortcuts.handleSave();
      } else if (e.ctrlKey && e.key === "e") {
        // 파일 추출: Ctrl + E
        e.preventDefault(); // 브라우저 동작 방지
        shortcuts.handleExport();
      } else if (e.ctrlKey && e.key === "i") {
        // 파일 불러오기: Ctrl + I
        e.preventDefault(); // 브라우저 동작 방지
        shortcuts.handleImport();
      } else {
        handled = false;
      }

      if (handled) {
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]); // shortcuts는 useCallback으로 메모이제이션되었으므로 안전

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#f5f5f5",
        fontFamily:
          "Pretendard" /* 폰트 적용 (CSS에서 이미 적용했겠지만 안전을 위해) */,
      }}
    >
      {/* ❓ 오른쪽 상단 도움말 버튼 */}
      <button onClick={() => setIsHelpOpen(true)} style={helpBtnStyle}>
        <i className="fa-solid fa-question"></i>
      </button>

      {/* 📘 도움말 모달 */}
      {isHelpOpen && Help({ setIsHelpOpen })}

      {/* 툴바 */}
      <Toolbar
        onAddNode={handleAddNode}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport} // 툴바 버튼 클릭 시 파일 선택 창 열기
      />

      <input
        type="file"
        id="file-input"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <svg width="100%" height="100%">
        {/* 임시 연결선 */}
        <TempConnection data={tempConnection} />

        {/* 복제 노드 (Ghost Node) */}
        {ghostNodeData && (
          <Node
            key="ghost-node"
            data={ghostNodeData}
            isEditing={false}
            isDragging={false}
            onNodeMouseDown={() => {}}
            onNodeDoubleClick={() => {}}
            onTextUpdate={() => {}}
            onDelete={() => {}}
            style={{ opacity: 0.4, pointerEvents: "none" }}
          />
        )}

        {/* 영구 연결선 */}
        {nodes.map((node) =>
          node.connections.map((connectedId) => (
            <Connection
              key={`${node.id}-${connectedId}`}
              nodes={nodes}
              fromId={node.id}
              toId={connectedId}
              onDisconnect={handleDisconnect}
            />
          ))
        )}

        {/* 실제 노드 */}
        {nodes.map((node) => (
          <Node
            key={node.id}
            data={node}
            isEditing={node.id === editingNodeId}
            isDragging={dragState !== null && dragState.id === node.id}
            onNodeMouseDown={handleNodeMouseDown}
            onNodeDoubleClick={handleNodeDoubleClick}
            onTextUpdate={handleTextUpdate}
            onDelete={deleteNode}
          />
        ))}
      </svg>

      {/* 🍞 토스트 알림 UI */}
      {toastMessage && <div style={toastStyle}>{toastMessage}</div>}

      {/* 🗑️ 오른쪽 아래 휴지통 버튼 */}
      <button onClick={() => setIsResetModalOpen(true)} style={resetBtnStyle}>
        <i className="fa-solid fa-trash-can"></i>
      </button>

      {/* ⚠️ 초기화 확인 모달 */}
      {isResetModalOpen && ResetModal({ confirmReset, setIsResetModalOpen })}

      {/* 토스트 애니메이션 CSS */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
      `}</style>
    </div>
  );
}

export default App;
