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
import { Textarea } from '@/components/ui/Textarea'
import { useApi } from '@/hooks/useApi'
import { usePostApi } from '@/hooks/usePostApi';
import { stayDetailsApi } from '@/service/userApi'
import { formatHour } from '@/utilis/formatHour';
import { Building2, DoorOpen, KeyRound, LogIn, LogOut, Smartphone, KeySquare, DoorClosed, Edit, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { StayDetails } from './Checkin';
import { useUser } from '@/userContext';
import { setI18nValue } from '@/lib/utilis';

const ACCESS_TYPES = [
    { value: 'physical_key', label: 'Clé physique', icon: <KeyRound size={18} /> },
    { value: 'key_box', label: 'Boîte à clés', icon: <KeySquare size={18} /> },
    { value: 'digicode', label: 'Digicode', icon: <span className="text-base font-mono">#</span> },
    { value: 'smart_lock', label: 'Smart lock', icon: <Smartphone size={18} /> },
    { value: 'concierge', label: 'Conciergerie', icon: <Building2 size={18} /> },
]
export const Checkout = () => {
    const { id } = useParams()
    const { lang } = useUser()

    const { data, loading, error, refresh } = useApi<StayDetails[]>(() => stayDetailsApi(id))

    useEffect(() => {
        refresh()
    }, [lang])

    const { post, errorPost, loadingPost } = usePostApi()

    const [checkOutTime, setCheckOutTime] = useState("")
    const [instructionLeaveI18n, setInstructionLeaveI18n] = useState("")

    const [keyInfo, setKeyInfo] = useState("")
    const [keyAccessType, setKeyAccessType] = useState(ACCESS_TYPES[0].value)

    const checkIn = data?.[0]
    const hasData = !!checkIn?.checkout

    useEffect(() => {
        if (!checkIn) return
        setCheckOutTime(checkIn.checkout ?? "")
        setInstructionLeaveI18n(checkIn.instructions_leave_i18n?.[lang] ?? "")
        setKeyInfo(checkIn.key_access_info ?? "")
        setKeyAccessType(checkIn.key_access_type ?? ACCESS_TYPES[0].value)
    }, [checkIn?.section_id, lang])


    const handleCheckin = async (e: React.FormEvent, close: () => void) => {
        e.preventDefault()
        await post(
            "/api/staydetails",
            {
                sectionId: checkIn?.section_id,
                checkOut: checkOutTime,
                instructions_leave_i18n: setI18nValue(
                    checkIn?.instructions_leave_i18n,
                    lang,
                    instructionLeaveI18n
                ),
                keyAccessType,
                keyInfo,
            },
            { close, refresh }
        )
    }

    if (loading) return <Loading />
    if (error) return <Error />
    return (
        <>
            <ConditionalPhone>
                <ClientLayout />
                {!hasData ? (
                    <div className="h-full my-auto flex justify-center items-center -mt-20">
                        <IconTitle title="Ajouter les informations de départ" icon={DoorClosed} />
                    </div>
                ) : (
                    <div className="p-3">
                        <IconTitle title="Départ" icon={DoorClosed} />
                        <InfoSection title="Horaire">
                            <InfoRow icon={LogOut} nameRow="Départ" valueRow={formatHour(checkIn.checkout ?? "")} />
                        </InfoSection>
                            {checkIn.instructions_leave_i18n?.[lang] && (
                                <InfoSection title="Instruction d'arrivée">
                                    <div className="relative">
                                        <InfoRow valueRow={checkIn.instructions_leave_i18n?.[lang]} />
                                    </div>
                                </InfoSection>
                            )}
                    </div>
                )}
            </ConditionalPhone>

            <Dialog trigger={<Button size="big" icon={hasData ? <Edit /> : <Plus />} variant="absolute">{hasData ? 'Modifier' : 'Ajouter'}</Button>} title="Check-in">
                {({ close }) => (
                    <Form onSubmit={(e) => handleCheckin(e, close)} className="p-4 space-y-4">

                        <ContentInput>
                            <Label htmlFor="checkout-time">Heure de départ</Label>
                            <Input id="checkout-time" type="time" value={checkOutTime}
                                onChange={(e) => setCheckOutTime(e.target.value)} />
                        </ContentInput>

                        <ContentInput>
                            <Label htmlFor="instructions">Instructions de départ</Label>
                            <Textarea id="instructions" value={instructionLeaveI18n}
                                placeholder="ex : Sonnez à l'interphone, appartement 3B…"
                                onChange={(e) => setInstructionLeaveI18n(e.target.value)} />
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