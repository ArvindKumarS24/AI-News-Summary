function Hero({ article }) {
  return (
    <section className="hero">
      <img
        src={article.urlToImage || "https://via.placeholder.com/1200x500"}
        alt=""
      />
      <div className="hero-content">
        <span>{article.source?.name}</span>
        <h2>{article.title}</h2>
        <p>{article.description}</p>

        <a href={article.url} target="_blank">
          Read full article →
        </a>
      </div>
    </section>
  );
}

export default Hero;
