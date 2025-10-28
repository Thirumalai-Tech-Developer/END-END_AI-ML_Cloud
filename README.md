# 🚀 ZFusion AI Cloud
### *End-to-End AI/ML Automation Platform — AutoML | RAG | DL | AI Chatbot*

ZFusion AI Cloud is a **next-generation AI workflow platform** that allows users to upload datasets, preprocess data automatically or manually, train models, evaluate performance, and deploy intelligent workflows — all from a single web interface.

It’s built to replicate **enterprise-level MLOps systems**, combining **Machine Learning, Deep Learning, Retrieval-Augmented Generation (RAG)**, and **Local/Cloud Language Models (LLMs)** into one unified ecosystem.

---

## 🧠 Features

### ⚡ Machine Learning Automation
- Upload structured datasets (CSV under 100MB)
- Automatic preprocessing (cleaning, scaling, skew handling)
- Smart task detection (auto switches between regression/classification)
- Trains multiple ML models & selects best performer
- Download trained model file (.pkl)
- Visualization dashboard (accuracy graph, confusion matrix, model compare)

### 🧩 Deep Learning Mode
- Supports unstructured datasets (image/text)
- TensorFlow/Keras-based model training
- Live accuracy/loss visualization
- Model summary + exportable .h5 weights

### 🔍 RAG (Retrieval-Augmented Generation)
- Upload documents (.txt, .pdf)
- Automatically converts data into embeddings
- Query your documents using LangChain + ChromaDB
- Fast, context-aware response generation

### 💬 AI Chatbot Integration
- Supports Local Language Models (LLMs) for offline mode
- Connects to Gemini API for hybrid cloud reasoning
- Intelligent switching between local and cloud inference
- Can interact with trained ML/DL models or knowledge base

---

## 🧰 Tech Stack

| Layer | Technologies Used |
|-------|-------------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Flask (Python) + Flask-CORS |
| ML/DL | Scikit-learn, TensorFlow, Keras |
| RAG | LangChain, ChromaDB / FAISS |
| Visualization | Matplotlib, Plotly |
| Deployment | Netlify / Render / HuggingFace Spaces |

---

## 🧪 Project Workflow

1️⃣ Upload Dataset → 2️⃣ Auto/Manual Preprocessing → 3️⃣ Model Training → 4️⃣ Evaluation Dashboard → 5️⃣ Download Model or Chat via AI Agent

---

## 💾 Folder Structure
```
ZFusionAI/
│
├── frontend/                # React Frontend
│   ├── src/
│   ├── components/
│   └── App.jsx
│
├── backend/                 # Flask Backend
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── static/
│   └── uploads/
│
├── requirements.txt
├── README.md
└── LICENSE
```

---

## ⚙️ Installation

### 1️⃣ Clone the repo
```
git clone https://github.com/Thirumalai-Tech-Developer/ZFusionAI-Cloud.git
cd ZFusionAI-Cloud
```

### 2️⃣ Setup Backend
```
cd backend
pip install -r requirements.txt
python app.py
```

### 3️⃣ Setup Frontend
```
cd frontend
npm install
npm start
```

Now open http://localhost:3000 🚀

---

## 📊 Example Use Cases
- Auto-train and evaluate ML models from CSV data
- Build quick Deep Learning models on image datasets
- Generate answers from PDF/text files using RAG
- Chat with AI using local or cloud models

---

## 🧑‍💻 Author
**Thirumalai G** — AI/ML Engineer | Full Stack Developer | R&D Enthusiast
🌐 [Portfolio](https://thirumalai.info) | 💼 [GitHub](https://github.com/Thirumalai-Tech-Developer)

---

## 🏁 License
This project is licensed under the MIT License — feel free to use, modify, and expand it.
