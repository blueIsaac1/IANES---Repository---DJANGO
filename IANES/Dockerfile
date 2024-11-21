FROM python:3.11-slim

WORKDIR /app

COPY req.txt /app/

RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r req.txt

COPY . /app/

EXPOSE 8002

CMD ["/venv/bin/python", "manage.py", "runserver", "0.0.0.0:8002"]
