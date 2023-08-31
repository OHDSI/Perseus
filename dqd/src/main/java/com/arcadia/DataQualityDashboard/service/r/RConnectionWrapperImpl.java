package com.arcadia.DataQualityDashboard.service.r;

import com.arcadia.DataQualityDashboard.config.DqdDatabaseProperties;
import com.arcadia.DataQualityDashboard.model.DataQualityLog;
import com.arcadia.DataQualityDashboard.model.DataQualityScan;
import com.arcadia.DataQualityDashboard.model.DbSettings;
import com.arcadia.DataQualityDashboard.repository.DataQualityLogRepository;
import com.arcadia.DataQualityDashboard.service.ProcessHolder;
import com.arcadia.DataQualityDashboard.service.error.RException;
import com.arcadia.DataQualityDashboard.service.response.TestConnectionResultResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.rosuda.REngine.REXP;
import org.rosuda.REngine.Rserve.RConnection;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.Timestamp;
import java.util.List;

import static com.arcadia.DataQualityDashboard.util.DbTypeAdapter.adaptDataBaseSchema;
import static com.arcadia.DataQualityDashboard.util.DbTypeAdapter.adaptDbType;
import static com.arcadia.DataQualityDashboard.util.DbTypeAdapter.adaptServer;
import static java.lang.String.format;

@RequiredArgsConstructor
@Slf4j
public class RConnectionWrapperImpl implements RConnectionWrapper {
    private static final int DEFAULT_THREAD_COUNT = 1;
    private static final int TOTAL_STEPS = 24;

    private final RConnection rConnection;

    @Getter
    private final boolean isUnix;

    private final DqdDatabaseProperties dqdDatabaseProperties;

    private final DataQualityLogRepository dataQualityLogRepository;

    private final ProcessHolder processHolder;

    private final List<String> logs = List.of("CDM Tables skipped:", "Execution Complete", "] [Check: ", "Processing check description:", "Execution started");

    @Override
    @SneakyThrows
    public void loadScript(String path) {
        String cmd = format("source('%s')", path);
        REXP runResponse = rConnection.parseAndEval(toTryCmd(cmd));
        if (runResponse.inherits("try-error")) {
            throw new RException(runResponse.asString());
        }
    }

    @Override
    @SneakyThrows
    public void loadScripts(List<String> scriptsPaths) {
        String cmdStringr = "library('stringr')";
        rConnection.parseAndEval(toTryCmd(cmdStringr));
        String cmdReadr = "library('readr')";
        rConnection.parseAndEval(toTryCmd(cmdReadr));
        String cmdDataQualityDashboard = "library('DataQualityDashboard')";
        rConnection.parseAndEval(toTryCmd(cmdDataQualityDashboard));

        for (String path : scriptsPaths) {
            loadScript(path);
        }
    }

    @SneakyThrows
    @Override
    public TestConnectionResultResponse testConnection(DbSettings dbSettings) {
        String dbType = adaptDbType(dbSettings.getDbType());
        String server = adaptServer(dbType, dbSettings.getServer(), dbSettings.getDatabase());
        String schema = adaptDataBaseSchema(dbSettings.getDatabase(), dbSettings.getSchema());
        String dqdCmd = format("testConnection(\"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\")", dbType, server, dbSettings.getPort(), schema, dbSettings.getUser(), dbSettings.getPassword(), dbSettings.getHttppath());
        REXP runResponse = rConnection.parseAndEval(toTryCmd(dqdCmd));
        if (runResponse.inherits("try-error")) {
            return TestConnectionResultResponse.builder().canConnect(false).message(runResponse.asString()).build();
        }
        return TestConnectionResultResponse.builder().canConnect(true).build();
    }

    @Override
    public String checkDataQuality(DataQualityScan scan) {
        return checkDataQuality(scan, DEFAULT_THREAD_COUNT);
    }

