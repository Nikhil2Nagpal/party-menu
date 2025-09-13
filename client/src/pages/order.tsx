import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Dish } from "@shared/schema";
import { CheckCircle } from "lucide-react";

interface OrderPageProps {
  selectedDishIds: string[];
}

export default function OrderPage() {
  const [, navigate] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Get selected dish IDs from URL params or local storage
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDishIds = urlParams.get("dishes")?.split(",") || [];

  const { data: dishes, isLoading } = useQuery<Dish[]>({
    queryKey: ["/api/dishes"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">Loading order...</div>
        </div>
      </div>
    );
  }

  const selectedDishes = dishes?.filter(dish => selectedDishIds.includes(dish.id)) || [];
  const totalAmount = selectedDishes.reduce((sum, dish) => sum + dish.price, 0);
  const gstAmount = Math.round(totalAmount * 0.18);
  const finalAmount = totalAmount + gstAmount;

  const handlePlaceOrder = () => {
    // Simulate order placement
    setOrderPlaced(true);
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              आपका ऑर्डर प्लेस हो गया है!
            </p>
            <p className="text-sm text-muted-foreground">
              Total Amount: <span className="font-semibold text-green-600">₹{finalAmount}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-3">Order Summary:</h3>
            <div className="space-y-2 text-sm">
              {selectedDishes.map((dish) => (
                <div key={dish.id} className="flex justify-between">
                  <span className="text-muted-foreground">{dish.name}</span>
                  <span className="text-foreground">₹{dish.price}</span>
                </div>
              ))}
              <hr className="border-border my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total (including GST)</span>
                <span className="text-green-600">₹{finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors"
              data-testid="button-new-order"
            >
              Order More Items
            </button>
            <div className="text-xs text-muted-foreground">
              Expected delivery time: 45-60 minutes
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate("/")}
                className="bg-muted p-2 rounded-lg hover:bg-muted/80 transition-colors"
                data-testid="button-back-to-menu"
              >
                <i className="fas fa-arrow-left text-foreground"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Order Summary</h1>
                <p className="text-sm text-muted-foreground">Review your selection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePlaceOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                data-testid="button-place-order"
              >
                <i className="fas fa-check mr-2"></i>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedDishes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <i className="fas fa-shopping-cart text-4xl text-muted-foreground mb-4"></i>
              <h2 className="text-xl font-semibold text-foreground mb-2">No items selected</h2>
              <p className="text-muted-foreground mb-6">Go back to the menu to select dishes for your party.</p>
              <button 
                onClick={() => navigate("/")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                data-testid="button-back-to-menu-empty"
              >
                Back to Menu
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">Selected Items ({selectedDishes.length})</h2>
              <div className="space-y-4">
                {selectedDishes.map((dish) => (
                  <div 
                    key={dish.id} 
                    className="bg-card border border-border rounded-lg p-4 shadow-sm"
                    data-testid={`order-item-${dish.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        src={dish.image || "https://via.placeholder.com/80x80"} 
                        alt={dish.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={dish.type === "VEG" ? "veg-indicator" : "non-veg-indicator"}></div>
                          <h3 className="text-lg font-semibold text-foreground">{dish.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{dish.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                            {dish.mealType}
                          </span>
                          <span className="text-xl font-bold text-primary">₹{dish.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-foreground mb-6">Bill Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal ({selectedDishes.length} items)</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total Amount</span>
                    <span data-testid="total-amount">₹{finalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    data-testid="button-confirm-order"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Confirm Order (₹{finalAmount})
                  </button>
                  
                  <button 
                    onClick={() => navigate("/")}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground py-3 rounded-lg font-medium transition-colors"
                    data-testid="button-modify-order"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Modify Order
                  </button>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Order Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Estimated delivery: 45-60 mins</div>
                    <div>• Free delivery for orders above ₹500</div>
                    <div>• Call us for any changes: +91 98765 43210</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}