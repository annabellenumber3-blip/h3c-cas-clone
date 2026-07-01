FROM python:3.11-slim

WORKDIR /app

# System deps for libvirt/qemu (mocked for container)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent code
COPY . .

# CVK agent runs as non-root
RUN useradd -m cvk && chown -R cvk:cvk /app
USER cvk

CMD ["python", "-m", "cvk_agent.main"]
