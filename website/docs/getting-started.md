---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# 🚀 Getting Started

Get AskMyDocs running locally in **5 minutes**.

---

## Prerequisites

Ensure you have:

```bash
node --version    # >= 20
dotnet --version  # >= 10.0
docker --version  # latest
```

---

## Option 1: Docker (Recommended)

### 1. Clone Repository
```bash
git clone https://github.com/poovarasasiva/askmydocs-api.git
cd askmydocs-api
```

### 2. Add Environment Variables
```bash
# Create .env file
echo "HUGGINGFACE_API_KEY=your_key_here" > .env
```

Get API key: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

### 3. Start Services
```bash
docker-compose up --build
```

### 4. Access Application
- **Frontend:** http://localhost:4200
- **Backend:** http://localhost:5000
- **API Docs:** http://localhost:5000/scalar
- **Health:** http://localhost:5000/health

---

## Option 2: Manual Setup

### Backend

```bash
cd src/AskMyDocs.API
dotnet restore
dotnet run
```

### Frontend

```bash
cd AskMyDocs.UI
npm install
npm start
```

### MongoDB

```bash
Use MongoDB Atlas
```

---

## ✅ Verify Installation

### Test Backend
```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "status": "Healthy",
  "totalChecks": 2,
  "checks": [
    {
      "name": "MongoDB",
      "status": "Healthy",
      "description": "MongoDB connection is healthy",
      "exception": null
    },
    {
      "name": "HuggingFace AI Service",
      "status": "Healthy",
      "description": "HuggingFace API is reachable.",
      "exception": null
    }
  ]
}
```

### Test Frontend
Open http://localhost:4200 - you should see the login page.

---

## 🎓 First Steps

1. **Sign up** through the UI
2. **Upload a document** (PDF/DOCX)
3. **Ask questions** like:
   - "What is the main topic?"
   - "Summarize key points"
   - "What are the conclusions?"

---

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port
lsof -ti:4200 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

### Hugging Face API Error

- Verify API key is correct
- Check rate limits at [huggingface.co/settings/billing](https://huggingface.co/settings/billing)

---

## 📚 Next Steps

- [Architecture Overview](/docs/architecture)
- [Deployment Guide](/docs/deployment)

---

Need help? [Open an issue](https://github.com/poovarasasiva/askmydocs-api/issues)
