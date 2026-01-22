import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Return & Refund Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">30-Day Return Policy</h2>
              <p className="text-muted-foreground">
                We offer a 30-day return policy for most products. Items must be returned in their original condition, with all packaging, accessories, and documentation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">How to Return an Item</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Log into your account and go to Order History</li>
                <li>Select the order containing the item you want to return</li>
                <li>Click "Request Return" and follow the instructions</li>
                <li>Print the return label and ship the item back to us</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Refund Process</h2>
              <p className="text-muted-foreground">
                Once we receive your return, we'll inspect it and process your refund within 5-7 business days. Refunds will be issued to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Non-Returnable Items</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Software and digital products</li>
                <li>Opened or used personal care items</li>
                <li>Items marked as "Final Sale"</li>
                <li>Gift cards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Damaged or Defective Items</h2>
              <p className="text-muted-foreground">
                If you receive a damaged or defective item, please contact us within 48 hours. We'll arrange for a replacement or full refund, including return shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Exchanges</h2>
              <p className="text-muted-foreground">
                We currently do not offer direct exchanges. Please return the item for a refund and place a new order for the item you want.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Return Shipping Costs</h2>
              <p className="text-muted-foreground">
                Return shipping costs are the responsibility of the customer unless the item is defective or we made an error in your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about returns, please contact our customer service team at returns@bestbuyelectronics.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicy;
