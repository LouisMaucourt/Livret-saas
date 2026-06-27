import { usePostApi } from "@/hooks/usePostApi"
import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react"
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { BtnIcon } from "./ui/BtnIcon";

export default function VerifyPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const { post, loadingPost, errorPost } = usePostApi()

    const token = new URLSearchParams(window.location.search).get("token")

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error")
                return
            }
            const result = await post<{ token: string }, { success: boolean }>(
                "/api/auth/register/token",
                { token }
            )
            if (result) {
                setStatus("success")
                setTimeout(() => {
                    window.location.href = "/properties"
                }, 2000)
            } else {
                setStatus("error")
            }
        }

        verify()
    }, [token])

    if (status === "loading" || loadingPost) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="max-w-md w-full p-8 shadow-xl">
                    <div className="flex flex-col items-center text-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
                        <p className="text-gray-600 font-medium">
                            Vérification en cours...
                        </p>
                    </div>
                </Card>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="max-w-md w-full p-8 shadow-xl">
                    <div className="flex flex-col items-center text-center gap-4">
                        <CheckCircle2 className="w-14 h-14 text-green-500" />
                        <p className="text-xl font-semibold text-green-600">
                            Email confirmé !
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirection en cours...
                        </p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-md w-full p-8 shadow-xl">
                <div className="flex flex-col items-center text-center gap-4">
                    <XCircle className="w-14 h-14 text-red-500" />
                    <p className="text-xl font-semibold text-red-600">
                        Lien invalide ou expiré
                    </p>
                    <BtnIcon to={`/login`} icon={< RotateCcw size={15} />}> Recréer un compte</BtnIcon>
                </div>
            </Card>
        </div>
    )
}   