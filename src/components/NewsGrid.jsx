import NewsCard from "./NewsCard";
import SkeletonCard from "./SkeletonCard";

function NewsGrid({ articles, loading }) {
  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid">
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
}

export default NewsGrid;
