
import React, { createContext, useContext, useState, useEffect } from "react";
import { GroceryItem, PantryItem, Recipe, MealPlan } from "@/types/models";
import { toast } from "@/components/ui/use-toast";

interface AppContextType {
  shoppingList: GroceryItem[];
  pantryItems: PantryItem[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  addToShoppingList: (item: Omit<GroceryItem, "id">) => void;
  removeFromShoppingList: (id: string) => void;
  updateShoppingItem: (id: string, updates: Partial<GroceryItem>) => void;
  toggleItemCompleted: (id: string) => void;
  addToPantry: (item: Omit<PantryItem, "id">) => void;
  removeFromPantry: (id: string) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  moveFromShoppingToPantry: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Helper function to generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoppingList, setShoppingList] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem("shoppingList");
    return saved ? JSON.parse(saved) : [];
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem("pantryItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("recipes");
    return saved ? JSON.parse(saved) : [];
  });

  const [mealPlans, setMealPlans] = useState<MealPlan[]>(() => {
    const saved = localStorage.getItem("mealPlans");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem("pantryItems", JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("mealPlans", JSON.stringify(mealPlans));
  }, [mealPlans]);

  const addToShoppingList = (item: Omit<GroceryItem, "id">) => {
    const newItem = { ...item, id: generateId() };
    setShoppingList((prev) => [...prev, newItem]);
    toast({
      title: "Item added",
      description: `${newItem.name} added to your shopping list`,
    });
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateShoppingItem = (id: string, updates: Partial<GroceryItem>) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const toggleItemCompleted = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const addToPantry = (item: Omit<PantryItem, "id">) => {
    const newItem = { ...item, id: generateId() };
    setPantryItems((prev) => [...prev, newItem]);
    toast({
      title: "Item added",
      description: `${newItem.name} added to your pantry`,
    });
  };

  const removeFromPantry = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updatePantryItem = (id: string, updates: Partial<PantryItem>) => {
    setPantryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const moveFromShoppingToPantry = (id: string) => {
    const item = shoppingList.find((item) => item.id === id);
    if (item) {
      const { isCompleted, ...pantryItem } = item;
      addToPantry({
        ...pantryItem,
        purchaseDate: new Date().toISOString().split('T')[0],
      });
      removeFromShoppingList(id);
      toast({
        title: "Item moved to pantry",
        description: `${item.name} has been moved to your pantry`,
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        shoppingList,
        pantryItems,
        recipes,
        mealPlans,
        addToShoppingList,
        removeFromShoppingList,
        updateShoppingItem,
        toggleItemCompleted,
        addToPantry,
        removeFromPantry,
        updatePantryItem,
        moveFromShoppingToPantry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
