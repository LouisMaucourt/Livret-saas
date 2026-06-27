import { createContext, ReactNode, useContext, useState } from "react";

export type User = {
    id: string,
    email: string,
    name: string,
    role: "owner" | "guest";
    title:string
}
export type Property = {
    id: string;
    owner_id: string;
    name: string;
    address: string;
    city: string;
    created_at: string;
    title: string;
    img_url: string;
    description: string
    country: string
    language:string
};

type Client = {
    id: string,
    name: string,
    property_id: string,
    is_active: boolean,
}

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    client: Client | null;
    setClient: (client: Client | null) => void;
    properties: Property[];
    setProperties: (properties: Property[]) => void;
    refreshProperties: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    const refreshProperties = async () => {
        const res = await fetch("/api/properties", { credentials: "include" });
        const data = await res.json();
        setProperties(data);
    };

    return (
        <UserContext.Provider value={{ user, setUser, client, setClient, properties, setProperties, refreshProperties }}>
            {children}
        </UserContext.Provider>
    );
}
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx
}