import { MappingNode } from '../../../models/mapping';
import { MappingForImage, MappingImage, MappingImageStyles } from './mapping-image';
import { CanvasWrapper } from './canvas-wrapper';
import { similarTableName } from '../../../app.constants';

const imageType = 'png';

const sourceBlockColor = '#F9F9F9';
const targetBlockColor = 'rgba(218, 235, 249, 0.5)';
const fontColor = '#2C2C2C';
const borderColor = '#BDBDBD';
const arrowColor = '#D4D4D4';

export function createMappingTablesImage(header: MappingForImage, mappingConfig: string[][], styles: MappingImageStyles): MappingImage {
  const mappingTables: MappingForImage[] = mappingConfig
    .filter(tables => tables[0] !== similarTableName)
    .flatMap(tables => {
      const targetTable = tables[0];
      return tables
        .filter((tableName, index) => index !== 0 && tableName !== similarTableName)
        .map(sourceTable => ({
          source: sourceTable,
          target: targetTable
        }));
    });

  return createMappingImage(header, mappingTables, styles);
}

export function createMappingFieldsImage(header: MappingForImage, mapping: MappingNode[], styles: MappingImageStyles): MappingImage {
  const mappingFields: MappingForImage[] = mapping
    .map(mappingNode => ({
      source: mappingNode.source_field,
      target: mappingNode.target_field
    }));

  return createMappingImage(header, mappingFields, styles);
}

function createMappingImage(header: MappingForImage, mappings: MappingForImage[], styles: MappingImageStyles): MappingImage {
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

  const uniqueSourceFieldsCount = new Set(mappings
    .filter(m => m.source)
    .map(m => m.source)
  ).size;
  const uniqueTargetFieldsCount = new Set(mappings
    .filter(m => m.source)
    .map(m => m.target)
  ).size;

  canvas.height = fieldsMarginTop + marginBottom + fieldHeight * Math.max(uniqueSourceFieldsCount, uniqueTargetFieldsCount);
  canvas.width = width || (marginLeft * 2 + fieldWidth * 2 + distanceBetweenSourceAndTarget);

  const sourceXCoordinate = marginLeft;
  const targetXCoordinate = marginLeft + fieldWidth + distanceBetweenSourceAndTarget;

  const headerFontStyles = {
    font: headerFont,
    color: fontColor
  };

  canvas.fillText(header.source.toUpperCase(), sourceXCoordinate, textMarginTop, headerFontStyles);
  canvas.fillText(header.target.toUpperCase(), targetXCoordinate, textMarginTop, headerFontStyles);

  const drawnSourceFieldsIndexes = {};
  const drawnTargetFieldsIndexes = {};

  let sourceIndex = 0;
  let targetIndex = 0;

  const fieldStyles = {
    borderColor,
    font: fieldFont,
    fontColor
  };

  for (const mappingItem of mappings) {
    const isConstMapping = !mappingItem.source;
    if (isConstMapping) {
      continue;
    }

    const sourceFieldDrawn = drawnSourceFieldsIndexes.hasOwnProperty(mappingItem.source);
    const targetFieldDrawn = drawnTargetFieldsIndexes.hasOwnProperty(mappingItem.target);

    const sourceYCoordinate = fieldsMarginTop +
      (sourceFieldDrawn ? drawnSourceFieldsIndexes[mappingItem.source] : sourceIndex) * fieldHeight;
    const targetYCoordinate = fieldsMarginTop +
      (targetFieldDrawn ? drawnTargetFieldsIndexes[mappingItem.target] : targetIndex) * fieldHeight;

    if (!sourceFieldDrawn) {
      canvas.fillRectangle(sourceXCoordinate, sourceYCoordinate, fieldWidth, fieldHeight, {
        text: mappingItem.source,
        fillColor: sourceBlockColor,
        ...fieldStyles
      });

      drawnSourceFieldsIndexes[mappingItem.source] = sourceIndex++;
    }

    if (!targetFieldDrawn) {
      canvas.fillRectangle(targetXCoordinate, targetYCoordinate, fieldWidth, fieldHeight, {
        text: mappingItem.target,
        fillColor: targetBlockColor,
        ...fieldStyles
      });

      drawnTargetFieldsIndexes[mappingItem.target] = targetIndex++;
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
    base64: canvas.image(imageType)
  };

  canvas.destroy();

  return result;
}
