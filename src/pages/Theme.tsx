import { HomeClient } from '@/pages/HomeClient';
import { IconTitle } from '@/components/ui/IconTitle';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { getSectionApi } from '@/service/userApi';
import { Eye, EyeClosed, GripVertical, ListOrdered } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { ReOrder } from '@/components/ui/ReOrder';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card } from '@/components/ui/Card';
import { InfoSection } from '@/components/ui/InfoSection';
import { SECTION_TITLES } from '@/config/langues';

export const ThemePage = () => {

    type Section = {
        is_visible: boolean
        id: string
        sort_order: number
        type: keyof typeof SECTION_TITLES
        title_i18n: Record<string, string> | string
    }
    const { id } = useParams()
    const { data } = useApi<Section[]>(() => getSectionApi(id))
    const { post } = usePostApi()
    const [localData, setLocalData] = useState<Section[]>([])
    const refreshHomeRef = useRef<(() => void) | null>(null)
    useEffect(() => {
        if (data?.length) {
            console.log('types reçus:', data.map(s => s.type))
            setLocalData(
                [...data]
                    .filter(s => s.type !== 'golden_book')
                    .sort((a, b) => a.sort_order - b.sort_order)
            )
        }
    }, [data])
    const onRefreshReady = useCallback((fn: () => void) => {
        refreshHomeRef.current = fn
    }, [])

    const handleVisibility = async (section: Section) => {
        setLocalData(prev => prev.map(s =>
            s.id === section.id ? { ...s, is_visible: !s.is_visible } : s
        ))
        await post(
            "/api/sections",
            { id: section.id, isVisible: !section.is_visible, sortOrder: section.sort_order },
            { method: "PUT" }
        )
        refreshHomeRef.current?.()
    }

    const handleReorder = async (newItems: Section[]) => {
        setLocalData(newItems)
        await Promise.all(
            newItems.map((s, i) =>
                post("/api/sections", { id: s.id, isVisible: s.is_visible, sortOrder: i + 1 }, { method: "PUT" })
            )
        )
        refreshHomeRef.current?.()
    }
    console.log(data)

    return (
        <div className="flex flex-row gap-4 ">
            <div className="flex flex-col gap-2 w-1/3 px-5 h-fit">
                <Card className="flex flex-col gap-3 py-5 px-5 mt-10">
                    <div>
                        <IconTitle title="Visibilité" icon={ListOrdered} />
                        <InfoSection title="Cliquer / déposé pour changer l'odre comme vous le voulez !"> </InfoSection>
                    </div>
                    <ReOrder items={localData} onReorder={handleReorder}>
                        {(s, i, dragProps) => (
                            <div
                                {...dragProps}
                                className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors active:cursor-grabbing select-none ${dragProps.className}`}
                            >
                                <h2>{i + 1}</h2>
                                <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                                <span className="flex-1 text-sm font-medium text-gray-800">
                                    {s.type === 'stay'
                                        ? 'Arrivée et Départ'
                                        : SECTION_TITLES[s.type as keyof typeof SECTION_TITLES]?.fr ?? s.type}
                                </span>
                                <button
                                    onClick={() => handleVisibility(s)}
                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${s.is_visible
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                        : "bg-gray-50 border-gray-100 text-gray-300"
                                        }`}
                                >
                                    {s.is_visible ? <Eye size={15} /> : <EyeClosed size={15} />}
                                </button>
                            </div>
                        )}
                    </ReOrder>
                </Card>

            </div>
            <div className="w-2/3 h-screen flex justify-center items-center">
                <ClientLayout>
                    <HomeClient onRefreshReady={onRefreshReady} />
                </ClientLayout>

            </div>
        </div>
    )
}