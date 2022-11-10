FROM --platform=linux/amd64 solr:8.8.1

USER root

COPY athena /opt/solr/server/solr/configsets/athena
COPY usagi /opt/solr/server/solr/configsets/usagi
COPY postgresql-42.2.19.jar /opt/solr/dist/postgresql-42.2.19.jar

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY sshd_config /etc/ssh/
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 8983 2222

ENTRYPOINT ["./entrypoint.sh"]