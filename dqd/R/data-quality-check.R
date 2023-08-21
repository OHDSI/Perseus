library(DatabaseConnector)
library(SqlRender)
library(magrittr)

dataQualityCheck <- function(cdm_dataType,
                             cdm_server,
                             cdm_port,
                             cdm_dataBaseSchema,
                             cdm_user,
                             cdm_password,
                             scanId,
                             threadCount,
                             cdmSourceName,
                             dqd_dataType,
                             dqd_server,
                             dqd_port,
                             dqd_dataBaseSchema,
                             dqd_user,
                             dqd_password,
                             username,
                             httppath) {
  print("Starting Data Quality Check process..")

  Sys.setenv('DATABASECONNECTOR_JAR_FOLDER' = '~/jdbcDrivers')

  if (cdm_dataType == "databricks") {
    connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = "spark",
                                                                    connectionString = sprintf("jdbc:spark://%s:%s/default;transportMode=http;ssl=1;httpPath=%s;AuthMech=3;UseNativeQuery=1;", cdm_server, cdm_port, httppath),
                                                                    user = "token",
                                                                    password = cdm_password)
  }
  else if (cdm_dataType == "azure") {
    cdm_dataType <- "sql server"

    parsed_database <- strsplit(cdm_dataBaseSchema, ".", fixed = TRUE)[[1]][1]

    cdm_dataBaseSchema <- strsplit(cdm_dataBaseSchema, ".", fixed = TRUE)[[1]][2]

    connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = cdm_dataType,
                                                                    connectionString = sprintf("jdbc:sqlserver://%s:%s;database=%s;user=%s@%s;password=%s;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", cdm_server, cdm_port, parsed_database, cdm_user, parsed_database, cdm_password),
                                                                    user = cdm_user,
                                                                    password = cdm_password
    )


  }
  else {
    connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = cdm_dataType,
                                                                    user = cdm_user,
                                                                    password = cdm_password,
                                                                    server = cdm_server,
                                                                    port = cdm_port,
                                                                    extraSettings = "")
  }
  resultsDatabaseSchema <- "" # the fully qualified database schema name of the results schema (that you can write to)

  # determine how many threads (concurrent SQL sessions) to use ----------------------------------------
  numThreads <- threadCount # on Redshift, 3 seems to work well

  # specify if you want to execute the queries or inspect them ------------------------------------------
  sqlOnly <- FALSE # set to TRUE if you just want to get the SQL scripts and not actually run the queries

  # where should the logs go? -------------------------------------------------------------------------
  outputFolder <- file.path("output", username)

  # logging type -------------------------------------------------------------------------------------
  verboseMode <- FALSE # set to TRUE if you want to see activity written to the console

  # write results to table? ------------------------------------------------------------------------------
  writeToTable <- FALSE # set to FALSE if you want to skip writing to a SQL table in the results schema

  # which DQ check levels to run -------------------------------------------------------------------
  checkLevels <- c("TABLE", "FIELD", "CONCEPT")

  # which DQ checks to run? ------------------------------------
  checkNames <- c() # Names can be found in inst/csv/OMOP_CDM_v5.3.1_Check_Desciptions.csv

  print("Execution started")
  result <- executeDqChecks(connectionDetails = connectionDetails,
                            cdmDatabaseSchema = cdm_dataBaseSchema,
                            resultsDatabaseSchema = resultsDatabaseSchema,
                            cdmSourceName = cdmSourceName,
                            numThreads = numThreads,
                            sqlOnly = sqlOnly,
                            outputFolder = outputFolder,
                            verboseMode = verboseMode,
                            writeToTable = writeToTable,
                            checkLevels = checkLevels,
                            cdmVersion = "5.3",
                            checkNames = checkNames)
  jsonResult <- jsonlite::toJSON(result)
  print("Data Quality Check process finished!")

  print(jsonResult)
  print("end of json")

  return(jsonResult)
}
