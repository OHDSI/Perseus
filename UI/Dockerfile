### STAGE 1: Build ###
FROM node:14.5.0 AS build-step
ARG env='prod'
ENV env ${env}
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN ng build $env

### STAGE 2: Run ###

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist/report-config /usr/share/nginx/html
