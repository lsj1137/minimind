// src/components/Toolbar.tsx
import React, { useState } from "react";

interface ToolbarProps {
  onAddNode: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
}

// 메뉴 항목 정의 (FA 아이콘 사용)
const MENU_ITEMS = [
  { label: "노드 추가", icon: "fa-plus", onClick: "onAddNode", shortcut: "C" },
  {
    label: "저장하기",
    icon: "fa-save",
    onClick: "onSave",
    shortcut: "Ctrl+S",
  },
  {
    label: "파일 추출",
    icon: "fa-file-export",
    onClick: "onExport",
    shortcut: "Ctrl+E",
  },
  {
    label: "파일 불러오기",
    icon: "fa-file-import",
    onClick: "onImport",
    shortcut: "Ctrl+I",
  },
];

function Toolbar(props: ToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toolbarStyle: React.CSSProperties = {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",

    // [확장/최소화 애니메이션]
    width: isExpanded ? "240px" : "50px", // 확장 시 너비 조정
    transition: "width 0.3s ease",
  };

  const buttonStyle: React.CSSProperties = {
    // 버튼 높이를 고정하여 정렬 문제 방지
    height: "50px",
    padding: "0 12px",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center", // 세로 중앙 정렬
    width: "100%",
  };

  return (
    <div
      style={toolbarStyle}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {MENU_ITEMS.map((item, index) => {
        const isPrimaryButton = index === 0; // 도형 추가 버튼 (항상 표시)
        const Handler = props[item.onClick as keyof ToolbarProps] as () => void;

        // 최소화 상태일 때는 도형 추가 버튼 (index 0)만 렌더링
        if (!isExpanded && !isPrimaryButton) return null;

        return (
          <button
            key={item.label}
            style={{
              ...buttonStyle,
              padding: isPrimaryButton && !isExpanded ? "0" : "0 12px",
              justifyContent:
                isPrimaryButton && !isExpanded ? "center" : "flex-start",
            }}
            onClick={Handler}
            title={item.label}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f0f0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {/* Font Awesome 아이콘 */}
            <i
              className={`fa-solid ${item.icon}`}
              style={{
                minWidth: isExpanded ? "20px" : "0",
                textAlign: "center",
              }}
            />

            {/* 텍스트 및 단축키 */}
            {isExpanded && (
              <span style={{ marginLeft: "15px", flexGrow: 1 }}>
                {item.label}
              </span>
            )}
            {isExpanded && (
              <span
                style={{
                  fontSize: "0.8em",
                  opacity: 0.6,
                  whiteSpace: "nowrap",
                }}
              >
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Toolbar;
