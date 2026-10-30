import { useUser } from "@/userContext";

type SwitchLanguagesVariant = "default" | "grey";

type Props = {
	data: { languages?: string[] | string | null };
	variant?: SwitchLanguagesVariant;
};

const variants: Record<SwitchLanguagesVariant, string> = {
	default: "",
	grey: "bg-violet-200 text-violet-700 border-violet-200",
};

const toArray = (value: unknown): string[] => {
	if (Array.isArray(value)) return value;
	if (typeof value === "string" && value.trim()) {
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) return parsed;
		} catch {}
		return value
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
	}
	return [];
};

export const SwitchLanguages = ({ data, variant = "default" }: Props) => {
	const { lang, setLang } = useUser();
	const languages = toArray(data?.languages);

	if (languages.length === 0) return null;

	return (
		<div className="flex gap-1.5 mt-2 text-white">
			{languages.map((code) => (
				<button
					key={code}
					type="button"
					onClick={() => setLang(code as Parameters<typeof setLang>[0])}
					className={`cursor-pointer px-2.5 py-0.5 rounded-full text-xs font-medium border transition ${
						lang === code
							? "bg-violet-600 text-white border-violet-600"
							: variants[variant] ||
								"bg-white/20 text-white border-white/30 hover:bg-white/30"
					}`}
				>
					{code.toUpperCase()}
				</button>
			))}
		</div>
	);
};
