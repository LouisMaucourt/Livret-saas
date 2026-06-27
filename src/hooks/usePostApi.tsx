import { useState } from "react"

type PostOptions = {
    close?: () => void
    refresh?: () => void
    method?: "POST" | "PUT" | "PATCH" | "DELETE"
}

type ApiResponse<R> = R & { error?: string }

export const usePostApi = () => {
    const [errorPost, setErrorPost] = useState<string | null>(null)
    const [loadingPost, setLoadingPost] = useState(false)

    const post = async <T extends Record<string, unknown>, R = unknown>(
        apiRoute: string,
        body: T,
        opts?: PostOptions
    ): Promise<ApiResponse<R> | null> => {
        setErrorPost(null)
        setLoadingPost(true)
        try {
            const res = await fetch(apiRoute, {
                method: opts?.method ?? "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            const result = await res.json() as ApiResponse<R>
            if (!res.ok) {
                setErrorPost(result.error ?? "Erreur serveur")
                return null
            }
            opts?.refresh?.()
            opts?.close?.()
            return result
        } catch {
            setErrorPost("Erreur serveur")
            return null
        } finally {
            setLoadingPost(false)
        }
    }

    return { post, errorPost, loadingPost }
}