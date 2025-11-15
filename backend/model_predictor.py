import importlib
import joblib
import pandas as pd
import numpy as np
import os


def _register_bitgenerator(alias) -> bool:
    """
    Register legacy numpy BitGenerator names that may appear inside
    pickled sklearn pipelines. Returns True if a new alias was added.
    """
    try:
        import numpy.random._pickle as np_random_pickle
    except Exception:
        return False

    alias_str = alias.strip() if isinstance(alias, str) else repr(alias).strip()
    alias = alias_str
    if not alias:
        return False

    # Standard names (e.g., 'MT19937') already exist; short-circuit
    if alias in np_random_pickle.BitGenerators:
        return True

    target = alias
    if alias.startswith("<class '") and alias.endswith("'>"):
        target = alias[8:-2]

    try:
        module_name, class_name = target.rsplit('.', 1)
        module = importlib.import_module(module_name)
        bit_generator_cls = getattr(module, class_name)
    except Exception:
        return False

    np_random_pickle.BitGenerators[alias] = bit_generator_cls
    np_random_pickle.BitGenerators.setdefault(class_name, bit_generator_cls)
    return True

# Ensure common aliases are registered up front
try:
    import numpy.random._pickle as _np_random_pickle
except Exception:
    _np_random_pickle = None

_register_bitgenerator("<class 'numpy.random._mt19937.MT19937'>")

if _np_random_pickle is not None:
    _original_bit_generator_ctor = _np_random_pickle.__bit_generator_ctor

    def _patched_bit_generator_ctor(bit_generator_name='MT19937'):
        if bit_generator_name not in _np_random_pickle.BitGenerators:
            _register_bitgenerator(bit_generator_name)
        normalized = bit_generator_name
        if normalized not in _np_random_pickle.BitGenerators:
            normalized = repr(bit_generator_name).strip()
        if isinstance(normalized, str):
            normalized = normalized.strip()
        return _original_bit_generator_ctor(normalized)

    _np_random_pickle.__bit_generator_ctor = _patched_bit_generator_ctor

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
                # Handle legacy numpy bit generator aliases emitted by older sklearn toolchains
                if isinstance(e, ValueError) and 'BitGenerator' in str(e):
                    alias = str(e).split(' is not a known BitGenerator', 1)[0]
                    if _register_bitgenerator(alias):
                        try:
                            self.model = joblib.load(self.model_path)
                            print("Model loaded successfully after BitGenerator shim!")
                            return
                        except Exception as retry_err:
                            print(f"Retry failed when loading model: {retry_err}")
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
