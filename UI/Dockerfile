FROM node:14.5.0

COPY . /app/UI

WORKDIR /app/UI

RUN npm install -g @angular/cli

RUN npm install

RUN npm install node-sass

CMD ["ng", "serve"]
