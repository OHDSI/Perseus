### STAGE 1: Build ###
FROM node:14.15.0 AS build-step
ARG env=prod
WORKDIR /usr/src/app
COPY package.json .
RUN npm install:${env}
COPY . .
RUN npm run build:${env}

### STAGE 2: Run ###
FROM nginx

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html
COPY sshd_config /etc/ssh/
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 4200 2222

CMD ["./entrypoint.sh"]
