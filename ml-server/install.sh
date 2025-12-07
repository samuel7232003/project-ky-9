#!/bin/bash

# Script để cài đặt dependencies cho ML Server

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VENV_PATH="$SCRIPT_DIR/venv_ml"

# Kiểm tra và activate virtual environment nếu có
if [ -d "$VENV_PATH" ]; then
    echo "✅ Tìm thấy virtual environment, đang activate..."
    source "$VENV_PATH/bin/activate"
else
    echo "⚠️  Virtual environment không tìm thấy, cài đặt vào global Python"
    echo "   (Khuyến nghị: tạo venv trước: python3.11 -m venv venv_ml)"
fi

echo ""
echo "📦 Installing PyTorch and torchvision..."
pip install torch torchvision

echo ""
echo "📦 Installing other dependencies from requirements.txt..."
pip install -r requirements.txt

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Đã cài đặt các dependencies mới:"
echo "   - langchain-core"
echo "   - langchain-google-genai"
echo "   - langchain-neo4j"
echo ""
echo "🚀 To start the server, run:"
echo "   python app.py"
echo "   hoặc: ./start.sh"

