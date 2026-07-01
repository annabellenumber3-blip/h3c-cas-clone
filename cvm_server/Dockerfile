FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create log directory
RUN mkdir -p /var/log/casserver

EXPOSE 8080 8443

# Start with uvicorn
CMD ["python", "-m", "uvicorn", "cvm_server.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
