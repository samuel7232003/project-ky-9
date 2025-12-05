from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from model_loader import load_model, get_model
from translation_service import translate_classification_result
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model khi start server
MODEL_PATH = os.getenv('MODEL_PATH')  # None nếu không set, để model_loader tự tìm
print("=" * 60)
print("Starting ML Server...")
print("=" * 60)

# Check current working directory
print(f"Current working directory: {os.getcwd()}")
print(f"Python file location: {os.path.dirname(os.path.abspath(__file__))}")

try:
    if MODEL_PATH:
        print(f"Loading model from specified path: {MODEL_PATH}")
        if not os.path.exists(MODEL_PATH):
            print(f"❌ ERROR: Model file not found at: {MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
        model = load_model(MODEL_PATH)
    else:
        print("Searching for model file: leaf_multitask_best.pth...")
        # List possible paths to check (chỉ tìm leaf_multitask_best.pth)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        possible_paths = [
            os.path.join(script_dir, 'leaf_multitask_best.pth'),  # Ưu tiên trong ml-server/
            os.path.join('..', 'leaf_multitask_best.pth'),  # Hoặc ở parent directory
            'leaf_multitask_best.pth',  # Hoặc trong current directory
        ]
        print("Checking paths:")
        for path in possible_paths:
            abs_path = os.path.abspath(path)
            exists = os.path.exists(path)
            print(f"  - {path} -> {abs_path} {'✅ EXISTS' if exists else '❌ NOT FOUND'}")
        
        model = load_model()  # Tự động tìm model
    
    # Verify model is actually loaded
    if model is None:
        raise Exception("load_model() returned None - model not loaded")
    
    # Test model access
    test_model = get_model()
    if test_model is None:
        raise Exception("get_model() returned None - model not accessible")
    
    print("✅ Model loaded and verified successfully!")
    print(f"✅ Model device: {test_model.device}")
    print("=" * 60)
except Exception as e:
    print(f"❌ ERROR loading model: {e}")
    import traceback
    print("Full traceback:")
    print(traceback.format_exc())
    print("=" * 60)
    print("⚠️  Server will start but predictions will fail until model is loaded")
    print("⚠️  Please check the error above and fix the issue")
    print("⚠️  You can try to load the model manually by calling /reload-model endpoint")
    print("=" * 60)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        model = get_model()  # Check if model is loaded
        return jsonify({
            'status': 'ok',
            'model_loaded': True,
            'device': str(model.device),
            'model_type': type(model).__name__
        })
    except Exception as e:
        print(f"[ML Server] Health check failed: {e}")
        import traceback
        print(traceback.format_exc())
        return jsonify({
            'status': 'error',
            'model_loaded': False,
            'message': str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict plant and disease from image
    
    Request body:
    {
        "image_url": "https://example.com/image.jpg"  // URL của ảnh
    }
    
    Response:
    {
        "success": true,
        "plant": {
            "name": "apple",
            "confidence": 0.95,
            "all_probabilities": {...}
        },
        "disease": {
            "name": "Black_rot",
            "confidence": 0.87,
            "all_probabilities": {...}
        }
    }
    """
    try:
        print(f"[ML Server] Received POST request to /predict")
        print(f"[ML Server] Request headers: {dict(request.headers)}")
        
        data = request.get_json()
        print(f"[ML Server] Request body: {data}")
        
        if not data:
            print("[ML Server] Error: No data provided in request")
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        image_url = data.get('image_url')
        if not image_url:
            print("[ML Server] Error: image_url is missing from request")
            return jsonify({
                'success': False,
                'error': 'image_url is required'
            }), 400
        
        print(f"[ML Server] Processing image URL: {image_url}")
        
        # Get model and predict
        model = get_model()
        print(f"[ML Server] Model loaded, starting prediction...")
        result = model.predict(image_url)
        print(f"[ML Server] Prediction successful: Plant={result['plant']['name']}, Disease={result['disease']['name']}")
        
        # Dịch kết quả sang tiếng Việt
        translated_result = translate_classification_result(result)
        print(f"[ML Server] Translation successful: Plant={translated_result['plant']['name']}, Disease={translated_result['disease']['name']}")
        
        return jsonify({
            'success': True,
            **translated_result
        })
        
    except Exception as e:
        print(f"[ML Server] Error in predict: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/reload-model', methods=['POST'])
def reload_model():
    """Reload model manually"""
    try:
        from model_loader import load_model as reload_model_func
        global _model
        _model = None  # Reset global model
        model = reload_model_func()
        return jsonify({
            'success': True,
            'message': 'Model reloaded successfully',
            'device': str(model.device)
        })
    except Exception as e:
        print(f"[ML Server] Error reloading model: {e}")
        import traceback
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/predict/file', methods=['POST'])
def predict_file():
    """
    Predict from uploaded file
    
    Request: multipart/form-data with 'image' file
    """
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Save temporary file
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        try:
            # Get model and predict
            model = get_model()
            result = model.predict(tmp_path)
            
            # Dịch kết quả sang tiếng Việt
            translated_result = translate_classification_result(result)
            
            return jsonify({
                'success': True,
                **translated_result
            })
        finally:
            # Clean up temp file
            os.unlink(tmp_path)
            
    except Exception as e:
        print(f"Error in predict_file: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))  # Changed default to 5001 to avoid conflict with backend
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)

