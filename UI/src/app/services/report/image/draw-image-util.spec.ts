import { createMappingFieldsImage } from './draw-image-util';
import { MappingImageStyles } from './mapping-image';
import { Comment } from '@models/comment';

export const testMapping = [
  {
    source_field: 'patid',
    target_field: 'person_id',
    sql_field: 'patid',
    sql_alias: 'person_id',
    sqlTransformation: 'LOWER(\'value\')',
    comments: [
      new Comment('comment')
    ]
  },
  {
    source_field: 'deathdate',
    target_field: 'death_datetime',
    sql_field: 'deathdate',
    sql_alias: 'death_datetime',
    lookup: '',
    sqlTransformation: '',
    comments: []
  },
  {
    source_field: 'birth_date',
    target_field: 'birth_datetime',
    sql_field: 'birth_date',
    sql_alias: 'birth_datetime',
    lookup: '',
    sqlTransformation: '',
    comments: [
      new Comment('comment')
    ]
  },
  {
    source_field: 'birth_date',
    target_field: 'year_of_birth',
    sql_field: 'birth_date',
    sql_alias: 'year_of_birth',
    sqlTransformation: 'UPPER(\'value\')',
    comments: [
      new Comment('comment')
    ]
  },
  {
    source_field: 'gender',
    target_field: 'gender_source_concept_id',
    sql_field: 'gender',
    sql_alias: 'gender_source_concept_id',
    sqlTransformation: 'LOWER(\'value\')',
    lookup: 'nucc',
    comments: []
  },
  {
    source_field: '',
    sql_field: '1',
    sql_alias: 'gender_concept_id',
    target_field: 'gender_concept_id',
    comments: []
  }
];

export const testMappingPairStyles: MappingImageStyles = {
  width: 600,
  fieldWidth: 200,
  fieldHeight: 40,
  distanceBetweenSourceAndTarget: 186,
  marginLeft: 7,
  marginBottom: 4,
  textMarginTop: 14,
  fieldsMarginTop: 26,
  headerFont: '600 16px Akzidenz-Grotesk Pro',
  fieldFont: '500 16px Akzidenz-Grotesk Pro'
};

describe('createMappingFieldsImage', () => {
  it('should generate mapping-pair image', async () => {
    const mappingPairImage = createMappingFieldsImage({source: 'Source', target: 'CDMV6'}, testMapping, testMappingPairStyles);

    const image = await fetch(mappingPairImage.base64);
    const blob = await image.blob();

    // saveAs(blob, 'mapping-pair-image.png');
  });
});
