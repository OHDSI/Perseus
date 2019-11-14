import { IRow } from 'src/app/models/row';

function middleHeightOfLine(line: any) {
  const {middleY} = line.attributes;

  return middleY.nodeValue;
}

function areaOffset(source, target) {
  const offset = (Math.max(source, target) - Math.min(source, target)) / 2;
  return source > target ? -offset : offset;
}

function getSVGPoint(row: IRow, canvas: any) {
  const clientRect = row.htmlElement.getBoundingClientRect();
  const { height, width } = clientRect;

  if (height === 0 || width === 0) {
    throw new Error('invalid client rectange height or width');
  }

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
