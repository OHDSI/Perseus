### STAGE 1: Build ###
FROM node:14.15.0 AS build-step
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
RUN npm install -g @angular/cli@~12.1.0
COPY . .
RUN ng build --prod

### STAGE 2: Run ###
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html

### Env variables ###
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
