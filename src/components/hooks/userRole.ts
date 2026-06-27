import { useUser } from "@/userContext";

export const useIsOwner = () => useUser().user?.role === "owner"