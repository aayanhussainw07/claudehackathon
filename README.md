# NYC Housing Compatibility Finder

A full-stack web application that helps users find their ideal NYC neighborhood by combining ML-based price predictions with lifestyle compatibility scoring.

## Features

- **NYC-only Website**: Landing page that introduces the experience, NYC stats, and live CTAs instead of jumping straight into an app screen
- **Lifestyle Quiz**: Multi-section questionnaire covering preferences for walkability, food, nightlife, transit, and more
- **Claude Portfolio Builder**: Weighted quiz answers are turned into a persona, NYC source digest, and Claude-generated plan (`/api/portfolio`)
- **Housing Input**: Customizable budget, bedrooms, bathrooms, property type, and square footage scoped to NYC
- **ML Price Predictions**: Predict current and future housing prices using the claudehackathon-mlmodel (`models/advanced_house_price_model.joblib`)
- **Compatibility Scoring**: Match user preferences with neighborhood characteristics
- **Interactive Map**: Leaflet-based map visualization with color-coded markers
- **AI Summaries**: Neighborhood insights aggregated from community feedback or Claude (when API key is provided)

## Tech Stack

### Backend
- **Flask** - Python web framework
- **scikit-learn** - ML model for price predictions
- **Pandas/NumPy** - Data processing

### Frontend
- **React** - UI library
- **Vite** - Build tool (fast dev server)
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **Axios** - API requests

## Project Structure

```
claudehackathon/
├── backend/
│   ├── app.py                  # Main Flask application
│   ├── model_predictor.py      # ML model wrapper
│   ├── scoring_engine.py       # Lifestyle compatibility algorithm
│   ├── neighborhood_data.py    # NYC neighborhood data
│   ├── claude_portfolio.py     # Claude-powered portfolio helper + NYC data sources
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 # ML model files (add your .joblib here)
│   └── data/                   # User data storage
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── HousingInput.jsx
│   │   │   └── MapView.jsx
│   │   ├── utils/
│   │   │   └── api.js          # API client
│   │   ├── styles/
│   │   │   └── index.css       # Tailwind CSS
│   │   ├── App.jsx             # Main app with routing
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```
