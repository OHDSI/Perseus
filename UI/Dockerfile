### STAGE 1: Build ###
FROM node:14.15.0 AS build-step
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build:prod

### STAGE 2: Run ###
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html
EXPOSE 4200

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
