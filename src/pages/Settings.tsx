
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Info, Moon, Shield, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all app data? This cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data cleared",
        description: "All app data has been cleared successfully.",
      });
      // Force a page reload to reset all states
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-20 animate-fade-in">
      <h1 className="page-title">Settings</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Get alerts for expiring items</p>
                </div>
              </div>
              <Switch checked disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Toggle dark theme</p>
                </div>
              </div>
              <Switch disabled />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-medium mb-3">About</h2>
          <div className="rounded-md border p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Pantry to Plate</p>
                <p className="text-sm text-gray-500 mb-2">
                  Version 1.0.0
                </p>
                <p className="text-sm text-gray-500">
                  A smart grocery app that helps you manage your shopping lists and pantry
                  inventory, with AI-powered recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-medium mb-3">Privacy & Data</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Privacy Policy</p>
                  <p className="text-sm text-gray-500">Read our privacy policy</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" disabled>
                View
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trash2 className="h-5 w-5 mr-3 text-destructive" />
                <div>
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-sm text-gray-500">This cannot be undone</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={clearAllData}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
