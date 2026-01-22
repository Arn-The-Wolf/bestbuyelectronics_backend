import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Customers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const customersData = await adminApi.getCustomers();
            setCustomers(customersData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading customers:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading customers...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
                <p className="text-slate-600 mt-2">View all registered customers</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Customers ({customers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <ScrollArea className="w-full">
                        <div className="min-w-[700px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">{customer.full_name || "N/A"}</TableCell>
                                            <TableCell>{customer.id}</TableCell>
                                            <TableCell>{customer.phone || "N/A"}</TableCell>
                                            <TableCell>{customer.city || "N/A"}</TableCell>
                                            <TableCell>
                                                <span className="capitalize">
                                                    {customer.user_roles?.[0]?.role || "customer"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
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
