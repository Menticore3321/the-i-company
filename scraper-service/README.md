# The I Company · Headless Instagram Scraper Microservice (Option A)

This is a dedicated standalone **Headless Chromium Scraper Microservice** using `puppeteer-extra` and `puppeteer-extra-plugin-stealth` for scraping live Instagram Reels (exact URLs, video view counts, thumbnails, likes, and captions) without getting blocked.

---

## 🚀 Quick Start (Local)

1. Open a terminal in this directory:
   ```bash
   cd "scraper-service"
   npm install
   npm start
   ```

2. The server will start on `http://localhost:4000`:
   - **Health check**: `http://localhost:4000/health`
   - **Scrape 10 Reels**: `http://localhost:4000/reels?handle=techburner&limit=10`

---

## ☁️ 1-Click Free Deployment on Render.com (2 Minutes)

1. Push this repository to GitHub.
2. Go to [https://dashboard.render.com](https://dashboard.render.com) and click **New + > Web Service**.
3. Select your GitHub repository (`the-i-company`).
4. Set:
   - **Root Directory**: `scraper-service`
   - **Environment**: `Docker`
   - **Plan**: `Free`
5. Click **Create Web Service**.
6. Render will generate your live microservice URL (e.g., `https://the-i-company-scraper.onrender.com`).
7. Paste this URL in your dashboard `.env` or in the **Add Influencer Modal** settings!

