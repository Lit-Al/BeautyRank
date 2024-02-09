# Используйте официальный образ Python
FROM python:3.9-alpine

# Установите рабочую директорию внутри контейнера
WORKDIR /app

# Установите зависимости PostgreSQL для Python
RUN apk add --no-cache postgresql-libs

# Установите зависимости для компиляции пакетов Python
RUN apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev

# Скопируйте зависимости и файлы проекта в контейнер
COPY requirements.txt ./
COPY . .

# Установите зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Установите команду запуска приложения
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]