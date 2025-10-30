---
# id: intro
title: Introduction
sidebar_label: Overview
slug: /
---

# AI-Powered Document Intelligence Platform

**AskMyDocs** is an enterprise-grade AI platform that lets you query and understand your documents — PDF, Word, or text — using modern LLM-based contextual understanding.

It extracts, chunks, embeds, and stores your document content for **semantic retrieval** and **natural-language Q&A** powered by **Hugging Face** and **Sentence Transformers**.

---

## 🔍 Quick Summary

- **Backend:** .NET 10 (Clean Architecture, CQRS, MediatR)
- **Frontend:** Angular 20 (PrimeNG + Tailwind)
- **Database:** MongoDB 8.0
- **AI Engine:** Hugging Face API (`all-mpnet-base-v2`)
- **Deployment:** Dockerized services hosted on Render (API) and Netlify (UI)
- **CI/CD:** GitHub Actions for automated build, test, and deploy

---

## 🚀 Live Environments

| Component | Hosting | Link |
|------------|----------|------|
| Frontend | Netlify | [https://askmydocuments.netlify.app](https://askmydocuments.netlify.app) |
| Backend API | Render | [https://askmydocs-0dfe.onrender.com/scalar](https://askmydocs-0dfe.onrender.com/scalar) |

---

## 💡 Core Capabilities

- Secure authentication (JWT)
- Document upload and parsing (PDF, DOCX)
- Semantic chunking & vector embedding
- Context-aware question answering
- Scalable modular architecture
