
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, UtensilsCrossed } from "lucide-react";

const MealPlanner = () => {
  return (
    <div className="p-4 pb-20 animate-fade-in">
      <h1 className="page-title">Meal Planner</h1>
      
      <div className="text-center py-8">
        <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium mb-2">Meal Planning</h2>
        <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
          Plan your meals based on what's in your pantry and create smart shopping lists.
        </p>
        <div className="space-y-3">
          <Button variant="outline" className="w-full max-w-xs" disabled>
            <Calendar className="mr-2 h-4 w-4" /> Plan This Week's Meals
          </Button>
          <p className="text-sm text-muted-foreground">
            Coming Soon
          </p>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-3">Suggested Recipes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on the ingredients in your pantry, here are some recipes you might enjoy.
        </p>
        
        <Card className="p-4 mb-4 text-center bg-muted/30">
          <p className="text-muted-foreground">
            Recipe suggestions based on your pantry will appear here soon.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MealPlanner;
