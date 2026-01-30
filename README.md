# Production-Grade Backend API - Node.js + TypeScript

Enterprise-ready authentication API with OTP verification, JWT tokens, and secure email delivery.

## 🚀 Features

- **User Signup** with email verification
- **OTP-based verification** (4-digit, 5-minute expiry)
- **Secure Login** with JWT tokens stored in HTTP-only cookies
- **Production-grade email service** using Nodemailer
- **Full TypeScript** support with strict type checking
- **Password hashing** using bcrypt
- **MongoDB** with Mongoose ODM

## 📁 Project Structure

```
src/
├── server.ts           # Application entry point
├── config/
│   ├── database.ts     # MongoDB connection
│   └── email.ts        # Nodemailer configuration
├── models/
│   └── User.ts         # User model with OTP fields
├── controllers/
│   └── authController.ts  # Authentication logic
└── routes/
    └── authRoutes.ts   # API routes
```

## 🛠️ Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual credentials:
   - MongoDB URI
   - SMTP credentials (Gmail App Password recommended)
   - JWT secret
   - Other settings

3. **Build and run:**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `SMTP_PASS`

## 🔑 API Endpoints

### 1. User Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully. OTP sent to email.",
  "data": {
    "email": "user@example.com",
    "isVerified": false
  }
}
```

### 2. Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "1234"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": {
    "email": "user@example.com",
    "isVerified": true
  }
}
```

### 3. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** JWT token is also set in HTTP-only cookie named `token`.

## 🔒 Security Features

- **Passwords** hashed with bcrypt (10 salt rounds)
- **OTPs** hashed before storage in database
- **JWT tokens** stored in HTTP-only, secure cookies
- **5-minute OTP expiry** for security
- **Email validation** and input sanitization
- **Environment-based configuration** (no hardcoded secrets)

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a strong `JWT_SECRET` (32+ characters)
3. Configure production MongoDB URI (MongoDB Atlas recommended)
4. Use production SMTP service or dedicated email provider
5. Set `CORS_ORIGIN` to your frontend domain
6. Enable HTTPS for secure cookie transmission
7. Use secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemailer** - Email delivery
- **cookie-parser** - Cookie handling
- **dotenv** - Environment variables
- **cors** - CORS support

## 🧪 Testing

Test endpoints using Postman, Insomnia, or curl:

```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📝 License

ISC

## 👨‍💻 Support

For issues or questions, please check the environment configuration and logs.
