# Docker Deployment Guide

Hướng dẫn deploy hệ thống NCKH Project sử dụng Docker và Docker Compose.

## 📋 Yêu cầu

- Docker >= 20.10
- Docker Compose >= 2.0 (hoặc docker-compose >= 1.29)
- Tối thiểu 5GB RAM (khuyến nghị)
- Tối thiểu 20GB disk space

## 🚀 Quick Start

### 1. Cấu hình Environment Variables

```bash
# Copy file example
cp docker-compose.env.example .env

# Chỉnh sửa .env với các giá trị thực tế
nano .env  # hoặc vim .env
```

**Các biến bắt buộc cần cấu hình:**

- `JWT_SECRET`: Secret key cho JWT (nên dùng string ngẫu nhiên mạnh)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `NEO4J_URI`: Neo4j connection URI
- `NEO4J_PASSWORD`: Neo4j password
- `GEMINI_API_KEY`: Google Gemini API key
- `MONGO_ROOT_PASSWORD`: MongoDB root password (nên đổi mặc định)

### 2. Kiểm tra Model File

**Option A: Model đã có sẵn**

```bash
ls -lh ml-server/leaf_multitask_best.pth
```

**Option B: Tải từ Google Drive (Khuyến nghị)**

Thêm `DRIVE_FILE_ID` vào file `.env`:

```env
DRIVE_FILE_ID=your_google_drive_file_id_here
```

Hoặc tải thủ công:

```bash
# Sử dụng script Python
python3 download_model.py

# Hoặc script bash
./ml-server/download_model.sh YOUR_FILE_ID
```

Xem hướng dẫn chi tiết: [DOWNLOAD_MODEL.md](./DOWNLOAD_MODEL.md)

### 3. Deploy

**Sử dụng script tự động (khuyến nghị):**

```bash
./deploy.sh deploy
```

**Hoặc sử dụng Docker Compose trực tiếp:**

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Xem logs
docker compose logs -f
```

## 📝 Script Deploy

Script `deploy.sh` cung cấp các lệnh:

```bash
./deploy.sh deploy    # Build và start tất cả services
./deploy.sh start     # Start services
./deploy.sh stop      # Stop services
./deploy.sh restart   # Restart services
./deploy.sh logs      # Xem logs
./deploy.sh status    # Kiểm tra trạng thái
./deploy.sh clean     # Xóa tất cả containers, volumes, images
```

**Hoặc chạy interactive menu:**

```bash
./deploy.sh
```

## 🏗️ Kiến trúc Services

Hệ thống bao gồm 4 services chính:

1. **mongodb**: MongoDB database (port 27017)
2. **backend**: Node.js API server (port 5000)
3. **ml-server**: Python ML server (port 5001)
4. **frontend**: React app với Nginx (port 80)

### Service Dependencies

```
frontend → backend → mongodb
backend → ml-server
ml-server → Neo4j (cloud)
```

## 🔍 Kiểm tra Health

Sau khi deploy, kiểm tra health của các services:

```bash
# Backend
curl http://localhost:5000/health

# ML Server
curl http://localhost:5001/health

# Frontend
curl http://localhost:80/health
```

Hoặc sử dụng:

```bash
./deploy.sh status
```

## 📊 Xem Logs

```bash
# Tất cả services
docker compose logs -f

# Service cụ thể
docker compose logs -f backend
docker compose logs -f ml-server
docker compose logs -f frontend
docker compose logs -f mongodb

# Hoặc dùng script
./deploy.sh logs
```

## 🔧 Troubleshooting

### 1. Port đã được sử dụng

Nếu port bị conflict, thay đổi trong `.env`:

```env
BACKEND_PORT=5000
ML_SERVER_PORT=5001
FRONTEND_PORT=80
MONGO_PORT=27017
```

### 2. MongoDB connection failed

Kiểm tra:

- MongoDB container đã start: `docker compose ps`
- Credentials trong `.env` đúng
- MongoDB health check: `docker compose logs mongodb`

### 3. ML Server không load model

Kiểm tra:

- File model tồn tại: `ls ml-server/leaf_multitask_best.pth`
- Model path trong `.env`: `MODEL_PATH=leaf_multitask_best.pth`
- ML Server logs: `docker compose logs ml-server`

### 4. Frontend không kết nối được Backend

Kiểm tra:

- `REACT_APP_API_URL` trong `.env` đúng
- Backend đang chạy: `curl http://localhost:5000/health`
- CORS configuration trong backend

### 5. Out of memory

Nếu thiếu RAM:

- Giảm số lượng services chạy đồng thời
- Tăng swap space
- Nâng cấp server RAM

## 🔄 Update Application

### Update code và rebuild:

```bash
# Pull latest code
git pull

# Rebuild và restart
docker compose build
docker compose up -d

# Hoặc dùng script
./deploy.sh deploy
```

### Update chỉ một service:

```bash
# Rebuild service cụ thể
docker compose build backend
docker compose up -d backend

# Restart service
docker compose restart backend
```

## 🗑️ Clean Up

### Xóa containers và volumes:

```bash
# Stop và xóa containers
docker compose down

# Xóa cả volumes (mất dữ liệu MongoDB!)
docker compose down -v

# Xóa cả images
docker compose down -v --rmi all

# Hoặc dùng script
./deploy.sh clean
```

## 📦 Production Deployment

### 1. Security

- Đổi tất cả passwords mặc định
- Sử dụng strong JWT secret
- Cấu hình firewall
- Sử dụng HTTPS (reverse proxy với Let's Encrypt)

### 2. Performance

- Tối ưu Docker images (đã dùng multi-stage build)
- Cấu hình resource limits trong docker-compose.yml
- Sử dụng CDN cho static files
- Enable caching

### 3. Monitoring

- Setup health checks (đã có sẵn)
- Monitor logs
- Setup alerts cho services down
- Monitor resource usage

### 4. Backup

- Backup MongoDB data: `docker compose exec mongodb mongodump`
- Backup volumes: `docker volume inspect nckh_mongodb_data`
- Setup automated backups

## 🔐 Environment Variables Reference

Xem file `docker-compose.env.example` để biết tất cả các biến môi trường có thể cấu hình.

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra logs: `./deploy.sh logs`
2. Kiểm tra status: `./deploy.sh status`
3. Xem troubleshooting section ở trên
4. Kiểm tra Docker và Docker Compose versions
