testConnection <- function(dataType, server, port, dataBaseSchema, user, password, httpPath) {
  Sys.setenv('DATABASECONNECTOR_JAR_FOLDER' = '~/jdbcDrivers')

  if (dataType == "databricks") {
    connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = "spark",
                                                                    connectionString = sprintf("jdbc:spark://%s:%s/default;transportMode=http;ssl=1;httpPath=%s;AuthMech=3;UseNativeQuery=1;", server, port, httpPath),
                                                                    user = "token",
                                                                    password = password)
  }
  else if (dataType == "azure") {
    dataType <- "sql server"
    parsed_database <- strsplit(dataBaseSchema, ".", fixed = TRUE)[[1]][1]
    connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = dataType,
                                                                    connectionString = sprintf("jdbc:sqlserver://%s:%s;database=%s;user=%s@%s;password=%s;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", server, port, parsed_database, user, parsed_database, password),
                                                                    user = user,
                                                                    password = password
    )
  }
  else {
    connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = dataType,
                                                                    user = user,
                                                                    password = password,
                                                                    server = server,
                                                                    port = port,
                                                                    extraSettings = "")
  }
  print("Testing connection to CDM database...")
  connection <- DatabaseConnector::connect(connectionDetails = connectionDetails)
  DatabaseConnector::disconnect(connection)
  print("Test connection successfully completed")
}