### STAGE 1: Build ###
FROM node:14.5.0 AS build-step
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
RUN npm install -g @angular/cli@~9.1.11
COPY . .
RUN ng build --prod

### STAGE 2: Run ###
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html
