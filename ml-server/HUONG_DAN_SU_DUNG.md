# Hướng dẫn sử dụng ML Server

## ✅ Đã cài đặt thành công!

- ✅ Python 3.11.14
- ✅ PyTorch 2.2.2
- ✅ Tất cả dependencies cần thiết

## Cách sử dụng

### 1. Activate virtual environment và start server

```bash
cd /Users/admin/Documents/Personal/project-ky-9
source venv_ml/bin/activate
cd ml-server
python app.py
```

### 2. Hoặc sử dụng script tự động

```bash
cd /Users/admin/Documents/Personal/project-ky-9
./ml-server/start.sh
```

## Kiểm tra server

Sau khi start server, mở terminal khác và test:

```bash
# Health check
curl http://localhost:5001/health

# Test prediction (cần có image URL)
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/leaf-image.jpg"}'
```

## Lưu ý

- Server sẽ chạy tại `http://localhost:5001` (mặc định, để tránh conflict với backend port 5000)
- Đảm bảo file model `leaf_multitask_best.pth` có trong thư mục `ml-server/`
- Nếu muốn đổi port, set environment variable: `PORT=5002 python app.py`

## Cài đặt lại khi có requirements mới

Khi có thêm dependencies mới vào `requirements.txt`, bạn có thể cài đặt lại bằng một trong các cách sau:

### Cách 1: Sử dụng script install.sh (Khuyến nghị)

```bash
cd /Users/admin/Documents/Personal/project-ky-9/ml-server
source venv_ml/bin/activate  # Nếu chưa activate
./install.sh
```

### Cách 2: Cài đặt thủ công

```bash
cd /Users/admin/Documents/Personal/project-ky-9/ml-server
source venv_ml/bin/activate  # Nếu chưa activate

# Cài đặt PyTorch (nếu chưa có)
pip install torch torchvision

# Cài đặt tất cả dependencies từ requirements.txt
pip install -r requirements.txt
```

### Cách 3: Chỉ cài đặt dependencies mới

Nếu chỉ muốn cài đặt các package mới được thêm vào:

```bash
cd /Users/admin/Documents/Personal/project-ky-9/ml-server
source venv_ml/bin/activate

# Cài đặt các LangChain dependencies mới
pip install langchain-core>=0.1.0 langchain-google-genai>=1.0.0 langchain-neo4j>=0.0.1
```

### Cách 4: Upgrade tất cả dependencies

```bash
cd /Users/admin/Documents/Personal/project-ky-9/ml-server
source venv_ml/bin/activate
pip install --upgrade -r requirements.txt
```

## Troubleshooting

### Nếu gặp lỗi "Model not found"

- Kiểm tra file model có trong project root không
- Hoặc set `MODEL_PATH` environment variable: `MODEL_PATH=/path/to/model.pth python app.py`

### Nếu gặp lỗi import

- Đảm bảo đã activate virtual environment: `source venv_ml/bin/activate`
- Kiểm tra Python version: `python --version` (phải là 3.11.x)
- Cài đặt lại dependencies: `pip install -r requirements.txt`

### Nếu gặp lỗi với LangChain dependencies

```bash
# Cài đặt lại các LangChain packages
pip install --upgrade langchain-core langchain-google-genai langchain-neo4j
```
