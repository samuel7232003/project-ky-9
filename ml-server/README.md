# Leaf Classification ML Server

Python Flask server để phân loại lá cây và bệnh từ ảnh.

## Setup

**⚠️ Yêu cầu:** Python 3.8 - 3.12 (PyTorch chưa hỗ trợ Python 3.13+)

Nếu bạn đang dùng Python 3.13, hãy tạo virtual environment mới với Python 3.11 hoặc 3.12:
```bash
# Tạo venv mới với Python 3.11 hoặc 3.12
python3.11 -m venv venv
# hoặc
python3.12 -m venv venv

source venv/bin/activate  # macOS/Linux
# hoặc
venv\Scripts\activate  # Windows
```

1. **Cài đặt PyTorch và torchvision** (cần cài riêng tùy theo platform):

   **Cho macOS (CPU hoặc MPS):**
   ```bash
   pip install torch torchvision
   ```

   **Cho Linux/Windows với CUDA:**
   ```bash
   # Xem https://pytorch.org/ để chọn command phù hợp với CUDA version
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
   ```

   Hoặc truy cập https://pytorch.org/ để chọn command phù hợp với hệ thống của bạn.

2. **Cài đặt các dependencies khác:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Đảm bảo có file model:**
   - `leaf_multitask_best.pth` hoặc `leaf_model_efficientnet_b0.pth` ở thư mục root project

4. **Chạy server:**
   ```bash
   python app.py
   ```

   Hoặc với environment variables:
   ```bash
   MODEL_PATH=../leaf_multitask_best.pth PORT=5000 python app.py
   ```

## API Endpoints

### Health Check
```
GET /health
```

### Predict from URL
```
POST /predict
Content-Type: application/json

{
  "image_url": "https://example.com/image.jpg"
}
```

### Predict from File Upload
```
POST /predict/file
Content-Type: multipart/form-data

image: <file>
```

## Response Format

```json
{
  "success": true,
  "plant": {
    "name": "apple",
    "confidence": 0.95,
    "all_probabilities": {
      "apple": 0.95,
      "banana": 0.02,
      ...
    }
  },
  "disease": {
    "name": "Black_rot",
    "confidence": 0.87,
    "all_probabilities": {
      "Black_rot": 0.87,
      "Healthy_Leaf": 0.10,
      ...
    }
  }
}
```

