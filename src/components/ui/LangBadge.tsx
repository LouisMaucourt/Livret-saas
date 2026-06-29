import { useIsOwner } from "../hooks/userRole"

export const LangBadge = ({
    i18nObject,
    currentLang
}: {
    i18nObject: Record<string, string>
    currentLang: string
}) => {
    const isOwner = useIsOwner()

    const hasCurrentLang = !!i18nObject[currentLang]
    const fallbackLang = Object.keys(i18nObject)[0]

    return (
        <span
            className={`${!isOwner ? "hidden" : ""} text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${hasCurrentLang
                    ? "bg-violet-100 text-violet-600"
                    : "bg-orange-100 text-orange-500"
                }`}
        >
            {hasCurrentLang
                ? currentLang
                : `${fallbackLang} · à traduire`}
        </span>
    )
}