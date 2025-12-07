# Hướng dẫn tải Model từ Google Drive

Hướng dẫn chi tiết để tải model file từ Google Drive về máy chủ.

## 📋 Các phương pháp

### Phương pháp 1: Sử dụng Script tự động (Khuyến nghị)

#### A. Sử dụng Python script:

```bash
# Chạy script Python
python3 download_model.py
```

Script sẽ hỏi bạn:

- Google Drive File ID
- Hoặc direct download URL

#### B. Sử dụng Bash script:

```bash
# Với File ID
./ml-server/download_model.sh YOUR_FILE_ID

# Với File ID và output path tùy chỉnh
./ml-server/download_model.sh YOUR_FILE_ID custom_model.pth
```

### Phương pháp 2: Tự động trong Deploy Script

1. Thêm `DRIVE_FILE_ID` vào file `.env`:

```env
DRIVE_FILE_ID=your_google_drive_file_id_here
```

2. Chạy deploy script:

```bash
./deploy.sh deploy
```

Script sẽ tự động download model nếu chưa có.

### Phương pháp 3: Tải trong Docker Build

Nếu muốn tải model khi build Docker image:

```bash
docker build \
  --build-arg DRIVE_FILE_ID=your_file_id \
  -t nckh-ml-server \
  ./ml-server
```

## 🔍 Lấy Google Drive File ID

### Cách 1: Từ Share Link

Nếu bạn có link chia sẻ Google Drive:

```
https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
```

File ID là phần giữa `/d/` và `/view`:

```
File ID: 1ABC123xyz456DEF789
```

### Cách 2: Từ URL khác

Nếu link có dạng:

```
https://drive.google.com/uc?id=1ABC123xyz456DEF789
```

File ID là giá trị sau `id=`:

```
File ID: 1ABC123xyz456DEF789
```

## 📝 Ví dụ sử dụng

### Ví dụ 1: Tải model thủ công

```bash
# Cài đặt gdown nếu chưa có
pip install gdown

# Tải model
gdown https://drive.google.com/uc?id=YOUR_FILE_ID -O ml-server/leaf_multitask_best.pth
```

### Ví dụ 2: Sử dụng script Python

```bash
cd /Users/admin/Documents/Personal/project-ky-9
python3 download_model.py

# Nhập File ID khi được hỏi
# Ví dụ: 1ABC123xyz456DEF789
```

### Ví dụ 3: Tự động trong deploy

```bash
# 1. Thêm vào .env
echo "DRIVE_FILE_ID=1ABC123xyz456DEF789" >> .env

# 2. Deploy
./deploy.sh deploy
```

## ⚙️ Cấu hình trong .env

Thêm vào file `.env`:

```env
# Google Drive Model Download
DRIVE_FILE_ID=your_google_drive_file_id_here
```

Sau đó deploy script sẽ tự động:

1. Kiểm tra model file có tồn tại không
2. Nếu không có và có `DRIVE_FILE_ID`, tự động tải về
3. Tiếp tục deployment

## 🔐 Quyền truy cập Google Drive

### File công khai (Public)

Nếu file đã được share công khai, bạn chỉ cần File ID.

### File riêng tư (Private)

Nếu file là private, bạn cần:

1. **Option 1**: Share file với quyền "Anyone with the link"

   - Right-click file → Share → Change to "Anyone with the link"
   - Lấy File ID và sử dụng

2. **Option 2**: Sử dụng Google Drive API với OAuth
   - Phức tạp hơn, cần setup OAuth credentials
   - Không khuyến nghị cho use case này

## 🐳 Tải trong Docker Container

Nếu muốn tải model sau khi container đã chạy:

```bash
# Vào container
docker compose exec ml-server bash

# Cài gdown
pip install gdown

# Tải model
gdown https://drive.google.com/uc?id=YOUR_FILE_ID -O /app/leaf_multitask_best.pth

# Restart service
exit
docker compose restart ml-server
```

## 🔍 Kiểm tra Model đã tải

```bash
# Kiểm tra file tồn tại
ls -lh ml-server/leaf_multitask_best.pth

# Kiểm tra kích thước (nên khoảng 47MB)
du -h ml-server/leaf_multitask_best.pth

# Kiểm tra trong container
docker compose exec ml-server ls -lh /app/leaf_multitask_best.pth
```

## ❌ Troubleshooting

### Lỗi: "Failed to download"

**Nguyên nhân:**

- File ID không đúng
- File không công khai
- Không có internet
- Google Drive rate limit

**Giải pháp:**

1. Kiểm tra File ID đúng chưa
2. Đảm bảo file được share công khai
3. Thử lại sau vài phút
4. Tải thủ công và copy vào server

### Lỗi: "gdown not found"

**Giải pháp:**

```bash
pip install gdown
# hoặc
pip3 install gdown
```

### Lỗi: "Permission denied"

**Giải pháp:**

```bash
chmod +x download_model.py
chmod +x ml-server/download_model.sh
```

### Model tải về nhưng ML Server vẫn lỗi

**Kiểm tra:**

1. File có đúng tên: `leaf_multitask_best.pth`
2. File có đúng vị trí: `ml-server/leaf_multitask_best.pth`
3. File không bị corrupt (kiểm tra size)
4. Xem logs: `docker compose logs ml-server`

## 📦 Alternative: Upload trực tiếp

Nếu không muốn dùng Google Drive, bạn có thể:

1. **SCP từ máy local:**

```bash
scp leaf_multitask_best.pth user@server:/path/to/project-ky-9/ml-server/
```

2. **SFTP:**

```bash
sftp user@server
put leaf_multitask_best.pth /path/to/project-ky-9/ml-server/
```

3. **Docker volume mount:**

```bash
# Copy vào volume
docker cp leaf_multitask_best.pth nckh-ml-server:/app/
```

## ✅ Best Practices

1. **Lưu File ID trong .env** để tự động tải khi cần
2. **Kiểm tra model sau khi tải** để đảm bảo không corrupt
3. **Backup model file** sau khi tải thành công
4. **Sử dụng version control** cho File ID (không commit model file)

## 📚 Tài liệu tham khảo

- [gdown GitHub](https://github.com/wkentaro/gdown)
- [Google Drive API](https://developers.google.com/drive/api)
- [Docker Build Args](https://docs.docker.com/engine/reference/commandline/build/#build-arg)
