import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Form } from '@/components/ui/Form';
import { ContentInput } from '@/components/ui/ContentInput';
import { Error } from "@/components/Error"
import { Loading } from '@/components/Loading';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { getClientsApi } from '@/service/userApi';
import { Pencil, Trash2, PowerOff, QrCodeIcon, User, Plus } from 'lucide-react';
import React, { useState } from 'react'
import { useParams } from 'react-router';
import { ClientQrCode } from '@/components/ui/ClientQrCode';
import { Card } from '@/components/ui/Card';
import { IconTitle } from '@/components/ui/IconTitle';

type Client = {
  id: string
  name: string
  property_id: string
  is_active: boolean
  created_at: string
  qr_token: string
}

export const Users = () => {
  const { id } = useParams()
  const [copied, setCopied] = useState(false)

  const { data, error, loading, refresh } = useApi(() => getClientsApi(id))
  const { post, errorPost, loadingPost } = usePostApi()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingPassword, setEditingPassword] = useState("")

  const handleCreate = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post("/api/clients", { property_id: id, name, password }, { close, refresh })
    setName("")
    setPassword("")
  }

  const handleUpdate = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post("/api/clients", { id: editingClient?.id, name: editingName, password: editingPassword || undefined }, { close, refresh, method: "PUT" })
  }

  const handleToggleActive = async (client: Client) => {
    await post("/api/clients", { id: client.id, is_active: !client.is_active }, { refresh, method: "PUT" })
  }

  const handleDelete = async (clientId: string, close: () => void) => {
    await post("/api/clients", { id: clientId }, { close, refresh, method: "DELETE" })
  }

  const copyText = (v: string) => {
    const el = document.createElement("textarea")
    el.value = v
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <Loading />
  if (error) return <Error />

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <IconTitle title="Vos clients" icon={User} />
        <Dialog
          trigger={<Button variant="absolute" size="big" icon={<Plus />}>Ajouter un client</Button>}
          title="Nouveau client"
        >
          {({ close }) => (
            <Form onSubmit={(e) => handleCreate(e, close)}>
              <ContentInput>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Nom du client"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </ContentInput>
              <ContentInput>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </ContentInput>
              {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}
              <Button type="submit" disabled={loadingPost} className="w-full">
                {loadingPost ? "Création..." : "Créer"}
              </Button>
            </Form>
          )}
        </Dialog>
      </div>

      {data?.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16 text-center !h-auto">
          <User className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Ajouter votre prochain client !</p>
        </Card>
      )}
      <div className="flex flex-col gap-4">
        {data?.map((client: Client) => (
          <Card
            key={client.id}
            className={`flex items-center justify-between px-7 py-6 transition-opacity ${!client.is_active ? "opacity-50" : ""
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold ${client.is_active
                ? "bg-gray-100 text-gray-700"
                : "bg-gray-200 text-gray-400"
                }`}>
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-base text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-400">
                  {client.is_active ? "Actif" : "Désactivé"}
                </p>
              </div>
            </div>


            <div className="flex items-center gap-1">

              <Dialog
                trigger={
                  <button
                    type="button"
                    onClick={() => { setEditingClient(client); setEditingName(client.name); setEditingPassword("") }}
                    className="p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                }
                title="Modifier le client"
              >
                {({ close }) => (
                  <Form onSubmit={(e) => handleUpdate(e, close)}>
                    <ContentInput>
                      <Label htmlFor="editName">Nom</Label>
                      <Input id="editName" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                    </ContentInput>
                    <ContentInput>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" type="password" placeholder="Laisser vide si inchangé" value={editingPassword} onChange={(e) => setEditingPassword(e.target.value)} />
                    </ContentInput>
                    {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}
                    <Button type="submit" disabled={loadingPost} className="w-full">
                      {loadingPost ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </Form>
                )}
              </Dialog>

              <Dialog
                trigger={
                  <button
                    type="button"
                    className="p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="QR Code"
                  >
                    <QrCodeIcon className="w-5 h-5" />
                  </button>
                }
                title={`QR Code — ${client.name}`}
              >
                {() => (
                  <div className="flex flex-col items-center gap-3">
                    <ClientQrCode client={client} />
                    <Button className="w-full" onClick={() => copyText(`http://localhost:3000/scan?token=${client.qr_token}`)}>
                      {copied ? "Copié ✓" : "Copier le lien"}
                    </Button>
                  </div>
                )}
              </Dialog>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                type="button"
                onClick={() => handleToggleActive(client)}
                className={`p-3 rounded-xl transition-colors ${client.is_active
                  ? "text-orange-400 hover:text-orange-600 hover:bg-orange-50"
                  : "text-green-400 hover:text-green-600 hover:bg-green-50"
                  }`}
                title={client.is_active ? "Désactiver" : "Réactiver"}
              >
                <PowerOff className="w-5 h-5" />
              </button>
              <Dialog
                trigger={
                  <button
                    type="button"
                    className="p-3 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                }
                title="Supprimer le client"
              >
                {({ close }) => (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-600">
                      Supprimer <strong>{client.name}</strong> ? Cette action est irréversible.
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" onClick={close} className="flex-1">Annuler</Button>
                      <Button type="button" onClick={() => handleDelete(client.id, close)} disabled={loadingPost} className="flex-1">
                        {loadingPost ? "Suppression..." : "Supprimer"}
                      </Button>
                    </div>
                  </div>
                )}
              </Dialog>

            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}