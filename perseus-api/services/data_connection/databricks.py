from databricks import sql


def test_connection(server_hostname, http_path, access_token):
  connection = sql.connect(
                          server_hostname = "adb-5203783447951236.16.azuredatabricks.net",
                          http_path = "/sql/1.0/warehouses/46ad57eecd726b7e",
                          access_token = access_token)

  cursor = connection.cursor()

  cursor.execute("SELECT * from range(10)")
  print(cursor.fetchall())

  cursor.close()
  connection.close()

  return {
    'canConnect': True,
    'tablesToScan': [
      {
        'tableName': 'foo',
        'selected': True,
      }
    ]
  }