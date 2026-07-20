import { translations } from "@/config/translations";
import { useUser } from "@/userContext";

export const useTranslation = () => {
    const { lang } = useUser()

    return translations[lang] ?? translations.fr
}