### STAGE 1: Build ###
FROM node:14.15.0 AS build-step
ARG env=prod
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build:${env}

### STAGE 2: Run ###
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html

EXPOSE 4200

CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
