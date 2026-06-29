import { useUser } from '@/userContext'
import { useLocation, useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useIsOwner } from '../hooks/userRole';

export const ClientLayout = () => {
  const { id } = useParams()
 const { properties, lang, setLang } = useUser()
  const location = useLocation()
  const isRoot = location.pathname === `/properties/${id}` ||
    location.pathname === `/properties/${id}/`
 
  const navigate = useNavigate()

  const p = properties?.find((e) => String(e.id) === id)

  const handleBack = () => {
    document.startViewTransition(() => {
      navigate(`/properties/${id}`)
    })
  }


  // console.log(properties)
  return (
    <div className="relative w-full min-h-1/4 flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(/images/${p?.img_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/65" />
      {!isRoot && 
        <button
          onClick={handleBack}
          aria-label="Retour à l'accueil"
          className="absolute top-3.5 left-3.5 w-[34px] h-[34px] rounded-full
          bg-white/20 backdrop-blur-sm border border-white/30
          flex items-center justify-center text-white
          hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={17} />
        </button>
      }
      <div className="relative p-4 text-white">
        <p className="font-medium text-xl leading-tight mb-1">{p?.title}</p>
        {p?.description && (
          <p className="text-white/75 text-sm leading-relaxed">{p.description}</p>
        )}

        {p?.languages && p.languages.length > 1 && (
          <div className="flex gap-1.5 mt-2 text-white">
            {p.languages.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition
            ${lang === code
                    ? 'bg-white text-black border-white'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
</div>
  )
}