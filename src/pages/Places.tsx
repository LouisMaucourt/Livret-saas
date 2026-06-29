import { Error } from '@/components/Error'
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ConditionalPhone } from '@/components/layout/ConditionalPhone';
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/Button'
import { ContentInput } from '@/components/ui/ContentInput'
import { Dialog } from '@/components/ui/Dialog'
import { Form } from '@/components/ui/Form'
import { IconTitle } from '@/components/ui/IconTitle'
import { InfoSection } from '@/components/ui/InfoSection'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { LangBadge } from '@/components/ui/LangBadge';
import { useApi } from '@/hooks/useApi'
import { usePostApi } from '@/hooks/usePostApi'
import { getPlacesApi } from '@/service/userApi'
import { useUser } from '@/userContext';
import { MapPin, Phone as PhoneIcon, Globe, UtensilsCrossed, Dumbbell, Plus, Edit, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PLACES_CATEGORIES = [
  { value: 'activité', label: 'Activité', icon: Dumbbell },
  { value: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
]

interface Place {
  id: string
  section_id: string
  name_i18n: Record<string, string>
  description_i18n: Record<string, string>
  website?: string
  phone?: string
  category?: string
  address?: string
}



export const Places = ({ defaultCategory = PLACES_CATEGORIES[0].value }: { defaultCategory?: string }) => {
  const { id } = useParams()
  const { lang } = useUser()

  const { data, loading, error, refresh } = useApi<Place[]>(() => getPlacesApi(id))
  const { post, errorPost, loadingPost } = usePostApi()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [view, setView] = useState<string | null>(defaultCategory)
  const [category, setCategory] = useState(view ?? PLACES_CATEGORIES[0].value)
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")

  useEffect(() => { refresh() }, [lang])

  const handleView = (value: string) => setView((prev) => prev === value ? null : value)

  const resetForm = () => {
    setName("")
    setDescription("")
    setAddress("")
    setCategory(PLACES_CATEGORIES[0].value)
    setPhone("")
    setWebsite("")
  }

  const handleOpen = () => setCategory(view ?? PLACES_CATEGORIES[0].value)

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post("/api/places", {
      sectionId: data?.[0]?.section_id,
      name_i18n: { [lang]: name },
      description_i18n: { [lang]: description },
      address, category, phone, website
    }, { close: () => { resetForm(); close() }, refresh })
  }

  const handleEdit = async (e: React.FormEvent, place: Place, close: () => void) => {
    e.preventDefault()
    await post("/api/places", {
      id: place.id,
      name_i18n: { ...place.name_i18n, [lang]: name },
      description_i18n: { ...place.description_i18n, [lang]: description },
      address, phone, website
    }, { method: "PUT", close: () => { resetForm(); close() }, refresh })
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    await post("/api/places", { id }, { method: "DELETE", refresh })
  }

  if (loading) return <Loading />
  if (error) return <Error />

  return (
    <>
      <ConditionalPhone>
        <ClientLayout />
        <div className="p-3">
          <IconTitle title="Lieux" icon={MapPin} />

          <div className="flex gap-2">
            {PLACES_CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => handleView(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-1 rounded-full text-sm border transition-colors ${view === cat.value ? "bg-violet-600 text-white border-blue-500" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>

          {PLACES_CATEGORIES.map((cat) => {
            if (view !== cat.value) return null
            const filtered = data?.filter((p) => p.category === cat.value) ?? []

            return (
              <div key={cat.value} className="pt-5">
                {filtered.length === 0 ? (
                  <p className="text-sm text-gray-400 px-4">Ajouter vos bonnes adresses !</p>
                ) : (
                  <InfoSection title={cat.label}>
                    {filtered.map((p) => (
                      <div key={p.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <Dialog
                            trigger={
                              <button
                                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-violet-600"
                                onClick={() => {
                                  setName(p.name_i18n?.[lang] ?? "")
                                  setDescription(p.description_i18n?.[lang] ?? "")
                                  setAddress(p.address ?? "")
                                  setPhone(p.phone ?? "")
                                  setWebsite(p.website ?? "")
                                }}
                              >
                                <Edit size={14} />
                              </button>
                            }
                            title="Modifier le lieu"
                          >
                            {({ close }) => (
                              <Form onSubmit={(e) => handleEdit(e, p, close)} className="p-4 space-y-4">
                                <ContentInput>
                                  <Label>Nom</Label>
                                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                                </ContentInput>
                                <ContentInput>
                                  <Label>Description</Label>
                                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                                </ContentInput>
                                <ContentInput>
                                  <Label>Adresse</Label>
                                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                                </ContentInput>
                                <ContentInput>
                                  <Label>Téléphone</Label>
                                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </ContentInput>
                                <ContentInput>
                                  <Label>Site web</Label>
                                  <Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
                                </ContentInput>
                                {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}
                                <Button type="submit" disabled={loadingPost} className="w-full">
                                  {loadingPost ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                              </Form>
                            )}
                          </Dialog>

                          <button
                            onClick={(e) => handleDelete(e, p.id)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-violet-50 shrink-0">
                            <cat.icon className="w-4 h-4 text-violet-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm text-gray-900">
                                {p.name_i18n?.[lang] ?? Object.values(p.name_i18n)[0]}
                              </h3>
                              <LangBadge i18nObject={p.name_i18n} currentLang={lang} />
                            </div>

                            {(p.description_i18n?.[lang] ?? Object.values(p.description_i18n)[0]) && (
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {p.description_i18n?.[lang] ?? Object.values(p.description_i18n)[0]}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 mt-3">
                              {p.address && (
                                <a href={`https://maps.google.com/?q=${encodeURIComponent(p.address)}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                                  <MapPin className="w-3 h-3" /> Adresse
                                </a>
                              )}
                              {p.website && (
                                <a href={p.website} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                                  <Globe className="w-3 h-3" /> Site
                                </a>
                              )}
                              {p.phone && (
                                <a href={`tel:${p.phone}`}
                                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                                  <PhoneIcon className="w-3 h-3" /> {p.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </InfoSection>
                )}
              </div>
            )
          })}
        </div>
      </ConditionalPhone>

      <Dialog trigger={<Button size="big" icon={<Plus />} variant="absolute" onClick={handleOpen}>Ajouter un lieu</Button>} title="Nouveau lieu">
        {({ close }) => (
          <Form onSubmit={(e) => handleSubmit(e, close)} className="p-4 space-y-4">
            <ContentInput>
              <Label>Catégorie</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLACES_CATEGORIES.map((c) => (
                  <button key={c.value} type="button" onClick={() => setCategory(c.value)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-colors ${category === c.value ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <c.icon size={16} />{c.label}
                  </button>
                ))}
              </div>
            </ContentInput>
            <ContentInput>
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </ContentInput>
            <ContentInput>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </ContentInput>
            <ContentInput>
              <Label>Adresse</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </ContentInput>
            <ContentInput>
              <Label>Téléphone</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </ContentInput>
            <ContentInput>
              <Label>Site web</Label>
              <Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
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