FROM --platform=linux/amd64 node:14.20.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

RUN npm install -g @angular/cli

COPY nginx.conf /etc/nginx/nginx.conf
# COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html
COPY sshd_config /etc/ssh/
COPY entrypoint.sh entrypoint.sh
# RUN chmod +x entrypoint.sh

EXPOSE 4200 2222

# CMD ["./entrypoint.sh"]
