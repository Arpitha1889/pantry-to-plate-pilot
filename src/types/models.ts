
export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  isCompleted?: boolean;
  notes?: string;
  expiryDate?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  purchaseDate?: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit?: string;
  }>;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
  tags: string[];
  isFavorite: boolean;
}

export interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
  };
}

export type Category = 
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Bakery'
  | 'Pantry'
  | 'Frozen'
  | 'Beverages'
  | 'Household'
  | 'Personal Care'
  | 'Other';

export const categories: Category[] = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Bakery',
  'Pantry',
  'Frozen',
  'Beverages',
  'Household',
  'Personal Care',
  'Other'
];
