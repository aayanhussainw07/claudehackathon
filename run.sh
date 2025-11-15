#!/bin/bash

# NYC Housing Compatibility - Quick Start Script
# This script runs both backend and frontend servers concurrently

echo "🏠 Starting NYC Housing Compatibility App..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend
echo "🔧 Starting Flask backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting React frontend..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started!"
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for processes
wait
