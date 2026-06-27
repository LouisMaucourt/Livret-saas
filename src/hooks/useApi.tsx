import { useEffect, useRef, useState, useCallback } from 'react'

export const useApi = <T extends unknown>(apiFn: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [trigger, setTrigger] = useState(0)
    const apiFnRef = useRef<() => Promise<T>>(apiFn)

    useEffect(() => {
        apiFnRef.current = apiFn
    })

    useEffect(() => {
        const load = async () => {
            try {
                setError(null)
                setLoading(true)
                const result = await apiFnRef.current()
                setData(result)
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [trigger])

    const refresh = useCallback(() => setTrigger(t => t + 1), [])

    return { data, loading, error, refresh }
}