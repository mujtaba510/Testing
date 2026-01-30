Write-Host "🚀 Preparing for Render deployment..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building TypeScript..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Push your code to GitHub/GitLab" -ForegroundColor White
    Write-Host "2. Go to render.com and create a new Web Service" -ForegroundColor White
    Write-Host "3. Connect your repository" -ForegroundColor White
    Write-Host "4. Set build command: npm run build" -ForegroundColor White
    Write-Host "5. Set start command: npm start" -ForegroundColor White
    Write-Host "6. Add environment variables (see README.md)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Your API will be available at: https://your-app-name.onrender.com" -ForegroundColor Magenta
} else {
    Write-Host "❌ Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}