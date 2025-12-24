import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          country: "us",
          category: category,
          pageSize: 10,
          apiKey: process.env.NEWS_API_KEY
        }
      }
    );

    res.json(response.data.articles || []);
  } catch (error) {
    console.error("❌ News API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
