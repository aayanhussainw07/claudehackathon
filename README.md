# Boroughs

**Boroughs** is an intelligent NYC neighborhood matching platform that helps you find your perfect New York City neighborhood by combining machine learning price predictions with personalized lifestyle compatibility scoring.

## About

Boroughs uses a data-driven approach to match you with NYC neighborhoods that fit both your budget and lifestyle. By analyzing your preferences through an interactive quiz and combining them with real housing data, we provide personalized recommendations across all five boroughs of New York City.

## Features

### Core Experience
- **Modern Landing Page**: Beautiful, animated introduction showcasing NYC statistics and platform features
- **Lifestyle Quiz**: Comprehensive questionnaire covering walkability, nightlife, food scene, transit, safety, and more
- **Personalized Portfolio**: AI-generated persona with weighted preference analysis and neighborhood recommendations
- **Housing Predictions**: ML-powered price predictions for current and future housing costs
- **Interactive Map**: Leaflet-based visualization with color-coded neighborhood markers
- **Neighborhood Insights**: AI-generated summaries with pros, cons, and sentiment analysis
- **Review System**: Community feedback and ratings for neighborhoods

### Smart Matching
- **Dual Scoring System**:
  - **Affordability Score**: How well neighborhoods fit your budget
  - **Lifestyle Score**: How well they match your preferences
- **NYC-Only Data**: All recommendations sourced exclusively from New York City neighborhoods
- **Real-time Updates**: Dynamic filtering and sorting based on your criteria

## Tech Stack

### Frontend
- **React** + **Vite** - Modern UI with fast development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Leaflet** - Interactive map visualizations
- **React Router** - Client-side routing
- **Axios** - API communication

### Backend
- **Flask** - Python web framework
- **scikit-learn** - ML models for price predictions
- **Pandas/NumPy** - Data processing and analysis
- **Flask-CORS** - Cross-origin resource sharing

## Project Structure

```
Boroughs/
├── backend/
│   ├── app.py                  # Flask application & API endpoints
│   ├── model_predictor.py      # ML price prediction model
│   ├── scoring_engine.py       # Lifestyle compatibility algorithm
│   ├── neighborhood_data.py    # NYC neighborhood database
│   ├── claude_portfolio.py     # AI portfolio generation
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 # ML model files
│   └── data/                   # User data & reviews
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── HousingInput.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── Login.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── StaggeredMenu.jsx
│   │   │   └── NeighborhoodModal.jsx
│   │   ├── utils/
│   │   │   └── api.js          # API client
│   │   ├── App.jsx             # Main app with routing
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Add Claude API key for AI-generated summaries:
```bash
export ANTHROPIC_API_KEY=your_key_here
```
*Note: The app works without an API key using fallback summaries*

5. Run the Flask server:
```bash
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## How It Works

### 1. Landing Page
Visit the homepage to explore Boroughs' features, NYC statistics, and get started with the matching process.

### 2. Lifestyle Quiz
Complete a comprehensive quiz covering:
- **Geography**: Commute preferences and location priorities
- **Lifestyle & Environment**: Walkability, nightlife, parks, transit
- **Food & Culture**: Restaurant scene, cultural diversity
- **Neighborhood Fit**: Safety, demographics, family-friendliness

### 3. Personal Portfolio
Receive a personalized portfolio including:
- **Persona**: AI-generated profile based on your preferences
- **Preference Weights**: Visual breakdown of what matters most to you
- **Top Neighborhoods**: Curated list of best matches
- **NYC Data Sources**: Insights from local NYC feeds
- **AI Summary**: Personalized recommendations and action items

### 4. Housing Input
Set your specific housing criteria:
- Budget (with slider)
- Bedrooms & bathrooms
- Property type (Condo, Co-op, Townhouse, etc.)
- Square footage
- Future price predictions (1-5 years)

### 5. Interactive Map
Explore neighborhoods with:
- **Color-coded markers**:
  - 🟢 Green = Great match (70-100)
  - 🟡 Yellow = Good match (40-69)
  - 🔴 Red = Poor match (0-39)
- **Detailed insights**: Predicted prices, scores, AI summaries
- **Smart filters**: Filter by affordability or lifestyle match
- **Top matches sidebar**: Quick access to best recommendations

## Scoring Algorithm

### Affordability Score (0-100)
- **100**: 20%+ under budget
- **80**: Within budget
- **50**: 20% over budget
- **20**: 50% over budget
- **0**: Significantly over budget

### Lifestyle Compatibility Score (0-100)
Weighted average based on quiz responses:
- Walkability (15%)
- Food & restaurants (12%)
- Nightlife preference (10%)
- Public transit (13%)
- Parks & green space (8%)
- Cultural diversity (7%)
- Safety & family-friendliness (15%)
- Commute distance (10%)
- Age demographics (10%)

### Combined Score
`(Affordability × 50%) + (Lifestyle × 50%)`

## ML Model

The prediction model uses Gradient Boosting with features:
- Property type, beds, baths, square footage
- Borough, locality, sublocality, street
- Geographic coordinates (lat/long)

*Fallback heuristics are used when the ML model is unavailable*

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login

### Quiz & Portfolio
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/portfolio` - Get personalized portfolio

### Housing & Predictions
- `POST /api/housing/predict` - Get neighborhood predictions
- `GET /api/neighborhood/<name>` - Get neighborhood details

### Reviews
- `GET /api/neighborhood/<name>/reviews` - Get reviews
- `POST /api/neighborhood/<name>/reviews` - Submit review

## Future Enhancements

- **Database Integration**: PostgreSQL for production data storage
- **Real-time Data**: Live scraping of reviews and market data
- **Enhanced Authentication**: OAuth, password hashing, session management
- **Additional Features**:
  - Save favorite neighborhoods
  - Price change alerts
  - School ratings integration
  - Crime statistics
  - Cost of living calculator
  - Commute time estimates
- **Mobile App**: React Native version
- **Social Features**: Share portfolios, neighborhood discussions

## Troubleshooting

### Backend Issues
- **Port in use**: Change port in `app.py`
- **Module errors**: Ensure virtual environment is activated
- **CORS errors**: Verify `flask-cors` is installed

### Frontend Issues
- **npm install fails**: Try `npm install --legacy-peer-deps`
- **Map not loading**: Check Leaflet CSS import
- **API errors**: Verify backend is running on port 5000

## Contributing

Contributions are welcome! Please feel free to:
- Add more NYC neighborhoods
- Improve scoring algorithms
- Enhance UI/UX
- Add new features
- Integrate additional data sources

## License

MIT License

---

**Boroughs** - Find Your Perfect NYC Neighborhood
