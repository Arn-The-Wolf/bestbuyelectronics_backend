import { Truck, Shield, Headphones, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free shipping on orders over TSh 100,000 across Tanzania",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment with encrypted checkout process",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer support team ready to help anytime",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day return policy for your peace of mind",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all hover-scale border-none animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
