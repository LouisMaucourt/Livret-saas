import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import OwnerDashboard from "./Dashboard";
import { useUser } from "@/userContext";

import { ClientLayout } from "./ClientLayout";


export default function ProtectedLayout() {
    const [loading, setLoading] = useState(true);
    const { user, setUser, setProperties } = useUser();
    
    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setUser(data);
                return fetch("/api/properties", { credentials: "include" });
            })
            .then((res) => res.json())
            .then((data) => setProperties(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);


    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    const layouts = {
        owner: OwnerDashboard,
        guest: ClientLayout,
    };
    const Layout = layouts[user.role] ?? OwnerDashboard;

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}