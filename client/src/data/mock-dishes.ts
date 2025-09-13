import { type Dish } from "@shared/schema";

export const mockDishes: Dish[] = [
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
  // Add more dishes as needed
];
