"""
Flask REST API for AI-Based Fake News Detection System.
Implements FR-7.4: RESTful API endpoint for prediction requests.
"""

import os
import sys
import json
import logging
import time
from functools import wraps

from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Ensure backend dir is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from predictor import predict, get_model_metrics, model_is_ready
from config import MIN_INPUT_CHARS, MAX_INPUT_WORDS, PORT, HOST, DEBUG
from gemini_analyzer import analyze_with_gemini, gemini_is_available

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# ── Custom JSON encoder for numpy types ─────────
import json as _json

class NumpyEncoder(_json.JSONEncoder):
    def default(self, obj):
        import numpy as np
        if isinstance(obj, np.integer):  return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.bool_):    return bool(obj)
        if isinstance(obj, np.ndarray):  return obj.tolist()
        return super().default(obj)



# Flask app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=''
)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Modern Flask way to set custom JSON provider
class CustomJSONProvider(_json.JSONEncoder):
    def default(self, obj):
        import numpy as np
        if isinstance(obj, np.integer):  return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.bool_):    return bool(obj)
        if isinstance(obj, np.ndarray):  return obj.tolist()
        return super().default(obj)

# Support both older and newer Flask versions
try:
    from flask.json.provider import DefaultJSONProvider
    class NumpyJSONProvider(DefaultJSONProvider):
        def default(self, obj):
            import numpy as np
            if isinstance(obj, np.integer):  return int(obj)
            if isinstance(obj, np.floating): return float(obj)
            if isinstance(obj, np.bool_):    return bool(obj)
            if isinstance(obj, np.ndarray):  return obj.tolist()
            return super().default(obj)
    app.json = NumpyJSONProvider(app)
except (ImportError, AttributeError):
    app.json_encoder = CustomJSONProvider

app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max upload
ALLOWED_EXTENSIONS = {'txt', 'csv'}

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def validate_text(text: str) -> tuple[bool, str]:
    """Validate user input text. Returns (is_valid, error_message)."""
    if not text or not text.strip():
        return False, "Input cannot be empty. Please enter a news article or headline."
    if len(text.strip()) < MIN_INPUT_CHARS:
        return False, f"Input is too short. Please provide at least {MIN_INPUT_CHARS} characters."
    word_count = len(text.split())
    if word_count > MAX_INPUT_WORDS:
        return False, f"Input exceeds maximum length of {MAX_INPUT_WORDS} words."
    return True, ""


def api_response(data: dict, status: int = 200):
    """Standardized API response wrapper using safe numpy-aware encoder."""
    from flask import current_app
    import json as _json2
    json_str = _json2.dumps(data, cls=NumpyEncoder)
    from flask import Response
    response = Response(json_str, status=status, mimetype='application/json')
    return response


# ─────────────────────────────────────────────
# Routes — Frontend
# ─────────────────────────────────────────────

@app.route('/')
def index():
    """Serve the main frontend application."""
    index_path = os.path.join(FRONTEND_DIR, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return jsonify({'message': 'AI Fake News Detector API — Frontend not found'}), 200


@app.route('/<path:filename>')
def static_files(filename):
    """Serve static frontend files."""
    file_path = os.path.join(FRONTEND_DIR, filename)
    if os.path.exists(file_path):
        return send_from_directory(FRONTEND_DIR, filename)
    abort(404)


# ─────────────────────────────────────────────
# Routes — API
# ─────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return api_response({
        'status': 'healthy',
        'model_ready': model_is_ready(),
        'version': '1.0.0',
        'timestamp': time.time()
    })


