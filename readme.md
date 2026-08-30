# ResumeFlow AI 2.0 — Next-Gen ATS Resume Studio

> A high-performance, aesthetically captivating, client-first interactive resume engineering platform built with modern web technologies, real-time ATS scoring, AI keyword enhancement, and 6 designer templates.

[![Live Demo](https://img.shields.io/badge/Live_Demo-ResumeFlow_Studio-4f7df9?style=for-the-badge&logo=render)](https://resume-builder-ui.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![ATS Rating](https://img.shields.io/badge/ATS_Optimization-100%25_Score-cyan?style=for-the-badge)](#ats-intelligence-engine)

---

## 🌟 Key Features & Highlights

### ⚡ Split-Screen Real-Time Live Studio
- **Instant Keystroke Synchronization**: Bi-directional reactive state binding between input repeaters and the live document preview.
- **Interactive Zoom & Pan**: Fluid viewport scaling from 50% to 150% with pixel-perfect document rendering.
- **Dynamic Modular Repeaters**: Effortlessly add, rearrange, and remove Experience, Education, Projects, Skills, Certifications, Languages, and Custom Sections.
- **Photo Customizer**: Crop, resize, and toggle between circular, rounded, and square avatar styles.

### 🎨 6 Designer-Crafted Resume Templates
1. **Silicon Valley Modern**: Dual-column layout with vibrant sidebar, skill tags, and timeline markers.
2. **Executive Minimalist**: Authoritative single-column typography optimized for senior leadership roles.
3. **Creative Designer**: Dynamic top header band with photo framing and aesthetic project cards.
4. **Cyber Dark / Terminal**: Futuristic matrix dark theme with monospace tags and glowing accents.
5. **Ivy League Academic**: Distinguished serif typography with formal divider rules.
6. **Compact Pro 1-Page**: Maximum information density strictly formatted for comprehensive 1-page presentation.

### 🎯 Real-Time ATS Intelligence & AI Optimization Engine
- **Action Verb Density Scanner**: Analyzes summaries and bullet points against 60+ power verbs (*Engineered*, *Architected*, *Spearheaded*, *Optimized*, *Automated*).
- **Metric Quantifier**: Evaluates measurable metrics (`%`, `$`, `k`, `x`, `M`, latency reduction).
- **Instant ATS Score (0–100%)**: Provides actionable recommendations and diagnostic badges before you submit.

### 💾 Local Vault & Multi-Resume Management
- **Autonomous Client-Side Storage**: Complete privacy — no resume data leaves the user's browser.
- **Multi-Resume Storage**: Create multiple targeted resumes tailored for different job profiles.
- **1-Click JSON Backup & Restore**: Download full resume backups and restore them at any time.
- **Vector-Crisp PDF Export**: Print-ready high-DPI PDF generation with automatic page-break avoidance.

---

## 🚀 Live Pages & Routing

| Page | URL / File | Purpose |
|------|-----------|---------|
| **Home Landing** | `index.html` | Holographic 3D resume hero, live features, and interactive scanner demo |
| **Live Studio** | `builder.html` | Split-screen resume builder with live synchronization & PDF export |
| **Template Gallery** | `templates.html` | Filterable templates catalog with 1-click launch |
| **Resume Vault** | `dashboard.html` | Manage, duplicate, rename, backup, and delete saved resumes |
| **Authentication** | `login.html` | Glassmorphic login with 1-click Instant Guest Access |
| **Settings** | `settings.html` | Profile management and sample dataset reset |
| **Contact** | `contact.html` | Developer contact form and privacy information |

---

## 🛠️ Technology Stack

- **Frontend Core**: Semantic HTML5, Modular ES6+ JavaScript, CSS3 Design Tokens & Glassmorphism
- **Styling Architecture**: Custom CSS Variables, Glassmorphic elevation, responsive CSS Grid / Flexbox, Print CSS Media Queries
- **PDF Engine**: Native vector browser rasterization + `html2pdf.js`
- **Iconography & Typography**: FontAwesome 6 Pro, Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*)
- **Deployment**: Universal static file hosting (Render, GitHub Pages, Vercel) + Dockerized Apache / PHP container fallback

---

## 📦 Deployment & Getting Started

### Option 1: Static Hosting (Zero Server Required)
Simply open `index.html` in any modern web browser, or deploy directly to GitHub Pages / Vercel / Netlify.

### Option 2: Docker Container (Render / Local)
```bash
# Build the Docker image
docker build -t resumeflow-app .

# Run container on port 80
docker run -p 8080:80 resumeflow-app
```
Visit `http://localhost:8080` in your browser.

---

## 👤 Author & Credits

**Binayak Chopra**  
- Portfolio: [binayakchopra.dev](https://resume-builder-ui.onrender.com)  
- GitHub: [@BinayakChopra](https://github.com/BinayakChopra)  

Crafted with dedication to empower engineers, designers, and students worldwide.
