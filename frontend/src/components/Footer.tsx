import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">BestBuy Electronics</h3>
            <p className="opacity-90">
              Tanzania's premier destination for quality electronics at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/returns" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Smartphones" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laptops" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Tablets" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Tablets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="opacity-80 hover:text-[#ff7f00] hover:underline transition-all">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 opacity-90">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center gap-2 opacity-90">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+255 123 456 789</span>
              </li>
              <li className="flex items-center gap-2 opacity-90">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@bestbuy.co.tz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-80">
          <p>&copy; {new Date().getFullYear()} BestBuy Electronics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