@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
    """
    Main prediction endpoint (FR-7.x).
    Accepts JSON: { "text": "..." }
    Returns:  { "label": "REAL|FAKE", "confidence": 92.3, "top_keywords": [...], ... }
    """
    start_time = time.time()

    # Validate model readiness
    if not model_is_ready():
        return api_response({
            'error': 'Model not trained yet. Please run the training script first.',
            'code': 'MODEL_NOT_READY'
        }, 503)

    # Parse input
    if request.is_json:
        data = request.get_json(silent=True) or {}
        text = data.get('text', '').strip()
    else:
        text = request.form.get('text', '').strip()

    # Validate
    valid, error_msg = validate_text(text)
    if not valid:
        return api_response({'error': error_msg, 'code': 'INVALID_INPUT'}, 400)

    try:
        result = predict(text)
        elapsed_ms_ml = round((time.time() - start_time) * 1000, 1)

        # ── Gemini AI second-opinion analysis ──
        gemini_start = time.time()
        try:
            gemini_result = analyze_with_gemini(
                text,
                ml_label=result['label'],
                ml_confidence=result['confidence']
            )
            result['gemini'] = gemini_result
        except Exception as ge:
            logger.warning(f"Gemini analysis skipped: {ge}")
            result['gemini'] = {'gemini_available': False}

        elapsed_ms = round((time.time() - start_time) * 1000, 1)
        result['response_time_ms'] = elapsed_ms
        result['ml_time_ms'] = elapsed_ms_ml
        result['gemini_time_ms'] = round((time.time() - gemini_start) * 1000, 1)

        logger.info(
            f"Prediction: {result['label']} ({result['confidence']}%) | "
            f"Gemini: {result['gemini'].get('gemini_verdict','—')} | "
            f"Total: {elapsed_ms}ms"
        )
        return api_response(result)

    except FileNotFoundError as e:
        return api_response({'error': str(e), 'code': 'MODEL_NOT_FOUND'}, 503)
    except ValueError as e:
        return api_response({'error': str(e), 'code': 'PROCESSING_ERROR'}, 400)
    except Exception as e:
        logger.exception(f"Unexpected error during prediction: {e}")
        return api_response({'error': 'An internal server error occurred.', 'code': 'INTERNAL_ERROR'}, 500)


@app.route('/api/predict/file', methods=['POST'])
def predict_file():
    """
    File upload prediction endpoint (FR-1.2).
    Accepts .txt and .csv files.
    """
    if not model_is_ready():
        return api_response({'error': 'Model not trained yet.', 'code': 'MODEL_NOT_READY'}, 503)

    if 'file' not in request.files:
        return api_response({'error': 'No file provided.', 'code': 'NO_FILE'}, 400)

    file = request.files['file']
    if not file.filename or not allowed_file(file.filename):
        return api_response({
            'error': 'Invalid file type. Only .txt and .csv files are supported.',
            'code': 'INVALID_FILE_TYPE'
        }, 400)

    try:
        content = file.read().decode('utf-8', errors='replace')
        # For CSV, extract text column
        if file.filename.endswith('.csv'):
            import io
            import pandas as pd
            df = pd.read_csv(io.StringIO(content))
            text_cols = [c for c in df.columns if 'text' in c.lower() or 'title' in c.lower()]
            if text_cols:
                content = ' '.join(df[text_cols[0]].dropna().astype(str).tolist())
            else:
                content = ' '.join(df.iloc[:, 0].dropna().astype(str).tolist())

        valid, error_msg = validate_text(content)
        if not valid:
            return api_response({'error': error_msg, 'code': 'INVALID_INPUT'}, 400)

        result = predict(content)
        # Also run Gemini analysis on file content
        try:
            gemini_result = analyze_with_gemini(content, result['label'], result['confidence'])
            result['gemini'] = gemini_result
        except Exception:
            result['gemini'] = {'gemini_available': False}
        return api_response(result)

    except Exception as e:
        logger.exception(f"File prediction error: {e}")
        return api_response({'error': 'Failed to process file.', 'code': 'FILE_ERROR'}, 500)


@app.route('/api/metrics', methods=['GET'])
def model_metrics():
    """Return model performance metrics for display."""
    metrics = get_model_metrics()
    if not metrics:
        return api_response({'error': 'No metrics available. Train a model first.'}, 404)
    return api_response(metrics)


@app.route('/api/status', methods=['GET'])
def system_status():
    """Return system status including whether model is trained and Gemini available."""
    ready = model_is_ready()
    logger.info(f"Status check: model_ready={ready}")
    return api_response({
        'model_ready': ready,
        'gemini_available': gemini_is_available(),
        'version': '1.0.0'
    })


# ─────────────────────────────────────────────
# Error Handlers
# ─────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return api_response({'error': 'Endpoint not found.', 'code': 'NOT_FOUND'}, 404)


@app.errorhandler(413)
def too_large(e):
    return api_response({'error': 'File too large. Maximum size is 2MB.', 'code': 'FILE_TOO_LARGE'}, 413)


@app.errorhandler(500)
def server_error(e):
    return api_response({'error': 'Internal server error.', 'code': 'INTERNAL_ERROR'}, 500)


# ─────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────

if __name__ == '__main__':
    logger.info(f"Starting AI Fake News Detector API on {HOST}:{PORT}")
    logger.info(f"Model ready: {model_is_ready()}")
    logger.info(f"Frontend dir: {FRONTEND_DIR}")
    app.run(host=HOST, port=PORT, debug=DEBUG)
