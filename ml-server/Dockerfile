# ML Server Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install PyTorch CPU version (lighter than GPU version)
# Note: For GPU support, install from pytorch.org with CUDA
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install other Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install gdown for downloading from Google Drive
RUN pip install --no-cache-dir gdown

# Copy application code
COPY . .

# Create directory for model if needed
RUN mkdir -p /app/models

# Download model from Google Drive if DRIVE_FILE_ID is provided (optional)
# This can be overridden at build time: docker build --build-arg DRIVE_FILE_ID=xxx
ARG DRIVE_FILE_ID=""
RUN if [ -n "$DRIVE_FILE_ID" ]; then \
        echo "Downloading model from Google Drive (File ID: $DRIVE_FILE_ID)..." && \
        gdown "https://drive.google.com/uc?id=${DRIVE_FILE_ID}" -O /app/leaf_multitask_best.pth && \
        echo "Model downloaded successfully"; \
    else \
        echo "No DRIVE_FILE_ID provided, skipping model download. Please mount model file or download manually."; \
    fi

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

# Start server
CMD ["python", "app.py"]

