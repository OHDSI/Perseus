FROM node:14.5.0

ARG CDM_CONFIG=''

ARG CDM_PORT=4200

ENV CDM_CONFIG ${CDM_CONFIG}

ENV CDM_PORT ${CDM_PORT}

COPY . /app/UI

WORKDIR /app/UI

RUN npm install -g @angular/cli

RUN npm install

RUN npm install node-sass

CMD ng serve --c $CDM_CONFIG --port $CDM_PORT
