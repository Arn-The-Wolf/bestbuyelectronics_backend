import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Truck, HeadphonesIcon, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                About BestBuy Electronics
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Tanzania's most trusted destination for premium electronics and unbeatable customer service since 2015
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Founded in 2015 in Dar es Salaam, BestBuy Electronics started with a simple mission: 
                  to make cutting-edge technology accessible to everyone in Tanzania. What began as a 
                  small shop has grown into the nation's leading electronics retailer, serving thousands 
                  of satisfied customers across the country.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mt-6">
                  We pride ourselves on offering only genuine products from the world's leading brands, 
                  backed by comprehensive warranties and exceptional after-sales support. Our team of 
                  tech experts is always ready to help you find the perfect device for your needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover-scale animate-fade-in">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">100% Authentic</h3>
                  <p className="text-muted-foreground">
                    All products are sourced directly from authorized distributors
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Fast Delivery</h3>
                  <p className="text-muted-foreground">
                    Same-day delivery available in Dar es Salaam and major cities
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <HeadphonesIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Our customer service team is always here to help you
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-scale animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Best Warranty</h3>
                  <p className="text-muted-foreground">
                    Comprehensive warranty coverage on all products
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To empower Tanzanians with access to the latest technology at competitive prices, 
                while providing exceptional customer service and building lasting relationships with 
                our community. We believe that everyone deserves access to quality electronics that 
                enhance their lives and businesses.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
