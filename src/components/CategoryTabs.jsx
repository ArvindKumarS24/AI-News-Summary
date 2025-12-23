const categories = [
  { key: "general", label: "General" },
  { key: "technology", label: "Technology" },
  { key: "business", label: "Business" },
  { key: "sports", label: "Sports" },
];

function CategoryTabs({ category, setCategory }) {
  return (
    <div className="tabs">
      {categories.map((c) => (
        <button
          key={c.key}
          className={category === c.key ? "active" : ""}
          onClick={() => setCategory(c.key)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
