const LEVEL_STEP = 1024;

export default function quantize(value: number) {
  return Math.floor(value / LEVEL_STEP);
}
