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
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 280,
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
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "NON-VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 320,
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
        price: 180,
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
        price: 220,
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
        price: 120,
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
        price: 150,
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
        price: 380,
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
        price: 80,
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
        price: 250,
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
        price: 280,
        ingredients: [
          { name: "Fish Fillet", quantity: "400g" },
          { name: "Yogurt", quantity: "1/2 cup" },
          { name: "Ginger-Garlic Paste", quantity: "2 tbsp" },
          { name: "Red Chili Powder", quantity: "1 tsp" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      },
      // More STARTER items
      {
        id: "11",
        name: "Paneer Tikka",
        description: "Marinated cottage cheese cubes grilled with bell peppers and onions.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "STARTER",
        type: "VEG",
        dishType: "GRILLED",
        categoryId: 2,
        forParty: "true",
        price: 220,
        ingredients: [
          { name: "Paneer", quantity: "300g" },
          { name: "Bell Peppers", quantity: "2" },
          { name: "Onions", quantity: "2" },
          { name: "Yogurt", quantity: "1/2 cup" },
          { name: "Tandoori Masala", quantity: "2 tbsp" }
        ]
      },
      {
        id: "12",
        name: "Seekh Kebab",
        description: "Spiced minced meat skewers grilled to perfection with herbs and spices.",
        image: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "STARTER",
        type: "NON-VEG",
        dishType: "GRILLED",
        categoryId: 2,
        forParty: "true",
        price: 300,
        ingredients: [
          { name: "Minced Meat", quantity: "500g" },
          { name: "Onions", quantity: "2" },
          { name: "Green Chilies", quantity: "3" },
          { name: "Ginger-Garlic Paste", quantity: "2 tbsp" },
          { name: "Red Chili Powder", quantity: "1 tsp" }
        ]
      },
      // More MAIN COURSE items
      {
        id: "13",
        name: "Rajma Masala",
        description: "Red kidney beans cooked in rich tomato and onion gravy with spices.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 240,
        ingredients: [
          { name: "Rajma", quantity: "2 cups" },
          { name: "Tomatoes", quantity: "3 large" },
          { name: "Onions", quantity: "2" },
          { name: "Ginger-Garlic Paste", quantity: "2 tbsp" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      },
      {
        id: "14",
        name: "Mutton Curry",
        description: "Tender mutton pieces cooked in traditional spices and rich gravy.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "MAIN COURSE",
        type: "NON-VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 420,
        ingredients: [
          { name: "Mutton", quantity: "500g" },
          { name: "Onions", quantity: "3" },
          { name: "Tomatoes", quantity: "2" },
          { name: "Yogurt", quantity: "1/2 cup" },
          { name: "Whole Spices", quantity: "1 set" }
        ]
      },
      // More DESSERT items
      {
        id: "15",
        name: "Ras Malai",
        description: "Soft cottage cheese dumplings in sweetened thickened milk with cardamom.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 180,
        ingredients: [
          { name: "Cottage Cheese", quantity: "200g" },
          { name: "Milk", quantity: "1 liter" },
          { name: "Sugar", quantity: "1 cup" },
          { name: "Cardamom", quantity: "4 pods" },
          { name: "Pistachios", quantity: "2 tbsp" }
        ]
      },
      {
        id: "16",
        name: "Kulfi",
        description: "Traditional Indian ice cream with cardamom and pistachios.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "FROZEN",
        categoryId: 3,
        forParty: "true",
        price: 120,
        ingredients: [
          { name: "Full Fat Milk", quantity: "1 liter" },
          { name: "Sugar", quantity: "1/2 cup" },
          { name: "Cardamom Powder", quantity: "1 tsp" },
          { name: "Pistachios", quantity: "3 tbsp" },
          { name: "Almonds", quantity: "2 tbsp" }
        ]
      },
      {
        id: "17",
        name: "Gajar Halwa",
        description: "Rich carrot pudding cooked with milk, sugar and garnished with nuts.",
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 160,
        ingredients: [
          { name: "Carrots", quantity: "1 kg" },
          { name: "Milk", quantity: "500ml" },
          { name: "Sugar", quantity: "3/4 cup" },
          { name: "Ghee", quantity: "3 tbsp" },
          { name: "Dry Fruits", quantity: "1/4 cup" }
        ]
      },
      {
        id: "18",
        name: "Kheer",
        description: "Creamy rice pudding cooked in milk with cardamom and nuts.",
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 140,
        ingredients: [
          { name: "Basmati Rice", quantity: "1/4 cup" },
          { name: "Full Fat Milk", quantity: "1 liter" },
          { name: "Sugar", quantity: "1/2 cup" },
          { name: "Cardamom", quantity: "3 pods" },
          { name: "Almonds", quantity: "2 tbsp" }
        ]
      },
      // More SIDES items
      {
        id: "19",
        name: "Jeera Rice",
        description: "Fragrant basmati rice cooked with cumin seeds and whole spices.",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "SIDES",
        type: "VEG",
        dishType: "RICE",
        categoryId: 4,
        forParty: "true",
        price: 180,
        ingredients: [
          { name: "Basmati Rice", quantity: "2 cups" },
          { name: "Cumin Seeds", quantity: "2 tsp" },
          { name: "Bay Leaves", quantity: "2" },
          { name: "Ghee", quantity: "2 tbsp" },
          { name: "Salt", quantity: "to taste" }
        ]
      },
      {
        id: "20",
        name: "Butter Naan",
        description: "Soft leavened bread brushed with butter and cooked in tandoor.",
        image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "SIDES",
        type: "VEG",
        dishType: "BREAD",
        categoryId: 4,
        forParty: "true",
        price: 70,
        ingredients: [
          { name: "All Purpose Flour", quantity: "2 cups" },
          { name: "Yogurt", quantity: "1/4 cup" },
          { name: "Butter", quantity: "3 tbsp" },
          { name: "Baking Powder", quantity: "1 tsp" },
          { name: "Salt", quantity: "1 tsp" }
        ]
      },
      {
        id: "21",
        name: "Mixed Raita",
        description: "Cooling yogurt side dish with cucumber, onion and mint.",
        image: "https://images.unsplash.com/photo-1596797882870-8c33ddeaa639?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "SIDES",
        type: "VEG",
        dishType: "ACCOMPANIMENT",
        categoryId: 4,
        forParty: "true",
        price: 90,
        ingredients: [
          { name: "Yogurt", quantity: "2 cups" },
          { name: "Cucumber", quantity: "1 large" },
          { name: "Onions", quantity: "1 small" },
          { name: "Mint Leaves", quantity: "2 tbsp" },
          { name: "Chat Masala", quantity: "1 tsp" }
        ]
      },
      {
        id: "22",
        name: "Papad",
        description: "Crispy thin wafers made from lentil flour, perfect as a side.",
        image: "https://images.unsplash.com/photo-1626132647523-66f4bf380027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        mealType: "SIDES",
        type: "VEG",
        dishType: "ACCOMPANIMENT",
        categoryId: 4,
        forParty: "true",
        price: 40,
        ingredients: [
          { name: "Urad Dal", quantity: "1 cup" },
          { name: "Salt", quantity: "1 tsp" },
          { name: "Black Pepper", quantity: "1/2 tsp" },
          { name: "Asafoetida", quantity: "1 pinch" },
          { name: "Oil", quantity: "for frying" }
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
