"""
Text Preprocessing Pipeline for AI-Based Fake News Detection System.
Implements sequential NLP preprocessing steps as defined in FR-3.x:
  1. Lowercasing
  2. Punctuation & special character removal
  3. Tokenization
  4. Stop-word removal
  5. Stemming / Lemmatization
"""

import re
import string
import logging
import nltk
import os

# Configure NLTK data path for serverless environments (read-only FS)
if os.environ.get('VERCEL') or os.path.exists('/tmp'):
    nltk.data.path.append('/tmp')

logger = logging.getLogger(__name__)

# Download required NLTK resources on first run
NLTK_PACKAGES = ['punkt', 'stopwords', 'wordnet', 'omw-1.4', 'punkt_tab']
for pkg in NLTK_PACKAGES:
    try:
        # Try to find it first to avoid redundant downloads
        try:
            if pkg == 'punkt': nltk.data.find('tokenizers/punkt')
            elif pkg == 'stopwords': nltk.data.find('corpora/stopwords')
            elif pkg == 'wordnet': nltk.data.find('corpora/wordnet')
            else: nltk.data.find(pkg)
        except LookupError:
             # Download to /tmp if not found
             download_dir = '/tmp' if os.path.exists('/tmp') else None
             if download_dir:
                 nltk.download(pkg, download_dir=download_dir, quiet=True)
             else:
                 nltk.download(pkg, quiet=True)
    except Exception as e:
        logger.warning(f"Could not download NLTK package '{pkg}': {e}")

# Import NLTK modules AFTER download
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer

# Initialize NLP tools
_lemmatizer = WordNetLemmatizer()
_stemmer = PorterStemmer()
_stop_words = set(stopwords.words('english'))


def _lowercase(text: str) -> str:
    """Step 1: Convert all characters to lowercase."""
    return text.lower()


def _remove_punctuation(text: str) -> str:
    """Step 2: Remove punctuation and special characters, keep apostrophes."""
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove special chars but keep apostrophes for contractions
    text = re.sub(r"[^a-z0-9\s']", ' ', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def _tokenize(text: str) -> list:
    """Step 3: Tokenize text into word tokens."""
    try:
        tokens = word_tokenize(text)
    except Exception:
        # Fallback: simple whitespace split
        tokens = text.split()
    return tokens


def _remove_stopwords(tokens: list) -> list:
    """Step 4: Remove stop-words using NLTK English corpus."""
    return [t for t in tokens if t not in _stop_words and len(t) > 1]


def _lemmatize(tokens: list) -> list:
    """Step 5: Lemmatize tokens to their base form."""
    return [_lemmatizer.lemmatize(t) for t in tokens]


def preprocess(text: str, use_stemming: bool = False) -> str:
    """
    Run the full preprocessing pipeline on input text.

    Args:
        text: Raw input text (headline or article body).
        use_stemming: If True, use Porter Stemmer instead of lemmatizer.

    Returns:
        Cleaned, preprocessed text as a single string.
    """
    if not isinstance(text, str) or not text.strip():
        return ''

    text = _lowercase(text)
    text = _remove_punctuation(text)
    tokens = _tokenize(text)
    tokens = _remove_stopwords(tokens)

    if use_stemming:
        tokens = [_stemmer.stem(t) for t in tokens]
    else:
        tokens = _lemmatize(tokens)

    return ' '.join(tokens)


def preprocess_batch(texts: list, use_stemming: bool = False) -> list:
    """
    Preprocess a list of texts.

    Args:
        texts: List of raw text strings.
        use_stemming: Whether to use stemming instead of lemmatization.

    Returns:
        List of preprocessed text strings.
    """
    return [preprocess(str(t), use_stemming) for t in texts]
