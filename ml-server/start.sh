#!/bin/bash

# Script để start ML Server với virtual environment đúng

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
VENV_PATH="$PROJECT_ROOT/venv_ml"

# Kiểm tra venv có tồn tại không
if [ ! -d "$VENV_PATH" ]; then
    echo "❌ Virtual environment không tìm thấy tại: $VENV_PATH"
    echo "Hãy chạy: python3.11 -m venv venv_ml"
    exit 1
fi

# Activate venv
source "$VENV_PATH/bin/activate"

# Kiểm tra Python version
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
echo "✅ Using Python: $PYTHON_VERSION"

# Kiểm tra PyTorch
if python -c "import torch" 2>/dev/null; then
    TORCH_VERSION=$(python -c "import torch; print(torch.__version__)" 2>/dev/null)
    echo "✅ PyTorch version: $TORCH_VERSION"
else
    echo "❌ PyTorch chưa được cài đặt"
    echo "Hãy chạy: pip install torch torchvision"
    exit 1
fi

# Chuyển đến thư mục ml-server
cd "$SCRIPT_DIR"

# Start server
echo ""
echo "🚀 Starting ML Server..."
echo "📍 Server sẽ chạy tại: http://localhost:5001 (default, để tránh conflict với backend port 5000)"
echo ""

python app.py

