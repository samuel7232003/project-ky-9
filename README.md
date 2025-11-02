# Project ky 9

## 🚀 Tính năng

- **Authentication & Authorization**: JWT-based với role-based access control
- **User Management**: CRUD operations với pagination và filtering
- **Image Upload**: Cloudinary integration for image upload and management
- **Messaging**: Send messages with text and/or images
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
cd project-ky-9
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

# Cloudinary Configuration (Required for Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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

### Image Upload

- `POST /api/upload/image` - Upload image to Cloudinary (requires authentication)
- `DELETE /api/upload/image/:publicId` - Delete image from Cloudinary (requires authentication)

### Messages

- `POST /api/messages` - Create a new message (requires authentication)
- `GET /api/messages` - Get list of messages (requires authentication)
- `GET /api/messages/:id` - Get message by ID (requires authentication)
- `PUT /api/messages/:id/status` - Update message status (requires authentication)
- `DELETE /api/messages/:id` - Delete message (requires authentication)

## 🛠️ Công nghệ sử dụng

### Backend

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Express-validator
- bcryptjs
- CORS
- Cloudinary (Image upload and management)
- Multer (File upload handling)

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

---

## 📸 Image Upload & Messaging Documentation

### Overview

This project includes comprehensive image upload and messaging features using Cloudinary for image storage and management. Users can upload images and send messages with text and/or images.

### Prerequisites

1. **Cloudinary Account**: Create a free account at [cloudinary.com](https://cloudinary.com)
2. **Get Cloudinary Credentials**: After creating an account, get your:
   - Cloud Name
   - API Key
   - API Secret
3. **Configure Environment Variables**: Add the credentials to your `.env` files (see Installation section above)

### Image Upload Feature

#### Backend API

The image upload feature uses Cloudinary for cloud-based image storage. All upload endpoints require authentication.

##### Upload Image

**Endpoint**: `POST /api/upload/image`

**Authentication**: Required (JWT token)

**Request**:

- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): Image file (max 10MB, images only)
  - `folder` (optional, string): Cloudinary folder name
  - `public_id` (optional, string): Custom public ID for the image
  - `width` (optional, number): Resize width
  - `height` (optional, number): Resize height
  - `crop` (optional, string): Crop mode (e.g., "fill", "fit", "scale")
  - `quality` (optional, number | "auto"): Image quality
  - `format` (optional, string): Image format (e.g., "jpg", "png", "webp")
  - `tags` (optional, string): Comma-separated tags

**Response** (200 OK):

```json
{
  "public_id": "folder/image_id",
  "secure_url": "https://res.cloudinary.com/.../image.jpg",
  "url": "http://res.cloudinary.com/.../image.jpg",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "bytes": 245678,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:

- `400 Bad Request`: No file provided or invalid file type
- `401 Unauthorized`: Missing or invalid authentication token
- `500 Internal Server Error`: Cloudinary upload error

##### Delete Image

**Endpoint**: `DELETE /api/upload/image/:publicId`

**Authentication**: Required (JWT token)

**Request**:

- URL Parameter: `publicId` - The Cloudinary public ID of the image

**Response** (200 OK):

```json
{
  "message": "Xóa ảnh thành công",
  "result": "ok"
}
```

**Error Responses**:

- `400 Bad Request`: Invalid public ID
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Image not found
- `500 Internal Server Error`: Cloudinary deletion error

#### Frontend Service

The frontend provides a TypeScript service (`cloudinaryService.ts`) for easy image upload integration.

##### Upload Image via Backend API (Recommended)

```typescript
import { cloudinaryService } from "./services/cloudinaryService";

