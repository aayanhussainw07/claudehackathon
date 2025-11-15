from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv

load_dotenv()

from model_predictor import HousingPredictor
from scoring_engine import calculate_compatibility_score
from neighborhood_data import get_nyc_neighborhoods
from claude_portfolio import (
    derive_preference_weights,
    build_persona_profile,
    aggregate_source_digest,
    generate_claude_portfolio_summary
)

app = Flask(__name__)

# --- FIXED CORS (WORKS 100%) ---
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    return response


# Initialize ML model
predictor = HousingPredictor()

APP_STATE_FILE = 'data/app_state.json'

def load_app_state():
    if os.path.exists(APP_STATE_FILE):
        with open(APP_STATE_FILE, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                pass
    return {'quiz_results': None}

def save_app_state():
    os.makedirs('data', exist_ok=True)
    with open(APP_STATE_FILE, 'w') as f:
        json.dump(app_state, f, indent=2)

app_state = load_app_state()

# -------------------------------
# AUTH ROUTES
# -------------------------------

@app.route('/api/auth/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    email = data.get('email') or 'guest@nyc.local'
    password = data.get('password') or 'guest'

    return jsonify({'token': 'demo-token', 'email': email}), 201


@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    email = data.get('email') or 'guest@nyc.local'
    password = data.get('password') or 'guest'

    return jsonify({'token': 'demo-token', 'email': email}), 200


# -------------------------------
# QUIZ ROUTES
# -------------------------------

@app.route('/api/quiz/submit', methods=['POST', 'OPTIONS'])
def submit_quiz():
    if request.method == "OPTIONS":
        return '', 200

    quiz_data = request.get_json() or {}
    app_state['quiz_results'] = quiz_data
    save_app_state()

    return jsonify({'message': 'Quiz saved successfully'}), 200


@app.route('/api/quiz/results', methods=['GET'])
def get_quiz_results():
    results = app_state.get('quiz_results')
    return jsonify({'results': results}), 200


# -------------------------------
# PREDICTION ROUTE
# -------------------------------

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict_housing():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()

    # User inputs
    budget = data.get('budget')
    beds = data.get('beds')
    baths = data.get('baths')
    property_type = data.get('propertyType', 'CONDO')
    property_sqft = data.get('propertySqft', 1000)
    years_future = data.get('yearsFuture', 0)

    quiz_results = app_state.get('quiz_results') or {}
    neighborhoods = get_nyc_neighborhoods()

    predictions = []

    for neighborhood in neighborhoods:
        prediction_input = {
            'TYPE': property_type,
            'BEDS': beds,
            'BATH': baths,
            'PROPERTYSQFT': property_sqft,
            'ADMINISTRATIVE_AREA_LEVEL_2': neighborhood['admin_area'],
            'LOCALITY': neighborhood['locality'],
            'SUBLOCALITY': neighborhood['sublocality'],
            'STREET_NAME': neighborhood['street_name'],
            'LATITUDE': neighborhood['lat'],
            'LONGITUDE': neighborhood['lng']
        }

        try:
            predicted_price = predictor.predict(prediction_input, years_future)
            affordability_score = calculate_affordability_score(predicted_price, budget)
            lifestyle_score = calculate_compatibility_score(quiz_results, neighborhood)
            combined_score = (affordability_score * 0.5) + (lifestyle_score * 0.5)

            predictions.append({
                'name': neighborhood['name'],
                'lat': neighborhood['lat'],
                'lng': neighborhood['lng'],
                'predicted_price': round(predicted_price, 2),
                'affordability_score': round(affordability_score, 2),
                'lifestyle_score': round(lifestyle_score, 2),
                'combined_score': round(combined_score, 2),
                'color': get_color_from_score(combined_score),
                'details': neighborhood
            })

        except Exception as e:
            print(f"Error predicting for {neighborhood['name']}: {e}")
            continue

    predictions.sort(key=lambda x: x['combined_score'], reverse=True)

    return jsonify({'predictions': predictions}), 200


# -------------------------------
# SCORING HELPERS
# -------------------------------

def calculate_affordability_score(predicted_price, budget):
    if budget == 0:
        return 0
    ratio = predicted_price / budget
    if ratio <= 0.8:
        return 100
    elif ratio <= 1.0:
        return 80
    elif ratio <= 1.2:
        return 50
    elif ratio <= 1.5:
        return 20
    else:
        return 0


def get_color_from_score(score):
    if score >= 70:
        return 'green'
    elif score >= 40:
        return 'yellow'
    else:
        return 'red'


# -------------------------------
# NEIGHBORHOOD DETAILS
# -------------------------------

@app.route('/api/neighborhood/<name>', methods=['GET'])
def get_neighborhood_details(name):
    neighborhoods = get_nyc_neighborhoods()
    neighborhood = next((n for n in neighborhoods if n['name'] == name), None)

    if not neighborhood:
        return jsonify({'error': 'Neighborhood not found'}), 404

    ai_summary = generate_mock_summary(neighborhood)

    return jsonify({
        'neighborhood': neighborhood,
        'ai_summary': ai_summary
    }), 200


# -------------------------------
# PORTFOLIO ROUTE
# -------------------------------

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    quiz_results = app_state.get('quiz_results')

    if not quiz_results:
        return jsonify({'error': 'Complete the quiz to unlock your NYC portfolio'}), 400

    neighborhoods = get_nyc_neighborhoods()
    compatibility = []

    for neighborhood in neighborhoods:
        lifestyle_score = calculate_compatibility_score(quiz_results, neighborhood)
        compatibility.append({
            'name': neighborhood['name'],
            'borough': neighborhood['admin_area'],
            'score': round(lifestyle_score, 2),
            'summary': neighborhood.get('vibe', ''),
            'tags': [
                neighborhood.get('vibe', '').title(),
                f"Food {neighborhood.get('food_score', 0)}/10",
                f"Transit {neighborhood.get('transit_score', 0)}/10"
            ],
            'highlights': {
                'walkability': neighborhood.get('walkability'),
                'nightlife': neighborhood.get('nightlife_score'),
                'parks': neighborhood.get('parks_score'),
                'transit': neighborhood.get('transit_score')
            }
        })

    compatibility.sort(key=lambda x: x['score'], reverse=True)
    top_neighborhoods = compatibility[:3]

    preference_weights = derive_preference_weights(quiz_results)
    persona = build_persona_profile(preference_weights, quiz_results, top_neighborhoods)
    source_digest = aggregate_source_digest(top_neighborhoods)
    ai_summary = generate_claude_portfolio_summary(
        persona, top_neighborhoods, preference_weights, source_digest
    )

    return jsonify({
        'persona': persona,
        'preference_weights': preference_weights,
        'top_neighborhoods': top_neighborhoods,
        'sources': source_digest,
        'ai_summary': ai_summary
    }), 200


# -------------------------------

def generate_mock_summary(neighborhood):
    return {
        'overall': f"{neighborhood['name']} is a {neighborhood.get('vibe', 'diverse')} neighborhood with good access to amenities.",
        'pros': [
            f"Walkability score: {neighborhood.get('walkability', 75)}/100",
            f"Food options: {neighborhood.get('food_density', 'High')}",
            "Public transportation nearby"
        ],
        'cons': [
            "Can be noisy during weekends",
            "Limited parking"
        ],
        'sentiment_score': neighborhood.get('sentiment', 7.5),
        'sources': ['Reddit: r/nyc', 'Facebook: NYC Housing Groups']
    }


# -------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=5000)
