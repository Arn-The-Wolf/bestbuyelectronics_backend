import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const ordersData = await ordersApi.getAll();
            setOrders(ordersData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading orders:", error);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            await ordersApi.updateStatus(orderId, status);
            toast({ title: "Success", description: "Order status updated!" });
            await loadOrders();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const updateOrderTracking = async (orderId: string, trackingNumber: string, trackingUrl: string) => {
        try {
            await ordersApi.updateTracking(orderId, { tracking_number: trackingNumber, tracking_url: trackingUrl });
            toast({ title: "Success", description: "Tracking info updated!" });
            await loadOrders();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
                <p className="text-slate-600 mt-2">Manage all customer orders</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders ({orders.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <ScrollArea className="w-full">
                        <div className="min-w-[800px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                                            <TableCell>{order.full_name || order.profiles?.full_name || "Guest"}</TableCell>
                                            <TableCell>
                                                {order.order_items && Array.isArray(order.order_items) ? (
                                                    <div className="text-sm">
                                                        {order.order_items.length} item(s)
                                                        {order.order_items[0]?.products?.name && (
                                                            <div className="text-muted-foreground mt-1">
                                                                {order.order_items[0].products.name}
                                                                {order.order_items.length > 1 && ` +${order.order_items.length - 1} more`}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-semibold">TSh {Number(order.total_amount).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="processing">Processing</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline">Track</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Update Tracking Info</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4 mt-4">
                                                            <div>
                                                                <Label>Tracking Number</Label>
                                                                <Input
                                                                    defaultValue={order.tracking_number || ""}
                                                                    id={`tracking-${order.id}`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Tracking URL</Label>
                                                                <Input
                                                                    defaultValue={order.tracking_url || ""}
                                                                    id={`url-${order.id}`}
                                                                />
                                                            </div>
                                                            <Button onClick={() => {
                                                                const trackingNumber = (document.getElementById(`tracking-${order.id}`) as HTMLInputElement).value;
                                                                const trackingUrl = (document.getElementById(`url-${order.id}`) as HTMLInputElement).value;
                                                                updateOrderTracking(order.id, trackingNumber, trackingUrl);
                                                            }}>
                                                                Save Tracking Info
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
