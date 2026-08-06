
from diseases import DISEASE_INFO


disease_name = "Bacterial_Spot"


details = DISEASE_INFO.get(disease_name)

if details:
    print(f"اسم المرض: {details['arabic_name']}")
    print(f"النوع: {details['plant_type']}")
    print(f"الأعراض: {details['symptoms']}")
    print("العلاج:")
    for step in details['treatment']:
        print(f"- {step}")
else:
    print("المرض غير موجود")