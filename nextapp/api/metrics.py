from flask import Flask, jsonify, request
import os
import sys

# Bridge to backend logic
base_dir = os.path.dirname(__file__)
backend_dir = os.path.abspath(os.path.join(base_dir, "..", "backend"))
sys.path.insert(0, backend_dir)

try:
    from predictor import get_model_metrics
except ImportError:
    def get_model_metrics(): return {}

app = Flask(__name__)

def _corsify(resp):
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp

@app.route('/api/metrics', methods=['GET', 'OPTIONS'])
def handle_metrics():
    if request.method == 'OPTIONS':
        resp = jsonify({})
        resp.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        return _corsify(resp)

    metrics = get_model_metrics()
    return _corsify(jsonify(metrics))
