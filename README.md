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

## 🛠️ Installation & Development

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual credentials

3. **Run in development:**
   ```bash
   npm run dev
   ```

## 🚀 Production Deployment on Render

### Step 1: Prepare Your Project

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Test production build:**
   ```bash
   npm start
   ```

### Step 2: Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub/GitLab account

2. **Connect Repository:**
   - Click "New +" → "Web Service"
   - Connect your GitHub/GitLab repository
   - Select this project

3. **Configure Service:**
   - **Name:** `auth-api` (or your choice)
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

4. **Environment Variables:**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-32-chars-min
   JWT_EXPIRY=7d
   COOKIE_EXPIRY=1
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   EMAIL_FROM_NAME=Your App Name
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

#### Option B: Using render.yaml (Blueprint)

1. **Push `render.yaml` to your repository**
2. **Deploy via Render Blueprint:**
   - Go to Render → "New +" → "Blueprint"
   - Connect repository
   - Render will auto-configure using `render.yaml`

### Step 3: Database Setup

1. **MongoDB Atlas:**
   - Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Get connection string
   - Whitelist Render's IP (0.0.0.0/0 for development)

2. **Update Environment Variables:**
   - Set `MONGODB_URI` in Render dashboard

### Step 4: Email Configuration

1. **Gmail Setup:**
   - Enable 2FA on Gmail
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use App Password in `SMTP_PASS`

2. **Environment Variables:**
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=16-character-app-password
   ```

### Step 5: Domain & SSL

- Render provides free SSL certificate
- Custom domain available in paid plans
- CORS_ORIGIN should match your frontend URL

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
curl https://your-render-app-url.onrender.com/health

# Signup
curl -X POST https://your-render-app-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📝 Environment Variables Reference

| Variable          | Description            | Example                |
| ----------------- | ---------------------- | ---------------------- |
| `NODE_ENV`        | Environment            | `production`           |
| `PORT`            | Server port            | `10000`                |
| `MONGODB_URI`     | MongoDB connection     | `mongodb+srv://...`    |
| `JWT_SECRET`      | JWT signing key        | `32+ character secret` |
| `JWT_EXPIRY`      | Token expiry           | `7d`                   |
| `COOKIE_EXPIRY`   | Cookie expiry (days)   | `1`                    |
| `SMTP_HOST`       | Email SMTP host        | `smtp.gmail.com`       |
| `SMTP_PORT`       | SMTP port              | `587`                  |
| `SMTP_USER`       | Email username         | `your-email@gmail.com` |
| `SMTP_PASS`       | Email password/App key | `app-password`         |
| `EMAIL_FROM_NAME` | Sender name            | `Your App`             |
| `CORS_ORIGIN`     | Frontend URL           | `https://yourapp.com`  |

## 🚨 Production Checklist

- [ ] Environment variables set correctly
- [ ] MongoDB Atlas connection working
- [ ] Email service configured
- [ ] CORS_ORIGIN updated for production
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] SSL enabled (Render provides this)
- [ ] Domain configured (optional)

## 📞 Support

For deployment issues:

1. Check Render build logs
2. Verify environment variables
3. Test database connection
4. Check email configuration

## 📄 License

ISC
