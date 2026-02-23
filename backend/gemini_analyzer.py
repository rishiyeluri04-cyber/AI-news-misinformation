"""
Gemini AI Analysis Module for TruthLens Fake News Detection System.
Provides deep contextual analysis using Google's Gemini 1.5 Flash model
as a second-opinion layer alongside the ML classifier.
"""

import os
import logging
import re
import json

logger = logging.getLogger(__name__)

# Primary key from environment; fallback to placeholder (user must provide their own key)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
_gemini_model = None
_gemini_available = False


def _init_gemini():
    """Lazy-initialize the Gemini client."""
    global _gemini_model, _gemini_available
    if _gemini_model is not None:
        return _gemini_available
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 0.2,       # Low temperature for factual analysis
                "top_p": 0.85,
                "top_k": 30,
                "max_output_tokens": 600, # Concise but thorough
            },
        )
        _gemini_available = True
        logger.info("Gemini AI initialized successfully.")
    except Exception as e:
        logger.warning(f"Gemini AI not available: {e}")
        _gemini_available = False
    return _gemini_available


# ── Prompt template ───────────────────────────────────────────────────────────
_ANALYSIS_PROMPT = """You are an expert fact-checker and media literacy analyst. 
Analyze the following news article/headline for credibility indicators.

ARTICLE:
\"\"\"{text}\"\"\"

ML Model Prediction: {ml_label} (Confidence: {ml_confidence}%)

Provide a structured JSON analysis with exactly these fields:
{{
  "gemini_verdict": "REAL" or "FAKE" or "UNCERTAIN",
  "gemini_confidence": <integer 0-100>,
  "credibility_score": <integer 0-10, where 10 = highly credible>,
  "red_flags": [<list of up to 5 specific red flags found, or empty list>],
  "credibility_signals": [<list of up to 5 credibility signals found, or empty list>],
  "language_analysis": "<1-2 sentences on writing style and tone>",
  "fact_check_verdict": "<1 concise sentence verdict>",
  "recommendation": "<1 sentence action recommendation for the reader>"
}}

Be precise, objective, and base your analysis only on the text provided.
Return ONLY valid JSON, no explanation outside the JSON.
"""


def analyze_with_gemini(text: str, ml_label: str, ml_confidence: float) -> dict:
    """
    Run Gemini AI analysis on article text.

    Args:
        text:          Raw article text.
        ml_label:      ML model verdict ('REAL' or 'FAKE').
        ml_confidence: ML model confidence (0-100).

    Returns:
        Dict with Gemini analysis fields, or a fallback dict if unavailable.
    """
    if not _init_gemini():
        return _fallback_analysis(ml_label, ml_confidence)

    # Truncate very long articles for the prompt (keep first 1500 chars)
    truncated = text[:1500] + ("…" if len(text) > 1500 else "")

    prompt = _ANALYSIS_PROMPT.format(
        text=truncated,
        ml_label=ml_label,
        ml_confidence=int(ml_confidence)
    )

    try:
        response = _gemini_model.generate_content(prompt)
        raw = response.text.strip()

        # Strip markdown code fences if present
        raw = re.sub(r'^```(?:json)?\s*', '', raw, flags=re.MULTILINE)
        raw = re.sub(r'\s*```$', '', raw, flags=re.MULTILINE)
        raw = raw.strip()

        data = json.loads(raw)
        return _sanitize_gemini_response(data)

    except json.JSONDecodeError as e:
        logger.warning(f"Gemini returned non-JSON response: {e}")
        return _fallback_analysis(ml_label, ml_confidence, raw_text=getattr(response, 'text', ''))
    except Exception as e:
        logger.error(f"Gemini analysis error: {e}")
        return _fallback_analysis(ml_label, ml_confidence)


def _sanitize_gemini_response(data: dict) -> dict:
    """Ensure all expected fields exist and have correct types."""
    verdict = str(data.get('gemini_verdict', 'UNCERTAIN')).upper()
    if verdict not in ('REAL', 'FAKE', 'UNCERTAIN'):
        verdict = 'UNCERTAIN'

    return {
        'gemini_verdict':       verdict,
        'gemini_confidence':    int(min(max(data.get('gemini_confidence', 50), 0), 100)),
        'credibility_score':    int(min(max(data.get('credibility_score', 5), 0), 10)),
        'red_flags':            [str(f) for f in data.get('red_flags', [])][:5],
        'credibility_signals':  [str(s) for s in data.get('credibility_signals', [])][:5],
        'language_analysis':    str(data.get('language_analysis', '')),
        'fact_check_verdict':   str(data.get('fact_check_verdict', '')),
        'recommendation':       str(data.get('recommendation', '')),
        'gemini_available':     True,
    }


def _fallback_analysis(ml_label: str, ml_confidence: float, raw_text: str = '') -> dict:
    """Return a graceful fallback when Gemini is unavailable."""
    is_fake = ml_label == 'FAKE'
    return {
        'gemini_verdict':      ml_label,
        'gemini_confidence':   int(ml_confidence),
        'credibility_score':   2 if is_fake else 8,
        'red_flags':           [],
        'credibility_signals': [],
        'language_analysis':   raw_text[:300] if raw_text else '',
        'fact_check_verdict':  f"ML model classified this as {ml_label} with {int(ml_confidence)}% confidence.",
        'recommendation':      "Please verify this content through multiple trusted sources.",
        'gemini_available':    False,
    }


def gemini_is_available() -> bool:
    """Check if Gemini client initializes correctly."""
    return _init_gemini()
