import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { infosApi } from '@/service/userApi';
import { Bookmark, ChevronDown, Edit, Info, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
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

export const InformationPage = () => {

  type Informations = {
    section_id:string
    id: string | null;
    title: string | null;
    description: string | null;
    img_url: string | null;
  }

  const [openId, setOpenId] = useState<string | null>(null)
  const { id } = useParams()

  const { data, error, loading, refresh } = useApi < Informations[]>(() => infosApi(id))
  const { post, errorPost, loadingPost } = usePostApi()

  const handleInfos = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    await post(
      "/api/infos",
      { sectionId: data?.[0]?.section_id, title, description, imgUrl },
      { close, refresh }
    )
    setDescription("")
    setTitle("")
    setImgUrl("")
  }

  const infos = data?.[0]
  const hasWifi = !!infos?.title

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imgUrl, setImgUrl] = useState("")
  const [editingInfo, setEditingInfo] = useState(null)

  console.log("sectionId:", data) 
  const handleEdit = async (e: React.FormEvent, close: () => void) => {
      e.preventDefault()
      
      await post(
        "/api/infos",
        {
          id: editingInfo.id,
          sectionId: editingInfo.section_id,
          title,
          description,
          imgUrl
        },
        { close, refresh, method: "PUT" }
      )
    }
  const handleDelete = async (id: string) => {

    await post(
      "/api/infos",
      { id},
      { refresh, method: "DELETE" }
    )
  }
  const isOwer = useIsOwner()

  if (loading) return <Loading />
  if (error) return <Error />

  return (
    <div>
      <div>
        <ConditionalPhone>
          <ClientLayout />
            {!hasWifi ? (
              <div className="h-full my-auto flex justify-center items-center -mt-20 mx-2">
              <IconTitle title="Renseigner vos première informations pratiques" sublabel="Exemples : Où trouver le café, poubelle ect..." icon={Info} />
              </div>
            ) : (
                <div className="p-3">
                  <IconTitle title="Informations pratiques" icon={Info} />

                  <InfoSection title="Liste des informations">
                    <div className="flex flex-col gap-3">
                      {data?.map((info) => (
                        <div
                          key={info.id}
                          className="group relative bg-white border border-gray-200 rounded-xl p-4 transition hover:shadow-sm"
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() =>
                              setOpenId(openId === info.id ? null : info.id)
                            }
                          >
                            <div className="p-2 rounded-lg bg-blue-50 shrink-0">
                              <Bookmark size={14} className="text-blue-500" />
                            </div>

                            <span className="flex-1 text-sm font-medium text-gray-900">
                              {info.title}
                            </span>

                            <ChevronDown
                              size={16}
                              className={`text-gray-400 transition-transform duration-200 ${openId === info.id ? "rotate-180" : ""
                                }`}
                            />
                          </div>
                          {openId === info.id && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {info.description}
                              </p>

                              {info.img_url && (
                                <img
                                  src={`/images/${info.img_url}`}
                                  alt={info.title ?? ""}
                                  className="mt-3 w-full max-h-44 object-cover rounded-lg border"
                                />
                              )}
                              {isOwer && (
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                                  <Dialog
                                    trigger={
                                      <button
                                        className="p-2 rounded-lg border bg-white text-gray-500 hover:text-violet-600 hover:bg-violet-50"
                                        onClick={() => {
                                          setEditingInfo(info)
                                          setTitle(info.title ?? "")
                                          setDescription(info.description ?? "")
                                          setImgUrl(info.img_url ?? "")
                                        }}
                                      >
                                        <Edit size={14} />
                                      </button>
                                    }
                                    title="Modifier l'information"
                                  >
                                    {({ close }) => (
                                      <Form onSubmit={(e) => handleEdit(e, close)}>
                                        <ContentInput>
                                          <Label htmlFor="title">Titre</Label>
                                          <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                          />
                                        </ContentInput>

                                        <ContentInput>
                                          <Label htmlFor="description">Description</Label>
                                          <Textarea
                                            value={description}
                                            onChange={(e) =>
                                              setDescription(e.target.value)
                                            }
                                          />
                                        </ContentInput>

                                        <ContentInput>
                                          <Label htmlFor="img">Photo</Label>
                                          <ImageUpload
                                            bgImage={imgUrl ? `/images/${imgUrl}` : undefined}
                                            className="h-40"
                                            onUploadSuccess={(name) =>
                                              setImgUrl(name)
                                            }
                                          />
                                        </ContentInput>

                                        {errorPost && (
                                          <p className="text-red-500 text-sm">
                                            {errorPost}
                                          </p>
                                        )}

                                        <Button
                                          type="submit"
                                          disabled={loadingPost}
                                          className="w-full"
                                        >
                                          {loadingPost
                                            ? "Enregistrement..."
                                            : "Enregistrer"}
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
                </div>
            )}
        </ConditionalPhone>

      </div>

      <Dialog
        trigger={<Button size="big" icon={<Plus />} variant="absolute">Ajouter</Button>}
        title="Informations Pratiques"
      >
        {({ close }) => (
          <Form onSubmit={(e) => handleInfos(e, close)}>

            <ContentInput>
              <Label htmlFor="networkName">Sujet</Label>
              <Input
                id="subjectInfo"
                placeholder="Café"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </ContentInput>

            <ContentInput>
              <Label htmlFor="description">Détail</Label>
              <Textarea
                id="description"
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pr-9"
              />

            </ContentInput>
            <ContentInput>
              <Label htmlFor="img">Photo</Label>
              <ImageUpload
                onUploadSuccess={(name) => setImgUrl(name)}
              />
              {imgUrl && (
                <p className="text-xs text-green-600 mt-1">✓ Image prête</p>
              )}
            </ContentInput>

            {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}

            <Button type="submit" disabled={loadingPost} className="w-full">
              {loadingPost ? "Enregistrement..." : "Enregistrer"}
            </Button>

          </Form>
        )}
      </Dialog>
    </div>
  )
}