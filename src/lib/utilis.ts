export function setI18nValue(
    obj: Record<string, string> | null | undefined,
    lang: string,
    value: string
) {
    return {
        ...(obj ?? {}),
        [lang]: value,
    }
}