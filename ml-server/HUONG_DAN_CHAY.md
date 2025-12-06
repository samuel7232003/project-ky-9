# Hướng dẫn chạy ML Server với Knowledge Graph

## Bước 1: Chuẩn bị môi trường

### 1.1. Kiểm tra Python version
```bash
python --version
# Hoặc
python3 --version
```

**Yêu cầu:** Python 3.8 - 3.12 (PyTorch chưa hỗ trợ Python 3.13+)

Nếu bạn đang dùng Python 3.13, tạo virtual environment mới:
```bash
# macOS/Linux
python3.11 -m venv venv_ml
# hoặc
python3.12 -m venv venv_ml

# Activate venv
source venv_ml/bin/activate

# Windows
python3.11 -m venv venv_ml
venv_ml\Scripts\activate
```

### 1.2. Activate virtual environment (nếu có)
```bash
# macOS/Linux
source venv_ml/bin/activate

# Windows
venv_ml\Scripts\activate
```

## Bước 2: Cài đặt dependencies

### 2.1. Cài đặt PyTorch và torchvision

**Cho macOS (CPU hoặc MPS):**
```bash
pip install torch torchvision
```

**Cho Linux/Windows với CUDA:**
```bash
# Xem https://pytorch.org/ để chọn command phù hợp với CUDA version
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### 2.2. Cài đặt các dependencies khác
```bash
cd ml-server
pip install -r requirements.txt
```

Hoặc sử dụng script có sẵn:
```bash
bash install.sh
```

## Bước 3: Cấu hình Environment Variables

### 3.1. Tạo file .env
```bash
cd ml-server
cp env.example .env
```

### 3.2. Chỉnh sửa file .env
Mở file `.env` và điền thông tin:

```bash
# Model Configuration
MODEL_PATH=leaf_multitask_best.pth
PORT=5001
DEBUG=False

# Neo4j Knowledge Graph Configuration
NEO4J_URI=neo4j+s://f3d83d5c.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password_here

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

**Lưu ý:** 
- Thay `your_neo4j_password_here` bằng password thực tế của Neo4j
- Thay `your_gemini_api_key_here` bằng API key thực tế của Google Gemini

## Bước 4: Kiểm tra file model

Đảm bảo có file model trong thư mục `ml-server`:
- `leaf_multitask_best.pth` (ưu tiên)
- hoặc `leaf_model_efficientnet_b0.pth`

## Bước 5: Chạy server

### Cách 1: Sử dụng script start.sh (khuyến nghị)
```bash
cd ml-server
bash start.sh
```

### Cách 2: Chạy trực tiếp
```bash
cd ml-server
python app.py
```

### Cách 3: Chạy với environment variables trực tiếp
```bash
cd ml-server
NEO4J_URI=neo4j+s://... \
NEO4J_USER=neo4j \
NEO4J_PASSWORD=... \
GEMINI_API_KEY=... \
python app.py
```

## Bước 6: Kiểm tra server đã chạy

Mở browser hoặc dùng curl:
```bash
curl http://localhost:5001/health
```

Response mong đợi:
```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cpu",
  "model_type": "LeafClassificationModel"
}
```

## Sử dụng API

### 1. Predict từ ảnh (URL)
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/image.jpg"
  }'
```

### 2. Predict từ file upload
```bash
curl -X POST http://localhost:5001/predict/file \
  -F "image=@/path/to/your/image.jpg"
```

### 3. Query Knowledge Graph bằng text
```bash
curl -X POST http://localhost:5001/query/text \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Cây cà chua có các triệu chứng như lá bị vàng và quả bị thối"
  }'
```

## Troubleshooting

### Lỗi: Model not found
- Kiểm tra file model có tồn tại trong thư mục `ml-server`
- Hoặc set `MODEL_PATH` trong `.env` hoặc environment variable

### Lỗi: Neo4j connection failed
- Kiểm tra `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` trong file `.env`
- Đảm bảo Neo4j database đang chạy và accessible

### Lỗi: Gemini API error
- Kiểm tra `GEMINI_API_KEY` trong file `.env`
- Đảm bảo API key hợp lệ và có quota

### Lỗi: PyTorch not found
- Cài đặt lại PyTorch: `pip install torch torchvision`
- Kiểm tra Python version (phải là 3.8-3.12)

### Lỗi: Port already in use
- Đổi port trong file `.env`: `PORT=5002`
- Hoặc kill process đang dùng port 5001

## Logs và Debug

Server sẽ in logs ra console. Để debug, set `DEBUG=True` trong file `.env`:
```
DEBUG=True
```

## Dừng server

Nhấn `Ctrl+C` trong terminal đang chạy server.


