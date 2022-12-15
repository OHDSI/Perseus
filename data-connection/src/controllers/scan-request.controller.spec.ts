import {Client, expect} from '@loopback/testlab';
import {concatMap, delay, EMPTY, expand, filter, from, map, Observable} from 'rxjs';
import {DataConnectionApplication} from '../application';
import {ScanRequestLog} from '../models';
import {MockDataSource} from '../test/mock-data-source';
import {setupApplication} from '../test/setup-application';

describe('ScanRequestController', () => {
  let app: DataConnectionApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  const pollLogs = (id: number): Observable<ScanRequestLog> => {
    const logPath = `/scan-requests/${id}/scan-request-logs`
    return from(client.get(logPath).expect(200)).pipe(
      map((r) => ({response: r, skip: 0})),
      expand((p) => {
        const l = p.response.body
        if (l[l.length - 1]?.status === 'complete') {
          return EMPTY
        } else {
          return from(client.get(logPath)
            .send({filter: {skip: p.skip}})
            .expect(200)
          ).pipe(
            map((r) => ({response: r, skip: p.skip + l.length})),
            delay(1000)
          )
        }
      }),
      concatMap((p) => {return p.response.body as Observable<ScanRequestLog>}),
      filter((l) => l.status !== 'complete')
    )
  }

  it('logs a model definition scan', (done) => {
    const modelDefinition = {
      name: 'customer',
      properties: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        c_custkey: {
          type: 'Number',
          databricks: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            col_name: 'c_custkey',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            data_type: 'bigint',
            comment: null,
          },
        },
      },
      settings: {
        databricks: {
          catalog: 'samples',
          database: 'tpch',
          tableName: 'customer',
          isTemporary: false,
        },
      },
      relations: {},
    };
    const ds = new MockDataSource({modelDefinitions: [modelDefinition]});
    app.bind('datasources.mock').to(ds)
    const newScanRequest = {
      dataSourceConfig: {
        connector: "mock",
      }
    }
    client.post('/scan-requests')
      .send(newScanRequest)
      .then((scanRes) => {
        expect(scanRes.statusCode).to.be.equal(200)
        expect(scanRes.body).have.key('id')
        let logsCreated = false
        pollLogs(scanRes.body.id).subscribe({
          next: l => {logsCreated = true; expect(l).have.key('modelDefinition') },
          complete: () => { expect(logsCreated).to.be.true(); done() },
          error: console.error
        })
      }).catch(console.error)
  });

  it('logs a model profile scan', (done) => {
    const executeResults = [{
      profileTime: '2022-12-13T22:45:21.244+0000',
      catalog: 'samples',
      database: 'nyctaxi',
      table: 'trips',
      rows: 21932,
      properties: {"tpep_dropoff_datetime": {"distinctValues": 20785, "frequencyDistribution": [{"bucketName": "2016-02-14 18:25:41", "bucketCount": 2}, {"bucketName": "2016-01-09 01:30:42", "bucketCount": 2}, {"bucketName": "2016-01-27 18:29:33", "bucketCount": 2}, {"bucketName": "2016-02-26 17:59:36", "bucketCount": 2}, {"bucketName": "2016-01-15 09:00:34", "bucketCount": 2}, {"bucketName": "2016-01-15 13:42:05", "bucketCount": 2}, {"bucketName": "2016-01-15 20:27:30", "bucketCount": 2}, {"bucketName": "2016-01-13 18:18:49", "bucketCount": 2}, {"bucketName": "2016-02-05 22:16:28", "bucketCount": 2}, {"bucketName": "2016-02-23 09:52:15", "bucketCount": 2}]}, "trip_distance": {"distinctValues": 1493, "frequencyDistribution": [{"bucketName": "0.9", "bucketCount": 540}, {"bucketName": "0.7", "bucketCount": 535}, {"bucketName": "0.8", "bucketCount": 509}, {"bucketName": "1.1", "bucketCount": 487}, {"bucketName": "1.0", "bucketCount": 482}, {"bucketName": "1.2", "bucketCount": 454}, {"bucketName": "0.6", "bucketCount": 409}, {"bucketName": "1.3", "bucketCount": 393}, {"bucketName": "1.5", "bucketCount": 377}, {"bucketName": "1.4", "bucketCount": 370}]}, "pickup_zip": {"distinctValues": 120, "frequencyDistribution": [{"bucketName": "10001", "bucketCount": 1227}, {"bucketName": "10003", "bucketCount": 1181}, {"bucketName": "10011", "bucketCount": 1129}, {"bucketName": "10021", "bucketCount": 1021}, {"bucketName": "10018", "bucketCount": 1012}, {"bucketName": "10023", "bucketCount": 1008}, {"bucketName": "10028", "bucketCount": 929}, {"bucketName": "10012", "bucketCount": 834}, {"bucketName": "10110", "bucketCount": 763}, {"bucketName": "10065", "bucketCount": 702}]}, "fare_amount": {"distinctValues": 161, "frequencyDistribution": [{"bucketName": "5.5", "bucketCount": 1139}, {"bucketName": "6.5", "bucketCount": 1113}, {"bucketName": "6.0", "bucketCount": 1091}, {"bucketName": "7.0", "bucketCount": 1076}, {"bucketName": "5.0", "bucketCount": 1046}, {"bucketName": "7.5", "bucketCount": 1022}, {"bucketName": "8.0", "bucketCount": 964}, {"bucketName": "8.5", "bucketCount": 922}, {"bucketName": "4.5", "bucketCount": 870}, {"bucketName": "9.0", "bucketCount": 833}]}, "tpep_pickup_datetime": {"distinctValues": 21367, "frequencyDistribution": [{"bucketName": "2016-01-05 20:14:43", "bucketCount": 3}, {"bucketName": "2016-01-21 19:27:11", "bucketCount": 2}, {"bucketName": "2016-02-23 22:01:37", "bucketCount": 2}, {"bucketName": "2016-01-09 19:05:34", "bucketCount": 2}, {"bucketName": "2016-02-14 01:23:09", "bucketCount": 2}, {"bucketName": "2016-01-09 21:02:46", "bucketCount": 2}, {"bucketName": "2016-01-11 19:49:03", "bucketCount": 2}, {"bucketName": "2016-02-03 17:21:02", "bucketCount": 2}, {"bucketName": "2016-02-14 19:20:56", "bucketCount": 2}, {"bucketName": "2016-02-18 22:58:45", "bucketCount": 2}]}, "dropoff_zip": {"distinctValues": 193, "frequencyDistribution": [{"bucketName": "10001", "bucketCount": 1069}, {"bucketName": "10021", "bucketCount": 1049}, {"bucketName": "10011", "bucketCount": 940}, {"bucketName": "10028", "bucketCount": 930}, {"bucketName": "10003", "bucketCount": 930}, {"bucketName": "10023", "bucketCount": 855}, {"bucketName": "10018", "bucketCount": 828}, {"bucketName": "10110", "bucketCount": 774}, {"bucketName": "10012", "bucketCount": 769}, {"bucketName": "10009", "bucketCount": 753}]}}
    }]
    const ds = new MockDataSource({executeResults});
    app.bind('datasources.mock').to(ds)
    const newScanRequest = {
      dataSourceConfig: {
        connector: "mock",
      },
      scanParameters: {
        profile: true
      }
    }
    client.post('/scan-requests')
      .send(newScanRequest)
      .then((scanRes) => {
        expect(scanRes.statusCode).to.be.equal(200)
        expect(scanRes.body).have.key('id')
        let logsCreated = false
        pollLogs(scanRes.body.id).subscribe({
          next: l => {logsCreated = true; expect(l).have.key('modelProfile') },
          complete: () => { expect(logsCreated).to.be.true(); done() },
          error: console.error
        })
      }).catch(console.error)
  });
});
