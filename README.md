# 🕊️ Lumière - AI Spiritual Assistant (Hybrid Cloud RAG)

**Lumière** is a high-performance spiritual assistant. It uses a **Decoupled Architecture** to combine the speed of a React frontend with the specialized power of an AI-optimized backend.

---

## 🏗️ System Architecture

To handle the heavy Machine Learning requirements (Sentence-Transformers & LLMs) while maintaining a fast user interface, this project is split across two specialized cloud platforms:

* **Frontend (Vercel)**: A fast, globally distributed React UI optimized for the best user experience.
* **Backend (Hugging Face Spaces)**: A dedicated Python environment that handles the RAG logic, vector embeddings (`BAAI/bge-m3`), and heavy model processing.
* **Database (MongoDB Atlas)**: A cloud-based NoSQL database for real-time chat history persistence.



---

## 🚀 Key Features

* **Intelligent RAG System**: Retrieves biblical verses based on semantic meaning rather than just keywords.
* **Contextual Memory**: Remembers your previous questions within a session thanks to MongoDB.
* **Query Rewriting**: Uses Llama 3.3 to refine user questions for better retrieval accuracy.
* **Responsive UI**: Mobile-first design developed with Tailwind CSS.

---

## 🛠️ Tech Stack

| Component | Technology | Hosting |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind | **Vercel** |
| **Backend** | FastAPI, Python | **Hugging Face** |
| **AI Models** | Llama 3.3 (Groq), BGE-M3 | **Cloud API / HF** |
| **Database** | MongoDB Atlas | **Cloud** |

---

## 📂 Project Layout

```text
Bible_Bot/
├── bible_bot/            # Frontend - Root Directory for Vercel
│   ├── src/              # React source code
│   └── vercel.json       # SPA routing configuration
├── README.md             # This documentation
└── [Backend Repo]        # Hosted separately on Hugging Face



## 🔗 Live Demo
🚀 **Access the application here**: [https://lumierebiblebot.vercel.app](https://lumierebiblebot.vercel.app)  
*(Note: The backend is hosted on Hugging Face and may take a few seconds to wake up on the first request.)*
