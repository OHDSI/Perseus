# 1st Build Step
FROM openjdk:17 as build

WORKDIR /workspace/app

# Source
COPY src src
COPY inst/shinyApps/www/css src/main/resources/static/css
COPY inst/shinyApps/www/htmlwidgets src/main/resources/static/htmlwidgets
COPY inst/shinyApps/www/img src/main/resources/static/img
COPY inst/shinyApps/www/js src/main/resources/static/js
COPY inst/shinyApps/www/vendor src/main/resources/static/vendor
COPY inst/shinyApps/www/favicon.ico src/main/resources/static/favicon.ico
COPY inst/shinyApps/www/index.html src/main/resources/static/index.html

# Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw && ./mvnw package

# 2nd Run Step
FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y openjdk-17-jdk openssh-server r-base \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY sshd_config /etc/ssh/

VOLUME /tmp

ARG JAR_FILE=/workspace/app/target/*.jar
COPY --from=build /workspace/app/target/*.jar app.jar


# asd
RUN apt-get update \
    && apt-get install -y apt-utils
RUN apt-get update \
    && apt-get install -y default-jdk
RUN apt-get update \
    && apt-get install -y libxml2-dev

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/OHDSI/DataQualityDashboard.git \
    && mv DataQualityDashboard/R root/R \
    && rm -rf DataQualityDashboard

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY sshd_config /etc/ssh/

VOLUME /rserve

WORKDIR .

COPY R/dqd-database-manager.R root/R/dqd-database-manager.R
COPY R/data-quality-check.R root/R/data-quality-check.R
COPY R/download-jdbc-drivers.R root/R/download-jdbc-drivers.R
COPY R/log-appender.R root/R/log-appender.R
COPY R/test-connection.R root/R/test-connection.R
COPY R/start-dqd-check.R root/R/start-dqd-check.R

# Enable tls 1.0, 1.1
COPY R/java-secure java-secure
RUN tr -d '\015' <./java-secure >./java-secure.tmp && mv ./java-secure.tmp ./java-secure && chmod 700 ./java-secure
RUN ./java-secure

COPY R/entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

RUN R -e "install.packages('SqlRender')"
RUN R -e "install.packages('ParallelLogger')"
RUN R -e "install.packages('stringr')"
RUN R -e "install.packages('devtools')"
RUN R -e "remotes::install_github('OHDSI/DatabaseConnector')"
RUN R -e "remotes::install_github('https://github.com/OHDSI/DataQualityDashboard/R')"
RUN R -e "remotes::install_github('OHDSI/DataQualityDashboard')"
RUN R -e "install.packages('Rserve',, 'http://rforge.net/', type='source')"
RUN R -e "install.packages('magrittr')"

EXPOSE 6311 2222 8001

ENTRYPOINT ["sh", "-c", "./entrypoint.sh& java ${JAVA_OPTS} -jar /app.jar ${0} ${@}"]
