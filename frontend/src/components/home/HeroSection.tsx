import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroSlides = [
  {
    image: hero1,
    title: "Tanzania's Best Electronics",
    description: "Discover the latest smartphones, laptops, and gadgets at unbeatable prices."
  },
  {
    image: hero2,
    title: "Premium Gaming Gear",
    description: "Level up your game with high-performance PCs, gaming laptops, and accessories."
  },
  {
    image: hero3,
    title: "Smart Home Solutions",
    description: "Transform your home with cutting-edge smart devices and wireless technology."
  }
];

const HeroSection = () => {
  const [api, setApi] = useState<any>();

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative h-screen overflow-hidden">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="relative h-full w-full bg-cover bg-center flex items-center justify-center transition-all duration-1000"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 animate-fade-in" />
                <div className="relative z-10 text-white text-center w-full px-4 md:px-8">
                  <div className="space-y-6 animate-scale-in">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link to="/products">
                        <Button size="lg" variant="secondary" className="text-base md:text-lg group">
                          Shop Now
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/chat">
                        <Button size="lg" variant="outline" className="text-base md:text-lg bg-white/10 hover:bg-white/20 border-white text-white">
                          Contact Us
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default HeroSection;
