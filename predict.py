import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS


from diseases import DISEASE_INFO

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight",
    "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy",
    "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]


def load_trained_model(model_path="plant_disease_model.pth"):
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(model.last_channel, 38)
    
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location=device))
        print("✅ تم تحميل أوزان الموديل بنجاح!")
    else:
        print(f"⚠️ ملف الأوزان {model_path} غير موجود!")
        
    model = model.to(device)
    model.eval()
    return model

ai_model = load_trained_model("plant_disease_model.pth")


def predict_image_file(image_file):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    image = Image.open(image_file).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = ai_model(input_tensor)
        probabilities = F.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
        
        idx = predicted_idx.item()
        conf_score = round(confidence.item() * 100, 2)
        predicted_class = CLASS_NAMES[idx] if idx < len(CLASS_NAMES) else f"Class_{idx}"
            
    return predicted_class, conf_score


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    try:
        predicted_class, confidence = predict_image_file(file)
        info = DISEASE_INFO.get(predicted_class, {})
        
        arabic_name = info.get('arabic_name', predicted_class)
        symptoms = info.get('symptoms', 'لا توجد تفاصيل')
        treatment_list = info.get('treatment', ['لا توجد توصيات'])
        treatment_str = " - ".join(treatment_list) if isinstance(treatment_list, list) else str(treatment_list)

        return jsonify({
            'disease_name': arabic_name,
            'confidence': confidence,
            'symptoms': symptoms,
            'treatment': treatment_str
        })
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    print("\n🚀 السيرفر شغال دلوقتي وجاهز لاستقبال الصور...")
    print("📍 الرابط: http://127.0.0.1:5000/predict\n")
    app.run(host='0.0.0.0', port=5000, debug=True)

    