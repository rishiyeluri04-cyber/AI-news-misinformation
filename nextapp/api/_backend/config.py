"""
Configuration settings for the AI-Based Fake News Detection System.
"""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths
MODEL_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')

# Ensure directories exist
# On Vercel, the filesystem is read-only except for /tmp
if os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
    # We only need to read models, not write logs/data in prod
    pass
else:
    for d in [MODEL_DIR, DATA_DIR, LOGS_DIR]:
        os.makedirs(d, exist_ok=True)

# Model settings
MODEL_PATH = os.path.join(MODEL_DIR, 'best_model.joblib')
VECTORIZER_PATH = os.path.join(MODEL_DIR, 'tfidf_vectorizer.joblib')
METRICS_PATH = os.path.join(MODEL_DIR, 'model_metrics.json')

# TF-IDF settings
TFIDF_MAX_FEATURES = 50000
TFIDF_NGRAM_RANGE = (1, 2)  # Unigrams + bigrams

# Input validation
MIN_INPUT_CHARS = 20
MAX_INPUT_WORDS = 5000

# Flask settings — DEBUG=False prevents the reloader from killing long Gemini requests
DEBUG = os.environ.get('FLASK_DEBUG', 'False') == 'True'
PORT = int(os.environ.get('PORT', 5000))
HOST = os.environ.get('HOST', '0.0.0.0')

# Data split ratios
TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

# Performance thresholds
MIN_ACCURACY = 0.85
TARGET_ACCURACY = 0.90
