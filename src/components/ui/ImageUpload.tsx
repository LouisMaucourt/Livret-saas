import React, { useRef, useState } from 'react'
import { generateImageName, getFileExtension } from '@/utilis/generateImageName'
import { Upload } from 'lucide-react'

interface ImageUploadProps {
    onUploadSuccess: (imgUrl: string) => void
    onUploadError?: (error: string) => void
    className?: string
    style?: React.CSSProperties
    bgImage?: string
}

export const ImageUpload = ({ onUploadSuccess, onUploadError, className, style, bgImage }: ImageUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const ext = getFileExtension(file)
        const imageName = generateImageName(ext)
        setPreview(URL.createObjectURL(file))
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', imageName)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) {
                const data = await res.json()
                onUploadError?.(data.error ?? "Erreur lors de l'upload")
                return
            }
            onUploadSuccess(imageName)
        } catch {
            onUploadError?.("Erreur serveur lors de l'upload")
        } finally {
            setUploading(false)
        }
    }

    const bg = preview ?? bgImage

    return (
        <div
            onClick={() => inputRef.current?.click()}
            className={`relative w-full h-40 rounded-xl border border-dashed border-black/[0.15] overflow-hidden cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${className}`}
            style={{ backgroundImage: bg ? `url(${bg})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
        >
            {!bg && (
                <div className="flex flex-col items-center gap-1.5 text-gray-400 select-none">
                    <Upload size={20} />
                    <span className="text-xs">Choisir une image</span>
                </div>
            )}

            {bg && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Upload size={18} className="text-white opacity-0 hover:opacity-100" />
                </div>
            )}

            {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Envoi…</span>
                </div>
            )}

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
    )
}