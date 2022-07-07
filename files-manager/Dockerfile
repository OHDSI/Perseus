FROM openjdk:17-alpine as build
WORKDIR /workspace/app
COPY src src
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN tr -d '\015' <./mvnw >./mvnw.sh && mv ./mvnw.sh ./mvnw && chmod 700 mvnw
RUN ./mvnw package

FROM openjdk:17-alpine

RUN apk update \
    && apk add --no-cache openssh-server \
    && ssh-keygen -A \
    && echo "root:Docker!" | chpasswd

COPY sshd_config /etc/ssh/

VOLUME /tmp

ARG JAR_FILE=/workspace/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar

COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 10500 2222

ENTRYPOINT ["./entrypoint.sh"]
