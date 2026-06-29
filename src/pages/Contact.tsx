import { Error } from '@/components/Error';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ConditionalPhone } from '@/components/layout/ConditionalPhone';
import { Phone } from '@/components/layout/Phone'
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/Button'
import { ContentInput } from '@/components/ui/ContentInput';
import { Dialog } from '@/components/ui/Dialog'
import { Form } from '@/components/ui/Form';
import { IconTitle } from '@/components/ui/IconTitle';
import { InfoRow } from '@/components/ui/InfoRow';
import { InfoSection } from '@/components/ui/InfoSection';
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { LangBadge } from '@/components/ui/LangBadge';
import { Textarea } from '@/components/ui/Textarea'
import { useApi } from '@/hooks/useApi'
import { usePostApi } from '@/hooks/usePostApi';
import { getContactApi } from '@/service/userApi'
import { useUser } from '@/userContext';
import console from 'console';
import { Phone as PhoneIcon, NotebookText, UserRound, MessageCircle, UserStar, Edit, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const Contact = () => {
    type Contact = {
        section_id: string
        name: string | null
        phone: string | null
        whatsapp: string | null
        notes_i18n: Record<string, string> | null  
    }
    const { id } = useParams()
    const { lang } = useUser()
    useEffect(() => {
        refresh()
    }, [lang])
    const { data, loading, error, refresh } = useApi<Contact[]>(() => getContactApi(id))

    const { post, errorPost, loadingPost } = usePostApi()

    const [phone, setPhone] = useState("")
    const [notes, setNotes] = useState("")
    const [name, setName] = useState("")
    const [whatsapp, setWhatsapp] = useState("")

    const contact = data?.[0]
    const hasData = contact?.name

    console.log(contact)
    useEffect(() => {
        if (!contact) return
        setPhone(contact.phone ?? "")
        setNotes(contact.notes_i18n?.[lang] ?? "")
        setName(contact.name ?? "")
        setWhatsapp(contact.whatsapp ?? "")
    }, [contact?.section_id, lang])

    const handleContact = async (e: React.FormEvent, close: () => void) => {
        e.preventDefault()
        await post("/api/contact", {
            sectionId: contact?.section_id,
            name,
            whatsapp,
            phone,
            notes_i18n: { ...(contact?.notes_i18n ?? {}), [lang]: notes },
        }, { close, refresh })
    }

    if (loading) return <Loading />
    if (error) return <Error />

    console.log(data)
    return (
        <>
            <ConditionalPhone>
                <ClientLayout />

                {!hasData ? (
                    <div className="h-full my-auto flex justify-center items-center -mt-20">
                        <IconTitle title="Ajouter votre contact" icon={UserRound} />
                    </div>
                ) : (
                    <div className="p-3 space-y-">
                                <IconTitle title="Contact d'urgence" icon={UserRound} />
                        <InfoSection title="Coordonnées">
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={UserStar}
                                        nameRow="Nom du contact"
                                        valueRow={contact?.name}
                                    />
                                <InfoRow
                                    icon={PhoneIcon}
                                    nameRow="Téléphone"
                                    valueRow={contact?.phone ?? ""}
                                />

                                {contact?.whatsapp && (
                                    <InfoRow
                                        icon={MessageCircle}
                                        nameRow="WhatsApp"
                                        valueRow={contact.whatsapp}
                                    />
                                )}

                                    {contact.notes_i18n?.[lang] &&
                                            <InfoSection title="Note">
                                                <div className="relative">
                                                    <InfoRow valueRow={contact.notes_i18n?.[lang]} />
                                                </div>
                                        </InfoSection>
                                    }
                                      
                                    
                            </div>
                        </InfoSection>
                    </div>
                )}
            </ConditionalPhone>

            <Dialog trigger={<Button size="big" icon={hasData ? <Edit /> : <Plus />}  variant="absolute">{hasData ? 'Modifier' : 'Ajouter'}</Button>} title="Contact d'urgence">
                {({ close }) => (
                    <Form onSubmit={(e) => handleContact(e, close)} className="p-4 space-y-4">

                        <ContentInput>
                            <Label htmlFor="name">Nom de la personne à contacter</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Prénom / Nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </ContentInput>
                        <ContentInput>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="ex : +33 6 12 34 56 78"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </ContentInput>
                        <ContentInput>
                            <Label htmlFor="name">WhatsApp</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="whatsapp"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                            />
                        </ContentInput>
                        <ContentInput>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                value={notes}
                                placeholder="ex : Appeler en cas d'urgence uniquement…"
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </ContentInput>

                        {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}

                        <Button type="submit" disabled={loadingPost} className="w-full">
                            {loadingPost ? "Enregistrement..." : "Enregistrer"}
                        </Button>

                    </Form>
                )}
            </Dialog>
        </>
    )
}