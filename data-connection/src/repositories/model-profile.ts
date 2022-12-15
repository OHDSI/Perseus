import {juggler, Repository} from '@loopback/repository';
import {FrequencyDistribution, ModelProfile, PropertyProfile} from '../models';

interface ProfileRow {
  profileTime: string,
  catalog: string,
  database: string,
  table: string,
  rows: number,
  properties: {
    [index: string]: {
      distinctValues: number,
      frequencyDistribution: {
        bucketName: string,
        bucketCount: number,
      }[]
    }
  }
}
export class ModelProfileRepository implements Repository<ModelProfile> {
  constructor(private connector: juggler.DataSource) {}

  async findLatest(): Promise<ModelProfile[]> {
    const rows = await this.connector.execute(`
      SELECT * FROM ModelProfile
      WHERE profileTime = (SELECT max(profileTime) FROM ModelProfile)
    `);
    return rows.map((r: ProfileRow) => {
      return new ModelProfile({
        settings: {
          databricks: {
            catalog: r.catalog,
            database: r.database,
            table: r.table,
          }
        },
        rowCount: r.rows,
        propertyProfiles: Object.keys(r.properties).map(k => {
          return new PropertyProfile({
            databricks: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              col_name: k,
            },
            distinctValues: r.properties[k].distinctValues,
            frequencyDistribution: r.properties[k].frequencyDistribution.map(
              f => new FrequencyDistribution(f)
            )
          })
        })
      })
    })
  }
}
