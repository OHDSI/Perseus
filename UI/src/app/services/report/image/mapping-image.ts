export interface MappingImage {
  height: number;
  width: number;
  base64: string;
}

export interface MappingForImage {
  source: string;
  target: string;
}

export interface MappingImageStyles {
  width: number;

  fieldWidth: number;
  fieldHeight: number;
  distanceBetweenSourceAndTarget: number;

  marginLeft: number;
  marginBottom: number;
  textMarginTop: number;
  fieldsMarginTop: number;

  headerFont: string;
  fieldFont: string;
}
