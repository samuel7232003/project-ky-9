# Quick Start Guide - ML Server

## Vấn đề: Python 3.13 không tương thích với PyTorch

Nếu bạn gặp lỗi khi cài PyTorch, có thể do bạn đang dùng Python 3.13 (PyTorch chỉ hỗ trợ Python 3.8-3.12).

## Giải pháp

### Option 1: Cài đặt Python 3.11 hoặc 3.12 qua Homebrew (Khuyến nghị)

```bash
# Cài đặt Python 3.11
brew install python@3.11

# Tạo virtual environment mới với Python 3.11
python3.11 -m venv venv_ml

# Activate venv
source venv_ml/bin/activate

# Cài đặt dependencies
cd ml-server
pip install torch torchvision
pip install -r requirements.txt
```

### Option 2: Sử dụng pyenv

```bash
# Cài đặt pyenv (nếu chưa có)
brew install pyenv

# Cài đặt Python 3.11
pyenv install 3.11.9

# Set local Python version
cd ml-server
pyenv local 3.11.9

# Tạo venv
python -m venv venv
source venv/bin/activate

# Cài đặt dependencies
pip install torch torchvision
pip install -r requirements.txt
```

### Option 3: Sử dụng Conda

```bash
# Tạo conda environment với Python 3.11
conda create -n ml-server python=3.11
conda activate ml-server

# Cài đặt PyTorch qua conda (dễ hơn)
conda install pytorch torchvision -c pytorch

# Cài đặt dependencies khác
cd ml-server
pip install -r requirements.txt
```

## Sau khi setup xong

```bash
# Start ML server
cd ml-server
python app.py
```

Server sẽ chạy tại `http://localhost:5000`

## Kiểm tra

```bash
# Test health endpoint
curl http://localhost:5000/health
```

