export interface MappingPairImage {
  height: number;
  width: number;
  content: string;
}

export interface MappingPairImageStyles {
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
