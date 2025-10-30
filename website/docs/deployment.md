---
id: deployment
title: Deployment Guide
sidebar_label: Deployment
---

# 🚀 Deployment Guide

This document covers containerization, CI/CD, and environment configuration for **AskMyDocs**.

---

## 🧱 Docker Setup

The entire stack (API, frontend, and MongoDB) is fully containerized.

### **Dockerfile — Backend**

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AskMyDocs.API/AskMyDocs.API.csproj", "AskMyDocs.API/"]
RUN dotnet restore "AskMyDocs.API/AskMyDocs.API.csproj"
COPY . .
RUN dotnet publish "AskMyDocs.API/AskMyDocs.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AskMyDocs.API.dll"]
```

### **Dockerfile — Frontend**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **docker-compose.yml**

```yaml
version: "3.9"
services:
  api:
    build: ./src/AskMyDocs.API
    ports:
      - "5000:80"
    env_file:
      - .env
    depends_on:
      - mongodb

  frontend:
    build: ./AskMyDocs.UI
    ports:
      - "4200:80"
    depends_on:
      - api

  mongodb:
    image: mongo:8.0
    container_name: askmydocs-db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## 🌍 Environment Configuration

| Variable              | Description     | Example                 |
| --------------------- | --------------- | ----------------------- |
| `MONGODB_CONNECTION`  | MongoDB URI     | mongodb://mongodb:27017 |
| `HUGGINGFACE_API_KEY` | AI API key      | hf_XXXXXXXX             |
| `JWT_SECRET`          | JWT signing key | randomstring123         |
| `JWT_ISSUER`          | Token issuer    | AskMyDocsAPI            |
| `JWT_AUDIENCE`        | Token audience  | AskMyDocsUsers          |

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Render

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x

      - name: Restore dependencies
        run: dotnet restore src/AskMyDocs.API

      - name: Build and publish
        run: dotnet publish src/AskMyDocs.API -c Release -o publish

      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

> **Tip:** Store your `RENDER_DEPLOY_HOOK` and API keys securely in **GitHub Secrets**.

---

## ☁️ Deployment Targets

| Environment    | Platform         | URL                                                                |
| -------------- | ---------------- | ------------------------------------------------------------------ |
| **Frontend**   | Netlify          | [askmydocuments.netlify.app](https://askmydocuments.netlify.app)   |
| **Backend**    | Render           | [askmydocs-0dfe.onrender.com](https://askmydocs-0dfe.onrender.com) |
| **Database**   | MongoDB Atlas    | Managed cluster                                                    |
| **AI Service** | Hugging Face API | Hosted                                                             |

---

## 🩺 Health & Monitoring

* **Health Endpoint:** `/health`
* **Status Codes:**
  * `Healthy`: All dependencies functional  
  * `Degraded`: Some services slow/unavailable  
  * `Unhealthy`: Critical failure  

Integrate with:
* **UptimeRobot** for ping checks  
* **Serilog + Seq** for structured logs  
* **Grafana/Prometheus** (optional) for metrics  

---

## ✅ Deployment Checklist

* [ ] Environment variables configured  
* [ ] MongoDB connection verified  
* [ ] Hugging Face API key active  
* [ ] Ports 4200 / 5000 open  
* [ ] Health check returns “Healthy”  

---

> "You don’t ship when it’s perfect — you ship when it’s predictable."