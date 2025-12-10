# Intelligent Plant Disease Diagnosis Using Knowledge Graph and Leaf Image Recognition

<div align="center">

**An AI-powered system for intelligent plant disease diagnosis combining deep learning image recognition with knowledge graph-based reasoning**

[![Python](https://img.shields.io/badge/Python-3.8--3.12-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4-green.svg)](https://www.mongodb.com/)
[![Neo4j](https://img.shields.io/badge/Neo4j-Graph%20DB-orange.svg)](https://neo4j.com/)

</div>

---

## 📋 Table of Contents

- [English](#english)
  - [Overview](#overview)
  - [Features](#features)
  - [System Architecture](#system-architecture)
  - [Technology Stack](#technology-stack)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Documentation](#api-documentation)
  - [Project Structure](#project-structure)
- [Tiếng Việt](#tiếng-việt)
  - [Tổng quan](#tổng-quan)
  - [Tính năng](#tính-năng)
  - [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
  - [Công nghệ sử dụng](#công-nghệ-sử-dụng)
  - [Cài đặt](#cài-đặt)
  - [Sử dụng](#sử-dụng)
  - [Tài liệu API](#tài-liệu-api)
  - [Cấu trúc dự án](#cấu-trúc-dự-án)

---

# English

## Overview

This project is an intelligent plant disease diagnosis system that combines **deep learning-based leaf image recognition** with **knowledge graph reasoning** to provide accurate disease identification and treatment recommendations. The system uses a multi-task neural network to classify both plant species and diseases from leaf images, then queries a Neo4j knowledge graph to retrieve detailed information about disease causes and treatment methods.

### Key Capabilities

- **Automatic Leaf Classification**: Upload a leaf image to automatically identify the plant species and detect any diseases
- **Knowledge Graph Integration**: Retrieve detailed information about disease causes and treatment methods from a structured knowledge graph
- **Natural Language Queries**: Ask questions about plant diseases in natural language (Vietnamese)
- **Multi-language Support**: Interface available in both English and Vietnamese
- **Real-time Diagnosis**: Fast and accurate disease detection using state-of-the-art deep learning models

## Features

### 🔬 Core Features

- **Leaf Image Classification**

  - Multi-task deep learning model for simultaneous plant and disease classification
  - Support for multiple plant species (apple, cherry, corn, grape, peach, pepper, potato, strawberry, tomato, and more)
  - Detection of various diseases including bacterial spots, fungal infections, viral diseases, and healthy leaves

- **Knowledge Graph Query**

  - Neo4j-based knowledge graph storing plant-disease relationships
  - RAG (Retrieval Augmented Generation) using Google Gemini for intelligent query processing
  - Semantic search for finding relevant disease information
  - Automatic extraction of causes (nguyên nhân) and treatments (điều trị)

- **Translation Service**

  - Automatic translation between English and Vietnamese for plant and disease names
  - Dictionary-based mapping for common terms
  - Fallback to Google Translate API for unknown terms

- **User Management**

  - JWT-based authentication and authorization
  - Role-based access control (Admin/User)
  - User profile management
  - Secure password hashing

- **Messaging System**
  - Send messages with text and/or images
  - Automatic leaf classification when images are uploaded
  - Conversation management
  - Message status tracking

### 🎨 User Interface

- Modern React-based frontend with TypeScript
- Responsive design with TailwindCSS
- Real-time updates using WebSocket
- Multi-language support (Vietnamese/English)
- Image upload with Cloudinary integration

## System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React/TS)    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend       │
│  (Node.js/      │
│   Express)      │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────┐
│   ML Server     │  │  MongoDB   │
│  (Python/Flask) │  │  Database  │
└────────┬────────┘  └────────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────┐
│  PyTorch Model  │  │   Neo4j    │
│  (Leaf Class.)  │  │ Knowledge  │
│                 │  │   Graph    │
└─────────────────┘  └─────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Google      │
                    │ Gemini API  │
                    │ (RAG)       │
                    └─────────────┘
```

### Component Description

1. **Frontend (React + TypeScript)**

   - User interface for uploading images and querying the system
   - Real-time messaging and conversation management
   - Multi-language support

2. **Backend (Node.js + Express)**

   - RESTful API server
   - User authentication and authorization
   - Message and conversation management
   - Integration with ML server and MongoDB

3. **ML Server (Python + Flask)**

   - Leaf image classification using PyTorch
   - Knowledge graph query processing
   - Translation service
   - Integration with Neo4j and Google Gemini

4. **MongoDB**

   - User data storage
   - Message and conversation storage

5. **Neo4j Knowledge Graph**

   - Plant-disease relationships
   - Disease causes and treatments
   - Semantic search capabilities

6. **Google Gemini API**
   - Natural language understanding
   - RAG (Retrieval Augmented Generation)
   - Entity extraction and relationship mapping

## Technology Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Socket.io** - WebSocket support

### ML Server

- **Python 3.8-3.12** - Programming language
- **Flask** - Web framework
- **PyTorch** - Deep learning framework
- **torchvision** - Computer vision utilities
- **Neo4j** - Graph database
- **LangChain** - LLM framework
- **Google Gemini API** - LLM and embeddings
- **deep-translator** - Translation service

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Neo4j Cloud** - Managed graph database

## Installation

### Prerequisites

- **Node.js** >= 16
- **Python** 3.8 - 3.12 (PyTorch doesn't support Python 3.13+)
- **MongoDB** >= 4.4
- **Docker** (optional, for containerized deployment)
- **Neo4j** account (cloud or self-hosted)
- **Google Gemini API** key
- **Cloudinary** account (for image storage)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd project-ky-9
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all
```

### Step 3: Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=nckh
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=dev

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ML Server URL
ML_SERVER_URL=http://localhost:5001
```

#### Frontend Configuration

```bash
cd frontend
cp env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### ML Server Configuration

```bash
cd ml-server
cp env.example .env
```

Edit `.env`:

```env
# Model Configuration
MODEL_PATH=../leaf_multitask_best.pth
PORT=5001

# Neo4j Configuration
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Download ML Model

The system requires a trained PyTorch model file. You can download it using:

```bash
# Option 1: Using Python script
python download_model.py

# Option 2: Using bash script
./ml-server/download_model.sh YOUR_GOOGLE_DRIVE_FILE_ID

# Option 3: Manual download
# Place leaf_multitask_best.pth in the project root directory
```

See [DOWNLOAD_MODEL.md](./DOWNLOAD_MODEL.md) for detailed instructions.

### Step 5: Setup ML Server

```bash
cd ml-server

# Create virtual environment (if using Python 3.13+, use Python 3.11 or 3.12)
python3.11 -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install PyTorch (choose based on your system)
pip install torch torchvision  # macOS (CPU/MPS)
# or
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118  # Linux/Windows with CUDA

# Install other dependencies
pip install -r requirements.txt
```

### Step 6: Start MongoDB

```bash
# macOS/Linux
mongod

# Windows
# Start MongoDB service from Services
```

### Step 7: Start Services

#### Option A: Run All Services Together (Recommended)

```bash
# Terminal 1: Start ML Server
cd ml-server
python app.py

# Terminal 2: Start Backend and Frontend
npm run dev
```

#### Option B: Run Services Separately

```bash
# Terminal 1: ML Server
cd ml-server
python app.py

# Terminal 2: Backend
npm run dev:backend

# Terminal 3: Frontend
npm run dev:frontend
```

### Step 8: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **ML Server**: http://localhost:5001

## Usage

### 1. User Registration and Login

1. Navigate to the login page
2. Register a new account or login with existing credentials
3. Admin users can manage other users

### 2. Upload Leaf Image for Diagnosis

1. Go to the main page
2. Click "Upload Image" or drag and drop an image
3. The system will automatically:
   - Classify the plant species
   - Detect any diseases
   - Retrieve treatment information from the knowledge graph
   - Display results in both English and Vietnamese

### 3. Query Knowledge Graph

1. Use the text query feature
2. Ask questions in Vietnamese, for example:
   - "Cây cà chua có các triệu chứng như lá bị vàng và quả bị thối"
   - "Cây lúa bị đạo ôn là do nguyên nhân gì?"
3. The system will search the knowledge graph and provide relevant information

### 4. Send Messages

1. Create a new conversation or select an existing one
2. Upload an image or type a message
3. If an image is uploaded, automatic classification will be performed
4. View conversation history and responses

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### User Management (Admin Only)

- `GET /api/users` - Get user list (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Profile Management

- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Image Upload

- `POST /api/upload/image` - Upload image to Cloudinary
- `DELETE /api/upload/image/:publicId` - Delete image

### Messaging

- `POST /api/messages` - Create message
- `GET /api/messages` - Get messages (with filters)
- `GET /api/messages/:id` - Get message by ID
- `PUT /api/messages/:id/status` - Update message status
- `DELETE /api/messages/:id` - Delete message

### Conversations

- `POST /api/conversations` - Create conversation
- `GET /api/conversations` - Get conversations
- `GET /api/conversations/:id` - Get conversation by ID
- `PUT /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

### ML Server Endpoints

- `GET /health` - Health check
- `POST /predict` - Predict from image URL
  ```json
  {
    "image_url": "https://example.com/image.jpg"
  }
  ```
- `POST /predict/file` - Predict from file upload
- `POST /query/text` - Query knowledge graph by text
  ```json
  {
    "query": "Cây cà chua có các triệu chứng như lá bị vàng"
  }
  ```

## Project Structure

```
project-ky-9/
├── backend/                    # Node.js backend server
│   ├── config/                 # Configuration files
│   │   ├── db.js              # MongoDB configuration
│   │   ├── jwt.js             # JWT configuration
│   │   └── socket.js          # WebSocket configuration
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messageController.js
│   │   ├── conversationController.js
│   │   └── uploadController.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── validation.js     # Input validation
│   │   └── errorHandler.js   # Error handling
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/              # Business logic services
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── messageService.js
│   │   ├── conversationService.js
│   │   └── leafClassificationService.js
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header/
│   │   │   ├── AuthRoute.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login/
│   │   │   └── Main/
│   │   │       ├── Main.tsx
│   │   │       ├── KnowledgeLib/
│   │   │       └── Drone/
│   │   ├── services/          # API services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── messageService.ts
│   │   │   ├── conversationService.ts
│   │   │   └── cloudinaryService.ts
│   │   ├── store/             # Redux store
│   │   │   ├── slices/
│   │   │   └── store.ts
│   │   ├── translations/      # i18n files
│   │   │   ├── en.json
│   │   │   └── vi.json
│   │   └── utils/             # Utility functions
│   └── package.json
│
├── ml-server/                  # Python ML server
│   ├── app.py                 # Flask application
│   ├── model_loader.py        # Model loading utilities
│   ├── translation_service.py # Translation service
│   ├── kg_service.py          # Knowledge graph service
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── README.md             # ML server documentation
│
├── KG_RAG_AI/                  # Knowledge graph and RAG implementation
│   └── rag_knowledge_graph_disease_tree/
│       ├── build_graph.ipynb  # Graph construction notebook
│       ├── process_main.ipynb # Main processing notebook
│       ├── data/              # Data files
│       └── raw_data/          # Raw data files
│
├── docker-compose.yml          # Docker Compose configuration
├── deploy.sh                   # Deployment script
├── download_model.py          # Model download script
├── package.json               # Root package.json
└── README.md                  # This file
```

## Docker Deployment

For production deployment using Docker, see [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md).

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication with HTTP-only cookies
- **CORS**: Configured for specific origins
- **Input Validation**: All inputs are validated using express-validator
- **Role-based Access Control**: Admin and user roles with appropriate permissions
- **API Rate Limiting**: Consider implementing rate limiting for production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- PyTorch team for the deep learning framework
- Neo4j for the graph database
- Google Gemini for LLM capabilities
- React team for the UI framework

---

# Tiếng Việt

## Tổng quan

Dự án này là một hệ thống chẩn đoán bệnh cây trồng thông minh kết hợp **nhận dạng hình ảnh lá cây dựa trên học sâu** với **lý luận đồ thị tri thức** để cung cấp nhận dạng bệnh chính xác và khuyến nghị điều trị. Hệ thống sử dụng mạng nơ-ron đa nhiệm để phân loại đồng thời loài cây và bệnh từ hình ảnh lá, sau đó truy vấn đồ thị tri thức Neo4j để lấy thông tin chi tiết về nguyên nhân và phương pháp điều trị bệnh.

### Khả năng chính

- **Phân loại lá tự động**: Tải lên hình ảnh lá để tự động nhận dạng loài cây và phát hiện bệnh
- **Tích hợp đồ thị tri thức**: Lấy thông tin chi tiết về nguyên nhân và phương pháp điều trị từ đồ thị tri thức có cấu trúc
- **Truy vấn ngôn ngữ tự nhiên**: Đặt câu hỏi về bệnh cây trồng bằng ngôn ngữ tự nhiên (Tiếng Việt)
- **Hỗ trợ đa ngôn ngữ**: Giao diện có sẵn bằng cả Tiếng Anh và Tiếng Việt
- **Chẩn đoán thời gian thực**: Phát hiện bệnh nhanh chóng và chính xác sử dụng các mô hình học sâu tiên tiến

## Tính năng

### 🔬 Tính năng cốt lõi

- **Phân loại hình ảnh lá cây**

  - Mô hình học sâu đa nhiệm để phân loại đồng thời cây và bệnh
  - Hỗ trợ nhiều loài cây (táo, anh đào, ngô, nho, đào, ớt, khoai tây, dâu tây, cà chua và nhiều loại khác)
  - Phát hiện các bệnh khác nhau bao gồm đốm vi khuẩn, nhiễm nấm, bệnh virus và lá khỏe mạnh

- **Truy vấn đồ thị tri thức**

  - Đồ thị tri thức dựa trên Neo4j lưu trữ mối quan hệ cây-bệnh
  - RAG (Retrieval Augmented Generation) sử dụng Google Gemini để xử lý truy vấn thông minh
  - Tìm kiếm ngữ nghĩa để tìm thông tin bệnh liên quan
  - Tự động trích xuất nguyên nhân và phương pháp điều trị

- **Dịch vụ dịch thuật**

  - Dịch tự động giữa Tiếng Anh và Tiếng Việt cho tên cây và bệnh
  - Ánh xạ dựa trên từ điển cho các thuật ngữ phổ biến
  - Dự phòng với Google Translate API cho các thuật ngữ chưa biết

- **Quản lý người dùng**

  - Xác thực và ủy quyền dựa trên JWT
  - Kiểm soát truy cập dựa trên vai trò (Admin/User)
  - Quản lý hồ sơ người dùng
  - Mã hóa mật khẩu an toàn

- **Hệ thống tin nhắn**
  - Gửi tin nhắn với văn bản và/hoặc hình ảnh
  - Phân loại lá tự động khi tải lên hình ảnh
  - Quản lý cuộc trò chuyện
  - Theo dõi trạng thái tin nhắn

### 🎨 Giao diện người dùng

- Frontend hiện đại dựa trên React với TypeScript
- Thiết kế responsive với TailwindCSS
- Cập nhật thời gian thực sử dụng WebSocket
- Hỗ trợ đa ngôn ngữ (Tiếng Việt/Tiếng Anh)
- Tải lên hình ảnh với tích hợp Cloudinary

## Kiến trúc hệ thống

```
┌─────────────────┐
│   Frontend      │
│   (React/TS)    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend       │
│  (Node.js/      │
│   Express)      │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────┐
│   ML Server     │  │  MongoDB   │
│  (Python/Flask) │  │  Database  │
└────────┬────────┘  └────────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────┐
│  PyTorch Model  │  │   Neo4j    │
│  (Leaf Class.)  │  │ Knowledge  │
│                 │  │   Graph    │
└─────────────────┘  └─────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Google      │
                    │ Gemini API  │
                    │ (RAG)       │
                    └─────────────┘
```

### Mô tả thành phần

1. **Frontend (React + TypeScript)**

   - Giao diện người dùng để tải lên hình ảnh và truy vấn hệ thống
   - Tin nhắn và quản lý cuộc trò chuyện thời gian thực
   - Hỗ trợ đa ngôn ngữ

2. **Backend (Node.js + Express)**

   - Máy chủ API RESTful
   - Xác thực và ủy quyền người dùng
   - Quản lý tin nhắn và cuộc trò chuyện
   - Tích hợp với ML server và MongoDB

3. **ML Server (Python + Flask)**

   - Phân loại hình ảnh lá sử dụng PyTorch
   - Xử lý truy vấn đồ thị tri thức
   - Dịch vụ dịch thuật
   - Tích hợp với Neo4j và Google Gemini

4. **MongoDB**

   - Lưu trữ dữ liệu người dùng
   - Lưu trữ tin nhắn và cuộc trò chuyện

5. **Đồ thị tri thức Neo4j**

   - Mối quan hệ cây-bệnh
   - Nguyên nhân và phương pháp điều trị bệnh
   - Khả năng tìm kiếm ngữ nghĩa

6. **Google Gemini API**
   - Hiểu ngôn ngữ tự nhiên
   - RAG (Retrieval Augmented Generation)
   - Trích xuất thực thể và ánh xạ mối quan hệ

## Công nghệ sử dụng

### Frontend

- **React 19** - Thư viện UI
- **TypeScript** - An toàn kiểu
- **Redux Toolkit** - Quản lý trạng thái
- **React Router DOM** - Định tuyến
- **Axios** - HTTP client
- **TailwindCSS** - Styling

### Backend

- **Node.js** - Môi trường runtime
- **Express.js** - Web framework
- **MongoDB** - Cơ sở dữ liệu
- **Mongoose** - ODM
- **JWT** - Xác thực
- **bcryptjs** - Mã hóa mật khẩu
- **Cloudinary** - Lưu trữ hình ảnh
- **Socket.io** - Hỗ trợ WebSocket

### ML Server

- **Python 3.8-3.12** - Ngôn ngữ lập trình
- **Flask** - Web framework
- **PyTorch** - Framework học sâu
- **torchvision** - Tiện ích thị giác máy tính
- **Neo4j** - Cơ sở dữ liệu đồ thị
- **LangChain** - Framework LLM
- **Google Gemini API** - LLM và embeddings
- **deep-translator** - Dịch vụ dịch thuật

### Hạ tầng

- **Docker** - Containerization
- **Docker Compose** - Điều phối đa container
- **Neo4j Cloud** - Cơ sở dữ liệu đồ thị được quản lý

## Cài đặt

### Yêu cầu

- **Node.js** >= 16
- **Python** 3.8 - 3.12 (PyTorch không hỗ trợ Python 3.13+)
- **MongoDB** >= 4.4
- **Docker** (tùy chọn, cho triển khai containerized)
- Tài khoản **Neo4j** (cloud hoặc tự host)
- **Google Gemini API** key
- Tài khoản **Cloudinary** (để lưu trữ hình ảnh)

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd project-ky-9
```

### Bước 2: Cài đặt Dependencies

```bash
# Cài đặt tất cả dependencies (root, backend, frontend)
npm run install:all
```

### Bước 3: Cấu hình Biến Môi trường

#### Cấu hình Backend

```bash
cd backend
cp env.example .env
```

Chỉnh sửa `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=nckh
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=dev

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ML Server URL
ML_SERVER_URL=http://localhost:5001
```

#### Cấu hình Frontend

```bash
cd frontend
cp env.example .env
```

Chỉnh sửa `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### Cấu hình ML Server

```bash
cd ml-server
cp env.example .env
```

Chỉnh sửa `.env`:

```env
# Model Configuration
MODEL_PATH=../leaf_multitask_best.pth
PORT=5001

# Neo4j Configuration
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### Bước 4: Tải ML Model

Hệ thống yêu cầu file mô hình PyTorch đã được huấn luyện. Bạn có thể tải xuống bằng:

```bash
# Tùy chọn 1: Sử dụng script Python
python download_model.py

# Tùy chọn 2: Sử dụng script bash
./ml-server/download_model.sh YOUR_GOOGLE_DRIVE_FILE_ID

# Tùy chọn 3: Tải thủ công
# Đặt leaf_multitask_best.pth trong thư mục root của project
```

Xem [DOWNLOAD_MODEL.md](./DOWNLOAD_MODEL.md) để biết hướng dẫn chi tiết.

### Bước 5: Setup ML Server

```bash
cd ml-server

# Tạo virtual environment (nếu dùng Python 3.13+, dùng Python 3.11 hoặc 3.12)
python3.11 -m venv venv
source venv/bin/activate  # macOS/Linux
# hoặc
venv\Scripts\activate  # Windows

# Cài đặt PyTorch (chọn dựa trên hệ thống của bạn)
pip install torch torchvision  # macOS (CPU/MPS)
# hoặc
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118  # Linux/Windows với CUDA

# Cài đặt các dependencies khác
pip install -r requirements.txt
```

### Bước 6: Khởi động MongoDB

```bash
# macOS/Linux
mongod

# Windows
# Khởi động dịch vụ MongoDB từ Services
```

### Bước 7: Khởi động Services

#### Tùy chọn A: Chạy Tất cả Services Cùng lúc (Khuyến nghị)

```bash
# Terminal 1: Khởi động ML Server
cd ml-server
python app.py

# Terminal 2: Khởi động Backend và Frontend
npm run dev
```

#### Tùy chọn B: Chạy Services Riêng lẻ

```bash
# Terminal 1: ML Server
cd ml-server
python app.py

# Terminal 2: Backend
npm run dev:backend

# Terminal 3: Frontend
npm run dev:frontend
```

### Bước 8: Truy cập Ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **ML Server**: http://localhost:5001

## Sử dụng

### 1. Đăng ký và Đăng nhập Người dùng

1. Điều hướng đến trang đăng nhập
2. Đăng ký tài khoản mới hoặc đăng nhập với thông tin đăng nhập hiện có
3. Người dùng admin có thể quản lý người dùng khác

### 2. Tải lên Hình ảnh Lá để Chẩn đoán

1. Đi đến trang chính
2. Nhấp "Tải lên Hình ảnh" hoặc kéo thả hình ảnh
3. Hệ thống sẽ tự động:
   - Phân loại loài cây
   - Phát hiện bệnh
   - Lấy thông tin điều trị từ đồ thị tri thức
   - Hiển thị kết quả bằng cả Tiếng Anh và Tiếng Việt

### 3. Truy vấn Đồ thị Tri thức

1. Sử dụng tính năng truy vấn văn bản
2. Đặt câu hỏi bằng Tiếng Việt, ví dụ:
   - "Cây cà chua có các triệu chứng như lá bị vàng và quả bị thối"
   - "Cây lúa bị đạo ôn là do nguyên nhân gì?"
3. Hệ thống sẽ tìm kiếm đồ thị tri thức và cung cấp thông tin liên quan

### 4. Gửi Tin nhắn

1. Tạo cuộc trò chuyện mới hoặc chọn cuộc trò chuyện hiện có
2. Tải lên hình ảnh hoặc nhập tin nhắn
3. Nếu tải lên hình ảnh, phân loại tự động sẽ được thực hiện
4. Xem lịch sử cuộc trò chuyện và phản hồi

## Tài liệu API

### Endpoints Xác thực

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập người dùng
- `POST /api/auth/logout` - Đăng xuất người dùng
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại

### Quản lý Người dùng (Chỉ Admin)

- `GET /api/users` - Lấy danh sách người dùng (với pagination)
- `GET /api/users/:id` - Lấy người dùng theo ID
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng

### Quản lý Hồ sơ

- `PUT /api/users/profile` - Cập nhật hồ sơ
- `PUT /api/users/change-password` - Đổi mật khẩu

### Tải lên Hình ảnh

- `POST /api/upload/image` - Tải lên hình ảnh lên Cloudinary
- `DELETE /api/upload/image/:publicId` - Xóa hình ảnh

### Tin nhắn

- `POST /api/messages` - Tạo tin nhắn
- `GET /api/messages` - Lấy tin nhắn (với bộ lọc)
- `GET /api/messages/:id` - Lấy tin nhắn theo ID
- `PUT /api/messages/:id/status` - Cập nhật trạng thái tin nhắn
- `DELETE /api/messages/:id` - Xóa tin nhắn

### Cuộc trò chuyện

- `POST /api/conversations` - Tạo cuộc trò chuyện
- `GET /api/conversations` - Lấy cuộc trò chuyện
- `GET /api/conversations/:id` - Lấy cuộc trò chuyện theo ID
- `PUT /api/conversations/:id` - Cập nhật cuộc trò chuyện
- `DELETE /api/conversations/:id` - Xóa cuộc trò chuyện

### ML Server Endpoints

- `GET /health` - Kiểm tra sức khỏe
- `POST /predict` - Dự đoán từ URL hình ảnh
  ```json
  {
    "image_url": "https://example.com/image.jpg"
  }
  ```
- `POST /predict/file` - Dự đoán từ tải lên file
- `POST /query/text` - Truy vấn đồ thị tri thức bằng văn bản
  ```json
  {
    "query": "Cây cà chua có các triệu chứng như lá bị vàng"
  }
  ```

## Cấu trúc dự án

```
project-ky-9/
├── backend/                    # Node.js backend server
│   ├── config/                 # Các file cấu hình
│   │   ├── db.js              # Cấu hình MongoDB
│   │   ├── jwt.js             # Cấu hình JWT
│   │   └── socket.js          # Cấu hình WebSocket
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messageController.js
│   │   ├── conversationController.js
│   │   └── uploadController.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # Middleware xác thực
│   │   ├── validation.js     # Xác thực đầu vào
│   │   └── errorHandler.js   # Xử lý lỗi
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/              # Business logic services
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── messageService.js
│   │   ├── conversationService.js
│   │   └── leafClassificationService.js
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header/
│   │   │   ├── AuthRoute.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login/
│   │   │   └── Main/
│   │   │       ├── Main.tsx
│   │   │       ├── KnowledgeLib/
│   │   │       └── Drone/
│   │   ├── services/          # API services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── messageService.ts
│   │   │   ├── conversationService.ts
│   │   │   └── cloudinaryService.ts
│   │   ├── store/             # Redux store
│   │   │   ├── slices/
│   │   │   └── store.ts
│   │   ├── translations/      # i18n files
│   │   │   ├── en.json
│   │   │   └── vi.json
│   │   └── utils/             # Utility functions
│   └── package.json
│
├── ml-server/                  # Python ML server
│   ├── app.py                 # Flask application
│   ├── model_loader.py        # Model loading utilities
│   ├── translation_service.py # Translation service
│   ├── kg_service.py          # Knowledge graph service
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── README.md             # ML server documentation
│
├── KG_RAG_AI/                  # Knowledge graph and RAG implementation
│   └── rag_knowledge_graph_disease_tree/
│       ├── build_graph.ipynb  # Graph construction notebook
│       ├── process_main.ipynb # Main processing notebook
│       ├── data/              # Data files
│       └── raw_data/          # Raw data files
│
├── docker-compose.yml          # Docker Compose configuration
├── deploy.sh                   # Deployment script
├── download_model.py          # Model download script
├── package.json               # Root package.json
└── README.md                  # File này
```

## Triển khai Docker

Để triển khai production sử dụng Docker, xem [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md).

## Cân nhắc Bảo mật

- **Mã hóa Mật khẩu**: Tất cả mật khẩu được mã hóa sử dụng bcryptjs
- **JWT Tokens**: Xác thực dựa trên token an toàn với HTTP-only cookies
- **CORS**: Được cấu hình cho các origins cụ thể
- **Xác thực Đầu vào**: Tất cả đầu vào được xác thực sử dụng express-validator
- **Kiểm soát Truy cập Dựa trên Vai trò**: Vai trò admin và user với quyền phù hợp
- **Giới hạn Tốc độ API**: Cân nhắc triển khai giới hạn tốc độ cho production

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## Giấy phép

Dự án này được cấp phép theo ISC License.

## Lời cảm ơn

- Nhóm PyTorch cho framework học sâu
- Neo4j cho cơ sở dữ liệu đồ thị
- Google Gemini cho khả năng LLM
- Nhóm React cho framework UI
