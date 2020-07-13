FROM python:3.6

COPY ./cdm_souffleur /app/cdm_souffleur

COPY ./requirements.txt /app/cdm_souffleur

WORKDIR /app/cdm_souffleur

ENV PYTHONPATH=/app

RUN pip install -r requirements.txt

RUN mkdir /app/cdm_souffleur/model/generate

RUN mkdir /app/cdm_souffleur/model/generate/Definitions

CMD ["python", "rest_api.py"]