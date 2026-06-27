import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { wifiApi } from '@/service/userApi';
import { Edit, Eye, EyeOff, House, Lock, LockIcon, Plus, Wifi, WifiOff } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Error } from "@/components/Error"
import { IconTitle } from '@/components/ui/IconTitle';
import { InfoSection } from '@/components/ui/InfoSection';
import { InfoRow } from '@/components/ui/InfoRow';
import { Form } from '@/components/ui/Form';
import { ContentInput } from '@/components/ui/ContentInput';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ConditionalPhone } from '@/components/layout/ConditionalPhone';

type WifiNetwork = {
  section_id: string;
  network_name: string | null;
  password: string | null;
};

export const WifiPage = () => {
  const { id } = useParams()
const { data, error, loading, refresh } = useApi<WifiNetwork[]>(() => wifiApi(id))

  const { post, errorPost, loadingPost } = usePostApi()

  
  const handleWifi = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post(
      "/api/wifi",
      { sectionId: wifi?.section_id, networkName, password },
      { close, refresh }
    )
  }

  const wifi = data?.[0]
  const hasWifi = !!wifi?.network_name

  const [networkName, setNetworkName] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { 
    if (!wifi) return
    setNetworkName(wifi.network_name ?? "")
    setPassword(wifi.password ?? "")
  },[wifi?.section_id])



  if (loading) return <Loading />
  if (error) return <Error />

  return (
    <>
        <ConditionalPhone>
          <ClientLayout/>
            {!hasWifi ? (
          <div className="h-full my-auto flex justify-center items-center -mt-20">
                <IconTitle title="Ajouter votre wifi" icon={WifiOff} />
            </div>
        ) : (
            <div className="p-3 space-y-">
                <IconTitle title="Wifi" icon={Wifi} />
                <InfoSection title="Nom du Wifi">
                  <InfoRow icon={House}  valueRow={wifi.network_name} />
                  <InfoRow icon={LockIcon}  valueRow={wifi.password} />
                </InfoSection>
              </div>
            )}  
        </ConditionalPhone>
        

      <Dialog
        trigger={<Button icon={hasWifi ? <Edit /> : <Plus />} size="big" variant="absolute">{hasWifi ? 'Modifier' : 'Ajouter'}</Button>}
        title="Réseau Wi-Fi"
      >
        {({ close }) => (
          <Form onSubmit={(e) => handleWifi(e, close)}>

            <ContentInput>
              <Label htmlFor="networkName">Nom du réseau (SSID)</Label>
              <Input
                id="networkName"
                placeholder="ex : MonReseau_5G"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
              />
            </ContentInput>

            <ContentInput>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9"
                />
                <Button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
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