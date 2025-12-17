// src/utils/colorUtils.ts

/**
 * HSL 색상을 CSS 문자열로 변환합니다.
 * @param h 색조 (Hue, 0-360)
 * @param s 채도 (Saturation, %)
 * @param l 명도 (Lightness, %)
 */
export function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * 12시 방향(상단)을 0도로 기준으로 하여, 두 점 사이의 각도를 0-360도 범위로 계산합니다.
 * @param cx 중심 노드(ROOT)의 X 좌표
 * @param cy 중심 노드(ROOT)의 Y 좌표
 * @param x 대상 노드의 X 좌표
 * @param y 대상 노드의 Y 좌표
 * @returns 0에서 360 사이의 각도 (Degree)
 */
export function getAngle(cx: number, cy: number, x: number, y: number): number {
  // 1. atan2를 사용하여 라디안 값 계산
  // (x - cx)는 코사인에 해당, (y - cy)는 사인에 해당하지만,
  // SVG 좌표계(y축이 아래로 증가)에서는 y축을 뒤집어야 일반 수학 좌표계와 일치합니다.
  const angleRad = Math.atan2(x - cx, -(y - cy));

  // 2. 라디안을 도(Degree)로 변환
  let angleDeg = angleRad * (180 / Math.PI);

  // 3. 0 ~ 360도 범위로 정규화 (12시 방향 0도 기준)
  if (angleDeg < 0) {
    angleDeg += 360;
  }

  return angleDeg;
}

/**
 * 각도에 따라 부드러운 파스텔톤 HSL 색상을 생성합니다.
 * @param angle 각도 (0-360)
 * @returns CSS HSL 색상 문자열
 */
export function getColorByAngle(angle: number): string {
  // 각도(Hue)는 0~360 범위 그대로 사용
  const hue = angle;

  // 채도(Saturation): 50% ~ 70% 사이로 설정하여 파스텔 톤 유지
  const saturation = 60;

  // 명도(Lightness): 80% ~ 90% 사이로 설정하여 색상을 연하게 만듭니다.
  const lightness = 85;

  return hslToCss(hue, saturation, lightness);
}
