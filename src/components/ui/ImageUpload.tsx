import React, { useRef, useState } from 'react'
import { generateImageName, getFileExtension } from '@/utilis/generateImageName'
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import { compressImage } from '@/utilis/compressImage';

interface ImageUploadProps {
    onUploadSuccess: (imgUrl: string) => void
    onUploadError?: (error: string) => void
    className?: string
    style?: React.CSSProperties
    bgImage?: string
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export const ImageUpload = ({ onUploadSuccess, onUploadError, className, style, bgImage }: ImageUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [status, setStatus] = useState<UploadStatus>('idle')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const ext = getFileExtension(file)
        const imageName = generateImageName(ext)
        setPreview(URL.createObjectURL(file))
        setStatus('uploading')
        setErrorMsg(null)

        try {
            const formData = new FormData()
            const compressed = await compressImage(file)
            formData.append('file', compressed)
            formData.append('fileName', imageName)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) {
                const data = await res.json()
                const message = data.error ?? "Erreur lors de l'upload"
                setStatus('error')
                setErrorMsg(message)
                onUploadError?.(message)
                return
            }

            setStatus('success')
            onUploadSuccess(imageName)
        } catch {
            const message = "Erreur serveur lors de l'upload"
            setStatus('error')
            setErrorMsg(message)
            onUploadError?.(message)
        }
    }

    const bg = preview ?? bgImage

    return (
        <div>
            <div
                onClick={() => inputRef.current?.click()}
                className={`relative w-full h-40 rounded-xl border border-dashed overflow-hidden cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${status === 'error' ? 'border-red-300' : 'border-black/[0.15]'
                    } ${className}`}
                style={{ backgroundImage: bg ? `url(${bg})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
            >
                {!bg && status === 'idle' && (
                    <div className="flex flex-col items-center gap-1.5 text-gray-400 select-none">
                        <Upload size={20} />
                        <span className="text-xs">Choisir une image</span>
                    </div>
                )}

                {bg && status !== 'uploading' && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center group">
                        <Upload size={18} className="text-white opacity-0 group-hover:opacity-100" />
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                        <Loader2 size={22} className="text-white animate-spin" />
                        <span className="text-white text-xs font-medium">Envoi…</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow">
                        <Check size={14} />
                    </div>
                )}

                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {status === 'success' && (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <Check size={12} /> Image prête
                </p>
            )}

            {status === 'error' && errorMsg && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errorMsg}
                </p>
            )}
        </div>
    )
}