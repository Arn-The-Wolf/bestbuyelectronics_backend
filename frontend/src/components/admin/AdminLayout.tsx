import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { authApi } from "@/lib/api";

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
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
