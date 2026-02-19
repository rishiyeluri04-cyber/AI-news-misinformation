from flask import Flask, request, jsonify
import sys
import os
import time

# Bridge to backend logic
base_dir = os.path.dirname(__file__)
backend_dir = os.path.abspath(os.path.join(base_dir, "..", "backend"))
sys.path.insert(0, backend_dir)

try:
    from predictor import predict, model_is_ready
    from gemini_analyzer import analyze_with_gemini
except ImportError as e:
    def predict(t): raise e
    def model_is_ready(): return False
    def analyze_with_gemini(*args, **kwargs): return {"gemini_available": False}

app = Flask(__name__)

def _corsify(resp):
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp

@app.route('/api/predict/file', methods=['POST', 'OPTIONS'])
def handle_file_predict():
    if request.method == 'OPTIONS':
        resp = jsonify({})
        resp.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        resp.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return _corsify(resp)

    if not model_is_ready():
        return jsonify({"error": "Model not ready"}), 503

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        content = file.read().decode('utf-8', errors='replace')
        
        # Simple extraction for demo: first 5000 chars
        text = content[:10000]
        
        t0 = time.time()
        result = predict(text)
        
        # Optional Gemini
        try:
            gemini = analyze_with_gemini(text, result["label"], result["confidence"])
            result['gemini'] = gemini
        except:
            result['gemini'] = {"gemini_available": False}

        result['response_time_ms'] = round((time.time() - t0) * 1000)
        return _corsify(jsonify(result))

    except Exception as e:
        return jsonify({"error": str(e)}), 500
