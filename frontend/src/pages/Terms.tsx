import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Use of Service</h2>
              <p className="text-muted-foreground">
                You must be at least 18 years old to use our services. You agree to provide accurate information and maintain the security of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Product Information</h2>
              <p className="text-muted-foreground">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Orders and Payment</h2>
              <p className="text-muted-foreground">
                All orders are subject to availability and confirmation of price. We reserve the right to refuse or cancel any order at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Shipping and Delivery</h2>
              <p className="text-muted-foreground">
                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Please refer to our Return Policy for detailed information about returns and refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website is owned by or licensed to us. You may not use any content without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
