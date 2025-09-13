import { type Dish } from "@shared/schema";

interface IngredientModalProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
}

export function IngredientModal({ isOpen, dish, onClose }: IngredientModalProps) {
  if (!isOpen || !dish) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{dish.name}</h2>
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <div className={dish.type === "VEG" ? "veg-indicator" : "non-veg-indicator"}></div>
            <span className="text-sm text-muted-foreground">
              {dish.type === "VEG" ? "Vegetarian" : "Non-Vegetarian"} • {dish.mealType}
            </span>
          </div>
          <p className="text-muted-foreground mb-6">{dish.description}</p>
          
          <h3 className="font-semibold text-foreground mb-4">Ingredients:</h3>
          <div className="space-y-3">
            {dish.ingredients?.map((ingredient, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-foreground">{ingredient.name}</span>
                <span className="text-muted-foreground text-sm">{ingredient.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-border">
          <button 
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            onClick={onClose}
            data-testid="button-modal-got-it"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
