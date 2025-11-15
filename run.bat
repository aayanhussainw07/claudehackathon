@echo off
REM NYC Housing Compatibility - Quick Start Script (Windows)
REM This script runs both backend and frontend servers

echo.
echo 🏠 Starting NYC Housing Compatibility App...
echo.

REM Check if we're in the right directory
if not exist "backend\" (
    echo ❌ Error: Please run this script from the project root directory
    exit /b 1
)
if not exist "frontend\" (
    echo ❌ Error: Please run this script from the project root directory
    exit /b 1
)

REM Start backend in new window
echo 🔧 Starting Flask backend...
start "Flask Backend" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python app.py"

REM Wait a moment for backend to initialize
timeout /t 5 /nobreak > nul

REM Start frontend in new window
echo ⚛️  Starting React frontend...
start "React Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ✅ Servers starting in separate windows!
echo 📍 Backend:  http://localhost:5000
echo 📍 Frontend: http://localhost:3000
echo.
echo Close the command windows to stop the servers
echo.

pause
