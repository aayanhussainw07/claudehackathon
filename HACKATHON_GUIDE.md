# Hackathon Guide - NYC Housing Compatibility Finder

## Elevator Pitch (30 seconds)

"Finding the right neighborhood in NYC is overwhelming. You need to consider not just affordability, but also lifestyle fit - walkability, food options, nightlife, safety. Our app uses machine learning to predict housing prices AND matches your lifestyle preferences with neighborhood characteristics, giving you a personalized map of where you'll actually be happy living."

## Problem Statement

Students and young professionals moving to NYC face these challenges:

1. **Information Overload**: Too many neighborhoods, too many factors
2. **Hidden Costs**: Rent may be affordable now, but will it stay that way?
3. **Lifestyle Mismatch**: An affordable apartment in the wrong neighborhood = unhappy living
4. **Scattered Data**: Have to check multiple sites for prices, reviews, walkability, etc.

## Our Solution

A single platform that:
- Predicts housing prices (current + future)
- Scores neighborhoods based on YOUR lifestyle preferences
- Visualizes results on an interactive map
- Provides AI-generated summaries from community feedback

## Technical Architecture

### Backend (Flask + Python)
```
User Request
    ↓
Flask API (open demo mode)
    ↓
┌─────────────────┬──────────────────────┐
│                 │                      │
ML Model          Quiz Scoring          Data Layer
(Price)           (Lifestyle)           (Neighborhoods)
    │                 │                      │
    └─────────────────┴──────────────────────┘
                      ↓
            Combined Score (0-100)
                      ↓
               JSON Response
```

### Frontend (React + Leaflet)
```
Login/Signup
    ↓
Lifestyle Quiz (4 sections, 10+ questions)
    ↓
Housing Input (budget, beds, baths, sqft)
    ↓
Map View (color-coded markers + details)
```

### Data Flow
1. User completes quiz → stored in backend
2. User enters housing preferences → stored locally
3. Backend generates predictions for ~13 NYC neighborhoods
4. For each neighborhood:
   - ML model predicts price
   - Scoring engine calculates lifestyle match
   - Combined score = (affordability × 0.5) + (lifestyle × 0.5)
5. Frontend displays results on map with color coding

## Key Innovation: Dual Scoring System

Most housing apps focus on ONE dimension:
- Zillow/Trulia = price only
- WalkScore = walkability only
- Yelp = food/amenities only

We combine BOTH affordability AND lifestyle in a single score:

```python
affordability_score = f(predicted_price, user_budget)
lifestyle_score = weighted_average([
    walkability_match,
    food_match,
    nightlife_match,
    transit_match,
    parks_match,
    diversity_match,
    safety_match,
    commute_match,
    demographic_match
])

final_score = (affordability_score + lifestyle_score) / 2
```

## ML Component

**Model Type**: GradientBoostingRegressor (scikit-learn)
**Features**: 10 inputs (beds, baths, sqft, location coords, etc.)
**Output**: Predicted price
**Enhancement**: Future price prediction using appreciation rate

If model isn't available, fallback uses heuristic based on borough pricing.

## Demo Flow (3-5 minutes)

1. **Signup** (10 sec)
   - Show quick account creation

2. **Quiz** (60 sec)
   - "I value walkability (10/10)"
   - "I want lots of food options (9/10)"
   - "Safety is important (8/10)"
   - "I prefer quiet neighborhoods (nightlife: 2/10)"

3. **Housing Input** (30 sec)
   - Budget: $600,000
   - 2 bed, 1 bath
   - 1000 sqft
   - Predict 2 years in future

4. **Map Results** (90 sec)
   - Point out color coding
   - Click GREEN marker (e.g., Astoria)
     - "Perfect match! Affordable + high food score + walkable"
   - Click RED marker (e.g., Upper East Side)
     - "Over budget, even though lifestyle matches"
   - Show filters
   - Show AI summary with pros/cons

5. **Technical Highlight** (30 sec)
   - "Our dual-scoring system considers BOTH price AND lifestyle"
   - "ML model predicts future prices so you can plan long-term"
   - "All in one platform - no need to jump between 5 different sites"

## What Makes This Hackathon-Ready

**Built in ~5 hours:**
- Used proven tech stack (Flask + React)
- Focused on core features
- Mock data for scraping (can demo concept without API keys)
- Fallback ML prediction (works even without trained model)
- Simple JSON storage (no database setup needed)

**Scalable for Future:**
- Easy to add real Reddit/Facebook scraping
- Can swap JSON for PostgreSQL
- ML model can be retrained with latest data
- Can add more neighborhoods/cities

## Judging Criteria Alignment

**Innovation** ⭐⭐⭐⭐⭐
- Dual-scoring system is unique
- Combines ML + lifestyle compatibility
- Future price prediction feature

**Technical Execution** ⭐⭐⭐⭐
- Full-stack app with auth
- Real ML integration (or smart fallback)
- Interactive map visualization
- Clean API design

**User Experience** ⭐⭐⭐⭐⭐
- Intuitive flow (quiz → input → results)
- Visual feedback (color coding, scores)
- Detailed insights (AI summaries)
- Responsive design

**Practicality** ⭐⭐⭐⭐⭐
- Solves real problem (housing search)
- Target market is clear (students/young professionals)
- Revenue potential (premium features, affiliate links)

## Potential Questions from Judges

**Q: How accurate is your ML model?**
A: Our model is a GradientBoostingRegressor trained on NYC real estate data. For the hackathon, we also have a heuristic fallback that uses median prices per borough. In production, we'd continuously retrain with latest market data.

**Q: Where do you get the neighborhood data?**
A: Currently using curated data. Future plan: scrape Reddit (r/nyc, r/AskNYC), Facebook housing groups, and integrate APIs like WalkScore, Yelp, and transit data.

**Q: How do you make money?**
A:
- Freemium model (limit searches, premium = unlimited)
- Affiliate fees from real estate agents/brokers
- Sponsored neighborhood listings
- Premium features (price alerts, advanced filters)

**Q: What about other cities?**
A: Architecture is city-agnostic. Just need to add neighborhood data for each city. We started with NYC because it's the most complex housing market.

**Q: How do you ensure data privacy?**
A: The hackathon demo now runs entirely in open mode—no server-side authentication or storage of personal data beyond temporary quiz responses. In production we would add encrypted passwords (bcrypt), GDPR compliance, account deletion, and never sell personal info.

## Future Roadmap

**Phase 1 (Post-Hackathon)**
- Deploy to cloud (Heroku/AWS)
- Add database (PostgreSQL)
- Implement real scraping
- Add more neighborhoods

**Phase 2 (Month 2-3)**
- User accounts with saved searches
- Email price alerts
- Roommate matching feature
- Mobile app (React Native)

**Phase 3 (Month 4-6)**
- Expand to other cities (SF, LA, Boston)
- Partner with real estate agents
- Add virtual tours integration
- Premium subscription launch

## Success Metrics

**Demo Success:**
- ✅ Shows end-to-end flow
- ✅ ML prediction works
- ✅ Map is interactive
- ✅ Scores make sense

**Hackathon Win:**
- Solves real problem ✅
- Technical excellence ✅
- Great UX ✅
- Clear business model ✅
- Scalable architecture ✅

## Contact & Links

- **GitHub**: [Your repo URL]
- **Live Demo**: [If deployed]
- **Presentation**: [Slides link]
- **Team**: [Your names]

---

**Remember**: Practice your demo at least 3 times before presenting. Focus on the problem → solution → innovation flow. Good luck! 🚀
