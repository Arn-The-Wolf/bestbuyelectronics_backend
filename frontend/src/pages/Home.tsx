import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const addToCartFn = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data = await productsApi.getFeatured();
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  const addToCart = (product: Product) => {
    addToCartFn(product);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FeaturedProducts products={featuredProducts} onAddToCart={addToCart} />
      <CategoriesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Home;