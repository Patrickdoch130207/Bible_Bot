# Lumière — AI Spiritual Assistant

<div align="center">

[![React](https://skillicons.dev/icons?i=react)](https://react.dev)
[![TypeScript](https://skillicons.dev/icons?i=ts)](https://www.typescriptlang.org)
[![Vite](https://skillicons.dev/icons?i=vite)](https://vitejs.dev)
[![TailwindCSS](https://skillicons.dev/icons?i=tailwind)](https://tailwindcss.com)
[![Python](https://skillicons.dev/icons?i=python)](https://www.python.org)
[![FastAPI](https://skillicons.dev/icons?i=fastapi)](https://fastapi.tiangolo.com)
[![MongoDB](https://skillicons.dev/icons?i=mongodb)](https://www.mongodb.com/atlas)
[![Vercel](https://skillicons.dev/icons?i=vercel)](https://vercel.com)

<br/>

![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Llama](https://img.shields.io/badge/Llama%203.3-6A0DAD?style=for-the-badge&logo=meta&logoColor=white)
![BGE-M3](https://img.shields.io/badge/BGE--M3-0080FF?style=for-the-badge&logo=academia&logoColor=white)

<br/>

**A high-performance spiritual assistant powered by a Hybrid Cloud RAG architecture.**

🌐 Live at [lumierebiblebot.vercel.app](https://lumierebiblebot.vercel.app)

</div>

---

## About

**Lumière** is an AI-powered spiritual assistant that helps users explore biblical wisdom through the power of modern AI. Rather than simple keyword search, Lumière understands the *meaning* behind your questions and finds the most relevant verses — then answers with care and context.

It uses a **Decoupled Architecture** to separate concerns cleanly: a fast React frontend lives on Vercel, while all the heavy AI processing runs on a dedicated Hugging Face Space.

---

## System Architecture

<div align="center">

| Layer | Platform | Role |
|:---|:---|:---|
| **Frontend** | Vercel | Fast, globally distributed React UI |
| **Backend** | Hugging Face Spaces | RAG logic, vector embeddings & LLM processing |
| **Database** | MongoDB Atlas | Real-time chat history persistence |

</div>

The split exists for a good reason — running Sentence-Transformers and large language models alongside a React UI on the same server would be wasteful and slow. Each part lives where it runs best.

---

## Key Features

- **Intelligent RAG System** — retrieves biblical verses based on semantic meaning, not just keywords
- **Contextual Memory** — remembers your previous questions within a session using MongoDB
- **Query Rewriting** — uses Llama 3.3 to refine your questions before retrieval for better accuracy
- **Responsive UI** — mobile-first design built with Tailwind CSS

---

## Tech Stack

<div align="center">

| Component | Technology | Hosting |
|:---|:---|:---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS | Vercel |
| **Backend** | Python, FastAPI | Hugging Face Spaces |
| **Embeddings** | BGE-M3 (BAAI/bge-m3) | Hugging Face |
| **LLM** | Llama 3.3 via Groq API | Cloud API |
| **Database** | MongoDB Atlas | Cloud |

</div>

---

## Project Layout

```
Bible_Bot/
├── bible_bot/            # Frontend — Vercel root directory
│   ├── src/              # React source code
│   └── vercel.json       # SPA routing configuration
├── README.md
└── [Backend Repo]        # Hosted separately on Hugging Face Spaces
```

---

## How it works

```
User question
     │
     ▼
Query Rewriting (Llama 3.3)
     │
     ▼
Semantic Search (BGE-M3 embeddings)
     │
     ▼
Relevant verses retrieved from vector store
     │
     ▼
Answer generated with context (Llama 3.3 via Groq)
     │
     ▼
Response displayed + saved to MongoDB
```

---

<div align="center">

Made by [Patrick Dochamou](https://github.com/Patrickdoch130207)

</div>
