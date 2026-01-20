import './CategoryTabs.css';

const CategoryTabs = ({ activeCategory, onCategoryChange, todoCounts }) => {
  const categories = [
    { id: 'all', label: '전체', icon: '📋' },
    { id: 'today', label: '오늘', icon: '☀️' },
    { id: 'week', label: '이번주', icon: '📅' },
    { id: 'later', label: '나중에', icon: '🕐' },
    { id: 'completed', label: '완료', icon: '✅' },
  ];

  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="tab-icon">{category.icon}</span>
          <span className="tab-label">{category.label}</span>
          {todoCounts[category.id] > 0 && (
            <span className="tab-count">{todoCounts[category.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
