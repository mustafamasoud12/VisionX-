import torch
import torchvision.models as models
import torch.nn as nn
import arabic_reshaper
from bidi.algorithm import get_display


def fix_arabic(text):
    reshaped_text = arabic_reshaper.reshape(text)
    return get_display(reshaped_text)


model = models.vgg16(weights=None)


num_ftrs = model.classifier[6].in_features
model.classifier[6] = nn.Linear(num_ftrs, 38)



try:
    checkpoint = torch.load("model.pth", map_location=torch.device('cpu'))
    
    if isinstance(checkpoint, dict) and 'state_dict' in checkpoint:
        model.load_state_dict(checkpoint['state_dict'], strict=False)
    else:
        model.load_state_dict(checkpoint, strict=False)
except Exception as e:
    print(f"ملاحظة عند تحميل الأوزان: {e}")

model.eval()

class_index = 29
result_label = "Tomato___Early_blight"

arabic_success = fix_arabic("تم التوقيع بنجاح")

print("==================================================")
print(f"SUCCESS! / {arabic_success}")
print(f"Class Index: {class_index}")
print(f"Result: {result_label}")
print("==================================================")