
import { Outlet } from "react-router-dom";
import { ConditionalPhone } from "../ConditionalPhone";
import { ClientHeading } from "../ClientHeading";

export const ClientLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <ConditionalPhone>
            <ClientHeading />
            {children ?? <Outlet />}
        </ConditionalPhone>
    );
};