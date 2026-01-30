import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi, reviewsApi, authApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  images: string[] | null;
  media?: Array<{ type: 'image' | 'video'; url: string }>;
  stock: number;
  brand: string | null;
  specifications: any;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [user, setUser] = useState<any>(null);

  const addToCartFn = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
    }
    checkUser();
  }, [id]);

  const checkUser = async () => {
    try {
      const data = await authApi.getCurrentUser();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  };

  const loadProduct = async () => {
    if (!id) return;
    try {
      const data = await productsApi.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    try {
      const data = await reviewsApi.getByProduct(id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const addToCart = () => {
    if (!product) return;

    addToCartFn(product);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to leave a review.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      await reviewsApi.create({
        product_id: id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setNewReview({ rating: 5, comment: "" });
      loadReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      loadRelated();
    }
  }, [product]);

  const loadRelated = async () => {
    if (!product) return;
    try {
      // getRelated returns featured for now, but in real app would filter
      const data = await productsApi.getRelated(product.id);
      // Filter out current product
      setRelatedProducts(data.filter(p => p.id !== product.id).slice(0, 4));
    } catch (e) {
      console.error("Error loading related products", e);
    }
  }

  // Combine legacy image and new media
  const mediaItems = product.media && Array.isArray(product.media) && product.media.length > 0
    ? product.media
    : product.image_url
      ? [{ type: 'image', url: product.image_url }]
      : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
              {mediaItems.length > 0 ? (
                mediaItems[activeImageIndex].type === 'video' ? (
                  <video
                    src={mediaItems[activeImageIndex].url}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={mediaItems[activeImageIndex].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-32 w-32 text-muted-foreground" />
                </div>
              )}

              {/* Carousel Arrows could go here */}
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {mediaItems.map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${activeImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                        <span className="text-xs">Video</span>
                      </div>
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
            {/* ... Rest of existing details inputs ... */}
            {product.brand && (
              <p className="text-muted-foreground mb-4">Brand: {product.brand}</p>
            )}

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= averageRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {product.discount_price ? (
                <>
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    TSh {product.discount_price.toLocaleString()}
                  </span>
                  <span className="text-xl md:text-2xl text-muted-foreground line-through">
                    TSh {product.price.toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="text-base md:text-lg px-3 py-1">
                    -{Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-3xl md:text-4xl font-bold">
                  TSh {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600 mb-6">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive mb-6">
                Out of Stock
              </Badge>
            )}

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="sm:w-auto">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {product.specifications && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section (Keep Existing) */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {user && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Write a Review</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <Star
                          className={`h-8 w-8 ${star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="mb-4"
                  rows={4}
                />

                <Button onClick={submitReview}>Submit Review</Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">{review.profiles?.full_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}

            {reviews.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <div key={rp.id} onClick={() => navigate(`/products/${rp.id}`)} className="cursor-pointer group">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                    {rp.image_url ? (
                      <img src={rp.image_url} alt={rp.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="text-muted-foreground" /></div>
                    )}
                  </div>
                  <h3 className="font-medium truncate">{rp.name}</h3>
                  <p className="text-primary font-bold">TSh {rp.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;