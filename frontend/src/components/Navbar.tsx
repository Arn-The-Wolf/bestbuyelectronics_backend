import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store";

interface NavbarProps {
  cartItemsCount?: number; // Kept for backward compatibility but made optional
}

const Navbar = ({ cartItemsCount = 0 }: NavbarProps) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use global store for cart count, fallback to prop if store is empty (though store should be source of truth)
  const storeCartCount = useCartStore((state) => state.getCartCount());
  // Prioritize store count if it has hydration, but keep prop for now if needed. 
  // Actually, we want to rely on store.
  const displayCartCount = storeCartCount;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/products", label: "Products" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    checkUser();
    // Poll for auth changes every 5 seconds
    const interval = setInterval(checkUser, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkUser = async () => {
    try {
      const data = await authApi.getCurrentUser();
      setUser(data.user);
      // Check if user has admin role
      const role = data.user?.role;
      setIsAdmin(role === 'admin');
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    authApi.logout();
    setUser(null);
    setIsAdmin(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BestBuyElectronics
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {navLinks.map((link) => (
              <Button
                key={link.to}
                variant="ghost"
                onClick={() => navigate(link.to)}
                className="hidden lg:flex"
              >
                {link.label}
              </Button>
            ))}

            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {displayCartCount}
                </span>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    My Orders
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3 mt-8">
                  {navLinks.map((link) => (
                    <Button
                      key={link.to}
                      variant="ghost"
                      onClick={() => {
                        navigate(link.to);
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      {link.label}
                    </Button>
                  ))}
                  {user && (
                    <>
                      <Button variant="ghost" onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }} className="justify-start">My Profile</Button>
                      <Button variant="ghost" onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }} className="justify-start">Admin</Button>
                      <Button variant="ghost" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="justify-start">Logout</Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;