#!/bin/bash

# Script để cài đặt dependencies cho ML Server

echo "Installing PyTorch and torchvision..."
pip install torch torchvision

echo "Installing other dependencies..."
pip install -r requirements.txt

echo "Installation complete!"
echo ""
echo "To start the server, run:"
echo "  python app.py"

