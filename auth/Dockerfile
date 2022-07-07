FROM openjdk:17 as build
WORKDIR /workspace/app

COPY src src
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN tr -d '\015' <./mvnw >./mvnw.sh && mv ./mvnw.sh ./mvnw && chmod 770 mvnw

RUN ./mvnw package

FROM openjdk:17

VOLUME /tmp

ARG JAR_FILE=/workspace/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar

EXPOSE 8002

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app.jar ${0} ${@}"]
