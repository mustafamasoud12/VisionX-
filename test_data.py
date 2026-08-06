import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms, datasets, models
from torch.utils.data import DataLoader, random_split


dataset_path = r"E:\صور للويب\plantvillage dataset\color"


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

print("⏳ جاري تحميل البيانات...")
full_dataset = datasets.ImageFolder(root=dataset_path, transform=transform)


train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size
train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)


print("🧠 جاري إعداد موديل الذكاء الاصطناعي...")
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)


model.classifier[1] = nn.Linear(model.last_channel, len(full_dataset.classes))


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
print(f"🖥️ التجهيز يتم باستخدام: {device}")


criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)


epochs = 1
print("\n🚀 بدأ تدريب الموديل الآن...")

for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    for i, (inputs, labels) in enumerate(train_loader):
        inputs, labels = inputs.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        if (i + 1) % 100 == 0:
            print(f"Batch {i + 1}/{len(train_loader)} - Loss: {running_loss / 100:.4f}")
            running_loss = 0.0


torch.save(model.state_dict(), "plant_disease_model.pth")
print("\n🎉 تم تدريب الموديل وحفظه بنجاح باسم 'plant_disease_model.pth'!")