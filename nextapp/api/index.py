import os
import sys

# Add the _backend directory to the path so imports work correctly inside app.py
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "_backend"))

# Import the Flask app
from app import app
