
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { PantryItem, categories } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Trash2, AlertTriangle, Refrigerator } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const Pantry = () => {
  const { 
    pantryItems, 
    addToPantry, 
    removeFromPantry
  } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newItem, setNewItem] = useState<Omit<PantryItem, "id">>({
    name: "",
    category: "Pantry",
    quantity: 1,
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
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
    
    addToPantry(newItem);
    setNewItem({
      name: "",
      category: "Pantry",
      quantity: 1,
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsAddDialogOpen(false);
  };

  const filteredItems = pantryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get expiring items (within 7 days)
  const expiringItems = filteredItems.filter((item) => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysDifference = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDifference >= 0 && daysDifference <= 7;
  });

  // Determine which items to display based on active tab
  const itemsToDisplay = activeTab === "expiring" 
    ? expiringItems 
    : filteredItems;

  // Group items by category
  const groupedItems: Record<string, PantryItem[]> = {};
  itemsToDisplay.forEach((item) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  return (
    <div className="p-4 pb-20 animate-fade-in">
      <h1 className="page-title">Pantry</h1>
      
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring Soon
            {expiringItems.length > 0 && (
              <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                {expiringItems.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {itemsToDisplay.length === 0 ? "No items" : `${itemsToDisplay.length} items`}
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
            <Refrigerator className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">
              {activeTab === "all" 
                ? "Your pantry is empty" 
                : "No items expiring soon"}
            </p>
            {activeTab === "all" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add your first item
              </Button>
            )}
          </div>
        )}

        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => {
                const isExpiringSoon = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <div 
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      isExpiringSoon ? "border-red-200 bg-red-50" : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-medium flex items-center">
                        {item.name}
                        {isExpiringSoon && (
                          <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.quantity} {item.unit || ""}
                      </div>
                      {item.expiryDate && (
                        <div className={`text-xs ${isExpiringSoon ? "text-red-500" : "text-gray-500"}`}>
                          Expires: {format(new Date(item.expiryDate), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFromPantry(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to Pantry</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Date</label>
                <Input
                  type="date"
                  value={newItem.purchaseDate || ""}
                  onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date (optional)</label>
                <Input
                  type="date"
                  value={newItem.expiryDate || ""}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                />
              </div>
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
            <Button onClick={handleAddItem}>Add to Pantry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pantry;
