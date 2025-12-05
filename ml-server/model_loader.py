import os
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import pickle
import numpy as np
import requests
from io import BytesIO

device = "cuda" if torch.cuda.is_available() else "cpu"

# Label encoders classes (từ notebook)
PLANT_CLASSES = ['apple', 'banana', 'corn', 'guava', 'lime', 'potato', 'tomato']
DISEASE_CLASSES = [
    'Algal_Leaf_Spot', 'Bacterial_spot', 'Black_Spot', 'Black_rot',
    'Cedar_apple_rust', 'Cercospora_leaf_spot Gray_leaf_spot', 'Citrus_Canker',
    'Citrus_Pest', 'Citrus_Scab', 'Common_rust', 'Early_blight', 'Greening',
    'Healthy_Leaf', 'Late_blight', 'Leaf_Curl', 'Leaf_Mold',
    'Northern_Leaf_Blight', 'Septoria_leaf_spot',
    'Spider_mites Two-spotted_spider_mite', 'Target_Spot',
    'Tomato_Yellow_Leaf_Curl_Virus', 'Tomato_mosaic_virus', 'Yellow_Spot',
    'anthracnose', 'cordana', 'fresh', 'healthy', 'insect_bite', 'multiple',
    'pestalotiopsis', 'scab', 'scorch', 'sigatoka', 'yld'
]

class MultiOutputEfficientNet(nn.Module):
    def __init__(self, num_plants, num_diseases):
        super().__init__()
        self.base = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        self.base.classifier = nn.Identity()
        self.fc_plant = nn.Linear(1280, num_plants)
        self.fc_disease = nn.Linear(1280, num_diseases)
        
    def forward(self, x):
        feats = self.base(x)
        out_plant = self.fc_plant(feats)
        out_disease = self.fc_disease(feats)
        return out_plant, out_disease

