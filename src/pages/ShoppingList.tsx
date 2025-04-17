
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { GroceryItem, categories } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, ShoppingCart, Search, Edit, Trash2, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ShoppingList = () => {
  const { 
    shoppingList, 
    addToShoppingList, 
    removeFromShoppingList, 
    toggleItemCompleted,
    moveFromShoppingToPantry
  } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState<Omit<GroceryItem, "id">>({
    name: "",
    category: "Produce",
    quantity: 1,
  });

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }
    
    addToShoppingList(newItem);
    setNewItem({
      name: "",
      category: "Produce",
      quantity: 1,
    });
    setIsAddDialogOpen(false);
  };

  const filteredItems = shoppingList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    // First sort by completion status
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    // Then sort by category
    return a.category.localeCompare(b.category);
  });

  // Group items by category
  const groupedItems: Record<string, GroceryItem[]> = {};
  sortedItems.forEach((item) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  return (
    <div className="p-4 pb-20 animate-fade-in">
      <h1 className="page-title">Shopping List</h1>
      
      <div className="mb-4 relative">
        <div className="input-with-icon">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {filteredItems.length === 0 ? "No items" : `${filteredItems.length} items`}
        </h2>
        <Button 
          size="sm" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedItems).length === 0 && (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Your shopping list is empty</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add your first item
            </Button>
          </div>
        )}

        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    item.isCompleted ? "bg-gray-50 text-gray-500" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Checkbox 
                      checked={item.isCompleted} 
                      onCheckedChange={() => toggleItemCompleted(item.id)}
                      className="mr-3"
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.quantity} {item.unit || ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFromShoppingList(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => moveFromShoppingToPantry(item.id)}
                    >
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to Shopping List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit (optional)</label>
                <Input
                  placeholder="e.g., lb, oz, pkg"
                  value={newItem.unit || ""}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Input
                placeholder="Add notes..."
                value={newItem.notes || ""}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShoppingList;
