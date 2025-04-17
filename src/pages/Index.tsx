
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, ShoppingCart, Refrigerator, Calendar, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { shoppingList, pantryItems } = useAppContext();
  const navigate = useNavigate();

  const pendingItems = shoppingList.filter(item => !item.isCompleted).length;
  const expiringItems = pantryItems.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysDifference = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDifference >= 0 && daysDifference <= 3;
  }).length;

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Pantry to Plate</h1>
      
      <Card className="mb-4 border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle>Shopping List</CardTitle>
          <CardDescription>
            {pendingItems === 0 
              ? "Your shopping list is empty" 
              : `You have ${pendingItems} items to buy`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center pt-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-primary h-5 w-5" />
            <span className="text-xl font-medium">{pendingItems}</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/shopping-list')}
          >
            View List
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4 border-l-4 border-l-secondary">
        <CardHeader className="pb-2">
          <CardTitle>Pantry</CardTitle>
          <CardDescription>
            {expiringItems > 0 
              ? `${expiringItems} items expiring soon` 
              : "No items expiring soon"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center pt-0">
          <div className="flex items-center gap-2">
            <Refrigerator className="text-secondary h-5 w-5" />
            <span className="text-xl font-medium">{pantryItems.length}</span>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => navigate('/pantry')}
          >
            View Pantry
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="col-span-1">
          <CardHeader className="p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent mx-auto mb-2">
              <Calendar className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-center text-base">Meal Plans</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-center">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/meal-planner')}
            >
              View Plans
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-center text-base">Smart Insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-center">
            <Button 
              variant="ghost" 
              className="w-full"
              disabled
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Button 
          size="lg" 
          className="w-full"
          onClick={() => navigate('/shopping-list')}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Shopping List
        </Button>
      </div>
    </div>
  );
};

export default Index;
