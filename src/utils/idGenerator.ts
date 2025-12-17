// src/utils/idGenerator.ts

const idState = {
  currentId: 0,
};

/**
 * 새로운 고유 노드 ID를 생성합니다. (예: "NODE-1", "NODE-2")
 */
export const createUniqueNodeId = (): string => {
  idState.currentId += 1;
  const newId = `NODE-${idState.currentId}`;
  return newId;
};

// 외부에서 ID 카운터를 설정하는 함수
export const initializeIdCounter = (maxId: number) => {
  idState.currentId = maxId;
};

export const getCurrentId = () => idState.currentId;
