import { useUser } from '@/userContext';

type SwitchLanguagesVariant = "default" | "grey"

type Props = {
    data: {
        languages?: string[]
    }
    variant?: SwitchLanguagesVariant
}
const variants: Record<SwitchLanguagesVariant, string> = {
    default: "",
    grey: "bg-violet-200 text-violet-700 border-violet-200", 
}
export const SwitchLanguages = ({ data, variant = "default" }: Props) => {
    const { lang, setLang } = useUser()

    return (
        <div>
            {data?.languages && data.languages.length > 1 && (
                <div className="flex gap-1.5 mt-2 text-white">
                    {data.languages.map((code) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => setLang(code)}
                            className={`cursor-pointer px-2.5 py-0.5 rounded-full text-xs font-medium border transition
    ${lang === code
                                    ? 'bg-violet-600 text-white border-violet-600'
                                    : variants[variant] || 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                }`}
                        >
                            {code.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}