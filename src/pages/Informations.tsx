import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { infosApi } from '@/service/userApi';
import { Bookmark, ChevronDown, Edit, Info, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Error } from "@/components/Error"
import { IconTitle } from '@/components/ui/IconTitle';
import { InfoSection } from '@/components/ui/InfoSection';
import { Form } from '@/components/ui/Form';
import { ContentInput } from '@/components/ui/ContentInput';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ConditionalPhone } from '@/components/layout/ConditionalPhone';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useIsOwner } from '@/components/hooks/userRole';
import { Textarea } from '@/components/ui/Textarea';
import { useUser } from '@/userContext';
import { LangBadge } from '@/components/ui/LangBadge';

interface Information {
  section_id: string
  id: string | null
  title_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
  img_url: string | null
}



export const InformationPage = () => {
  const { lang } = useUser()
  const [openId, setOpenId] = useState<string | null>(null)
  const { id } = useParams()

  const { data, error, loading, refresh } = useApi<Information[]>(() => infosApi(id))
  const { post, errorPost, loadingPost } = usePostApi()

  useEffect(() => { refresh() }, [lang])

  const [titleI18n, setTitleI18n] = useState<Record<string, string>>({})
  const [descriptionI18n, setDescriptionI18n] = useState<Record<string, string>>({})
  const [imgUrl, setImgUrl] = useState("")
  const [editingInfo, setEditingInfo] = useState<Information | null>(null)

  const resetForm = () => {
    setTitleI18n({})
    setDescriptionI18n({})
    setImgUrl("")
  }

  const handleInfos = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post(
      "/api/infos",
      { sectionId: data?.[0]?.section_id, titleI18n, descriptionI18n, imgUrl },
      { close: () => { resetForm(); close() }, refresh }
    )
  }

  const handleEdit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post(
      "/api/infos",
      { id: editingInfo?.id, titleI18n, descriptionI18n, imgUrl },
      { close: () => { resetForm(); close() }, refresh, method: "PUT" }
    )
  }

  const handleDelete = async (infoId: string) => {
    await post("/api/infos", { id: infoId }, { refresh, method: "DELETE" })
  }

  const isOwner = useIsOwner()
  const validInfos = data?.filter(info => info.title_i18n && Object.keys(info.title_i18n).length > 0) ?? []

  if (loading) return <Loading />
  if (error) return <Error />

  return (
    <>
      <ConditionalPhone>
        <ClientLayout />
        <div className="p-3">


          {!validInfos.length ? (
            <div className="h-full flex justify-center items-center mt-20">
              <IconTitle
                title="Renseignez vos premières informations pratiques"
                sublabel="Exemples : Où trouver le café, les poubelles..."
                icon={Info}
              />
            </div>
          ) : (
            <>
                      <IconTitle title="Informations pratiques" icon={Info} />
            <InfoSection title="Liste des informations">
              <div className="flex flex-col gap-3">
                {validInfos.map((info) => (
                  <div
                    key={info.id}
                    className="group relative bg-white border border-gray-200 rounded-xl p-4 transition hover:shadow-sm"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setOpenId(openId === info.id ? null : info.id)}
                    >
                      <div className="p-2 rounded-lg bg-blue-50 shrink-0">
                        <Bookmark size={14} className="text-blue-500" />
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        {info.title_i18n![lang] ?? Object.values(info.title_i18n!)[0]}
                      </span>
                      <LangBadge i18nObject={info.title_i18n!} currentLang={lang} />
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${openId === info.id ? "rotate-180" : ""}`}
                      />
                    </div>

                    {openId === info.id && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {info.description_i18n?.[lang] ?? Object.values(info.description_i18n ?? {})[0]}
                        </p>
                        {info.img_url && (
                          <img
                            src={`/images/${info.img_url}`}
                            alt={info.title_i18n![lang] ?? ""}
                            className="mt-3 w-full max-h-44 object-cover rounded-lg border"
                          />
                        )}
                        {isOwner && (
                          <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                            <Dialog
                              trigger={
                                <button
                                  className="p-2 rounded-lg border bg-white text-gray-500 hover:text-violet-600 hover:bg-violet-50"
                                  onClick={() => {
                                    setEditingInfo(info)
                                    setTitleI18n({ ...info.title_i18n, [lang]: info.title_i18n?.[lang] ?? "" })
                                    setDescriptionI18n({ ...info.description_i18n, [lang]: info.description_i18n?.[lang] ?? "" })
                                    setImgUrl(info.img_url ?? "")
                                  }}
                                >
                                  <Edit size={14} />
                                </button>
                              }
                              title="Modifier l'information"
                            >
                              {({ close }) => (
                                <Form onSubmit={(e) => handleEdit(e, close)} className="p-4 space-y-4">
                                  <ContentInput>
                                    <Label>Titre</Label>
                                    <Input
                                      value={titleI18n[lang] ?? ''}
                                      onChange={(e) => setTitleI18n({ ...titleI18n, [lang]: e.target.value })}
                                    />
                                  </ContentInput>
                                  <ContentInput>
                                    <Label>Description</Label>
                                    <Textarea
                                      value={descriptionI18n[lang] ?? ''}
                                      onChange={(e) => setDescriptionI18n({ ...descriptionI18n, [lang]: e.target.value })}
                                    />
                                  </ContentInput>
                                  <ContentInput>
                                    <Label>Photo</Label>
                                    <ImageUpload
                                      bgImage={imgUrl ? `/images/${imgUrl}` : undefined}
                                      className="h-40"
                                      onUploadSuccess={(name) => setImgUrl(name)}
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
                              onClick={() => info.id && handleDelete(info.id)}
                              className="p-2 rounded-lg border text-gray-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
                </InfoSection>
              </>
          )}
        </div>
      </ConditionalPhone>

      <Dialog
        trigger={<Button size="big" icon={<Plus />} variant="absolute">Ajouter</Button>}
        title="Informations Pratiques"
      >
        {({ close }) => (
          <Form onSubmit={(e) => handleInfos(e, close)} className="p-4 space-y-4">
            <ContentInput>
              <Label>Sujet</Label>
              <Input
                placeholder="Café"
                value={titleI18n[lang] ?? ''}
                onChange={(e) => setTitleI18n({ ...titleI18n, [lang]: e.target.value })}
              />
            </ContentInput>
            <ContentInput>
              <Label>Détail</Label>
              <Textarea
                placeholder="Description..."
                value={descriptionI18n[lang] ?? ''}
                onChange={(e) => setDescriptionI18n({ ...descriptionI18n, [lang]: e.target.value })}
              />
            </ContentInput>
            <ContentInput>
              <Label>Photo</Label>
              <ImageUpload onUploadSuccess={(name) => setImgUrl(name)} />
              {imgUrl && <p className="text-xs text-green-600 mt-1">✓ Image prête</p>}
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