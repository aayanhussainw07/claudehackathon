import joblib
import pandas as pd
import numpy as np
import os

class HousingPredictor:
    def __init__(self, model_path='models/advanced_house_price_model.joblib'):
        """
        Initialize the housing price predictor
        """
        self.model_path = model_path
        self.model = None
        self.load_model()

    def load_model(self):
        """Load the pre-trained model"""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print("Model loaded successfully!")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print(f"Model file not found at {self.model_path}")
            print("Using fallback prediction method")
            self.model = None

    def predict(self, input_data, years_future=0, appreciation_rate=0.05):
        """
        Predict house price based on input features

        Args:
            input_data: dict with keys:
                - TYPE
                - BEDS
                - BATH
                - PROPERTYSQFT
                - ADMINISTRATIVE_AREA_LEVEL_2
                - LOCALITY
                - SUBLOCALITY
                - STREET_NAME
                - LATITUDE
                - LONGITUDE
            years_future: int, number of years in the future
            appreciation_rate: float, annual appreciation rate (default 5%)

        Returns:
            float: predicted price
        """
        if self.model is not None:
            # Use actual ML model
            df = pd.DataFrame([input_data])
            base_price = self.model.predict(df)[0]
        else:
            # Fallback: simple heuristic for hackathon demo
            base_price = self._fallback_prediction(input_data)

        # Apply appreciation for future years
        future_price = base_price * ((1 + appreciation_rate) ** years_future)

        return future_price

    def _fallback_prediction(self, input_data):
        """
        Simple fallback prediction when model isn't available
        For hackathon demo purposes
        """
        # Base price per sqft varies by location
        base_price_per_sqft = {
            'Manhattan': 1500,
            'Brooklyn': 1000,
            'Queens': 800,
            'Bronx': 600,
            'Staten Island': 700
        }

        # Get base price from admin area
        admin_area = input_data.get('ADMINISTRATIVE_AREA_LEVEL_2', 'Queens')
        price_per_sqft = base_price_per_sqft.get(admin_area, 900)

        # Calculate base price
        sqft = input_data.get('PROPERTYSQFT', 1000)
        beds = input_data.get('BEDS', 2)
        baths = input_data.get('BATH', 1)

        base_price = sqft * price_per_sqft

        # Adjust for bedrooms and bathrooms
        base_price *= (1 + (beds * 0.1))
        base_price *= (1 + (baths * 0.05))

        # Add some randomness for variety
        base_price *= np.random.uniform(0.9, 1.1)

        return base_price

    def predict_batch(self, input_list, years_future=0):
        """
        Predict prices for multiple properties
        """
        predictions = []
        for input_data in input_list:
            pred = self.predict(input_data, years_future)
            predictions.append(pred)
        return predictions
