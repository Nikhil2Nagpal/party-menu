import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all dishes
  app.get("/api/dishes", async (req, res) => {
    try {
      const dishes = await storage.getDishes();
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dishes" });
    }
  });

  // Get dishes by category
  app.get("/api/dishes/category/:mealType", async (req, res) => {
    try {
      const { mealType } = req.params;
      const dishes = await storage.getDishesByCategory(mealType.toUpperCase());
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dishes by category" });
    }
  });

  // Get single dish
  app.get("/api/dishes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dish = await storage.getDish(id);
      
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }
      
      res.json(dish);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dish" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