// Upload a single image
const handleUpload = async (file: File) => {
  try {
    const result = await cloudinaryService.uploadImage(file, {
      folder: "uploads",
      transformation: {
        width: 1920,
        height: 1080,
        crop: "fill",
        quality: "auto",
      },
      tags: ["user-upload", "photo"],
    });

    console.log("Uploaded:", result.secureUrl);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

##### Upload Multiple Images

```typescript
// Upload multiple images
const handleMultipleUpload = async (files: File[]) => {
  try {
    const results = await cloudinaryService.uploadMultipleImages(files, {
      folder: "messages",
      transformation: {
        quality: "auto",
      },
    });

    return results; // Array of upload results
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

##### Delete Image

```typescript
// Delete an image
const handleDelete = async (publicId: string) => {
  try {
    await cloudinaryService.deleteImage(publicId);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
```

##### Direct Upload (Alternative)

You can also upload directly to Cloudinary from the frontend (requires upload preset configuration):

```typescript
// Direct upload (bypasses backend)
const result = await cloudinaryService.uploadImageDirect(file, {
  folder: "direct-uploads",
  transformation: {
    width: 800,
    quality: "auto",
  },
});
```

### Messaging Feature

#### Overview

The messaging feature allows users to send and manage messages with text and/or images. Each message can contain:

- Text content (optional)
- One image (optional)
- At least one of the above is required

#### Backend API

##### Create Message

**Endpoint**: `POST /api/messages`

**Authentication**: Required (JWT token)

**Request Body**:

```json
{
  "content": "Hello, this is a message", // Optional
  "image": "https://res.cloudinary.com/.../image.jpg" // Optional (single image URL, not array)
}
```

**Validation Rules**:

- Must have at least `content` OR `image`
- `image` must be a string (URL), not an array
- Only one image per message is allowed

**Response** (201 Created):

```json
{
  "_id": "message_id",
  "content": "Hello, this is a message",
  "image": "https://res.cloudinary.com/.../image.jpg",
  "userId": {
    "_id": "user_id",
    "username": "john_doe",
    "name": "John Doe",
    "avatar": "https://..."
  },
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:

- `400 Bad Request`: Missing both content and image, or image is an array
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: User not found

##### Get Messages

**Endpoint**: `GET /api/messages`

**Authentication**: Required (JWT token)

**Query Parameters**:

- `userId` (optional, string): Filter by user ID (admin only)
- `status` (optional, string): Filter by status (`pending`, `read`, `archived`)
- `page` (optional, number): Page number (default: 1)
- `limit` (optional, number): Items per page (default: 10)

**Note**: Regular users can only see their own messages. Admins can see all messages or filter by user.

**Response** (200 OK):

```json
{
  "messages": [
    {
      "_id": "message_id",
      "content": "Hello",
      "image": "https://...",
      "userId": { ... },
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

##### Get Message by ID

**Endpoint**: `GET /api/messages/:id`

**Authentication**: Required (JWT token)

**Response** (200 OK): Same format as create message response

**Error Responses**:

- `403 Forbidden`: User trying to access another user's message (non-admin)
- `404 Not Found`: Message not found

##### Update Message Status

**Endpoint**: `PUT /api/messages/:id/status`

**Authentication**: Required (JWT token)

**Request Body**:

```json
{
  "status": "read" // "pending", "read", or "archived"
}
```

**Response** (200 OK): Updated message object

**Error Responses**:

- `400 Bad Request`: Invalid status value
- `403 Forbidden`: User trying to update another user's message (non-admin)
- `404 Not Found`: Message not found

##### Delete Message

**Endpoint**: `DELETE /api/messages/:id`

**Authentication**: Required (JWT token)

**Response** (204 No Content): Empty response

**Error Responses**:

- `403 Forbidden`: User trying to delete another user's message (non-admin)
- `404 Not Found`: Message not found

#### Frontend Service

The frontend provides a TypeScript service (`messageService.ts`) for message management.

##### Send a Text Message

```typescript
import { messageService } from "./services/messageService";

const sendTextMessage = async () => {
  try {
    const message = await messageService.createMessage({
      content: "Hello, this is a text message",
    });
    console.log("Message sent:", message);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
```

##### Send a Message with Image

**Option 1: Upload image first, then create message**

```typescript
import { messageService } from "./services/messageService";
import { cloudinaryService } from "./services/cloudinaryService";

const sendMessageWithImage = async (file: File, text?: string) => {
  try {
    // Step 1: Upload image
    const uploadResult = await cloudinaryService.uploadImage(file, {
      folder: "messages",
    });

    // Step 2: Create message with image URL
    const message = await messageService.createMessage({
      content: text,
      image: uploadResult.secureUrl,
    });

    console.log("Message with image sent:", message);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
```

**Option 2: Use helper method (uploads and creates in one step)**

```typescript
const sendMessageWithImage = async (file: File, text?: string) => {
  try {
    const message = await messageService.createMessageWithImage(file, text, {
      folder: "messages",
      transformation: {
        quality: "auto",
      },
    });

    console.log("Message with image sent:", message);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
```

##### Get Messages

```typescript
// Get all user's messages
const getMyMessages = async () => {
  try {
    const result = await messageService.getMessages({
      status: "pending",
      page: 1,
      limit: 20,
    });

    console.log("Messages:", result.messages);
    console.log("Total:", result.total);
  } catch (error) {
    console.error("Failed to get messages:", error);
  }
};
```

##### Update Message Status

```typescript
const markAsRead = async (messageId: string) => {
  try {
    const updated = await messageService.updateMessageStatus(messageId, "read");
    console.log("Message updated:", updated);
  } catch (error) {
    console.error("Failed to update message:", error);
  }
};
```

##### Delete Message

```typescript
const deleteMessage = async (messageId: string) => {
  try {
    await messageService.deleteMessage(messageId);
    console.log("Message deleted");
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
};
```

### Example: Complete Workflow

Here's a complete example of uploading an image and sending it as a message:

```typescript
import { messageService } from "./services/messageService";

const handleSendImageMessage = async (file: File, caption?: string) => {
  try {
    // Upload image and create message in one step
    const message = await messageService.createMessageWithImage(
      file,
      caption || "Check out this image!",
      {
        folder: "messages",
        transformation: {
          width: 1920,
          height: 1080,
          crop: "fill",
          quality: "auto",
          format: "webp",
        },
        tags: ["user-message"],
      }
    );

    console.log("Message sent successfully:", message);
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Usage in a React component
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const message = await handleSendImageMessage(file, "My uploaded image");
    // Handle success (update UI, show notification, etc.)
  } catch (error) {
    // Handle error (show error message, etc.)
  }
};
```

### File Size and Format Limitations

- **Maximum file size**: 10MB per image
- **Supported formats**: All image formats (JPEG, PNG, GIF, WebP, etc.)
- **File validation**: Only image files are accepted (MIME type must start with `image/`)

### Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only access/modify their own messages (admins can access all)
3. **File validation**: Server validates file type and size before upload
4. **Rate limiting**: Consider implementing rate limiting for production
5. **Image transformations**: Use Cloudinary transformations to optimize images and reduce bandwidth

### Best Practices

1. **Use transformations**: Always apply image transformations for optimization
2. **Set appropriate folders**: Organize images in Cloudinary folders
3. **Add tags**: Use tags for better image management
4. **Handle errors**: Always implement proper error handling in your frontend
5. **Show upload progress**: Consider implementing upload progress indicators for better UX
6. **Validate before upload**: Validate file size and type on the client side before upload

### Troubleshooting

**Issue**: Upload fails with authentication error

- **Solution**: Ensure you're sending a valid JWT token in the Authorization header

**Issue**: "Cloudinary configuration missing" error

- **Solution**: Verify all Cloudinary environment variables are set correctly in your `.env` file

**Issue**: Image upload succeeds but message creation fails

- **Solution**: Ensure the image URL from Cloudinary is valid and accessible

**Issue**: "Message can only have one image" error

- **Solution**: Ensure you're sending `image` as a string (URL), not an array

**Issue**: File size exceeds limit

- **Solution**: Implement client-side file size validation or compress images before upload
