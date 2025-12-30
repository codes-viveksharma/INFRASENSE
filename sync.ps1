# INFRASENSE Sync & Deploy Script
# Run this command: .\sync.ps1 "Your commit message"

$msg = $args[0]
if (-not $msg) { $msg = "sync: update project at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" }

Write-Host "🚀 Starting Sync to GitHub..." -ForegroundColor Cyan

# Stage all changes
git add .

# Commit
git commit -m $msg

# Push to main
git push origin main

Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
Write-Host "🌐 Render (Backend) and Vercel (Frontend) will now start auto-deploying." -ForegroundColor Yellow
Write-Host "Check progress here:" -ForegroundColor White
Write-Host "- Frontend: https://vercel.com/dashboard"
Write-Host "- Backend: https://dashboard.render.com/"
