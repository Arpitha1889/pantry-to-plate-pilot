
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Refrigerator, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shopping-list", label: "Shopping", icon: ShoppingCart },
    { path: "/pantry", label: "Pantry", icon: Refrigerator },
    { path: "/meal-planner", label: "Meals", icon: Calendar },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-3",
              currentPath === item.path
                ? "text-primary"
                : "text-gray-500 hover:text-primary"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
