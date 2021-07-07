export interface TypeConcept {
  sourceFieldName: string;
  visitTypeIP: 'IP';
  valueIP: string;
  visitTypeOP: 'OP';
  valueOP: string;
  visitTypeER: 'ER';
  valueER: string;
}

export type VisitType = 'IP|OP|ER';
