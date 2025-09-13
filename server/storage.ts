import { type User, type InsertUser, type Dish, type InsertDish } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDishes(): Promise<Dish[]>;
  getDishesByCategory(mealType: string): Promise<Dish[]>;
  getDish(id: string): Promise<Dish | undefined>;
  createDish(dish: InsertDish): Promise<Dish>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private dishes: Map<string, Dish>;

  constructor() {
    this.users = new Map();
    this.dishes = new Map();
    this.initializeDishes();
  }

  private initializeDishes() {
    const mockDishes: Dish[] = [
      {
        id: "1",
        name: "Kadhai Paneer",
        description: "Paneer cubes in spicy onion gravy with onions and capsicum cubes.",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        ingredients: [
          { name: "Paneer", quantity: "200g" },
          { name: "Onion", quantity: "2 large" },
          { name: "Capsicum", quantity: "1 large" },
          { name: "Tomato Puree", quantity: "1 cup" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      },
      {
        id: "2",
        name: "Butter Chicken",
        description: "Tender chicken in rich, creamy tomato and butter sauce with aromatic spices.",
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "NON-VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        ingredients: [
          { name: "Chicken", quantity: "500g" },
          { name: "Butter", quantity: "50g" },
          { name: "Tomato Sauce", quantity: "1 cup" },
          { name: "Heavy Cream", quantity: "100ml" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      },
      {
        id: "3",
        name: "Garden Salad",
        description: "Fresh mixed greens with cherry tomatoes, cucumber, and house dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "STARTER",
        type: "VEG",
        dishType: "SALAD",
        categoryId: 2,
        forParty: "true",
        ingredients: [
          { name: "Mixed Greens", quantity: "2 cups" },
          { name: "Cherry Tomatoes", quantity: "1 cup" },
          { name: "Cucumber", quantity: "1 large" },
          { name: "Olive Oil", quantity: "2 tbsp" },
          { name: "Lemon Juice", quantity: "1 tbsp" }
        ]
      },
      {
        id: "4",
        name: "Dal Tadka",
        description: "Yellow lentils tempered with cumin, mustard seeds, and aromatic spices.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "DAL",
        categoryId: 1,
        forParty: "true",
        ingredients: [
          { name: "Yellow Lentils", quantity: "1 cup" },
          { name: "Cumin Seeds", quantity: "1 tsp" },
          { name: "Mustard Seeds", quantity: "1 tsp" },
          { name: "Turmeric", quantity: "1/2 tsp" },
          { name: "Green Chilies", quantity: "2" }
        ]
      },
      {
        id: "5",
        name: "Vegetable Samosa",
        description: "Crispy pastry filled with spiced potatoes, peas, and aromatic herbs.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "STARTER",
        type: "VEG",
        dishType: "SNACK",
        categoryId: 2,
        forParty: "true",
        ingredients: [
          { name: "Potatoes", quantity: "3 large" },
          { name: "Green Peas", quantity: "1/2 cup" },
          { name: "Pastry Sheets", quantity: "6" },
          { name: "Cumin Powder", quantity: "1 tsp" },
          { name: "Coriander", quantity: "2 tbsp" }
        ]
      },
      {
        id: "6",
        name: "Gulab Jamun",
        description: "Soft milk dumplings soaked in rose-flavored sugar syrup.",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        ingredients: [
          { name: "Milk Powder", quantity: "1 cup" },
          { name: "Sugar", quantity: "2 cups" },
          { name: "Rose Water", quantity: "1 tsp" },
          { name: "Cardamom", quantity: "4 pods" },
          { name: "Ghee", quantity: "2 tbsp" }
        ]
      },
      {
        id: "7",
        name: "Chicken Biryani",
        description: "Aromatic basmati rice layered with spiced chicken and saffron.",
        image: "https://images.unsplash.com/photo-1563379091-2de6c4b49427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "NON-VEG",
        dishType: "RICE",
        categoryId: 1,
        forParty: "true",
        ingredients: [
          { name: "Basmati Rice", quantity: "2 cups" },
          { name: "Chicken", quantity: "500g" },
          { name: "Saffron", quantity: "1 pinch" },
          { name: "Fried Onions", quantity: "1/2 cup" },
          { name: "Yogurt", quantity: "1/2 cup" }
        ]
      },
      {
        id: "8",
        name: "Garlic Naan",
        description: "Soft leavened bread topped with fresh garlic and herbs.",
        image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "SIDES",
        type: "VEG",
        dishType: "BREAD",
        categoryId: 4,
        forParty: "true",
        ingredients: [
          { name: "All Purpose Flour", quantity: "2 cups" },
          { name: "Garlic", quantity: "4 cloves" },
          { name: "Yogurt", quantity: "1/4 cup" },
          { name: "Baking Powder", quantity: "1 tsp" },
          { name: "Fresh Herbs", quantity: "2 tbsp" }
        ]
      },
      {
        id: "9",
        name: "Chicken Wings",
        description: "Crispy chicken wings tossed in spicy buffalo sauce.",
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "STARTER",
        type: "NON-VEG",
        dishType: "APPETIZER",
        categoryId: 2,
        forParty: "true",
        ingredients: [
          { name: "Chicken Wings", quantity: "500g" },
          { name: "Buffalo Sauce", quantity: "1/2 cup" },
          { name: "Garlic Powder", quantity: "1 tsp" },
          { name: "Paprika", quantity: "1 tsp" },
          { name: "Celery Salt", quantity: "1/2 tsp" }
        ]
      },
      {
        id: "10",
        name: "Fish Tikka",
        description: "Marinated fish pieces grilled to perfection with aromatic spices.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "STARTER",
        type: "NON-VEG",
        dishType: "GRILLED",
        categoryId: 2,
        forParty: "true",
        ingredients: [
          { name: "Fish Fillet", quantity: "400g" },
          { name: "Yogurt", quantity: "1/2 cup" },
          { name: "Ginger-Garlic Paste", quantity: "2 tbsp" },
          { name: "Red Chili Powder", quantity: "1 tsp" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      }
    ];

    mockDishes.forEach(dish => {
      this.dishes.set(dish.id, dish);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDishes(): Promise<Dish[]> {
    return Array.from(this.dishes.values());
  }

  async getDishesByCategory(mealType: string): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(
      dish => dish.mealType === mealType
    );
  }

  async getDish(id: string): Promise<Dish | undefined> {
    return this.dishes.get(id);
  }

  async createDish(insertDish: InsertDish): Promise<Dish> {
    const id = randomUUID();
    const dish: Dish = { 
      ...insertDish, 
      id,
      image: insertDish.image ?? null,
      dishType: insertDish.dishType ?? null,
      categoryId: insertDish.categoryId ?? null,
      forParty: insertDish.forParty ?? null,
      ingredients: insertDish.ingredients as Array<{ name: string; quantity: string }> ?? null
    };
    this.dishes.set(id, dish);
    return dish;
  }
}

export const storage = new MemStorage();
