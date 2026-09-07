import React, { useEffect } from 'react'

import { BtnHome } from '@/components/ui/BtnHome'
import { useApi } from '@/hooks/useApi';
import { getSectionApi } from '@/service/userApi';
import { useParams } from 'react-router';
import { useUser } from '@/userContext';
import { SECTION_CONFIG, SECTION_TITLES } from '@/config/langues';


type HomeProps = {
  onRefreshReady?: (refresh: () => void) => void
}
export const HomeClient = ({ onRefreshReady }: HomeProps) => {
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
      label: SECTION_TITLES[config.labelKey]?.[lang] ?? config.label,
    }))
  })

  const isOdd = buttons.length % 2 !== 0

  return (

    <div className="flex-1 grid grid-cols-2 gap-4 p-4 auto-rows-fr">
      {buttons.map((btn, i) => (
        <BtnHome
          {...btn}
          key={btn.key}
          propertyId={id ?? ""}
          wide={isOdd && i === buttons.length - 1}
        />
      ))}
    </div>
  )
}