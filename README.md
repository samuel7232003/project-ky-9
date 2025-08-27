# Project ky 9


## 🚀 Tính năng

- **Authentication & Authorization**: JWT-based với role-based access control
- **User Management**: CRUD operations với pagination và filtering
- **Internationalization**: Hỗ trợ đa ngôn ngữ (Tiếng Việt/English)
- **Modern UI**: React với TypeScript và Redux Toolkit
- **API Validation**: Express-validator với error handling
- **Security**: Password hashing, CORS, secure cookies

## 📋 Yêu cầu hệ thống

- Node.js >= 16
- MongoDB >= 4.4
- npm hoặc yarn

## ⚙️ Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd nckh-2025
```

### 2. Cài đặt dependencies

```bash
npm run install:all
```

### 3. Cấu hình môi trường

#### Backend

```bash
cd backend
cp env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=nckh
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=dev
```

#### Frontend

```bash
cd frontend
cp env.example .env
```

Chỉnh sửa file `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 4. Khởi động MongoDB

```bash
mongod
```

## 🏃‍♂️ Chạy ứng dụng

### Chạy cả backend và frontend cùng lúc (Khuyến nghị)

```bash
npm run dev
```

### Chạy riêng lẻ

#### Backend

```bash
npm run dev:backend
```

#### Frontend

```bash
npm run dev:frontend
```

## 📦 Build

Để build frontend cho production:

```bash
npm run build
```

## 🔧 Scripts có sẵn

- `npm run dev` - Chạy cả backend và frontend trong development mode
- `npm run dev:backend` - Chạy chỉ backend
- `npm run dev:frontend` - Chạy chỉ frontend
- `npm run install:all` - Cài đặt dependencies cho tất cả
- `npm run build` - Build frontend cho production
- `npm run start` - Chạy backend trong production mode

## 📁 Cấu trúc dự án

```
nckh-2025/
├── backend/                 # Node.js backend
│   ├── config/             # Cấu hình database, JWT, etc.
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── configs/        # App configuration
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── translations/   # i18n files
│   │   └── utils/          # Utility functions
│   └── package.json
├── package.json            # Root package.json với scripts
└── README.md               # File này
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Users (Admin only)

- `GET /api/users` - Lấy danh sách users (với pagination)
- `GET /api/users/:id` - Lấy thông tin user
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Profile

- `PUT /api/users/profile` - Cập nhật profile
- `PUT /api/users/change-password` - Đổi mật khẩu

## 🛠️ Công nghệ sử dụng

### Backend

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Express-validator
- bcryptjs
- CORS

### Frontend

- React 19
- TypeScript
- Redux Toolkit
- React Router DOM
- Axios
- React Icons

## 🔒 Bảo mật

- Password hashing với bcryptjs
- JWT tokens với secure cookies
- CORS configuration
- Input validation
- Role-based access control
- Error handling tập trung

## 🌐 Internationalization

Hỗ trợ 2 ngôn ngữ:

- Tiếng Việt (mặc định)
- English

## 📝 Ghi chú

- Đảm bảo MongoDB đang chạy trước khi khởi động backend
- Trong production, thay đổi JWT_SECRET và các cấu hình bảo mật khác
- Sử dụng HTTPS trong production
