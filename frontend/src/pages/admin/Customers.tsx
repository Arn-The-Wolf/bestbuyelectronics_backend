import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {customers.map((customer) => (
                            <Card key={customer.id} className="overflow-hidden">
                                <CardContent className="p-4 space-y-3">
                                    {/* Name and Role */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-base text-blue-700">{customer.full_name || "N/A"}</h3>
                                            <Badge className="mt-1 capitalize text-xs bg-blue-100 text-blue-800 border-blue-200">
                                                {customer.user_roles?.[0]?.role || "customer"}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Joined</p>
                                            <p className="text-sm">{new Date(customer.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-sm font-mono truncate">{customer.id}</p>
                                    </div>

                                    {/* Phone and City */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Phone</p>
                                            <p className="text-sm">{customer.phone || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">City</p>
                                            <p className="text-sm">{customer.city || "N/A"}</p>
                                        </div>
                                    </div>
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
                                            <TableCell className="font-medium text-blue-700">{customer.full_name || "N/A"}</TableCell>
                                            <TableCell>{customer.id}</TableCell>
                                            <TableCell>{customer.phone || "N/A"}</TableCell>
                                            <TableCell>{customer.city || "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge className="capitalize text-xs bg-blue-100 text-blue-800 border-blue-200">
                                                    {customer.user_roles?.[0]?.role || "customer"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
