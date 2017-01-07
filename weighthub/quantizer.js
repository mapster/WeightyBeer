const LEVEL_STEP = 1024;

module.exports = function quantize(value) {
  return Math.floor(value / LEVEL_STEP);
}
