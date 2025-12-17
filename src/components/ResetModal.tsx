import { resetModalStyles } from "../style/appStyle";

interface ResetModalProps {
  confirmReset: () => void;
  setIsResetModalOpen: (v: boolean) => void;
}

export default function ResetModal(props: ResetModalProps) {
  return (
    <div style={resetModalStyles.overlay}>
      <div style={resetModalStyles.container}>
        <h3 style={resetModalStyles.title}>전체 초기화</h3>
        <p style={resetModalStyles.message}>
          모든 노드가 삭제됩니다. 정말 초기화하시겠습니까?
        </p>
        <div style={resetModalStyles.buttonGroup}>
          <button
            onClick={props.confirmReset}
            style={resetModalStyles.deleteButton}
          >
            삭제하기
          </button>
          <button
            onClick={() => props.setIsResetModalOpen(false)}
            style={resetModalStyles.cancelButton}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
