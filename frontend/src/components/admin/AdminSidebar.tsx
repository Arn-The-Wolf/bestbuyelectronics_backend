import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderOpen,
  Users,
  Tag,
  Star,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
];

export default function AdminSidebar({ className }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate("/auth");
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-gradient-to-b from-slate-900 to-slate-800 text-white", className)}>
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <Link to="/">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-300 transition-all cursor-pointer">
            Bestbuy Electronics
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-slate-700/50",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 border-l-4 border-cyan-400"
                    : "text-slate-300 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-cyan-200")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout Button */}
      <div className="border-t border-slate-700 p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
