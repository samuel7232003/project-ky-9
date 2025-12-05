"""
Translation service để dịch tên cây và bệnh sang tiếng Việt
"""
from deep_translator import GoogleTranslator
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Dictionary mapping cho các tên cây và bệnh phổ biến (fallback nếu translation API fail)
PLANT_TRANSLATIONS = {
    'apple': 'Táo',
    'cherry': 'Anh đào',
    'corn': 'Ngô',
    'grape': 'Nho',
    'peach': 'Đào',
    'pepper': 'Ớt',
    'potato': 'Khoai tây',
    'strawberry': 'Dâu tây',
    'tomato': 'Cà chua',
    'guava': 'Ổi',
    'mango': 'Xoài',
    'orange': 'Cam',
    'papaya': 'Đu đủ',
    'banana': 'Chuối',
    'rice': 'Lúa',
    'soybean': 'Đậu nành',
    'wheat': 'Lúa mì',
}

DISEASE_TRANSLATIONS = {
    'Apple_scab': 'Bệnh ghẻ táo',
    'Black_rot': 'Bệnh thối đen',
    'Cedar_apple_rust': 'Bệnh gỉ sắt táo',
    'healthy': 'Khỏe mạnh',
    'Late_blight': 'Bệnh sương mai muộn',
    'Leaf_Mold': 'Bệnh mốc lá',
    'Leaf_Spot': 'Bệnh đốm lá',
    'Powdery_Mildew': 'Bệnh phấn trắng',
    'Rust': 'Bệnh gỉ sắt',
    'Scab': 'Bệnh ghẻ',
    'Target_Spot': 'Bệnh đốm mục tiêu',
    'Tomato_mosaic_virus': 'Virus khảm cà chua',
    'Tomato_Yellow_Leaf_Curl_Virus': 'Virus vàng lá xoăn cà chua',
    'Two-spotted_spider_mite': 'Nhện đỏ hai chấm',
    'Bacterial_spot': 'Bệnh đốm vi khuẩn',
    'Early_blight': 'Bệnh sương mai sớm',
    'Septoria_leaf_spot': 'Bệnh đốm lá Septoria',
    'Spider_mites': 'Nhện đỏ',
    'Leaf_Spot': 'Bệnh đốm lá',
    'Common_rust': 'Bệnh gỉ sắt thường',
    'Northern_Leaf_Blight': 'Bệnh cháy lá phía bắc',
    'Cercospora_leaf_spot': 'Bệnh đốm lá Cercospora',
    'Gray_leaf_spot': 'Bệnh đốm lá xám',
    'insect_bite': 'Vết cắn côn trùng',
    'scorch': 'Cháy lá',
}

def normalize_text(text):
    """
    Chuẩn hóa text để so sánh (lowercase, thay _ và - bằng space)
    """
    if not text:
        return ''
    return text.lower().replace('_', ' ').replace('-', ' ').strip()

def translate_text(text, source_lang='en', target_lang='vi'):
    """
    Dịch text từ source_lang sang target_lang
    Sử dụng dictionary mapping trước, nếu không có thì dùng Google Translate
    """
    if not text:
        return text
    
    # Chuẩn hóa text để so sánh
    text_normalized = normalize_text(text)
    
    # Kiểm tra exact match trước
    if text in PLANT_TRANSLATIONS:
        return PLANT_TRANSLATIONS[text]
    if text in DISEASE_TRANSLATIONS:
        return DISEASE_TRANSLATIONS[text]
    
    # Kiểm tra normalized match trong plant translations
    for key, value in PLANT_TRANSLATIONS.items():
        if normalize_text(key) == text_normalized:
            return value
    
    # Kiểm tra normalized match trong disease translations
    for key, value in DISEASE_TRANSLATIONS.items():
        if normalize_text(key) == text_normalized:
            return value
    
    # Nếu không có trong dictionary, dùng Google Translate
    try:
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        translated = translator.translate(text)
        logger.info(f"Translated '{text}' -> '{translated}' using Google Translate")
        return translated
    except Exception as e:
        logger.warning(f"Translation failed for '{text}': {e}. Returning formatted text.")
        # Fallback: format lại text cho dễ đọc hơn
        return text.replace('_', ' ').replace('-', ' ').title()

def translate_classification_result(result):
    """
    Dịch kết quả phân loại sang tiếng Việt
    Giữ lại cả tên tiếng Anh (name_en) và tên tiếng Việt (name_vi)
    """
    if not result:
        return result
    
    translated_result = result.copy()
    
    # Dịch tên cây
    if 'plant' in result and 'name' in result['plant']:
        plant_name_en = result['plant']['name']
        plant_name_vi = translate_text(plant_name_en)
        translated_result['plant'] = result['plant'].copy()
        translated_result['plant']['name_en'] = plant_name_en  # Tên tiếng Anh
        translated_result['plant']['name_vi'] = plant_name_vi  # Tên tiếng Việt
        translated_result['plant']['name'] = plant_name_en  # Giữ tên gốc làm mặc định
    
    # Dịch tên bệnh
    if 'disease' in result and 'name' in result['disease']:
        disease_name_en = result['disease']['name']
        disease_name_vi = translate_text(disease_name_en)
        translated_result['disease'] = result['disease'].copy()
        translated_result['disease']['name_en'] = disease_name_en  # Tên tiếng Anh
        translated_result['disease']['name_vi'] = disease_name_vi  # Tên tiếng Việt
        translated_result['disease']['name'] = disease_name_en  # Giữ tên gốc làm mặc định
    
    return translated_result

