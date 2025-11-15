# 5-Minute Quickstart Guide

Get the NYC Housing Compatibility app running in 5 minutes!

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Leave this terminal running! Backend is now at `http://localhost:5000`

## Step 2: Frontend Setup (2 minutes)

Open a **NEW terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Leave this terminal running! Frontend is now at `http://localhost:3000`

## Step 3: Use the App (1 minute)

1. Open browser to `http://localhost:3000`
2. Click "Sign Up" and create an account (any email/password)
3. Take the lifestyle quiz (move sliders, click Next)
4. Enter housing preferences (budget, beds, baths)
5. Click "Find My Neighborhoods"
6. Explore the interactive map!

## Features to Demo

**Color-Coded Markers:**
- 🟢 Green = Great match
- 🟡 Yellow = Good match
- 🔴 Red = Poor match

**Click on any marker** to see:
- Predicted price
- Affordability score
- Lifestyle compatibility
- AI-generated pros/cons

**Sidebar filters:**
- Filter by affordability
- Filter by lifestyle match
- See top 10 matches

## Troubleshooting

**Backend won't start?**
```bash
# Make sure you're in the virtual environment
which python  # Should show path with 'venv'

# Try reinstalling
pip install --upgrade pip
pip install -r requirements.txt
```

**Frontend shows blank page?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Port already in use?**
- Backend: Change port in `backend/app.py` (last line)
- Frontend: Change port in `frontend/vite.config.js`

## Next Steps

- Add your ML model to `backend/models/`
- Customize neighborhoods in `backend/neighborhood_data.py`
- Adjust scoring weights in `backend/scoring_engine.py`
- Style the UI with Tailwind classes

## Demo Checklist

For your hackathon presentation:

- [ ] Show signup flow
- [ ] Complete quiz with extreme values (e.g., max walkability)
- [ ] Set a budget and show price predictions
- [ ] Click on green marker (best match)
- [ ] Click on red marker (poor match)
- [ ] Use filters to show only affordable
- [ ] Explain scoring algorithm
- [ ] Mention future enhancements (real scraping, etc.)

Good luck! 🚀
