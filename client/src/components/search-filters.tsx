interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  vegFilter: boolean;
  onVegFilterChange: (enabled: boolean) => void;
  nonVegFilter: boolean;
  onNonVegFilterChange: (enabled: boolean) => void;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  vegFilter,
  onVegFilterChange,
  nonVegFilter,
  onNonVegFilterChange
}: SearchFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
        <input 
          type="text" 
          placeholder="Search dishes..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          data-testid="input-search-dishes"
        />
      </div>

      {/* Veg/Non-Veg Filters */}
      <div className="flex justify-center space-x-4">
        <button 
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-colors ${
            vegFilter
              ? "border-green-500 bg-green-50 text-green-600"
              : "border-green-500 text-green-600 hover:bg-green-50"
          }`}
          onClick={() => onVegFilterChange(!vegFilter)}
          data-testid="button-filter-veg"
        >
          <div className="veg-indicator"></div>
          <span className="font-medium">Vegetarian</span>
        </button>
        <button 
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-colors ${
            nonVegFilter
              ? "border-red-500 bg-red-50 text-red-600"
              : "border-red-500 text-red-600 hover:bg-red-50"
          }`}
          onClick={() => onNonVegFilterChange(!nonVegFilter)}
          data-testid="button-filter-non-veg"
        >
          <div className="non-veg-indicator"></div>
          <span className="font-medium">Non-Vegetarian</span>
        </button>
      </div>
    </div>
  );
}
