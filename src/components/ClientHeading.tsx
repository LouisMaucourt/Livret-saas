import { useUser } from '@/userContext'
import { useLocation, useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { SwitchLanguages } from './ui/SwitchLanguages';

export const ClientHeading = () => {
  const { id } = useParams()
  const { properties, lang } = useUser()
  const location = useLocation()
  const isRoot = location.pathname === `/properties/${id}` ||
    location.pathname === `/properties/${id}/`

  const navigate = useNavigate()

  const p = properties?.find((e) => (e.id) === id)

  const handleBack = () => {
    document.startViewTransition(() => {
      navigate(`/properties/${id}`)
    })
  }

  return (
    <div className="relative w-full   md:min-h-1/4 min-h-[25vh] flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(/images/${p?.img_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/15 to-violet-500/35" />
      {!isRoot &&
        <button
          onClick={handleBack}
          aria-label="Retour à l'accueil"
          className="absolute top-5 left-3.5 size-10 rounded-full
          bg-white/20 backdrop-blur-sm border border-white/30
          flex items-center justify-center text-white
          hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      }
      <div className="relative p-4 text-white">
        <div className="mb-3">
          <p className="font-medium text-xl leading-tight mb-1">{p?.title}</p>
          <p className="text-white/75 text-sm leading-relaxed whitespace-pre-line ">
            {p?.description_i18n?.[lang]}
          </p>
        </div>

        {p && <SwitchLanguages data={p} />}
      </div>
    </div>
  )
}