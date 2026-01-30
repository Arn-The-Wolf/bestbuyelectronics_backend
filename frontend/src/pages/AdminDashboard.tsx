import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, MessageSquare, Users, Star } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    messages: 0,
    customers: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await adminApi.getStats();
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stats:", error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
          {getGreeting()}, Admin
        </h1>
        <p className="text-slate-600 mt-2 text-lg">Here's what's happening in your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/products" className="block">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Products</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.products}</div>
              <p className="text-xs text-blue-600/80 mt-1 font-medium">Active in catalog</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/orders" className="block">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Orders</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.orders}</div>
              <p className="text-xs text-green-600/80 mt-1 font-medium">All time orders</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/orders" className="block">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-full">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                TSh {stats.revenue.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600/80 mt-1 font-medium">Total earnings</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/messages" className="block">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Messages</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.messages}</div>
              <p className="text-xs text-purple-600/80 mt-1 font-medium">Customer messages</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/customers" className="block">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-cyan-500 bg-gradient-to-br from-white to-cyan-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Customers</CardTitle>
              <div className="p-2 bg-cyan-100 rounded-full">
                <Users className="h-5 w-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.customers}</div>
              <p className="text-xs text-cyan-600/80 mt-1 font-medium">Registered users</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/reviews" className="block">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-yellow-500 bg-gradient-to-br from-white to-yellow-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Reviews</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.reviews}</div>
              <p className="text-xs text-yellow-600/80 mt-1 font-medium">Product reviews</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            Use the sidebar to navigate to different sections of the admin panel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}