import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ordersApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Truck, ArrowRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderConfirmation = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (id) {
            loadOrder(id);
        }
    }, [id]);

    const loadOrder = async (orderId: string) => {
        try {
            const data = await ordersApi.getById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Error loading order:', error);
            toast({
                title: "Error",
                description: "Could not load order details.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Order ID copied to clipboard",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 py-16 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                    <Link to="/">
                        <Button>Return to Home</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. Your order #{order.id.slice(0, 8)} has been placed.
                    </p>
                </div>

                {order.payment_method === 'mobile_money' ? (
                    <Card className="mb-6 border-primary/20 shadow-lg">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Phone className="h-5 w-5" />
                                Payment Required
                            </CardTitle>
                            <CardDescription>
                                Please complete your payment to process this order.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
                                    <h3 className="font-semibold text-base mb-2">M-Pesa Payment Instructions:</h3>
                                    <ol className="list-decimal list-inside space-y-2">
                                        <li>Go to <strong>M-Pesa menu</strong> on your phone</li>
                                        <li>Select <strong>"Lipa na M-Pesa"</strong></li>
                                        <li>Select <strong>"Pay Bill"</strong></li>
                                        <li>Enter Business Number: <strong className="text-primary">888999</strong></li>
                                        <li className="flex items-center flex-wrap gap-2">
                                            Enter Account Number:
                                            <code className="bg-background px-2 py-1 rounded border font-mono font-bold">
                                                {order.id}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2"
                                                onClick={() => copyToClipboard(order.id)}
                                            >
                                                <Copy className="h-3 w-3 mr-1" /> Copy
                                            </Button>
                                        </li>
                                        <li>Enter Amount: <strong>TSh {Number(order.total_amount).toLocaleString()}</strong></li>
                                        <li>Enter your M-Pesa PIN and confirm</li>
                                    </ol>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                                    <span className="font-medium">Note:</span>
                                    Your order will be processed immediately after payment confirmation.
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Payment on Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Your order will be delivered to you shortly. Please prepare
                                <strong> TSh {Number(order.total_amount).toLocaleString()}</strong> in cash upon delivery.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/products">
                        <Button variant="outline" className="w-full sm:w-auto">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link to="/profile">
                        <Button className="w-full sm:w-auto">
                            View Order Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderConfirmation;
