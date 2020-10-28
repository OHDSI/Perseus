import { MappingPair } from '../../../models/mapping';
import { MappingPairImage } from './mapping-pair-image';

const imageType = 'png';

// const fieldMarginTop = 50;
const fieldMarginTop = 40;
// const textMarginTop = 25;
const textMarginTop = 20;
const margin = 10;

// const fieldHeight = 41;
const fieldHeight = 39;
// const fieldWidth = 452;
const fieldWidth = 200;

// const distanceBetweenSourceAndTarget = 374;
const distanceBetweenSourceAndTarget = 250;

const sourceFieldColor = '#F9F9F9';
const targetFieldColor = 'rgba(218, 235, 249, 0.5)';

// const headerFont = '24px serif';
const headerFont = '14px serif';
// const fieldFont = '20px serif';
const fieldFont = '12px serif';
const fontColor = '#2C2C2C';

function fillTextInCenterOfRectangle(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, height: number) {
  ctx.font = fieldFont;
  ctx.fillStyle = fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, x + width / 2, y + height / 2);
}

export function createMappingPairImage(mappingPair: MappingPair): MappingPairImage {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  ctx.canvas.height = fieldMarginTop + margin + fieldHeight * mappingPair.mapping.length;
  ctx.canvas.width = margin * 2 + fieldWidth * 2 + distanceBetweenSourceAndTarget;

  const sourceXCoordinate = margin;
  const targetXCoordinate = margin + fieldWidth + distanceBetweenSourceAndTarget;

  ctx.font = headerFont;
  ctx.fillStyle = fontColor;

  ctx.fillText(mappingPair.source_table.toUpperCase(), sourceXCoordinate, textMarginTop);
  ctx.fillText(mappingPair.target_table.toUpperCase(), targetXCoordinate, textMarginTop);

  let index = 0;
  for (const mappingItem of mappingPair.mapping) {
    const yCoordinate = fieldMarginTop + index++ * fieldHeight;

    ctx.fillStyle = sourceFieldColor;
    ctx.fillRect(sourceXCoordinate, yCoordinate, fieldWidth, fieldHeight);
    fillTextInCenterOfRectangle(ctx, mappingItem.source_field, sourceXCoordinate, yCoordinate, fieldWidth, fieldHeight);

    ctx.fillStyle = targetFieldColor;
    ctx.fillRect(targetXCoordinate, yCoordinate, fieldWidth, fieldHeight);
    fillTextInCenterOfRectangle(ctx, mappingItem.target_field, targetXCoordinate, yCoordinate, fieldWidth, fieldHeight);
  }

  const result = {
    height: canvas.height,
    width: canvas.width,
    content: canvas.toDataURL(imageType)
  };

  canvas.remove();

  return result;
}
