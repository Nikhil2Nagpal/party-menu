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
        image: "/images/kadhai-paneer.jfif",
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
        image: "/images/butter-chicken.jfif",
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
        image: "/images/green-salad.jfif",
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
        name: "Dal Makhni",
        description: "Creamy black lentils slow-cooked with butter, cream, and aromatic spices.",
        image: "/images/dal-makhni.jfif",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "DAL",
        categoryId: 1,
        forParty: "true",
        price: 240,
        ingredients: [
          { name: "Black Lentils", quantity: "1 cup" },
          { name: "Kidney Beans", quantity: "1/2 cup" },
          { name: "Butter", quantity: "50g" },
          { name: "Heavy Cream", quantity: "100ml" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      },
      {
        id: "5",
        name: "Vegetable Samosa",
        description: "Crispy pastry filled with spiced potatoes, peas, and aromatic herbs.",
        image: "/images/samosa.jfif",
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
        image: "/images/gulab-jamun.jfif",
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
        image: "/images/chicken-biryani.jfif",
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
        image: "/images/garlic-naan.jfif",
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
        image: "/images/chicken-wings.jfif",
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
        image: "/images/fish-tikka.jfif",
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
        image: "/images/paneer-tikka.jfif",
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
        image: "/images/seekh-kabab.jfif",
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
        image: "/images/rajma-masala.jfif",
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
        image: "/images/mutton-curry.jfif",
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
        image: "/images/ras-malai.jfif",
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
        image: "/images/kulfi.jfif",
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
        image: "/images/gajar-halwa.jfif",
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
        image: "/images/kheer.jfif",
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
        image: "/images/jeera-rice.jfif",
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
        image: "/images/butter-naan.jfif",
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
        image: "/images/mixed-raita.jfif",
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
        image: "/images/papad.jfif",
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
      },
      {
        id: "23", // Make sure this is a unique ID
        name: "Mutton Rogan Josh",
        description: "Traditional Kashmiri lamb curry with aromatic spices and yogurt.",
        image: "/images/mutton-rogan.jfif",
        mealType: "MAIN COURSE", // Can be "STARTER", "MAIN COURSE", "DESSERT", or "SIDES"
        type: "NON-VEG", // Can be "VEG" or "NON-VEG"
        dishType: "CURRY",
        categoryId: 1, // 1 for MAIN COURSE, 2 for STARTER, 3 for DESSERT, 4 for SIDES
        forParty: "true",
        price: 420,
        ingredients: [
          { name: "Mutton", quantity: "500g" },
          { name: "Yogurt", quantity: "1/2 cup" },
          { name: "Kashmiri Red Chilies", quantity: "2 tbsp" },
          { name: "Garam Masala", quantity: "1 tsp" },
          { name: "Fennel Seeds", quantity: "1 tsp" }
        ]
      },
      
      // 5 NEW STARTER ITEMS
      {
        id: "24",
        name: "Spring Rolls",
        description: "Crispy vegetable rolls with sweet chili dipping sauce.",
        image: "/images/spring-rolls.jfif",
        mealType: "STARTER",
        type: "VEG",
        dishType: "APPETIZER",
        categoryId: 2,
        forParty: "true",
        price: 160,
        ingredients: [
          { name: "Cabbage", quantity: "1 cup" },
          { name: "Carrot", quantity: "1/2 cup" },
          { name: "Spring Roll Wrappers", quantity: "10" },
          { name: "Soy Sauce", quantity: "2 tbsp" },
          { name: "Ginger", quantity: "1 tsp" }
        ]
      },
      {
        id: "25",
        name: "Chicken Lollipop",
        description: "Deep-fried chicken drumettes in spicy glaze.",
        image: "/images/chicken-lollipop.jfif",
        mealType: "STARTER",
        type: "NON-VEG",
        dishType: "APPETIZER",
        categoryId: 2,
        forParty: "true",
        price: 240,
        ingredients: [
          { name: "Chicken Drumettes", quantity: "500g" },
          { name: "Red Chili Powder", quantity: "1 tsp" },
          { name: "Ginger-Garlic Paste", quantity: "1 tbsp" },
          { name: "Soy Sauce", quantity: "2 tbsp" },
          { name: "Honey", quantity: "1 tbsp" }
        ]
      },
      {
        id: "26",
        name: "Aloo Tikki",
        description: "Spiced potato patties with mint chutney.",
        image: "/images/aloo-tikki.jfif",
        mealType: "STARTER",
        type: "VEG",
        dishType: "SNACK",
        categoryId: 2,
        forParty: "true",
        price: 130,
        ingredients: [
          { name: "Potatoes", quantity: "4 large" },
          { name: "Green Chilies", quantity: "2" },
          { name: "Cumin Powder", quantity: "1 tsp" },
          { name: "Coriander", quantity: "2 tbsp" },
          { name: "Bread Crumbs", quantity: "1/2 cup" }
        ]
      },
      {
        id: "27",
        name: "Prawn Tempura",
        description: "Lightly battered fried prawns with sweet chili sauce.",
        image: "/images/prown.jfif",
        mealType: "STARTER",
        type: "NON-VEG",
        dishType: "APPETIZER",
        categoryId: 2,
        forParty: "true",
        price: 320,
        ingredients: [
          { name: "Prawns", quantity: "300g" },
          { name: "Tempura Batter", quantity: "1 cup" },
          { name: "Ice Water", quantity: "1/2 cup" },
          { name: "Flour", quantity: "1/2 cup" },
          { name: "Sweet Chili Sauce", quantity: "1/4 cup" }
        ]
      },
      {
        id: "28",
        name: "Bruschetta",
        description: "Toasted bread topped with tomatoes, basil and mozzarella.",
        image: "/images/bruschetta.jfif",
        mealType: "STARTER",
        type: "VEG",
        dishType: "APPETIZER",
        categoryId: 2,
        forParty: "true",
        price: 180,
        ingredients: [
          { name: "Baguette", quantity: "1/2 loaf" },
          { name: "Tomatoes", quantity: "2 large" },
          { name: "Basil", quantity: "1/4 cup" },
          { name: "Mozzarella", quantity: "100g" },
          { name: "Balsamic Glaze", quantity: "2 tbsp" }
        ]
      },
      
      // 5 NEW MAIN COURSE ITEMS
      {
        id: "29",
        name: "Palak Paneer",
        description: "Cottage cheese cubes in creamy spinach gravy.",
        image: "/images/palak-paneer.jfif",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 260,
        ingredients: [
          { name: "Paneer", quantity: "200g" },
          { name: "Spinach", quantity: "500g" },
          { name: "Onions", quantity: "2" },
          { name: "Ginger-Garlic Paste", quantity: "1 tbsp" },
          { name: "Garam Masala", quantity: "1 tsp" }
        ]
      },
      {
        id: "30",
        name: "Lamb Rogan Josh",
        description: "Tender lamb in aromatic Kashmiri spices.",
        image: "/images/lamb.jfif",
        mealType: "MAIN COURSE",
        type: "NON-VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 450,
        ingredients: [
          { name: "Lamb", quantity: "500g" },
          { name: "Onions", quantity: "3" },
          { name: "Yogurt", quantity: "1/2 cup" },
          { name: "Kashmiri Chili", quantity: "2 tsp" },
          { name: "Saffron", quantity: "pinch" }
        ]
      },
      {
        id: "31",
        name: "Chana Masala",
        description: "Spiced chickpea curry with onions and tomatoes.",
        image: "/images/chana.jfif",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 200,
        ingredients: [
          { name: "Chickpeas", quantity: "2 cups" },
          { name: "Tomatoes", quantity: "3" },
          { name: "Onions", quantity: "2" },
          { name: "Garam Masala", quantity: "1 tsp" },
          { name: "Cumin Seeds", quantity: "1 tsp" }
        ]
      },
      {
        id: "32",
        name: "Prawn Biryani",
        description: "Fragrant rice layered with spiced prawns and saffron.",
        image: "/images/prawn.jfif",
        mealType: "MAIN COURSE",
        type: "NON-VEG",
        dishType: "RICE",
        categoryId: 1,
        forParty: "true",
        price: 380,
        ingredients: [
          { name: "Basmati Rice", quantity: "2 cups" },
          { name: "Prawns", quantity: "300g" },
          { name: "Saffron", quantity: "pinch" },
          { name: "Mint", quantity: "1/4 cup" },
          { name: "Yogurt", quantity: "1/2 cup" }
        ]
      },
      {
        id: "33",
        name: "Eggplant Curry",
        description: "Tender eggplant in spicy tomato-onion gravy.",
        image: "/images/eggplant.jfif",
        mealType: "MAIN COURSE",
        type: "VEG",
        dishType: "CURRY",
        categoryId: 1,
        forParty: "true",
        price: 230,
        ingredients: [
          { name: "Eggplant", quantity: "2 large" },
          { name: "Tomatoes", quantity: "3" },
          { name: "Onions", quantity: "2" },
          { name: "Turmeric", quantity: "1/2 tsp" },
          { name: "Coriander Powder", quantity: "1 tsp" }
        ]
      },
      
      // 5 NEW DESSERT ITEMS
      {
        id: "34",
        name: "Chocolate Mousse",
        description: "Light and airy chocolate mousse with berry compote.",
        image: "/images/mousse.jfif",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 180,
        ingredients: [
          { name: "Dark Chocolate", quantity: "200g" },
          { name: "Heavy Cream", quantity: "1 cup" },
          { name: "Eggs", quantity: "3" },
          { name: "Sugar", quantity: "1/4 cup" },
          { name: "Vanilla Extract", quantity: "1 tsp" }
        ]
      },
      {
        id: "35",
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert.",
        image: "/images/tiramisu.jfif",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 220,
        ingredients: [
          { name: "Ladyfingers", quantity: "20" },
          { name: "Mascarpone", quantity: "500g" },
          { name: "Coffee", quantity: "1 cup" },
          { name: "Cocoa Powder", quantity: "2 tbsp" },
          { name: "Sugar", quantity: "1/4 cup" }
        ]
      },
      {
        id: "36",
        name: "Fruit Parfait",
        description: "Layered yogurt with seasonal fruits and granola.",
        image: "/images/parfait.jfif",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 160,
        ingredients: [
          { name: "Greek Yogurt", quantity: "2 cups" },
          { name: "Mixed Berries", quantity: "1 cup" },
          { name: "Granola", quantity: "1/2 cup" },
          { name: "Honey", quantity: "2 tbsp" },
          { name: "Mint Leaves", quantity: "few" }
        ]
      },
      {
        id: "37",
        name: "Cheesecake",
        description: "Creamy New York style cheesecake with berry topping.",
        image: "/images/cake.jfif",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "SWEET",
        categoryId: 3,
        forParty: "true",
        price: 240,
        ingredients: [
          { name: "Cream Cheese", quantity: "500g" },
          { name: "Graham Crackers", quantity: "1 cup" },
          { name: "Sugar", quantity: "1/2 cup" },
          { name: "Vanilla Extract", quantity: "1 tsp" },
          { name: "Mixed Berries", quantity: "1/2 cup" }
        ]
      },
      {
        id: "38",
        name: "Ice Cream Sundae",
        description: "Vanilla ice cream with hot fudge and nuts.",
        image: "/images/icecream.jfif",
        mealType: "DESSERT",
        type: "VEG",
        dishType: "FROZEN",
        categoryId: 3,
        forParty: "true",
        price: 150,
        ingredients: [
          { name: "Vanilla Ice Cream", quantity: "2 scoops" },
          { name: "Hot Fudge", quantity: "1/4 cup" },
          { name: "Chopped Nuts", quantity: "2 tbsp" },
          { name: "Whipped Cream", quantity: "2 tbsp" },
          { name: "Cherry", quantity: "1" }
        ]
      },
      
      // 5 NEW SIDES ITEMS
      {
        id: "39",
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter and herbs.",
        image: "/images/bread.jfif",
        mealType: "SIDES",
        type: "VEG",
        dishType: "BREAD",
        categoryId: 4,
        forParty: "true",
        price: 90,
        ingredients: [
          { name: "Baguette", quantity: "1/2 loaf" },
          { name: "Butter", quantity: "100g" },
          { name: "Garlic", quantity: "4 cloves" },
          { name: "Parsley", quantity: "2 tbsp" },
          { name: "Salt", quantity: "to taste" }
        ]
      },
      {
        id: "40",
        name: "Mashed Potatoes",
        description: "Creamy mashed potatoes with butter and herbs.",
        image: "/images/potato.jfif",
        mealType: "SIDES",
        type: "VEG",
        dishType: "ACCOMPANIMENT",
        categoryId: 4,
        forParty: "true",
        price: 120,
        ingredients: [
          { name: "Potatoes", quantity: "1 kg" },
          { name: "Butter", quantity: "100g" },
          { name: "Milk", quantity: "1/4 cup" },
          { name: "Chives", quantity: "2 tbsp" },
          { name: "Salt", quantity: "to taste" }
        ]
      },
      {
        id: "41",
        name: "Steamed Vegetables",
        description: "Seasonal vegetables steamed with herbs.",
        image: "/images/steam-vegies.jfif",
        mealType: "SIDES",
        type: "VEG",
        dishType: "ACCOMPANIMENT",
        categoryId: 4,
        forParty: "true",
        price: 140,
        ingredients: [
          { name: "Broccoli", quantity: "1/2 head" },
          { name: "Carrots", quantity: "2" },
          { name: "Green Beans", quantity: "1 cup" },
          { name: "Butter", quantity: "2 tbsp" },
          { name: "Lemon Juice", quantity: "1 tbsp" }
        ]
      },
      {
        id: "42",
        name: "Fried Rice",
        description: "Egg fried rice with vegetables and soy sauce.",
        image: "/images/fried.jfif",
        mealType: "SIDES",
        type: "VEG",
        dishType: "RICE",
        categoryId: 4,
        forParty: "true",
        price: 160,
        ingredients: [
          { name: "Basmati Rice", quantity: "2 cups" },
          { name: "Eggs", quantity: "2" },
          { name: "Vegetables", quantity: "1 cup" },
          { name: "Soy Sauce", quantity: "2 tbsp" },
          { name: "Spring Onions", quantity: "2" }
        ]
      },
      {
        id: "43",
        name: "Coleslaw",
        description: "Fresh cabbage salad with creamy dressing.",
        image: "/images/coleslaw.jfif",
        mealType: "SIDES",
        type: "VEG",
        dishType: "SALAD",
        categoryId: 4,
        forParty: "true",
        price: 100,
        ingredients: [
          { name: "Cabbage", quantity: "1/2 head" },
          { name: "Carrots", quantity: "2" },
          { name: "Mayonnaise", quantity: "1/4 cup" },
          { name: "Apple Cider Vinegar", quantity: "1 tbsp" },
          { name: "Sugar", quantity: "1 tsp" }
        ]
      }
    ];

    mockDishes.forEach(dish => {
      this.dishes.set(dish.id, dish);
    });
  }

  // 5 NEW STARTER ITEMS
  // 1. Spring Rolls
  // 2. Chicken Lollipop
  // 3. Aloo Tikki
  // 4. Prawn Tempura
  // 5. Bruschetta
  
  // 5 NEW MAIN COURSE ITEMS
  // 1. Palak Paneer
  // 2. Lamb Rogan Josh
  // 3. Chana Masala
  // 4. Prawn Biryani
  // 5. Eggplant Curry
  
  // 5 NEW DESSERT ITEMS
  // 1. Chocolate Mousse
  // 2. Tiramisu
  // 3. Fruit Parfait
  // 4. Cheesecake
  // 5. Ice Cream Sundae
  
  // 5 NEW SIDES ITEMS
  // 1. Garlic Bread
  // 2. Mashed Potatoes
  // 3. Steamed Vegetables
  // 4. Fried Rice
  // 5. Coleslaw

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
