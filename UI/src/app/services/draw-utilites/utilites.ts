function middleHeightOfLine(line: any) {
  const {y1, y2} = line.attributes;

  return ( +y1.nodeValue + +y2.nodeValue) / 2;
}

function areaOffset() {
  const {sourceAreaWidth: source, targetAreaWidth: target} = this.commonService;
  const offset = (Math.max(source, target) - Math.min(source, target)) / 2;
  return source > target ? -offset : offset;
}

export {
  middleHeightOfLine,
  areaOffset
};
