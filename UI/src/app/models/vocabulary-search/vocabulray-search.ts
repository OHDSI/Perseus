import { Concept } from './concept';

export interface VocabSearchReqParams {
  pageSize: number;
  pageNumber: number;
  query?: string;
  sort?: string;
  order?: string;
  domain?: string[];
  standardConcept?: string[];
  conceptClass?: string[];
  vocabulary?: string[];
  invalidReason?: string[];
  updateFilters?: boolean;
}

export interface VocabSearchFilters {
  [key: string]: {
    [key: string]: number
  };
}

export interface VocabSearchResult {
  content: Concept[];
  facets?: VocabSearchFilters;
  totalElements: number;
  totalPages: number;
}

export enum VocabSearchMode {
  LOCAL = 'local',
  ATHENA = 'athena'
}
