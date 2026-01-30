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
import { Badge } from "@/components/ui/badge";

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
            toast({ title: "Success", description: "Coupon added successfully!", variant: "success" });
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
            toast({ title: "Success", description: "Coupon deleted!", variant: "success" });
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
                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3 p-4">
                                {coupons.map((coupon) => (
                                    <Card key={coupon.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: coupon.is_active ? '#22c55e' : '#94a3b8' }}>
                                        <CardContent className="p-4 space-y-3">
                                            {/* Code and Active Status */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-slate-500">Coupon Code</p>
                                                    <p className="font-mono font-bold text-lg">{coupon.code}</p>
                                                    <Badge className={`mt-1 text-xs ${coupon.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Discount</p>
                                                    <p className="text-2xl font-bold text-blue-600">{coupon.discount_percentage}%</p>
                                                </div>
                                            </div>

                                            {/* Min Purchase and Max Uses */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-slate-500">Min Purchase</p>
                                                    <p className="text-sm font-semibold">TSh {Number(coupon.min_purchase_amount).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Max Uses</p>
                                                    <p className="text-sm font-semibold">{coupon.max_uses || "Unlimited"}</p>
                                                </div>
                                            </div>

                                            {/* Usage and Validity */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-slate-500">Used Count</p>
                                                    <p className="text-sm">{coupon.used_count || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Valid Until</p>
                                                    <p className="text-sm">{new Date(coupon.valid_until).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="w-full"
                                                onClick={() => deleteCoupon(coupon.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete Coupon
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <ScrollArea className="w-full">
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
                                                    <TableCell className="font-semibold text-blue-600">{coupon.discount_percentage}%</TableCell>
                                                    <TableCell>TSh {Number(coupon.min_purchase_amount).toLocaleString()}</TableCell>
                                                    <TableCell>{coupon.max_uses || "Unlimited"}</TableCell>
                                                    <TableCell>{coupon.used_count || 0}</TableCell>
                                                    <TableCell>{new Date(coupon.valid_until).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge className={`text-xs ${coupon.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
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
                                </ScrollArea>
                            </div>
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
                                    <Input type="number" min="0" max="100" value={newCoupon.discount_percentage || ""} onChange={(e) => setNewCoupon({ ...newCoupon, discount_percentage: Number(e.target.value) || 0 })} placeholder="20" />
                                </div>
                                <div>
                                    <Label>Discount Amount (TSh) - Optional</Label>
                                    <Input type="number" min="0" value={newCoupon.discount_amount || ""} onChange={(e) => setNewCoupon({ ...newCoupon, discount_amount: e.target.value ? Number(e.target.value) : null })} placeholder="Optional" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Min Purchase (TSh)</Label>
                                    <Input type="number" min="0" value={newCoupon.min_purchase_amount || ""} onChange={(e) => setNewCoupon({ ...newCoupon, min_purchase_amount: Number(e.target.value) || 0 })} placeholder="0" />
                                </div>
                                <div>
                                    <Label>Max Uses (0 = unlimited)</Label>
                                    <Input type="number" min="0" value={newCoupon.max_uses || ""} onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: Number(e.target.value) || 0 })} placeholder="0" />
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