class LeafClassificationModel:
    def __init__(self, model_path, device='cpu'):
        self.device = device
        self.num_plants = len(PLANT_CLASSES)
        self.num_diseases = len(DISEASE_CLASSES)
        
        # Load model
        self.model = MultiOutputEfficientNet(self.num_plants, self.num_diseases)
        
        # Load checkpoint - có thể là checkpoint dict hoặc state_dict trực tiếp
        checkpoint = torch.load(model_path, map_location=device)
        
        # Kiểm tra xem có phải là checkpoint dict không
        if isinstance(checkpoint, dict):
            # Nếu có key 'model_state', đó là checkpoint từ training
            if 'model_state' in checkpoint:
                print(f"[Model] Loading from checkpoint (epoch {checkpoint.get('epoch', 'unknown')})")
                state_dict = checkpoint['model_state']
            # Nếu có key 'fc_plant.weight' hoặc các key của model, đó là state_dict
            elif 'fc_plant.weight' in checkpoint or 'base.features.0.0.weight' in checkpoint:
                print(f"[Model] Loading from state_dict")
                state_dict = checkpoint
            else:
                # Thử tìm key đầu tiên có vẻ là state_dict
                print(f"[Model] Checkpoint keys: {list(checkpoint.keys())[:5]}")
                raise ValueError(f"Unknown checkpoint format. Keys: {list(checkpoint.keys())}")
        else:
            # Không phải dict, có thể là state_dict cũ
            print(f"[Model] Loading as direct state_dict")
            state_dict = checkpoint
        
        # Load state dict với strict=False để bỏ qua missing keys nếu cần
        try:
            self.model.load_state_dict(state_dict, strict=True)
        except RuntimeError as e:
            print(f"[Model] Warning: Strict loading failed, trying with strict=False")
            self.model.load_state_dict(state_dict, strict=False)
            print(f"[Model] Model loaded with some missing/unexpected keys (this may affect accuracy)")
        
        self.model.to(device)
        self.model.eval()
        
        # Transform cho inference (không có data augmentation)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
    def predict(self, image_path_or_url):
        """
        Predict plant và disease từ image path hoặc URL
        """
        try:
            # Load image
            if image_path_or_url.startswith('http'):
                print(f"[Model] Downloading image from URL: {image_path_or_url}")
                try:
                    # Download image với timeout và headers
                    response = requests.get(
                        image_path_or_url,
                        timeout=30,  # 30 seconds timeout
                        headers={
                            'User-Agent': 'Mozilla/5.0 (compatible; ML-Server/1.0)'
                        },
                        stream=True
                    )
                    response.raise_for_status()  # Raise exception nếu status code không phải 2xx
                    
                    # Check content type
                    content_type = response.headers.get('content-type', '')
                    if not content_type.startswith('image/'):
                        raise ValueError(f"URL does not point to an image. Content-Type: {content_type}")
                    
                    # Read image data
                    img_data = response.content
                    if len(img_data) == 0:
                        raise ValueError("Downloaded image is empty")
                    
                    print(f"[Model] Image downloaded successfully ({len(img_data)} bytes)")
                    img = Image.open(BytesIO(img_data)).convert("RGB")
                except requests.exceptions.Timeout:
                    raise Exception(f"Timeout while downloading image from {image_path_or_url}")
                except requests.exceptions.RequestException as e:
                    raise Exception(f"Failed to download image from URL: {str(e)}")
                except Exception as e:
                    raise Exception(f"Error processing downloaded image: {str(e)}")
            else:
                if not os.path.exists(image_path_or_url):
                    raise FileNotFoundError(f"Image file not found: {image_path_or_url}")
                print(f"[Model] Loading image from file: {image_path_or_url}")
                img = Image.open(image_path_or_url).convert("RGB")
            
            # Transform
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            
            # Predict
            with torch.no_grad():
                out_plant, out_disease = self.model(img_tensor)
                
                # Get probabilities
                plant_probs = torch.softmax(out_plant, dim=1).cpu().numpy()[0]
                disease_probs = torch.softmax(out_disease, dim=1).cpu().numpy()[0]
                
                # Get predictions
                pred_plant_idx = out_plant.argmax(1).item()
                pred_disease_idx = out_disease.argmax(1).item()
                
                # Get class names
                plant_name = PLANT_CLASSES[pred_plant_idx]
                disease_name = DISEASE_CLASSES[pred_disease_idx]
                
                # Get confidence scores
                plant_confidence = float(plant_probs[pred_plant_idx])
                disease_confidence = float(disease_probs[pred_disease_idx])
                
                return {
                    'plant': {
                        'name': plant_name,
                        'confidence': plant_confidence,
                        'all_probabilities': {
                            PLANT_CLASSES[i]: float(plant_probs[i]) 
                            for i in range(len(PLANT_CLASSES))
                        }
                    },
                    'disease': {
                        'name': disease_name,
                        'confidence': disease_confidence,
                        'all_probabilities': {
                            DISEASE_CLASSES[i]: float(disease_probs[i]) 
                            for i in range(len(DISEASE_CLASSES))
                        }
                    }
                }
        except Exception as e:
            raise Exception(f"Error during prediction: {str(e)}")

# Global model instance
_model = None

def load_model(model_path=None):
    """Load model một lần và reuse"""
    global _model
    if _model is None:
        # Default paths để tìm model
        if model_path is None:
            import os
            # Get directory where model_loader.py is located
            script_dir = os.path.dirname(os.path.abspath(__file__))
            # Chỉ tìm leaf_multitask_best.pth (model chính)
            possible_paths = [
                os.path.join(script_dir, 'leaf_multitask_best.pth'),  # Ưu tiên trong ml-server/
                os.path.join('..', 'leaf_multitask_best.pth'),  # Hoặc ở parent directory
                'leaf_multitask_best.pth',  # Hoặc trong current directory
            ]
            model_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    model_path = os.path.abspath(path)
                    print(f"✅ Found model at: {model_path}")
                    break
            
            if model_path is None:
                error_msg = (
                    f"Model file 'leaf_multitask_best.pth' not found. Checked paths:\n"
                    + "\n".join([f"  - {os.path.abspath(p)}" for p in possible_paths])
                    + "\nPlease specify MODEL_PATH environment variable or place 'leaf_multitask_best.pth' in ml-server directory."
                )
                raise FileNotFoundError(error_msg)
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        
        print(f"🔄 Loading model from: {model_path}")
        print(f"🔄 Using device: {device}")
        _model = LeafClassificationModel(model_path, device)
        print(f"✅ Model loaded successfully!")
    return _model

def get_model():
    """Get loaded model"""
    if _model is None:
        raise Exception("Model not loaded. Call load_model() first.")
    return _model

