interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  getSelectedCount: (category: string) => number;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange, getSelectedCount }: CategoryTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(category => {
          const isActive = activeCategory === category;
          const selectedCount = getSelectedCount(category);
          
          return (
            <button
              key={category}
              className={`category-tab px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                isActive
                  ? "active bg-primary text-primary-foreground shadow-lg transform scale-105"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
              onClick={() => onCategoryChange(category)}
              data-testid={`tab-${category.toLowerCase().replace(' ', '-')}`}
            >
              {category}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                isActive
                  ? "bg-primary-foreground text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {selectedCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
