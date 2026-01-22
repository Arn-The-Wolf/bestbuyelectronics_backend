import { useEffect, useState } from "react";
import { couponsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Coupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({
        code: "", discount_percentage: 0, discount_amount: null, min_purchase_amount: 0,
        max_uses: 0, valid_from: new Date().toISOString().split('T')[0], valid_until: ""
    });
    const { toast } = useToast();

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            const couponsData = await couponsApi.getAll();
            setCoupons(couponsData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading coupons:", error);
            setLoading(false);
        }
    };

    const addCoupon = async () => {
        try {
            await couponsApi.create(newCoupon);
            toast({ title: "Success", description: "Coupon added successfully!" });
            setNewCoupon({
                code: "", discount_percentage: 0, discount_amount: null, min_purchase_amount: 0,
                max_uses: 0, valid_from: new Date().toISOString().split('T')[0], valid_until: ""
            });
            await loadCoupons();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await couponsApi.delete(id);
            toast({ title: "Success", description: "Coupon deleted!" });
            await loadCoupons();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading coupons...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Coupons</h1>
                <p className="text-slate-600 mt-2">Manage discount coupons</p>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Coupon List</TabsTrigger>
                    <TabsTrigger value="add">Add New Coupon</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Coupons ({coupons.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <ScrollArea className="w-full">
                                <div className="min-w-[900px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Discount %</TableHead>
                                                <TableHead>Min Purchase</TableHead>
                                                <TableHead>Max Uses</TableHead>
                                                <TableHead>Used</TableHead>
                                                <TableHead>Valid Until</TableHead>
                                                <TableHead>Active</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {coupons.map((coupon) => (
                                                <TableRow key={coupon.id}>
                                                    <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                                                    <TableCell>{coupon.discount_percentage}%</TableCell>
                                                    <TableCell>TSh {Number(coupon.min_purchase_amount).toLocaleString()}</TableCell>
                                                    <TableCell>{coupon.max_uses || "Unlimited"}</TableCell>
                                                    <TableCell>{coupon.used_count || 0}</TableCell>
                                                    <TableCell>{new Date(coupon.valid_until).toLocaleDateString()}</TableCell>
                                                    <TableCell>{coupon.is_active ? "✓" : "✗"}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => deleteCoupon(coupon.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Coupon
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Coupon Code</Label>
                                <Input value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="SAVE20" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Discount Percentage (%)</Label>
                                    <Input type="number" min="0" max="100" value={newCoupon.discount_percentage} onChange={(e) => setNewCoupon({ ...newCoupon, discount_percentage: Number(e.target.value) })} placeholder="20" />
                                </div>
                                <div>
                                    <Label>Discount Amount (TSh) - Optional</Label>
                                    <Input type="number" min="0" value={newCoupon.discount_amount || ""} onChange={(e) => setNewCoupon({ ...newCoupon, discount_amount: e.target.value ? Number(e.target.value) : null })} placeholder="Optional" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Min Purchase (TSh)</Label>
                                    <Input type="number" min="0" value={newCoupon.min_purchase_amount} onChange={(e) => setNewCoupon({ ...newCoupon, min_purchase_amount: Number(e.target.value) })} placeholder="0" />
                                </div>
                                <div>
                                    <Label>Max Uses (0 = unlimited)</Label>
                                    <Input type="number" min="0" value={newCoupon.max_uses} onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: Number(e.target.value) })} placeholder="0" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Valid From</Label>
                                    <Input type="date" value={newCoupon.valid_from} onChange={(e) => setNewCoupon({ ...newCoupon, valid_from: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Valid Until *</Label>
                                    <Input type="date" value={newCoupon.valid_until} onChange={(e) => setNewCoupon({ ...newCoupon, valid_until: e.target.value })} required />
                                </div>
                            </div>
                            <Button onClick={addCoupon} className="w-full" size="lg">Add Coupon</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
