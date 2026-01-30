#!/bin/bash

echo "🚀 Preparing for Render deployment..."

# Build the project
echo "📦 Building TypeScript..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub/GitLab"
    echo "2. Go to render.com and create a new Web Service"
    echo "3. Connect your repository"
    echo "4. Set build command: npm run build"
    echo "5. Set start command: npm start"
    echo "6. Add environment variables (see README.md)"
    echo ""
    echo "🔗 Your API will be available at: https://your-app-name.onrender.com"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi