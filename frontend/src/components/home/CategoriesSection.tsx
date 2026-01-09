import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Laptop, Tablet, Headphones } from "lucide-react";

const categories = [
  { name: "Smartphones", icon: Smartphone, color: "text-blue-500" },
  { name: "Laptops", icon: Laptop, color: "text-purple-500" },
  { name: "Tablets", icon: Tablet, color: "text-green-500" },
  { name: "Accessories", icon: Headphones, color: "text-orange-500" },
];

const CategoriesSection = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">
            Browse our wide selection of electronics
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} to={`/products?category=${category.name}`}>
                <Card 
                  className="hover:shadow-xl transition-all cursor-pointer hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                      <Icon className={`h-10 w-10 ${category.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
