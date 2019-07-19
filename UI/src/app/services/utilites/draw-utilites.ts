function middleHeightOfLine(line: any) {
  const {y1, y2} = line.attributes;

  return ( +y1.nodeValue + +y2.nodeValue) / 2;
}

function areaOffset({sourceAreaWidth: source, targetAreaWidth: target}) {
  const offset = (Math.max(source, target) - Math.min(source, target)) / 2;
  return source > target ? -offset : offset;
}

function getSVGPoint(row, canvas) {
  const clientRect = row.htmlElement.getBoundingClientRect();
  const { height } = clientRect;

  let x: number;
  switch (row.area) {
    case 'source': {
      x = clientRect.right;
      break;
    }
    case 'target': {
      x = clientRect.left;
      break;
    }
    default: {
      return null;
    }
  }

  const y = clientRect.bottom - height / 2;
  const pt = canvas.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const svgPoint = pt.matrixTransform(canvas.getScreenCTM().inverse());

  return svgPoint;
}

export {
  middleHeightOfLine,
  areaOffset,
  getSVGPoint
};
