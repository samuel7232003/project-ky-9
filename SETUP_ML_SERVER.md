# Hướng dẫn Setup ML Server cho Leaf Classification

## Tổng quan

Hệ thống tự động phân loại lá cây và bệnh khi user gửi ảnh trong message. Bao gồm:
- Python Flask server để chạy model phân loại
- Node.js service để gọi Python server
- Tích hợp tự động vào messageService

## Bước 1: Setup Python ML Server

**⚠️ Yêu cầu quan trọng:** Python 3.8 - 3.12 (PyTorch chưa hỗ trợ Python 3.13+)

Nếu bạn đang dùng Python 3.13, hãy tạo virtual environment mới với Python 3.11 hoặc 3.12:
```bash
# Kiểm tra Python versions có sẵn
python3.11 --version  # hoặc python3.12 --version

# Tạo venv mới với Python 3.11 hoặc 3.12
python3.11 -m venv venv
# hoặc
python3.12 -m venv venv

source venv/bin/activate  # macOS/Linux
# hoặc
venv\Scripts\activate  # Windows
```

### 1.1. Cài đặt PyTorch và torchvision

PyTorch cần cài đặt riêng trước:

```bash
# Cho macOS (CPU hoặc MPS)
pip install torch torchvision

# Cho Linux/Windows với CUDA (xem https://pytorch.org/ để chọn command phù hợp)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### 1.2. Cài đặt các dependencies khác

```bash
cd ml-server
pip install -r requirements.txt
```

### 1.2. Đảm bảo có file model

Đảm bảo file model `leaf_multitask_best.pth` hoặc `leaf_model_efficientnet_b0.pth` nằm ở thư mục root của project (cùng cấp với `ml-server`).

### 1.3. Chạy ML Server

```bash
cd ml-server
python app.py
```

Hoặc với environment variables:

```bash
MODEL_PATH=../leaf_multitask_best.pth PORT=5000 python app.py
```

Server sẽ chạy tại `http://localhost:5000`

## Bước 2: Setup Backend Node.js

### 2.1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2.2. Cấu hình environment variables

Thêm vào file `.env`:

```env
# ML Server URL
ML_SERVER_URL=http://localhost:5000
```

### 2.3. Chạy Backend Server

```bash
cd backend
npm run dev
```

## Bước 3: Kiểm tra hoạt động

### 3.1. Kiểm tra ML Server

```bash
curl http://localhost:5000/health
```

Response mong đợi:
```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cpu"
}
```

### 3.2. Test prediction

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/leaf-image.jpg"}'
```

### 3.3. Test tích hợp với Backend

Khi tạo message với ảnh qua API, hệ thống sẽ tự động:
1. Lưu message vào database
2. Gọi ML server để phân loại
3. Lưu kết quả phân loại vào field `classification` của message

Response sẽ bao gồm:
```json
{
  "_id": "...",
  "content": "...",
  "image": "https://cloudinary.com/...",
  "classification": {
    "plant": {
      "name": "apple",
      "confidence": 0.95
    },
    "disease": {
      "name": "Black_rot",
      "confidence": 0.87
    }
  },
  ...
}
```

## Cấu trúc dữ liệu

### Message Schema (đã được cập nhật)

```javascript
{
  content: String,
  image: String, // URL của ảnh
  userId: ObjectId,
  conversationId: ObjectId,
  status: String,
  classification: {  // Tự động thêm khi có ảnh
    plant: {
      name: String,
      confidence: Number
    },
    disease: {
      name: String,
      confidence: Number
    }
  }
}
```

## Troubleshooting

### ML Server không start được

1. Kiểm tra file model có tồn tại không
2. Kiểm tra Python version (cần >= 3.8)
3. Kiểm tra đã cài đủ dependencies chưa

### Backend không kết nối được ML Server

1. Kiểm tra ML server đã chạy chưa (`curl http://localhost:5000/health`)
2. Kiểm tra `ML_SERVER_URL` trong `.env`
3. Kiểm tra firewall/network settings

### Prediction fail nhưng message vẫn được tạo

Đây là behavior mong muốn - nếu ML server không available hoặc có lỗi, message vẫn được tạo nhưng không có classification. Check logs để debug.

## Production Deployment

### ML Server

1. Sử dụng gunicorn hoặc uvicorn để chạy Flask app:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. Hoặc sử dụng Docker:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY ml-server/requirements.txt .
RUN pip install -r requirements.txt
COPY ml-server/ .
COPY leaf_multitask_best.pth .
CMD ["python", "app.py"]
```

### Environment Variables

- `ML_SERVER_URL`: URL của ML server (default: http://localhost:5000)
- `MODEL_PATH`: Đường dẫn đến file model (default: ../leaf_multitask_best.pth)
- `PORT`: Port cho ML server (default: 5000)