    @Override
    @SneakyThrows
    public String checkDataQuality(DataQualityScan scan, int threadCount) {
        DbSettings dbSettings = scan.getDbSettings();
        String cdmDbType = adaptDbType(dbSettings.getDbType());
        String cdmServer = adaptServer(cdmDbType, dbSettings.getServer(), dbSettings.getDatabase());
        String cdmSchema = adaptDataBaseSchema(dbSettings.getDatabase(), dbSettings.getSchema());

        String dqdServer = adaptServer(dqdDatabaseProperties.getDbms(), dqdDatabaseProperties.getServer(), dqdDatabaseProperties.getDatabase());

        ProcessBuilder processBuilder = new ProcessBuilder();
//        processBuilder.command("docker", "exec", "r-serve", "Rscript", "root/R/start-dqd-check.R", cdmDbType, cdmServer, String.valueOf(scan.getDbSettings().getPort()), cdmSchema, scan.getDbSettings().getUser(), scan.getDbSettings().getPassword(), String.valueOf(scan.getId()), String.valueOf(threadCount), scan.getProject(), dqdDatabaseProperties.getDbms(), dqdServer, String.valueOf(dqdDatabaseProperties.getPort()), dqdDatabaseProperties.getSchema(), dqdDatabaseProperties.getUser(), dqdDatabaseProperties.getPassword(), scan.getUsername(), dbSettings.getHttppath() != null ? dbSettings.getHttppath() : "null");
        processBuilder.command("Rscript", "root/R/start-dqd-check.R", cdmDbType, cdmServer, String.valueOf(scan.getDbSettings().getPort()), cdmSchema, scan.getDbSettings().getUser(), scan.getDbSettings().getPassword(), String.valueOf(scan.getId()), String.valueOf(threadCount), scan.getProject(), dqdDatabaseProperties.getDbms(), dqdServer, String.valueOf(dqdDatabaseProperties.getPort()), dqdDatabaseProperties.getSchema(), dqdDatabaseProperties.getUser(), dqdDatabaseProperties.getPassword(), scan.getUsername(), dbSettings.getHttppath() != null ? dbSettings.getHttppath() : "null");

        processBuilder.redirectErrorStream(true);
        StringBuilder runResponse = new StringBuilder();

        try {
            Process process = processBuilder.start();
            processHolder.addProcess(scan.getId(), process);
            int stepsFinished = 0;
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;

            boolean recordJson = false;
            while ((line = reader.readLine()) != null) {
                if (!recordJson && isSubstringPresent(line, logs)) {
                    stepsFinished++;

                    int percent = Math.min(stepsFinished * 100 / TOTAL_STEPS, 90);

                    DataQualityLog dataQualityLog = new DataQualityLog();
                    dataQualityLog.setDataQualityScan(scan);
                    dataQualityLog.setMessage(line);
                    dataQualityLog.setTime(new Timestamp(System.currentTimeMillis()));
                    dataQualityLog.setPercent(percent);
                    dataQualityLog.setStatusCode(1);
                    dataQualityLog.setStatusName("INFO");

                    dataQualityLogRepository.save(dataQualityLog);
                }

                if (line.contains("end of json")) {
                    recordJson = false;
                }

                if (recordJson) {
                    runResponse.append(line);
                }

                if (line.contains("Data Quality Check process finished!")) {
                    recordJson = true;
                }
            }

            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return runResponse.toString();
    }

    @Deprecated
    @SneakyThrows
    public Integer getRServerPid() {
        String cmd = "Sys.getpid()";
        return rConnection.eval(cmd).asInteger();
    }

    @Deprecated
    @SneakyThrows
    public void abort(int pid) {
        rConnection.eval("tools::pskill(" + pid + ")");
        rConnection.eval("tools::pskill(" + pid + ", tools::SIGKILL)");

        this.close();
    }

    @Override
    @SneakyThrows
    public void close() {
        if (isUnix) {
            this.rConnection.close();
        } else {
            this.rConnection.shutdown();
        }
    }

    private String toTryCmd(String cmd) {
        return "try(eval(" + cmd + "),silent=TRUE)";
    }

    private boolean isSubstringPresent(String string, List<String> substrings) {
        return !string.toLowerCase().contains("error") && substrings.stream().anyMatch(string::contains);
    }
}
