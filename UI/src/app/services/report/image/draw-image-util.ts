import { MappingPair } from '../../../models/mapping';
import { MappingPairImage, MappingPairImageStyles } from './mapping-pair-image';
import { CanvasWrapper } from './canvas-wrapper';

const imageType = 'png';

const sourceFieldColor = '#F9F9F9';
const targetFieldColor = 'rgba(218, 235, 249, 0.5)';
const fontColor = '#2C2C2C';
const borderColor = '#BDBDBD';
const arrowColor = '#D4D4D4';

export function createMappingPairImage(mappingPair: MappingPair, styles: MappingPairImageStyles): MappingPairImage {
  const {
    width,
    fieldWidth,
    fieldHeight,
    distanceBetweenSourceAndTarget,
    marginLeft,
    marginBottom,
    textMarginTop,
    fieldsMarginTop,
    headerFont,
    fieldFont
  } = styles;

  const canvas = new CanvasWrapper();

  const uniqueSourceFieldsCount = new Set(mappingPair.mapping
    .map(m => m.source_field))
    .size;
  const uniqueTargetFieldsCount = new Set(mappingPair.mapping
    .map(m => m.target_field))
    .size;

  canvas.height = fieldsMarginTop + marginBottom + fieldHeight * Math.max(uniqueSourceFieldsCount, uniqueTargetFieldsCount);
  canvas.width = width || (marginLeft * 2 + fieldWidth * 2 + distanceBetweenSourceAndTarget);

  const sourceXCoordinate = marginLeft;
  const targetXCoordinate = marginLeft + fieldWidth + distanceBetweenSourceAndTarget;

  const headerFontStyles = {
    font: headerFont,
    color: fontColor
  };

  canvas.fillText(mappingPair.source_table.toUpperCase(), sourceXCoordinate, textMarginTop, headerFontStyles);
  canvas.fillText(mappingPair.target_table.toUpperCase(), targetXCoordinate, textMarginTop, headerFontStyles);

  const drawnSourceFieldsIndexes = {};
  const drawnTargetFieldsIndexes = {};

  let sourceIndex = 0;
  let targetIndex = 0;

  const fieldStyles = {
    borderColor,
    font: fieldFont,
    fontColor
  };

  for (const mappingItem of mappingPair.mapping) {
    const sourceFieldDrawn = drawnSourceFieldsIndexes.hasOwnProperty(mappingItem.source_field);
    const targetFieldDrawn = drawnTargetFieldsIndexes.hasOwnProperty(mappingItem.target_field);

    const sourceYCoordinate = fieldsMarginTop +
      (sourceFieldDrawn ? drawnSourceFieldsIndexes[mappingItem.source_field] : sourceIndex) * fieldHeight;
    const targetYCoordinate = fieldsMarginTop +
      (targetFieldDrawn ? drawnTargetFieldsIndexes[mappingItem.target_field] : targetIndex) * fieldHeight;

    if (!sourceFieldDrawn) {
      canvas.fillRectangle(sourceXCoordinate, sourceYCoordinate, fieldWidth, fieldHeight, {
        text: mappingItem.source_field,
        fillColor: sourceFieldColor,
        ...fieldStyles
      });

      drawnSourceFieldsIndexes[mappingItem.source_field] = sourceIndex++;
    }

    if (!targetFieldDrawn) {
      canvas.fillRectangle(targetXCoordinate, targetYCoordinate, fieldWidth, fieldHeight, {
        text: mappingItem.target_field,
        fillColor: targetFieldColor,
        ...fieldStyles
      });

      drawnTargetFieldsIndexes[mappingItem.target_field] = targetIndex++;
    }

    const arrowBeginCoordinates = {
      x: sourceXCoordinate + fieldWidth,
      y: sourceYCoordinate + fieldHeight / 2
    };
    const arrowEndCoordinates = {
      x: targetXCoordinate,
      y: targetYCoordinate + fieldHeight / 2
    };

    canvas.drawArrow(
      arrowBeginCoordinates.x,
      arrowBeginCoordinates.y,
      arrowEndCoordinates.x,
      arrowEndCoordinates.y,
      arrowColor
    );
  }

  const result = {
    height: canvas.height,
    width: canvas.width,
    content: canvas.image(imageType)
  };

  canvas.destroy();

  return result;
}
