---
id: troubleshooting
title: Troubleshooting Guide
sidebar_label: Troubleshooting
---

# 🧰 Troubleshooting Guide

Quick fixes for common setup or runtime issues.

-----

## 🚀 Render Fails

**Error:**
`Failed to connect to API`

**Note:** Cold start on Render can take up to **50 seconds** for the first API request after deployment or idle period.

-----
## 🧠 AI Response Empty

**Causes:** Invalid Hugging Face key, rate limits, or missing model config.

**Fix:**

  * Verify `.env` → `HUGGINGFACE_API_KEY`
  * Check Hugging Face usage
  * Restart backend

-----

## 🧩 CORS Issues

**Error:**

```
Access to fetch at ... from origin http://localhost:4200 has been blocked by CORS policy
```

**Fix:** Update allowed origins in `Program.cs`:

`.WithOrigins("http://localhost:4200", "https://askmydocuments.netlify.app")`

-----

## 🐳 Docker Build Failures

**Fix:**

```bash
docker system prune -a
docker-compose build --no-cache
```

-----

## 🧮 Health Check Failures

| Component | Status | Fix |
| :--- | :--- | :--- |
| MongoDB | Unhealthy | Ensure container is running |
| HuggingFace | Unhealthy | Verify API key and rate limits |

Always check `/health` before deeper debugging.
