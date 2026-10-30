import { useIsOwner } from "../../hooks/userRole";

export const LangBadge = ({
	i18nObject,
	currentLang,
	className = "",
}: {
	i18nObject: Record<string, string>;
	currentLang: string;
	className?: string;
}) => {
	const isOwner = useIsOwner();

	const hasText = (v?: string) => !!v?.trim();

	const hasAnyText = Object.values(i18nObject ?? {}).some(hasText);
	const hasCurrentLang = hasText(i18nObject?.[currentLang]);

	if (!isOwner || !hasAnyText) return null;

	return (
		<span
			className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
				hasCurrentLang
					? "bg-violet-100 text-violet-600"
					: "bg-orange-100 text-orange-500"
			} ${className}`}
		>
			{hasCurrentLang ? currentLang : `${currentLang} · à traduire`}
		</span>
	);
};
