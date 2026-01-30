import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { authApi } from "@/lib/api";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const userData = await authApi.getCurrentUser();
            if (!userData.user) {
                navigate("/auth");
                return;
            }

            // Check admin role
            const role = userData.user.role;
            if (role !== "admin") {
                navigate("/");
                return;
            }

            setIsAdmin(true);
            setLoading(false);
        } catch (error) {
            navigate("/auth");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block h-full">
                <AdminSidebar />
            </div>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden border-b bg-white p-4 flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-0 w-64">
                            <AdminSidebar className="border-none" />
                        </SheetContent>
                    </Sheet>
                    <h1 className="font-bold text-lg">Admin Dashboard</h1>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
