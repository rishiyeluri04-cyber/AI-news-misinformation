from flask import Flask, request, jsonify
import sys
import os
import time
import json

# Ensure backend modules are importable
BACKEND_DIR = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, BACKEND_DIR)

# Try importing core logic
try:
    from predictor import predict
    from gemini_analyzer import analyze_with_gemini
except ImportError as e:
    # This ensures the function doesn't crash on load, but will fail gracefully on request
    def predict(t): raise e
    def analyze_with_gemini(*args): return {}

app = Flask(__name__)

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def handle_predict():
    if request.method == 'OPTIONS':
        return _build_cors_response()

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400
            
        text = (data.get("text") or "").strip()
        
        if not text:
            return jsonify({"error": "Field 'text' is required"}), 400
            
        if len(text) < 20:
             return jsonify({"error": "Text too short (min 20 chars)"}), 400

        t0 = time.time()
        
        # ML Prediction
        try:
            result = predict(text)
        except Exception as e:
            return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

        ml_ms = round((time.time() - t0) * 1000)

        # Gemini Analysis
        t1 = time.time()
        gemini = {}
        try:
             gemini = analyze_with_gemini(text, result["label"], result["confidence"])
        except Exception:
             gemini = {} # Fallback
        
        g_ms = round((time.time() - t1) * 1000)
        
        # Merge Results
        result['gemini'] = gemini
        result['ml_time_ms'] = ml_ms
        result['gemini_time_ms'] = g_ms
        result['response_time_ms'] = round((time.time() - t0) * 1000)
        
        return _corsify_actual_response(jsonify(result))

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

def _build_cors_response():
    resp = jsonify({})
    resp.headers.add("Access-Control-Allow-Origin", "*")
    resp.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    resp.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return resp

def _corsify_actual_response(resp):
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp
