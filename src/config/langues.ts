import { type LucideIcon, DoorOpen, DoorClosed, ClipboardList, Phone, Info, Wifi, Pin } from 'lucide-react'

type SectionKey = keyof typeof SECTION_TITLES;

type SectionButtonConfig = {
    label: string;
    sublabel: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    to: string;
    labelKey: SectionKey;
};

export type Lang = "fr" | "en" | "es" | "de" | "it" | "pt";


export const SECTION_TITLES = {
    infos: { fr: "Informations", en: "Informations", es: "Información", de: "Infos", it: "Informazioni", pt: "Informações" },
    wifi: { fr: "Wifi", en: "Wifi", es: "Wifi", de: "Wifi", it: "Wifi", pt: "Wifi" },
    stay: { fr: "Arrivée et Départ", en: "Check-in & Out", es: "Llegada y Salida", de: "An- und Abreise", it: "Arrivo e Partenza", pt: "Chegada e Saída" },
    checkin: { fr: "Arrivée", en: "Check-in", es: "Llegada", de: "Anreise", it: "Arrivo", pt: "Chegada" },
    checkout: { fr: "Départ", en: "Check-out", es: "Salida", de: "Abreise", it: "Partenza", pt: "Saída" },
    rules: { fr: "Règles", en: "Rules", es: "Reglas", de: "Regeln", it: "Regole", pt: "Regras" },
    places: { fr: "Lieux", en: "Places", es: "Lugares", de: "Orte", it: "Posti", pt: "Lugares" },
    contacts: { fr: "Contact", en: "Contact", es: "Contacto", de: "Kontakt", it: "Contatto", pt: "Contato" },
    golden_book: { fr: "Livre d'or", en: "Golden book", es: "Libro de oro", de: "Goldenes Buch", it: "Libro d'oro", pt: "Livro de ouro" },
}
export const SECTION_CONFIG: Record<string, SectionButtonConfig[]> = {
    wifi: [{ label: "Wifi", sublabel: "Se connecter", icon: Wifi, iconBg: "#FBEAF0", iconColor: "#993556", to: "wifi", labelKey: "wifi" }],
    contacts: [{ label: "Contact", sublabel: "Joindre l'hôte", icon: Phone, iconBg: "#FBEAF0", iconColor: "#993556", to: "contact", labelKey: "contacts" }],
    rules: [{ label: "Règles", sublabel: "Règles du logement", icon: ClipboardList, iconBg: "#F1EFE8", iconColor: "#5F5E5A", to: "rules", labelKey: "rules" }],
    infos: [{ label: "Informations", sublabel: "Informations utiles", icon: Info, iconBg: "#E6F1FB", iconColor: "#185FA5", to: "infos", labelKey: "infos" }],
    places: [{ label: "Lieux", sublabel: "Nos adresses", icon: Pin, iconBg: "#FAECE7", iconColor: "#993C1D", to: "convenience", labelKey: "places" }],
    checkin: [{ label: "Arrivée", sublabel: "Check-in & accès", icon: DoorOpen, iconBg: "#EAF3DE", iconColor: "#3B6D11", to: "checkin", labelKey: "checkin" }],
    checkout: [{ label: "Départ", sublabel: "Check-out & clés", icon: DoorClosed, iconBg: "#FAEEDA", iconColor: "#854F0B", to: "checkout", labelKey: "checkout" }],
    stay: [
        { label: "Arrivée", sublabel: "Check-in & accès", icon: DoorOpen, iconBg: "#EAF3DE", iconColor: "#3B6D11", to: "checkin", labelKey: "checkin" },
        { label: "Départ", sublabel: "Check-out & clés", icon: DoorClosed, iconBg: "#FAEEDA", iconColor: "#854F0B", to: "checkout", labelKey: "checkout" },
    ],
}
export const LANGUAGE_LABELS = {
    fr: "Français",
    en: "Anglais",
    es: "Espagnol",
    de: "Allemand",
    it: "Italien",
    pt: "Portugais",
}