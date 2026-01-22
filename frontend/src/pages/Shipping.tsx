import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Globe } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable shipping to your doorstep
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Standard Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">$5.99</p>
              <p className="text-muted-foreground">3-5 business days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Express Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">$15.99</p>
              <p className="text-muted-foreground">1-2 business days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>International</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">Varies</p>
              <p className="text-muted-foreground">7-14 business days</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">Processing Time</h3>
              <p className="text-muted-foreground">
                Orders are typically processed within 1-2 business days. You'll receive a confirmation email once your order ships with tracking information.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Tracking Your Order</h3>
              <p className="text-muted-foreground">
                Once shipped, you can track your order in real-time through your account dashboard or using the tracking link provided in your shipping confirmation email.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Free Shipping</h3>
              <p className="text-muted-foreground">
                Enjoy free standard shipping on orders over $50! This offer applies to domestic orders only.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">International Shipping</h3>
              <p className="text-muted-foreground">
                We ship to most countries worldwide. International shipping rates vary by destination and package weight. Customs duties and taxes may apply and are the responsibility of the recipient.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Shipping Restrictions</h3>
              <p className="text-muted-foreground">
                Some products may have shipping restrictions due to size, weight, or local regulations. Any restrictions will be noted on the product page.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Delivery Issues</h3>
              <p className="text-muted-foreground">
                If your package is lost, damaged, or delayed, please contact our customer service team. We'll work with the carrier to resolve the issue quickly.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
