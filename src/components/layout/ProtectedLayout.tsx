import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import OwnerDashboard from "./Dashboard";
import { useUser } from "@/userContext";
import { TestLayout } from "./TestLayout";


export default function ProtectedLayout() {
    const [loading, setLoading] = useState(true);
    const { user, setUser, setProperties } = useUser();
    
    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setUser(data);

                if (data.role === 'guest') {
                    const propertyId = data.property_id
                    fetch(`/api/properties/${propertyId}/public`, { credentials: "include" })
                        .then(res => res.json())
                        .then(property => setProperties([property]))
                        .catch(e => console.error(e))
                } else {
                    fetch("/api/properties", { credentials: "include" })
                        .then(res => res.json())
                        .then(data => setProperties(data))
                        .catch(e => console.error(e))
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);


    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    const layouts = {
        owner: OwnerDashboard,
        guest: TestLayout,
    };
    const Layout = layouts[user.role] ?? OwnerDashboard;

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}