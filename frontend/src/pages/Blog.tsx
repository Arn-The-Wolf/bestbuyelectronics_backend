import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Gaming Laptops for 2025",
      excerpt: "Discover the best gaming laptops that combine performance, portability, and value...",
      category: "Gaming",
      date: "Jan 15, 2025",
      image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80",
    },
    {
      id: 2,
      title: "5G Technology: What You Need to Know",
      excerpt: "Understanding the impact of 5G on smartphones and mobile devices...",
      category: "Mobile",
      date: "Jan 12, 2025",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    },
    {
      id: 3,
      title: "Smart Home Devices Guide 2025",
      excerpt: "Transform your home with the latest IoT devices and automation systems...",
      category: "Smart Home",
      date: "Jan 10, 2025",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tech News & Blog
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest technology trends, product reviews, and industry insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge>{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
