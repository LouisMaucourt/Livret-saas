export const fromI18n = (field: string | Record<string, string>, lang: string) => {
    const obj = typeof field === 'string' ? JSON.parse(field) : field
    return obj?.[lang] ?? obj?.['fr'] ?? null
}