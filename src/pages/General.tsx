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
import { usePostApi } from '@/hooks/usePostApi';
import { useUser } from '@/userContext';
import { Edit, Flag, Globe, Home, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';

export const General = () => {
    const navigate = useNavigate()
    const { properties } = useUser()
    console.log(properties)
    const { id } = useParams()
    const data = properties?.find((e) => e.id === id)
    console.log(data)

    if (!data) return null

    const [title, setTitle] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        if (!data) return
        setTitle(data.title ?? "")
        setImgUrl(data.img_url ?? "")
        setCity(data.city ?? "")
        setAddress(data.address ?? "")
        setDescription(data.description ?? "")
    }, [data?.id])

    const { post, errorPost, loadingPost } = usePostApi()

    const handleProperties = async (e: React.FormEvent, close: () => void) => {
        await post(
            "/api/properties",
            { id: data?.id, title, city, address, imgUrl, description },
            { close, method: "PUT" }
        )
        e.preventDefault()
    }

    const DeleteProperties = async (e: React.FormEvent, close: () => void) => {
        await post(
            "/api/properties",
            { id},
            { close, method: "DELETE" }
        )
        e.preventDefault()
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
                                <InfoRow icon={Home} nameRow="Nom" valueRow={data.title} />
                                <InfoRow icon={Globe} nameRow="Langue" valueRow={data.language} />
                            </InfoSection>

                            <InfoSection title="Localisation">
                                <InfoRow icon={MapPin} nameRow="Ville" valueRow={data.city} />
                                <InfoRow icon={MapPin} nameRow="Adresse" valueRow={data.address} />
                                {data.country && <InfoRow icon={Flag} nameRow="Pays" valueRow={data.country} />}
                            </InfoSection>

                            {data.description && (
                                <InfoSection title="Description">
                                    <InfoRow valueRow={data.description} />
                                </InfoSection>
                            )}

                            {data.img_url && (
                                <InfoSection title="Photo">
                                    <img
                                        src={`http://localhost:3000/images/${data.img_url}`}
                                        className="w-full h-[40vh] object-cover rounded-lg"
                                    />
                                </InfoSection>
                            )}

                        </div>
                    </Card>
                </>
            </div>
            <Dialog trigger={<Button size="big"  icon={<Edit />} variant="absolute">Modifier</Button>} title="Propriété">
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
                        <Label htmlFor="img">Photo</Label>
                        <ImageUpload
                            bgImage={imgUrl ? `/images/${imgUrl}` : undefined}
                            className="h-48"
                            onUploadSuccess={(name) => setImgUrl(name)}
                            onUploadError={(err) => setError(err)}
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
