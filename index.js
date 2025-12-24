// 1️⃣ Imports
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";

import newsRoutes from "./routes/newsRoutes.js";

// 2️⃣ Config
dotenv.config();

// 3️⃣ Create app
const app = express();

// 4️⃣ Middlewares
app.use(cors());
app.use(express.json());

// 5️⃣ Health check (Render needs this)
app.get("/", (req, res) => {
  res.send("🚀 AI News Backend is running");
});

// 6️⃣ News routes
app.use("/news", newsRoutes);

/* ============================================================
   7️⃣ AI ARTICLE SUMMARY ROUTE
============================================================ */
app.post("/summarize-article", (req, res) => {
  const { title, description, content } = req.body;

  const cleanTitle = title || "News Update";

  let text = "";
  if (content && content.length > 80) {
    text = content.replace(/\[\+\d+ chars\]/g, "");
  } else if (description && description.length > 40) {
    text = description;
  } else {
    text = cleanTitle;
  }

  const sentences = text
    .replace(/\s+/g, " ")
    .split(".")
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 3);

  const summary = `
🧠 ${cleanTitle}

${sentences.join(". ")}.
  `.trim();

  res.json({ summary });
});

/* ============================================================
   8️⃣ DAILY TELEGRAM NEWS DIGEST (CRON)
============================================================ */
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily Telegram news digest...");

  try {
    const newsResponse = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          country: "us",
          pageSize: 5,
          apiKey: process.env.NEWS_API_KEY,
        },
      }
    );

    const articles = newsResponse.data.articles;
    if (!articles || articles.length === 0) return;

    const combinedNews = articles
      .map((a, i) => `${i + 1}. ${a.title}`)
      .join("\n");

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: `Summarize these headlines using emojis and explain why it matters:\n\n${combinedNews}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 250,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = aiResponse.data.choices[0].message.content;

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `🗞️ Daily AI News Digest\n\n${summary}`,
      }
    );

    console.log("✅ Daily news sent to Telegram");
  } catch (error) {
    console.error("❌ Cron job failed:", error.message);
  }
});

// 9️⃣ START SERVER (Render-safe)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
