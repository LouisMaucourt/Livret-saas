import React, { useEffect } from 'react'
import { DoorOpen, DoorClosed, UtensilsCrossed, Map, ClipboardList, Phone, Info, Wifi } from 'lucide-react'
import { BtnHome } from '@/components/ui/BtnHome'
import { ClientLayout } from './ClientLayout';
import { ConditionalPhone } from './ConditionalPhone';
import { useApi } from '@/hooks/useApi';
import { getSectionApi } from '@/service/userApi';
import { useParams } from 'react-router';

const SECTION_CONFIG = {
  wifi: [{ label: "Wifi", sublabel: "Se connecter", icon: Wifi, iconBg: "#FBEAF0", iconColor: "#993556", to: "wifi" }],
  contacts: [{ label: "Contact", sublabel: "Joindre l'hôte", icon: Phone, iconBg: "#FBEAF0", iconColor: "#993556", to: "contact" }],
  rules: [{ label: "Règlement", sublabel: "Règles du logement", icon: ClipboardList, iconBg: "#F1EFE8", iconColor: "#5F5E5A", to: "rules" }],
  infos: [{ label: "Infos", sublabel: "Informations utiles", icon: Info, iconBg: "#E6F1FB", iconColor: "#185FA5", to: "infos" }],
  places: [
    { label: "Restaurants", sublabel: "Nos adresses", icon: UtensilsCrossed, iconBg: "#FAECE7", iconColor: "#993C1D", to: "restaurants" },
    { label: "Activités", sublabel: "À faire autour", icon: Map, iconBg: "#EEEDFE", iconColor: "#534AB7", to: "activity" },
  ],
  stay: [
    { label: "Arrivée", sublabel: "Check-in & accès", icon: DoorOpen, iconBg: "#EAF3DE", iconColor: "#3B6D11", to: "checkin" },
    { label: "Départ", sublabel: "Check-out & clés", icon: DoorClosed, iconBg: "#FAEEDA", iconColor: "#854F0B", to: "checkout" },
  ],
}
type HomeProps = {
  onRefreshReady?: (refresh: () => void) => void
}

export const Home = ({ onRefreshReady }: HomeProps) => {
  const { id } = useParams()
  const { data, refresh } = useApi(() => getSectionApi(id))

  useEffect(() => {
    onRefreshReady?.(refresh)
  }, [refresh])

  const sections = [...(data ?? [])]
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)

    console.log(data)
  const buttons = sections.flatMap((s, si) => {
    const configs = SECTION_CONFIG[s.type]
    if (!configs) return []
    return configs.map((config, i) => ({ ...config, key: `${s.id}-${i}` }))
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