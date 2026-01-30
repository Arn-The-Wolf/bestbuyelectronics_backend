import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { authApi, ordersApi, profilesApi } from "@/lib/api";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { useCartStore } from "@/lib/store";

const Checkout = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const cart = useCartStore((state) => state.cart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    checkUser();
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]); // Add cart as dependency to redirect if empty

  const checkUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      if (!userData.user) {
        navigate("/auth");
        return;
      }
      setUser(userData.user);

      try {
        const profile = await profilesApi.getMe();
        if (profile) {
          setFormData({
            fullName: profile.full_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
          });
        }
      } catch (error) {
        // Profile might not exist yet
      }
    } catch (error) {
      navigate("/auth");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = getCartTotal();

      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const order = await ordersApi.create({
        items,
        total_amount: total,
        shipping_address: `${formData.address}, ${formData.city}`,
        phone: formData.phone,
        payment_method: paymentMethod,
      });

      await profilesApi.update({
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      });

      clearCart();

      toast({
        title: "Order placed successfully!",
        description: paymentMethod === "mobile_money"
          ? "Please complete payment via M-Pesa to the number shown."
          : "Your order will be delivered. Pay cash on delivery.",
      });

      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-4 border-t pt-6 mt-6">
                    <Label className="text-lg font-semibold">Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="mobile_money" id="mobile_money" />
                          <Label htmlFor="mobile_money" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Mobile Money (M-Pesa)</p>
                              <p className="text-sm text-muted-foreground">Pay via M-Pesa mobile money</p>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                          <Label htmlFor="cash_on_delivery" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Banknote className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "mobile_money" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">M-Pesa Payment Instructions:</p>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Go to M-Pesa menu on your phone</li>
                          <li>Select "Lipa na M-Pesa"</li>
                          <li>Select "Pay Bill"</li>
                          <li>Enter Business Number: <strong>888999</strong></li>
                          <li>Enter Account Number: Your Order ID (will be shown after placing order)</li>
                          <li>Enter Amount: <strong>TSh {getCartTotal().toLocaleString()}</strong></li>
                          <li>Enter your M-Pesa PIN and confirm</li>
                        </ol>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">
                          TSh {((item.discount_price || item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>TSh {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      TSh {getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;