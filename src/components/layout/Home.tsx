import React, { useEffect } from 'react'
import { DoorOpen, DoorClosed, UtensilsCrossed, Map, ClipboardList, Phone, Info, Wifi, Pin } from 'lucide-react'
import { BtnHome } from '@/components/ui/BtnHome'
import { ClientLayout } from './ClientLayout';
import { ConditionalPhone } from './ConditionalPhone';
import { useApi } from '@/hooks/useApi';
import { getSectionApi } from '@/service/userApi';
import { useParams } from 'react-router';
import { useUser } from '@/userContext';

const SECTION_CONFIG = {
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
export const BUTTON_LABELS = {
  wifi: { fr: "Wifi", en: "Wifi", es: "Wifi", de: "Wifi", it: "Wifi", pt: "Wifi" },
  infos: { fr: "Informations", en: "Information", es: "Información", de: "Informationen", it: "Informazioni", pt: "Informações" },
  checkin: { fr: "Arrivée", en: "Check-in", es: "Llegada", de: "Anreise", it: "Arrivo", pt: "Chegada" },
  checkout: { fr: "Départ", en: "Check-out", es: "Salida", de: "Abreise", it: "Partenza", pt: "Saída" },
  contacts: { fr: "Contact", en: "Contact", es: "Contacto", de: "Kontakt", it: "Contatto", pt: "Contato" },
  rules: { fr: "Règles", en: "Rules", es: "Reglas", de: "Regeln", it: "Regole", pt: "Regras" },
  places: { fr: "Lieux", en: "Places", es: "Lugares", de: "Orte", it: "Luoghi", pt: "Lugares" },
};
type HomeProps = {
  onRefreshReady?: (refresh: () => void) => void
}
export const Home = ({ onRefreshReady }: HomeProps) => {
  const { lang } = useUser()

  
  console.log(lang)

  const { id } = useParams()
  const { data, refresh } = useApi(() => getSectionApi(id))

  useEffect(() => {
    onRefreshReady?.(refresh)
  }, [refresh])

  const sections = [...(data ?? [])]
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)

  const buttons = sections.flatMap((s) => {
    const configs = SECTION_CONFIG[s.type]
    if (!configs) return []

    return configs.map((config, i) => ({
      ...config,
      key: `${s.id}-${i}`,
      label: BUTTON_LABELS[config.labelKey]?.[lang] ?? config.label,
    }))
  })

  const isOdd = buttons.length % 2 !== 0

  return (
    <ConditionalPhone>
      <ClientLayout />
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 auto-rows-fr">
        {buttons.map((btn, i) => (
          <BtnHome
            key={btn.key}
            {...btn}
            propertyId={id}
            wide={isOdd && i === buttons.length - 1}
          />
        ))}
      </div>
    </ConditionalPhone>
  )
}