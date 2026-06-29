import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ContentInput } from '@/components/ui/ContentInput';
import { Dialog } from '@/components/ui/Dialog';
import { Form } from '@/components/ui/Form';
import { IconTitle } from '@/components/ui/IconTitle';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { InfoRow } from '@/components/ui/InfoRow';
import { InfoSection } from '@/components/ui/InfoSection';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { propertiesApi } from '@/service/userApi';
import { Property, User, useUser } from '@/userContext';
import { Edit, Flag, Globe, Home, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';

const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
]

export const General = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { data, loading, refresh } = useApi<Property[]>(() => propertiesApi())

    const property = data?.find(c => c.id === id)
    console.log(property?.address)
    const [title, setTitle] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [languages, setLanguages] = useState<string[]>(property?.languages ?? ['fr'])
    const [error, setError] = useState<string | null>(null)
    const { post, errorPost, loadingPost } = usePostApi()

    useEffect(() => {
        if (!data) return
        setTitle(property?.title ?? '')
        setImgUrl(property?.img_url ?? '')
        setCity(property?.city ?? '')
        setAddress(property?.address ?? '')
        setDescription(property?.description ?? '')
    }, [property?.id])

    if (!data) return null

    const toggleLanguage = (code: string) => {
        if (code === 'fr') return
        setLanguages(prev =>
            prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
        )
    }

    const handleProperties = async (e: React.FormEvent, close: () => void) => {
        // e.preventDefault()
        await post(
            "/api/properties",
            { id: property?.id, title, city, address, imgUrl, description, languages },
            { close, method: "PUT", refresh }
        )
    }

    const DeleteProperties = async (e: React.FormEvent, close: () => void) => {
        e.preventDefault()
        await post(
            "/api/properties",
            { id },
            { close, method: "DELETE" }
        )
        navigate("/properties")
    }
    return (
        <div>
            <div>
                <>
                    <IconTitle title="Général" icon={Home} />
                    <Card className="p-8">
                        <div className="flex flex-col gap-3">
                            <InfoSection title="Hébergement">
                                <InfoRow valueRow={property?.title} />
                            </InfoSection>

                            <InfoSection title="Localisation">
                                <InfoRow valueRow={property?.city} />
                                <InfoRow valueRow={property.address} />
                            </InfoSection>

                            <InfoSection title="Description">
                                <InfoRow valueRow={property?.description} />
                            </InfoSection>

                            <InfoSection title="Langues disponibles">
                                <div className="flex flex-wrap gap-2">
                                    {(property?.languages ?? ['fr']).map((code) => {
                                        const lang = LANGUAGES.find(l => l.code === code)
                                        return (
                                            <span key={code} className="px-3 py-1 rounded-full text-sm bg-violet-100 text-violet-700 border border-violet-200">
                                                {lang?.label ?? code}
                                            </span>
                                        )
                                    })}
                                </div>
                            </InfoSection>

                            {(imgUrl || property.img_url) ? (
                                <InfoSection title="Photo">
                                    <div className="relative w-full h-[50vh] overflow-hidden rounded-lg">
                                        <div
                                            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(/images/${property?.img_url || "placeholder.jpg"})`,
                                            }}
                                        />
                                    </div>
                                </InfoSection>
                            ) : (
                                <InfoSection title="Photo">
                                    <div className="w-full h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <Home size={32} className="opacity-30" />
                                        <p className="text-sm">Aucune photo ajoutée</p>
                                    </div>
                                </InfoSection>
                            )}


                        </div>
                    </Card>
                </>
            </div>
            <Dialog trigger={<Button size="big" icon={<Edit />} variant="absolute">Modifier</Button>} title="Propriété">
                {({ close }) => (
                    <Form
                        onSubmit={(e) => {
                            handleProperties(e, close);
                            close();
                        }}
                    >
                        <ContentInput>
                            <Label htmlFor="title">Nom de l'hébergement</Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </ContentInput>
                        <ContentInput className="grid grid-cols-2">
                            <div>
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </ContentInput>
                        <ContentInput>
                            <Label htmlFor="lang">Langues disponibles</Label>
                            <div className="flex flex-wrap gap-2">
                                {LANGUAGES.map(({ code, label }) => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() => toggleLanguage(code)}
                                        className={`px-3 py-1.5 rounded-full text-sm border transition
          ${languages.includes(code)
                                                ? 'bg-violet-600 text-white border-violet-600'
                                                : 'bg-white text-gray-500 border-gray-200'
                                            }
          ${code === 'fr' ? 'opacity-60 cursor-not-allowed' : ''}
        `}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </ContentInput>
                        <Label htmlFor="img">Photo</Label>
                        <ImageUpload
                            bgImage={imgUrl ? `/images/${imgUrl}` : undefined}
                            className="h-48"
                            onUploadSuccess={(name) => setImgUrl(name)}
                        />
                        {imgUrl && (
                            <p className="text-xs text-green-600 mt-1">✓ Image prête</p>
                        )}
                        <ContentInput>
                            <Label htmlFor="description">Courte description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </ContentInput>

                        {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}

                        <Button type="submit" disabled={loadingPost} className="w-full">
                            {loadingPost ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </Form>
                )}
            </Dialog>
            <Card className="mt-7">
                <Dialog trigger={<Button icon={<Edit />} variant="delete">Supprimer cette propriété</Button>} title="Etes-vous sûre ? ">
                    {({ close }) => (
                        <Form
                            onSubmit={(e) => {
                                DeleteProperties(e, close);
                                close();
                            }}
                        >
                            <p>Une fois supprimer vous ne pourrez pas revenir en arrière </p>
                            <Button type="submit" disabled={loadingPost} className="w-full">
                                {loadingPost ? "Enregistrement..." : "Supprimer définitivement"}
                            </Button>
                        </Form>
                    )}
                </Dialog>
            </Card>
        </div>
    )
}
