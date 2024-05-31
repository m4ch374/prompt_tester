FROM python:3.10

WORKDIR /app

COPY ./requirements.txt /app/backend/requirements.txt

RUN pip install -r /app/backend/requirements.txt

COPY . /app/backend

EXPOSE 8000

CMD ["fastapi", "run", "/app/backend/main.py", "--port", "8000"]
