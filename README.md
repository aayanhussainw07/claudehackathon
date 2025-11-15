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

## Quick Start (5-Hour Hackathon Setup)

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Add the ML model + Claude key:
   - The pre-trained `advanced_house_price_model.joblib` from `claudehackathon-mlmodel` lives in `backend/models/`
   - Copy your key/value pair into `.env` (or export directly):
     ```bash
     export CLAUDE_API_KEY=sk-ant-...
     ```
     Claude is optional — without a key we fall back to on-device summaries.

5. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
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

The frontend will run on `http://localhost:3000`

## Usage Guide

1. **Visit the website landing page**
   - `/` showcases the NYC-only scope, explains the multi-step flow, and links to quiz/map/portfolio.

2. **Sign Up/Login**
   - Create a new account or login with existing credentials
   - Credentials are stored locally (use a proper database in production)

3. **Take the Quiz**
   - Answer questions about your lifestyle preferences
   - Covers 4 sections: Geography, Lifestyle, Food & Culture, Neighborhood Fit
   - Your answers are saved and used for compatibility scoring

4. **Review Your NYC Portfolio**
   - `/portfolio` composes your persona, preference weight bars, source digest, and Claude summary
   - Bring your own `CLAUDE_API_KEY` for live copy, or we fall back to deterministic tips
   - Use the CTA buttons to jump into housing inputs or the map

5. **Enter Housing Preferences**
   - Set your budget (slider)
   - Choose bedrooms, bathrooms, property type
   - Adjust square footage
   - Optionally predict future prices (1-5 years)

6. **Explore the Map**
   - View color-coded markers:
     - **Green** = Great match (70-100 score)
     - **Yellow** = Good match (40-69 score)
     - **Red** = Poor match (0-39 score)
   - Click markers to see:
     - Predicted price
     - Affordability score
     - Lifestyle compatibility score
     - AI-generated summary (pros/cons)
   - Filter by affordability or lifestyle match
   - Browse top matches in the sidebar

## ML Model Details

The app expects the claudehackathon-mlmodel (Gradient Boosting) with these features:
- `TYPE` (categorical)
- `BEDS` (numeric)
- `BATH` (numeric)
- `PROPERTYSQFT` (numeric)
- `ADMINISTRATIVE_AREA_LEVEL_2` (categorical - borough)
- `LOCALITY` (categorical)
- `SUBLOCALITY` (categorical)
- `STREET_NAME` (categorical)
- `LATITUDE` (numeric)
- `LONGITUDE` (numeric)

If no model is provided, the app uses a fallback heuristic based on:
- Borough base prices (Manhattan: $1500/sqft, Brooklyn: $1000/sqft, etc.)
- Property size multipliers
- Bedroom/bathroom adjustments

## Scoring Algorithm

### Affordability Score (0-100)
- 100 = 20%+ under budget
- 80 = Within budget
- 50 = 20% over budget
- 20 = 50% over budget
- 0 = Way over budget

### Lifestyle Compatibility Score (0-100)
Weighted average of:
- Walkability match (15%)
- Food/restaurant density (12%)
- Nightlife vs. quiet (10%)
- Public transit (13%)
- Parks and green space (8%)
- Diversity (7%)
- Safety/family-friendly (15%)
- Commute distance (10%)
- Age demographic fit (10%)

### Combined Score
`(Affordability × 0.5) + (Lifestyle × 0.5)`

## Claude Portfolio Details

- Endpoint: `GET /api/portfolio`
- Requires: authenticated user + completed quiz
- Data returned:
  - `persona`: NYC-only title, tagline, description, focus boroughs
  - `preference_weights`: slider weights normalized to percentages for visualization
  - `top_neighborhoods`: top 3 NYC matches with scores & highlights
  - `sources`: digest of NYC-only feeds included in the prompt
  - `ai_summary`: Claude JSON (headline, insights, call_to_action). Falls back to deterministic copy when no API key is present.

## Future Enhancements

For a production version, consider:

1. **Database**: Replace JSON storage with PostgreSQL/MongoDB
2. **Real Scraping**: Implement Reddit/Facebook API integration for real reviews
3. **Authentication**: Add OAuth (Google, Facebook), password hashing
4. **Real-time Model**: Train model on latest data, update predictions
5. **More Features**:
   - Save favorite neighborhoods
   - Email notifications for price changes
   - Roommate matching
   - Cost of living calculator
   - School ratings integration
   - Crime statistics
6. **Deployment**: Deploy to Heroku/AWS/Vercel
7. **Testing**: Add unit tests, integration tests

## Troubleshooting

### Backend Issues
- **Port already in use**: Change port in `app.py` (line: `app.run(debug=True, port=5000)`)
- **Module not found**: Make sure virtual environment is activated and dependencies are installed
- **CORS errors**: Ensure `flask-cors` is installed

### Frontend Issues
- **npm install fails**: Try `npm install --legacy-peer-deps`
- **Blank map**: Check that Leaflet CSS is loaded in `index.html`
- **API errors**: Verify backend is running on port 5000

## Contributing

This is a hackathon project! Feel free to:
- Add more neighborhoods
- Improve the scoring algorithm
- Add new quiz questions
- Enhance the UI/UX
- Integrate real data sources

## License

MIT License - feel free to use for your hackathon projects!

## Hackathon Tips

**Time-Saving Shortcuts:**
1. Use the fallback prediction if ML model setup is taking too long
2. Mock data is already included - no need to scrape initially
3. SQLite/JSON storage is fast to set up
4. Focus on core features first, add polish later
5. Test frequently - don't wait until the end

**Demo Presentation Tips:**
1. Show the full user journey (signup → quiz → input → map)
2. Highlight the scoring algorithm
3. Explain the color coding
4. Click on different neighborhoods to show AI summaries
5. Emphasize the dual-scoring system (affordability + lifestyle)

Good luck with your hackathon!