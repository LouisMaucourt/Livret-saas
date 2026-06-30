import {  User, useUser } from "@/userContext";
import { DropDown } from "../ui/DropDown";
import { Card } from "../ui/Card";

import React, { useState } from "react";

import { BtnIcon } from "../ui/BtnIcon";
import { HomeIcon, House, Info, InfoIcon, Paintbrush, User as Usericon, Users } from "lucide-react";
import { useParams } from "react-router";
import { Wifi, LogIn, LogOut, ScrollText, Phone, MapPin } from 'lucide-react'
import { addCookie, getCookie } from "@/utilis/cookies";
import { useApi } from "@/hooks/useApi";
import { propertiesApi } from "@/service/userApi";
import { usePostApi } from "@/hooks/usePostApi";
import { Phone as Phonetemplate } from "@/components/layout/Phone"
import { Button } from "../ui/Button";
import { Link } from "react-router";
import { NavSection } from "../ui/NavSection";



export default function OwnerDashboard({ children }: { children: React.ReactNode }) {


    const { user, properties } = useUser();
    const { id } = useParams()
    const { data } = useApi<User[]>(() => propertiesApi())

    const idx = id || getCookie("propertyId") || properties[0]?.id

    const propertiesData = data ?? []

    const p = data?.find((e) => e.id === idx)

    const logOut = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        window.location.href = "/login";
    }
    return (
        <div className="flex">
            <div className="w-52 shrink-0" />

            <div className="fixed left-0 top-0 h-screen w-52 flex flex-col justify-between p-3
        bg-white/55 backdrop-blur-xl border-r border-black/[0.06] z-10">
                <div className="flex flex-col">
                    <DropDown title={p?.title ?? properties[0]?.title} icon={House}>
                        <p className="text-xs text-gray-400 mb-3">Mes propriétés</p>
                        {propertiesData.map((property) => (
                            <Link to={`/properties/${property.id}`} key={property.id} onClick={() => addCookie("propertyId", property.id)}>
                                {property.title}
                            </Link>
                        ))}
                        <Link to="/properties" className="w-full">
                            <Button className="mt-5 w-full">Ajouter une propriété</Button>
                        </Link>
                    </DropDown>
                    <div className="flex flex-col gap-10">
                        <NavSection label="Pages">
                            <BtnIcon to={`/properties/${idx}/`} icon={<HomeIcon size={15} />}>Menu</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/infos`} icon={<InfoIcon size={15} />}>Informations Pratiques</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/wifi`} icon={<Wifi size={15} />}>Wifi</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/checkin`} icon={<LogIn size={15} />}>Arrivée</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/checkout`} icon={<LogOut size={15} />}>Départ</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/rules`} icon={<ScrollText size={15} />}>Règlement</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/contact`} icon={<Phone size={15} />}>Contact</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/activity`} icon={<MapPin size={15} />}>Activités</BtnIcon>
                        </NavSection>

                        <hr className="my-2.5 border-black/[0.06]" />

                        <NavSection label="Général">
                            <BtnIcon to={`/properties/${idx}/general`} icon={<Info size={15} />}>Informations</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/users`} icon={<Users size={15} />}>Clients</BtnIcon>
                            <BtnIcon to={`/properties/${idx}/theme`} icon={<Paintbrush size={15} />}>Customisation</BtnIcon>
                        </NavSection>

                    </div>
                </div>

                <DropDown title={user?.name ?? "Utilisateur"} icon={Usericon} align="bottom" >
                    <p className="text-xs text-gray-400">Mon compte</p>
                    <button
                        onClick={() => logOut()}
                        className="text-red-500 hover:bg-red-50 w-full text-left p-2"
                    >
                        Déconnexion
                    </button>
                </DropDown>
            </div>

            <div className="p-6 w-full min-h-screen">
                {children}
            </div>
        </div>
    );
}