FROM python:3.12-slim
WORKDIR /app
COPY server/ server/
COPY static/ static/
EXPOSE 8000
CMD ["python", "server/app.py"]
