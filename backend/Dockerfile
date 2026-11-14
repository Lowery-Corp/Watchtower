# syntax=docker/dockerfile:1.7

FROM python:3.12-slim

WORKDIR /app

# Prevent Python from writing pyc files and force logs to flush
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy dependency metadata separately so application-only changes reuse this
# expensive layer. BuildKit keeps downloaded wheels between builds.
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install --prefer-binary -r requirements.txt

# Copy the app code
COPY . .

# Expose API port
EXPOSE 8000

# Default command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
