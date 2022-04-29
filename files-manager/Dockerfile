FROM openjdk:17-oracle as build
WORKDIR /workspace/app
COPY src src
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN tr -d '\015' <./mvnw >./mvnw.sh && mv ./mvnw.sh ./mvnw && chmod 700 mvnw
RUN ./mvnw package

FROM openjdk:17-oracle
VOLUME /tmp

ARG JAR_FILE=/workspace/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar
EXPOSE 10500
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app.jar ${0} ${@}"]
