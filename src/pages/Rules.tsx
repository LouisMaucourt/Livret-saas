import { Error } from "@/components/Error";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ConditionalPhone } from "@/components/layout/ConditionalPhone";
import { Phone } from "@/components/layout/Phone"
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/Button"
import { ContentInput } from "@/components/ui/ContentInput"
import { Dialog } from "@/components/ui/Dialog"
import { Form } from "@/components/ui/Form"
import { IconTitle } from "@/components/ui/IconTitle"
import { InfoRow } from "@/components/ui/InfoRow"
import { InfoSection } from "@/components/ui/InfoSection"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { useApi } from "@/hooks/useApi"
import { usePostApi } from "@/hooks/usePostApi"
import { getRulesApi } from "@/service/userApi"
import { AlarmSmoke, BookText, Edit, PartyPopper } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"

export const Rules = () => {
    const { id } = useParams()

    const { data, error, loading, refresh } = useApi(() => getRulesApi(id))
    const { post, errorPost, loadingPost } = usePostApi()

    const rules = data?.[0]

    const hasData = !rules

    const [smokingAllowed, setSmokingAllowed] = useState(false)
    const [petsAllowed, setPetsAllowed] = useState(false)
    const [partiesAllowed, setPartiesAllowed] = useState(false)
    const [additionalRules, setAdditionalRules] = useState("")

    
    useEffect(() => {
        if (!rules) return
        setAdditionalRules(rules.additional_rules ?? "")
        setPartiesAllowed(rules.parties_allowed ?? false)
        setPetsAllowed(rules.pets_allowed ?? false)
        setSmokingAllowed(rules.smoking_allowed ?? false)
    }, [rules?.section_id])
    
    if (loading) return <Loading/>
    if (error) return <Error/>
    
    console.log(rules)
    const handleRules = async (e: React.FormEvent, close: () => void) => {
        e.preventDefault()

        await post(
            "/api/rules",
            {
                sectionId: rules?.section_id,
                smokingAllowed,
                petsAllowed,
                partiesAllowed,
                additionalRules
            },
            { close, refresh }
        )
    }

    return (
        <div>
            <Dialog
                trigger={<Button  size="big"icon={<Edit/>} variant="absolute"> Modifier</Button>}
                title="Règles"
            >
                {({ close }) => (
                    <Form onSubmit={(e) => handleRules(e, close)} className="p-4 space-y-4">

                        <ContentInput>
                            <Label htmlFor="smoking">Fumeur</Label>
                            <Input
                            id="smoking"
                                type="checkbox"
                                checked={smokingAllowed}
                                onChange={(e) => setSmokingAllowed(e.target.checked)}
                            />
                        </ContentInput>

                        <ContentInput>
                            <Label htmlFor="animal">Animaux</Label>
                            <Input
                                type="checkbox"
                                id="animal"
                                checked={petsAllowed}
                                onChange={(e) => setPetsAllowed(e.target.checked)}
                            />
                        </ContentInput>

                        <ContentInput>
                            <Label htmlFor="party">Fêtes</Label>
                            <Input
                                id="paarrt"
                                type="checkbox"
                                checked={partiesAllowed}
                                onChange={(e) => setPartiesAllowed(e.target.checked)}
                            />
                        </ContentInput>

                        <ContentInput className="flex flex-col gap-1.5">
                            <Label htmlFor="rules">Règles supplémentaires</Label>
                            <Textarea
                                id="rules"
                                value={additionalRules}
                                onChange={(e) => setAdditionalRules(e.target.value)}
                            />
                        </ContentInput>

                        {errorPost && (
                            <p className="text-red-500 text-sm">{errorPost}</p>
                        )}

                        <Button type="submit" disabled={loadingPost} className="w-full">
                            {loadingPost ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </Form>
                )}
            </Dialog>
            <ConditionalPhone>
                <ClientLayout />
                          <div className="p-3">
                    {hasData ? (
                    <div className="p-3">
                    <IconTitle
                        title="Aucune information des Règles"
                        icon={BookText}
                            />
                        </div>
                ) : (
                    <div className="">
                        <IconTitle title="Règles" icon={BookText} />

                        <InfoSection title="Autorisation">
                            <InfoRow
                                icon={PartyPopper}
                                valueRow={rules?.parties_allowed ? "Fêtes autorisées" : "Fêtes non autorisées"}
                                classNameIcon={rules?.parties_allowed ? "text-green-400" : "text-red-400"}
                            />

                            <InfoRow
                                icon={AlarmSmoke}
                                valueRow={rules?.smoking_allowed ? "Fumeur autorisé" : "Fumeur non autorisé"}
                                classNameIcon={rules?.smoking_allowed ? "text-green-400" : "text-red-400"}
                            />

                            <InfoRow
                                icon={AlarmSmoke}
                                valueRow={rules?.pets_allowed ? "Animaux autorisés" : "Animaux non autorisés"}
                                classNameIcon={rules?.pets_allowed ? "text-green-400" : "text-red-400"}
                            />
                        </InfoSection>
                        {!rules &&
                        <InfoSection title="À noter">
                            <p>{rules?.additional_rules}</p>
                                    </InfoSection>
                                }
                    </div>
                    )}
                </div>
                </ConditionalPhone>
        </div>
    )
}