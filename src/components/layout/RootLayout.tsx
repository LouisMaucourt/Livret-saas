import "@/index.css";
import { UserProvider } from "@/userContext";
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <UserProvider>
            <main>
                <Outlet />
            </main>
        </UserProvider>
    );
}