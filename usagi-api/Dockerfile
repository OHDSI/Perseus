FROM python:3.7
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY sshd_config /etc/ssh/

EXPOSE 5002
EXPOSE 2222

ENTRYPOINT ["python", "/app/main.py"]