import { type Dish } from "@shared/schema";

interface DishCardProps {
  dish: Dish;
  isSelected: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onViewIngredients: () => void;
}

export function DishCard({ dish, isSelected, onAdd, onRemove, onViewIngredients }: DishCardProps) {
  return (
    <div className="dish-card bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <img 
        src={dish.image || "https://via.placeholder.com/400x240"} 
        alt={dish.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={dish.type === "VEG" ? "veg-indicator" : "non-veg-indicator"}></div>
            <h3 className="font-semibold text-lg text-foreground">{dish.name}</h3>
          </div>
          <button 
            className={`p-2 rounded-full transition-colors ${
              isSelected 
                ? "bg-primary text-primary-foreground pulse-animation" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            onClick={isSelected ? onRemove : onAdd}
            data-testid={`button-${isSelected ? 'remove' : 'add'}-dish-${dish.id}`}
          >
            <i className={`fas ${isSelected ? 'fa-check' : 'fa-plus'} text-sm`}></i>
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{dish.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">₹{dish.price}</span>
            <span className="text-xs text-muted-foreground">{dish.mealType}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button 
            className="text-accent hover:text-accent/80 font-medium text-sm flex items-center space-x-1"
            onClick={onViewIngredients}
            data-testid={`button-ingredients-${dish.id}`}
          >
            <i className="fas fa-list-ul"></i>
            <span>Ingredients</span>
          </button>
        </div>
      </div>
    </div>
  );
}
