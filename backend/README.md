# API Routes Documentation

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Routes Overview

### Authentication Routes (`/api/auth`)

#### Register
- **POST** `/api/auth/register`
- **Access:** Public
- **Body:**
```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
}
```
- **Response (200):**
```json
{
    "message": "Registration Successful",
    "token": "<jwt-token>",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "isAdmin": false
    }
}
```

#### Login
- **POST** `/api/auth/login`
- **Access:** Public
- **Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Response (200):**
```json
{
    "message": "Login Successful",
    "token": "<jwt-token>",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "isAdmin": false
    }
}
```

### User Routes (`/api/user`)

#### Get User by Email
- **GET** `/api/user/:email`
- **Access:** Public
- **Response (200):**
```json
{
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "isAdmin": false
    }
}
```

#### Create User
- **POST** `/api/user`
- **Access:** Public
- **Body:**
```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
}
```

#### Delete User
- **DELETE** `/api/user/:email`
- **Access:** Public
- **Response (200):** "User Deleted"

### Blog Routes (`/api/blogs`)

#### Create Blog
- **POST** `/api/blogs`
- **Access:** Protected
- **Body:**
```json
{
    "title": "Blog Title",
    "description": "Blog content"
}
```
- **Response (200):**
```json
{
    "message": "blog added successfully",
    "data": {
        "id": 1,
        "Title": "Blog Title",
        "description": "Blog content",
        "authorId": 1,
        "verified": false,
        "likecount": 0
    }
}
```

#### Get All Verified Blogs
- **GET** `/api/blogs`
- **Access:** Public
- **Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "Title": "Blog Title",
            "description": "Blog content",
            "authorId": 1,
            "verified": true,
            "likecount": 0
        }
    ]
}
```

#### Get Blog by ID
- **GET** `/api/blogs/:id`
- **Access:** Public
- **Response (200):**
```json
{
    "data": {
        "id": 1,
        "Title": "Blog Title",
        "description": "Blog content",
        "authorId": 1,
        "verified": true,
        "likecount": 0
    }
}
```

### Like Routes (`/api/likes`)

#### Like Blog
- **POST** `/api/likes/:blogId`
- **Access:** Protected
- **Response (200):** "Liked successfully"

#### Unlike Blog
- **DELETE** `/api/likes/:blogId`
- **Access:** Protected
- **Response (200):** "Like removed successfully"

### Admin Routes (`/api/admin`)

#### Get All Users
- **GET** `/api/admin/users`
- **Access:** Admin Only
- **Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "email": "admin@example.com",
            "name": "Admin",
            "isAdmin": true
        }
    ]
}
```

#### Delete User (Admin)
- **DELETE** `/api/admin/users/:userId`
- **Access:** Admin Only
- **Response (200):** "User and associated blogs deleted successfully"

#### Set User as Admin
- **PUT** `/api/admin/users/:userId/set-admin`
- **Access:** Admin Only
- **Response (200):** "User set as admin successfully"

#### Remove Admin Privileges
- **PUT** `/api/admin/users/:userId/remove-admin`
- **Access:** Admin Only
- **Response (200):** "Admin privileges removed successfully"

#### Get All Blogs (Admin)
- **GET** `/api/admin/blogs`
- **Access:** Admin Only
- **Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "Title": "Blog Title",
            "description": "Blog content",
            "authorId": 1,
            "verified": false,
            "likecount": 0
        }
    ]
}
```

#### Reject Blog
- **PUT** `/api/admin/blogs/:blogId/reject`
- **Access:** Admin Only
- **Body:**
```json
{
    "rejectionReason": "Reason for rejection"
}
```
- **Response (200):** "Blog rejected successfully"

#### Verify Blog
- **PUT** `/api/admin/blogs/:blogId/verify`
- **Access:** Admin Only
- **Response (200):** "Blog verified successfully"

### Verification Routes

#### Email Verification
- **GET** `/verify/:token/:userId`
- **Access:** Public
- **Response (200):** "User Verified" or "Invalid Token"

#### Send OTP
- **POST** `/verify/send-otp`
- **Access:** Public
- **Body:**
```json
{
    "email": "user@example.com"
}
```
- **Response (200):**
```json
{
    "message": "OTP sent successfully"
}
```

#### Verify OTP
- **POST** `/verify/verify-otp`
- **Access:** Public
- **Body:**
```json
{
    "email": "user@example.com",
    "otp": "123456"
}
```
- **Response (200):**
```json
{
    "message": "OTP verified successfully"
}
```

## Error Responses

- **400 Bad Request:** Invalid input or missing required fields
- **401 Unauthorized:** Missing or invalid authentication token
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server-side error
