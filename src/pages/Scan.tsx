import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useUser } from '@/userContext'
import { Loading } from '@/components/Loading'
import { Error } from '@/components/Error'

export const ScanPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { setClient, setLang } = useUser()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = searchParams.get("token")
        if (!token) { setError("QR Code invalide"); return }

        fetch(`/api/auth/scan?token=${token}`)
            .then(res => res.json())
            .then(client => {
                if (client.error) { setError(client.error); return }
                setClient(client)
                if (client.language) setLang(client.language)
                navigate(`/properties/${client.property_id}`)
            })
            .catch(() => setError("Erreur de connexion"))
    }, [])

    if (error) return <Error message={error} />
    return <Loading />
}