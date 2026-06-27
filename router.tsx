import { createBrowserRouter } from "react-router";
import {  WifiPage } from "@/pages/Wifi";
import { Home } from "@/components/layout/Home";
import { Properties } from "@/pages/Properties";
import { Login } from "@/components/Login";

import RootLayout from "@/components/layout/RootLayout";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { BookletLayout } from "@/components/layout/BookletLayout";
import { Checkin } from "@/pages/Checkin";
import { Rules } from "@/pages/Rules";
import { Contact } from "@/pages/Contact";
import { Places } from "@/pages/Places";
import { Checkout } from "@/pages/Checkout";
import { Users } from "@/pages/Users";
import { General } from "@/pages/General";
import { ScanPage } from "@/pages/Scan";
import { InformationPage } from "@/pages/Informations";
import { ThemePage } from "@/pages/Theme";
import VerifyPage from "@/components/Vertify";


export const router = createBrowserRouter([
    {
        Component: RootLayout,
        children: [
            {
                path: "/",
                Component: Login,
            },
            {
                path: "/verify",
                Component: VerifyPage,
            },
            {
                path: "/login",
                Component: Login,
            },
            {
                path: "/scan",
                Component: ScanPage,
            },
            {
                Component: ProtectedLayout,
                children: [
                    {
                        path: "/properties",
                        Component: Properties,
                    },
                    {
                        path: "/properties/:id",  
                        Component: BookletLayout,
                        children: [
                            { index: true, Component: Home },   
                            { path: "wifi", Component: WifiPage },
                            { path: "infos", Component: InformationPage },         
                            { path: "checkin", Component: Checkin },
                            { path: "checkout", Component: Checkout },   
                            { path: "rules", Component: Rules },
                            { path: "contact", Component: Contact },
                            { path: "activity", element: <Places defaultCategory="activité" /> },
                            { path: "restaurants", element: <Places defaultCategory="restaurant" /> },
                        ],
                        
                    },
                    {
                        path: "/properties/:id/theme",
                        Component: ThemePage
                    },
                    {
                        path: "/properties/:id/users",
                        Component: Users
                    },

                    {
                        path: "/properties/:id/general",
                        Component: General
                    },

                ],
            },
        ],
    },
]);