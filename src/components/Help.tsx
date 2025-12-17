// src/components/Help.tsx
import {
  closeButtonStyle,
  helpContentStyle,
  modalOverlayStyle,
} from "../style/appStyle";

interface HelpProps {
  setIsHelpOpen: (v: boolean) => void;
}

export default function Help(props: HelpProps) {
  const setIsHelpOpen = props.setIsHelpOpen;
  return (
    <div style={modalOverlayStyle} onClick={() => setIsHelpOpen(false)}>
      <div style={helpContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
          💡 사용 방법
        </h2>

        <ul
          style={{
            textAlign: "left",
            lineHeight: "1.8",
            padding: "0 20px",
          }}
        >
          <li>
            <strong>노드 이동:</strong> 노드를 드래그하여 원하는 위치로
            옮기세요.
          </li>
          <li>
            <strong>노드 연결:</strong> <kbd>Shift</kbd>를 누른 채로 노드를
            드래그하여 다른 노드에 놓으세요.
          </li>
          <li>
            <strong>노드 연결 해제:</strong> 연결선에 마우스를 올리고{"  "}
            <strong>선 중앙에 있는 삭제 버튼</strong>
            {"  "} 을 누르세요.
          </li>
          <li>
            <strong>텍스트 수정:</strong> 노드를 <strong>더블 클릭</strong>
            하여 내용을 수정하세요.
          </li>
          <li>
            <strong>노드 삭제:</strong> 노드에 마우스를 올리고{"  "}
            <strong>노드 우측 상단 삭제</strong>
            {"  "} 버튼을 누르세요.
          </li>
        </ul>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>⌨️ 단축키</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <span>
              노드 추가: <kbd>C</kbd>
            </span>
            <span>
              저장하기: <kbd>Ctrl</kbd>+<kbd>S</kbd>
            </span>
            <span>
              파일 추출: <kbd>Ctrl</kbd>+<kbd>E</kbd>
            </span>
            <span>
              파일 불러오기: <kbd>Ctrl</kbd>+<kbd>I</kbd>
            </span>
          </div>
        </div>

        <button onClick={() => setIsHelpOpen(false)} style={closeButtonStyle}>
          닫기
        </button>
      </div>
    </div>
  );
}
