import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryTabs from "./components/CategoryTabs";
import Hero from "./components/Hero";
import NewsGrid from "./components/NewsGrid";
import "./App.css";

function App() {
  const [category, setCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/news/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <>
      <Navbar />
      <CategoryTabs category={category} setCategory={setCategory} />

      {articles.length > 0 && <Hero article={articles[0]} />}

      <NewsGrid
        articles={articles.slice(1)}
        loading={loading}
      />
    </>
  );
}

export default App;
