import { Error } from '@/components/Error';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ConditionalPhone } from '@/components/layout/ConditionalPhone';
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
import {  setI18nValue } from '@/lib/utilis';
import { stayDetailsApi } from '@/service/userApi'
import { useUser } from '@/userContext';
import { formatHour } from '@/utilis/formatHour';
import { Building2, DoorOpen, KeyRound, LogIn, LogOut, Smartphone, KeySquare, Edit, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

const ACCESS_TYPES = [
  { value: 'physical_key', label: 'Clé physique', icon: <KeyRound size={18} /> },
  { value: 'key_box', label: 'Boîte à clés', icon: <KeySquare size={18} /> },
  { value: 'digicode', label: 'Digicode', icon: <span className="text-base font-mono">#</span> },
  { value: 'smart_lock', label: 'Smart lock', icon: <Smartphone size={18} /> },
  { value: 'concierge', label: 'Conciergerie', icon: <Building2 size={18} /> },
]
export type StayDetails = {
  section_id: string
  checkin: string | null
  checkout: string | null
  instructions_i18n: Record<string, string> | null
  instructions_leave_i18n: Record<string, string> | null  
  key_access_type: string | null
  key_access_info: string | null
}
export const Checkin = () => {

  const { lang } = useUser()

  useEffect(() => {
    refresh()
  }, [lang])

  const { id } = useParams()
  const { data, loading, error, refresh } = useApi<StayDetails[]>(() => stayDetailsApi(id))
  console.log(data)

  const { post, errorPost, loadingPost } = usePostApi()

  const [checkInTime, setCheckInTime] = useState("")
  const [instructionI18n, setInstructionI18n] = useState("")
  const [keyInfo, setKeyInfo] = useState("")
  const [keyAccessType, setKeyAccessType] = useState(ACCESS_TYPES[0].value)


  const checkIn = data?.[0]
  const hasData = !!checkIn?.checkin
  

  useEffect(() => {
    if (!checkIn) return
    setCheckInTime(checkIn.checkin ?? "")
    setInstructionI18n(checkIn.instructions_i18n?.[lang] ?? "") 
    setKeyInfo(checkIn.key_access_info ?? "")      
    setKeyAccessType(checkIn.key_access_type ?? ACCESS_TYPES[0].value)
  }, [checkIn?.section_id, lang])

  const handleCheckin = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post(
      "/api/staydetails",
      {
        sectionId: checkIn?.section_id,
        checkIn: checkInTime,
        instructions_i18n: setI18nValue(
          checkIn?.instructions_i18n,
          lang,
          instructionI18n
        ),
        keyAccessType,
        keyInfo,
      },
      { close, refresh }
    )
  }
  console.log(data)


  const accessLabel = ACCESS_TYPES.find(a => a.value === checkIn?.key_access_type)?.label
  const needCode = keyAccessType === "digicode" || keyAccessType === "key_box"
  if (loading) return <Loading />
  if (error) return <Error />
  return (
    <>
        <ConditionalPhone>
          <ClientLayout />
          {!hasData ? (
            
            <div className="h-full my-auto flex justify-center items-center -mt-20">
              <IconTitle title="Ajouter les informations d'arrivée !" icon={DoorOpen} />
            </div>

        ) : (
          <div className="p-3">
              <IconTitle title="Arrivée" icon={DoorOpen} />
            <div className="flex flex-col gap-3">
            <InfoSection title="Horaire">
                    <InfoRow icon={LogIn} nameRow="Arrivée" valueRow={formatHour(checkIn.checkin ?? "")} />
            </InfoSection>
            <InfoSection title="Accès">
              <InfoRow icon={KeyRound} valueRow={accessLabel ?? checkIn.key_access_type}>
                    {needCode && checkIn.key_access_info && ( 
                      <span className="bg-black text-white font-mono text-sm px-3 py-1 rounded-lg tracking-widest">
                        {checkIn.key_access_info}
                      </span>
                    )}
              </InfoRow>
            </InfoSection>
                {checkIn?.instructions_i18n?.[lang] && (
                  <InfoSection title="Instruction d'arrivée">
                    <div className="relative">
                      <InfoRow valueRow={checkIn?.instructions_i18n?.[lang]} />
                    </div>
                  </InfoSection>
                )}
              </div>
          </div>
          )}
        </ConditionalPhone>

      <Dialog trigger={<Button icon={hasData ? <Edit /> : <Plus />} size="big"variant="absolute">{hasData ? 'Modifier' : 'Ajouter'}</Button>} title="Check-in">
        {({ close }) => (
          <Form onSubmit={(e) => handleCheckin(e, close)} className="p-4 space-y-4">

              <ContentInput>
                <Label htmlFor="checkin-time">Arrivée</Label>
                <Input id="checkin-time" type="time" value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)} />
              </ContentInput>

            <ContentInput>
              <Label htmlFor="hour">Type d'accès</Label>
              <div className="grid grid-cols-3 gap-2">
                {ACCESS_TYPES.map((t) => (
                  <button
                    key={t.value || checkIn?.key_access_type}
                    type="button"
                    onClick={() => setKeyAccessType(t.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors
                      ${keyAccessType === t.value
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </ContentInput>

            {(needCode) && (
              <ContentInput>
                <Label htmlFor="key-info">
                  Infos d’accès (optionnel)
                </Label>
                <Textarea
                  id="key-info"
                  value={keyInfo}
                  placeholder="ex : Code boîte à clés : 1234…"
                  onChange={(e) => setKeyInfo(e.target.value)}
                />
              </ContentInput>
            )}

            <ContentInput>
              <Label htmlFor="instructions">Instructions d'arrivée</Label>
              <Textarea id="instructions" value={instructionI18n}
                placeholder="ex : Sonnez à l'interphone, appartement 3B…"
                onChange={(e) => setInstructionI18n(e.target.value)} />
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