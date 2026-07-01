FROM python:3.11-slim

WORKDIR /app

# System deps for SSH/SCP
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent code
COPY . .

# CVK agent runs as non-root in container
RUN useradd -m cvk && chown -R cvk:cvk /app
USER cvk

# Default: run in mock mode for containerized testing
CMD ["python", "-m", "cvk_agent", "--mock", "--status"]
