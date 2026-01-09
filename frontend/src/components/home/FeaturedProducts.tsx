import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const FeaturedProducts = ({ products, onAddToCart }: FeaturedProductsProps) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Handpicked deals just for you</p>
        </div>
        <Link to="/products">
          <Button variant="outline" size="lg">View All Products</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Card 
            key={product.id} 
            className="group hover:shadow-xl transition-all animate-fade-in hover-scale"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(0)</span>
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {product.discount_price ? (
                  <>
                    <span className="text-xl font-bold text-primary">
                      TSh {product.discount_price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      TSh {product.price.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      -{Math.round((1 - product.discount_price / product.price) * 100)}%
                    </Badge>
                  </>
                ) : (
                  <span className="text-xl font-bold">
                    TSh {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-destructive border-destructive">
                  Out of Stock
                </Badge>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
