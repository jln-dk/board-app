export const add = (A: number[], B: number[]): number[] => {
  return [A[0] + B[0], A[1] + B[1]];
};

export const sub = (A: number[], B: number[]): number[] => {
  return [A[0] - B[0], A[1] - B[1]];
};

export const div = (A: number[], n: number): number[] => {
  return [A[0] / n, A[1] / n];
};

export const multiply = (A: number[], n: number): number[] => {
  return [A[0] * n, A[1] * n];
};

export const multiplyVectors = (A: number[], B: number[]): number[] => {
  return [A[0] * B[0], A[1] * B[1]];
};

export const toFixed = (a: number[]): number[] => {
  return a.map((v) => Math.round(v * 100) / 100);
};

export const getRelativePoint = (
  point: number[],
  camera: number[],
  zoom: number
): number[] => {
  const xyMinusCamera = sub(point, camera);
  const zoomFactor = 1 / zoom;
  const scaledXY = multiply(xyMinusCamera, zoomFactor);
  return scaledXY;
};
