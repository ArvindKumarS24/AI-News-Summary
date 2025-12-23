import { useState } from "react";

// 🔹 Simple emoji detector based on title keywords
const getEmoji = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("ai") || t.includes("tech") || t.includes("apple") || t.includes("google"))
    return "🤖";
  if (t.includes("business") || t.includes("market") || t.includes("stock"))
    return "📈";
  if (t.includes("sport") || t.includes("match") || t.includes("game"))
    return "🏆";
  if (t.includes("health") || t.includes("vaccine") || t.includes("medical"))
    return "🩺";
  if (t.includes("politic") || t.includes("congress") || t.includes("government"))
    return "🏛️";
  return "📰";
};

function NewsCard({ article }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // =========================
  // 🤖 AI SUMMARIZE
  // =========================
  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");

    const payload = {
      title: article.title || "News Update",
      description: article.description || "",
      content:
        article.content ||
        article.description ||
        article.title ||
        "This article discusses a recent news update.",
    };

    try {
      const res = await fetch("http://localhost:5000/summarize-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const finalText =
        data?.summary?.trim() ||
        `${payload.title}

This article highlights a relevant topic with limited available details.`;

      setSummary(finalText);
    } catch {
      setSummary(`AI Summary Unavailable

Something went wrong while generating this summary.`);
    }

    setLoading(false);
  };

  // =========================
  // 🔗 SHARE
  // =========================
  const share = (type) => {
    const url = article.url;
    const text = article.title;

    if (type === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    }
    if (type === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`
      );
    }
    if (type === "copy") {
      navigator.clipboard.writeText(url);
      alert("📋 Link copied!");
    }
    setShowShare(false);
  };

  const emoji = getEmoji(article.title);

  return (
    <div className="card">
      <img
        src={article.urlToImage || "https://via.placeholder.com/400x200"}
        alt={article.title}
      />

      <h3>{article.title}</h3>
      <p>{article.description || "Click below to read the full article."}</p>

      {/* ACTIONS */}
      <div className="actions">
        <button onClick={handleSummarize}>
          {loading ? "🤖 Thinking..." : "AI Summarize"}
        </button>

        <a href={article.url} target="_blank" rel="noreferrer">
          <button className="secondary">Get Article</button>
        </a>

        <button onClick={() => setShowShare(!showShare)}>Share</button>
      </div>

      {/* SHARE MENU */}
      {showShare && (
        <div className="share-menu">
          <button onClick={() => share("whatsapp")}>WhatsApp</button>
          <button onClick={() => share("telegram")}>Telegram</button>
          <button onClick={() => share("copy")}>Copy Link</button>
        </div>
      )}

      {/* =========================
          🧠 AI SUMMARY
         ========================= */}
      {summary && (
        <div className="ai-summary-box">
          {/* Heading */}
          <h4 style={{ fontWeight: "700", marginBottom: "8px" }}>
            {emoji} AI Smart Summary
          </h4>

          {/* Points */}
          {summary
            .split(".")
            .map((line, i) => line.trim())
            .filter((line) => line.length > 20)
            .slice(0, 4)
            .map((line, i) => (
              <p
                key={i}
                style={{
                  fontStyle: "italic",
                  marginLeft: "10px",
                  lineHeight: "1.6",
                }}
              >
                • {line}.
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

export default NewsCard;
