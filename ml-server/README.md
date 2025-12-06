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

4. **Cấu hình environment variables (tùy chọn):**

   - Copy `env.example` thành `.env` và điền thông tin:
     ```bash
     cp env.example .env
     # Sau đó chỉnh sửa file .env và điền thông tin thực tế
     ```
   - Hoặc set trực tiếp khi chạy:
     ```bash
     NEO4J_URI=neo4j+s://... NEO4J_USER=neo4j NEO4J_PASSWORD=... GEMINI_API_KEY=... python app.py
     ```

   **Các biến môi trường cần thiết:**

   - `NEO4J_URI`: Neo4j database URI (ví dụ: `neo4j+s://xxx.databases.neo4j.io`)
   - `NEO4J_USER`: Neo4j username (mặc định: `neo4j`)
   - `NEO4J_PASSWORD`: Neo4j password
   - `GEMINI_API_KEY`: Google Gemini API key

5. **Chạy server:**

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

### Query Knowledge Graph by Text

```
POST /query/text
Content-Type: application/json

{
  "query": "Cây cà chua có các triệu chứng như lá bị vàng và quả bị thối"
}
```

## Response Format

### Predict Response (with KG integration)

Khi gửi ảnh, response sẽ bao gồm thông tin từ Knowledge Graph nếu tìm thấy:

```json
{
  "success": true,
  "plant": {
    "name": "apple",
    "name_en": "apple",
    "name_vi": "Táo",
    "confidence": 0.95,
    "all_probabilities": {...}
  },
  "disease": {
    "name": "Black_rot",
    "name_en": "Black_rot",
    "name_vi": "Bệnh thối đen",
    "confidence": 0.87,
    "all_probabilities": {...}
  },
  "kg_info": {
    "nguyen_nhan": ["Nguyên nhân 1", "Nguyên nhân 2"],
    "dieu_tri": ["Cách điều trị 1", "Cách điều trị 2"]
  }
}
```

### Text Query Response

Khi query bằng text, response có thể là:

- **Direct answer** (nếu không phải câu hỏi về bệnh cây):

```json
{
  "success": true,
  "type": "direct_answer",
  "answer": "Câu trả lời trực tiếp..."
}
```

- **Search results** (nếu là câu hỏi về bệnh cây):

```json
{
  "success": true,
  "type": "search_results",
  "results": [
    {
      "cay": "cà chua",
      "benh": "thối đít quả",
      "description": "...",
      "text": "...",
      "score": 0.971
    }
  ]
}
```

## Response Format (Legacy)

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
