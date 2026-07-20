import { Error } from '@/components/Error';
import { useIsOwner } from '@/hooks/userRole';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ConditionalPhone } from '@/components/layout/ConditionalPhone';
import { Loading } from '@/components/Loading';
import { AccordionCard } from '@/components/ui/AccordionCards';
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
import { useTranslation } from '@/hooks/useTranslation';
import { getContactApi } from '@/service/userApi'
import { useUser } from '@/userContext';
import console from 'console';
import { Phone as PhoneIcon, UserRound, MessageCircle, UserStar, Edit, Plus, Trash2 } from 'lucide-react'
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
    const t = useTranslation()
    const { id } = useParams()
    const { lang } = useUser()

    const { data, loading, error, refresh } = useApi<Contact[]>(() => getContactApi(id))

    const { post, errorPost, loadingPost } = usePostApi()

    const [phone, setPhone] = useState("")
    const [notesI18n, setNotesI18n] = useState<Record<string, string>>({})
    const [name, setName] = useState("")
    const [whatsapp, setWhatsapp] = useState("")
    const [editingInfo, setEditingInfo] = useState<Contact | null>(null)

    const [openId, setOpenId] = useState<string | null>(null)

    const contact = data?.[0]
    const hasData = contact?.name

    const resetForm = () => {
        setPhone("")
        setName("")
        setWhatsapp("")
        setNotesI18n({})
    }
    useEffect(() => {
        if (!contact) return
        setPhone(contact.phone ?? "")
        setNotesI18n(contact.notes_i18n ?? {})
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
            notes_i18n: { ...(contact?.notes_i18n ?? {}), [lang]: notesI18n[lang] ?? "" },
        }, { close: () => {close() }, refresh })
    }
    const handleEdit = async (e: React.FormEvent, close: () => void) => {
        e.preventDefault()
        await post("/api/contact", {
            id: editingInfo?.id,
            name,
            whatsapp,
            phone,
            notes_i18n: { ...(contact?.notes_i18n ?? {}), [lang]: notesI18n[lang] ?? "" },
        }, { close: () => { ; close() }, refresh, method: "PUT" })
    }
    const handleDelete = async (contactId: string) => {
        await post("/api/contact", { id: contactId }, { refresh, method: "DELETE" })
    }
    if (loading) return <Loading />
    if (error) return <Error />

    console.log(data)
    const isOwner = useIsOwner()

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
                        <IconTitle title={t.contact.title} icon={UserRound} />
                        <InfoSection title={t.contact.details}>
                                <div className="space-y-3">
                                    {data?.map((contact) => (
                                        <AccordionCard
                                            key={contact.id}
                                            icon={UserRound}
                                            title={contact.name}
                                            badge={<LangBadge i18nObject={contact.notes_i18n!} currentLang={lang} />}

                                            isOpen={openId === contact.id}
                                            onToggle={() => setOpenId(openId === contact?.id ? null : contact?.id)}
                                            actions={isOwner &&
                                                (
                                                <>
                                                    <Dialog
                                                        trigger={
                                                            <Button
                                                                onClick={() => {
                                                                    setEditingInfo(contact)
                                                                    setName(contact.name ?? "")
                                                                    setPhone(contact.phone ?? "")
                                                                    setWhatsapp(contact.whatsapp ?? "")
                                                                    setNotesI18n({ ...contact.notes_i18n, [lang]: contact.notes_i18n?.[lang] ?? "" })
                                                                }}
                                                            >
                                                                <Edit size={14} />
                                                            </Button>
                                                        }
                                                        title="Modifier le contact"
                                                    >
                                                        {({ close }) => (
                                                            <Form onSubmit={(e) => handleEdit(e, close)} className="p-4 space-y-4">
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
                                                                        value={notesI18n[lang] ?? ""}
                                                                        placeholder="ex : Appeler en cas d'urgence uniquement…"
                                                                        onChange={(e) => setNotesI18n(prev => ({ ...prev, [lang]: e.target.value }))}

                                                                    />
                                                                </ContentInput>
                                                                {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}
                                                                <Button type="submit" disabled={loadingPost} className="w-full">
                                                                    {loadingPost ? "Enregistrement..." : "Enregistrer"}
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </Dialog>

                                                    <button
                                                        onClick={() => contact.id && handleDelete(contact.id)}
                                                        className="p-2 rounded-lg border text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                                )
                                             }
                                        >
                                            <div className="flex flex-col gap-4 pt-4">
                                            <InfoRow
                                                icon={UserStar}
                                                nameRow={t.contact.contact_name}
                                                valueRow={contact?.name}
                                                
                                            />
                                            <InfoRow
                                                icon={PhoneIcon}
                                                nameRow={t.contact.phone}
                                                valueRow={contact?.phone ?? ""}
                                            />

                                            {contact?.whatsapp && (
                                                <InfoRow
                                                    icon={MessageCircle}
                                                    nameRow={t.contact.whatsapp}
                                                    valueRow={contact.whatsapp}
                                                />
                                            )}

                                            {contact.notes_i18n?.[lang] &&
                                                <InfoSection title={t.contact.note}>
                                                    <div className="relative">
                                                        <InfoRow valueRow={contact.notes_i18n?.[lang]} />
                                                    </div>
                                                </InfoSection>
                                                }
                                            </div>

                                        </AccordionCard>
                                    ))}



                            </div>
                        </InfoSection>
                    </div>
                )}
            </ConditionalPhone>

            <Dialog trigger={<Button size="big" onClick={resetForm}  icon={<Plus />} variant="absolute"> Ajouter</Button>} title="Ajouter un Contact">
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
                                value={notesI18n[lang] ?? ""}
                                placeholder="ex : Appeler en cas d'urgence uniquement…"
                                onChange={(e) => setNotesI18n(prev => ({ ...prev, [lang]: e.target.value }))}

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