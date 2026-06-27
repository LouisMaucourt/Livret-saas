
import { useApi } from '@/hooks/useApi';
  import { propertiesApi } from '@/service/userApi';
  import{ useState } from 'react'
import { Link } from 'react-router-dom';
import { Dialog } from "@/components/ui/Dialog";
import { Input } from '@/components/ui/Input';
import { ContentInput } from '@/components/ui/ContentInput';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Form } from '@/components/ui/Form';
import { usePostApi } from '@/hooks/usePostApi';
import { Button } from '@/components/ui/Button';
import { addCookie } from '@/utilis/cookies';
import { Plus } from 'lucide-react';
import { Property, useUser } from '@/userContext';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';
import { Label } from '@/components/ui/Label';


  export const Properties = () => {
    const [title, setTitle] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")


    const { data, loading,error, refresh } = useApi <Property[]>(() => propertiesApi())
    const hasData = !data?.length;
    const { post, errorPost, loadingPost } = usePostApi()

    const { user } = useUser()


    console.log("user", data)
    console.log(data)
    const handleProperties = async () => {
      // e.preventDefault()
      await post(
        "/api/properties",
        { userId: user?.id, title, city, address, imgUrl, description },
        { refresh }
      )
    }
    if (loading) return <Loading />
    if (error) return <Error />
    return (
      <div>
        <div className="">
          {hasData &&
            <Dialog title="Bienvenue dans votre configuration" defaultOpen>
              {({ close }) => (
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Donnez vie à votre première propriété.
                    Commencez par la créer, puis personnalisez-la entièrement selon vos besoins.
                  </p>

                  <p className="text-sm text-gray-500">
                    Une fois partagée, votre client pourra consulter les informations essentielles,
                    tandis que vous gardez le contrôle total sur sa gestion.
                  </p>
                  <Button onClick={() => close()}>
                    Commencer
                  </Button>
                </div>
              )}
            </Dialog>
          }

        </div>
        <Dialog trigger={<Button icon={<Plus />} variant={hasData ? "absoluteCenter" : "absolute"}>{hasData ? "Enregistrez votre première propriété" : "Ajouter une propriété"}</Button>} title="Propriété">
          {({ close }) => (
            <Form
              onSubmit={async (e) => {
                await handleProperties();
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
                onUploadSuccess={(name) => setImgUrl(name)}
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
        <div className={`grid grid-cols-${data?.length} gap-4 flex-1 h-[92vh]`}>
          {data?.map((b) => (
            <Link key={b.id} to={`/properties/${b.id}`} onClick={() => addCookie('propertyId', b.id)} className="relative flex items-center justify-center h-full overflow-hidden rounded-xl" style={{ backgroundImage: `url(http://localhost:3000/images/${b?.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/30" />
              <h2 className="relative  px-6 py-2 rounded-full text-white font-semibold text-lg text-center bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:tracking-wide active:scale-95">
                {b.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    )
  }
