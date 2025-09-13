import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryTabs } from "@/components/category-tabs";
import { SearchFilters } from "@/components/search-filters";
import { DishCard } from "@/components/dish-card";
import { IngredientModal } from "@/components/ingredient-modal";
import { SelectedSummary } from "@/components/selected-summary";
import { type Dish } from "@shared/schema";

const MEAL_TYPES = ["STARTER", "MAIN COURSE", "DESSERT", "SIDES"];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("STARTER");
  const [searchTerm, setSearchTerm] = useState("");
  const [vegFilter, setVegFilter] = useState(false);
  const [nonVegFilter, setNonVegFilter] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const { data: dishes = [], isLoading } = useQuery<Dish[]>({
    queryKey: ["/api/dishes"],
  });

  // Filter dishes based on current filters
  const filteredDishes = dishes.filter(dish => {
    // Category filter
    if (dish.mealType !== selectedCategory) return false;
    
    // Search filter
    if (searchTerm && !dish.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Veg/Non-veg filter
    if (vegFilter || nonVegFilter) {
      // If both filters are active, show all dishes (OR logic)
      if (vegFilter && nonVegFilter) return true;
      // If only veg filter is active, show only VEG dishes
      if (vegFilter && dish.type !== "VEG") return false;
      // If only non-veg filter is active, show only NON-VEG dishes
      if (nonVegFilter && dish.type !== "NON-VEG") return false;
    }
    
    return true;
  });

  // Count selected dishes by category (only those matching current filters)
  const getSelectedCountByCategory = (category: string) => {
    return selectedDishes.filter(dishId => {
      const dish = dishes.find(d => d.id === dishId);
      if (!dish || dish.mealType !== category) return false;
      
      // Apply the same filter logic as filteredDishes
      // Search filter
      if (searchTerm && !dish.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Veg/Non-veg filter
      if (vegFilter || nonVegFilter) {
        // If both filters are active, show all dishes (OR logic)
        if (vegFilter && nonVegFilter) return true;
        // If only veg filter is active, show only VEG dishes
        if (vegFilter && dish.type !== "VEG") return false;
        // If only non-veg filter is active, show only NON-VEG dishes
        if (nonVegFilter && dish.type !== "NON-VEG") return false;
      }
      
      return true;
    }).length;
  };

  const handleAddDish = (dishId: string) => {
    if (!selectedDishes.includes(dishId)) {
      setSelectedDishes([...selectedDishes, dishId]);
    }
  };

  const handleRemoveDish = (dishId: string) => {
    setSelectedDishes(selectedDishes.filter(id => id !== dishId));
  };

  const handleViewIngredients = (dish: Dish) => {
    setSelectedDish(dish);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDish(null);
  };

  const handleContinue = () => {
    // TODO: Navigate to checkout or next step
    console.log("Continue with selected dishes:", selectedDishes);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">Loading dishes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <i className="fas fa-utensils text-primary-foreground text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Party Menu</h1>
                <p className="text-sm text-muted-foreground">Select dishes for your party</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors">
                <i className="fas fa-user mr-2"></i>Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          vegFilter={vegFilter}
          onVegFilterChange={setVegFilter}
          nonVegFilter={nonVegFilter}
          onNonVegFilterChange={setNonVegFilter}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={MEAL_TYPES}
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          getSelectedCount={getSelectedCountByCategory}
        />

        {/* Dish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredDishes.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              isSelected={selectedDishes.includes(dish.id)}
              onAdd={() => handleAddDish(dish.id)}
              onRemove={() => handleRemoveDish(dish.id)}
              onViewIngredients={() => handleViewIngredients(dish)}
            />
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No dishes found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Selected Items Summary */}
      {selectedDishes.length > 0 && (
        <SelectedSummary
          totalCount={selectedDishes.length}
          onContinue={handleContinue}
        />
      )}

      {/* Ingredient Modal */}
      <IngredientModal
        isOpen={modalOpen}
        dish={selectedDish}
        onClose={handleCloseModal}
      />
    </div>
  );
}
