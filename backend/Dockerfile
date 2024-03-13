FROM python:3.12

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt /backend/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . /backend



