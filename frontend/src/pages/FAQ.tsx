import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and mobile money (M-Pesa, Tigo Pesa). All transactions are secure and encrypted.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery. You'll receive a tracking number once your order ships.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most products. Items must be in original condition with all packaging. Certain electronics may have different return windows - please check the product page for details.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. International orders may be subject to customs duties and taxes.",
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
    },
    {
      question: "What is your warranty policy?",
      answer: "All products come with manufacturer warranty. Extended warranty options are available at checkout. Warranty periods vary by product - check the product details for specific information.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 24 hours of placement. After that, please contact our customer service team for assistance.",
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes! We offer special pricing for bulk orders. Contact our sales team at sales@bestbuyelectronics.com for a custom quote.",
    },
    {
      question: "How does the loyalty program work?",
      answer: "Earn 1 point for every $1 spent. Points can be redeemed for discounts on future purchases. Members also get early access to sales and exclusive deals.",
    },
    {
      question: "What if my product arrives damaged?",
      answer: "If your product arrives damaged, contact us within 48 hours with photos of the damage. We'll arrange a replacement or full refund immediately.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
