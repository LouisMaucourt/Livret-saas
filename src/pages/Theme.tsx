import { Home } from '@/components/layout/Home';
import { IconTitle } from '@/components/ui/IconTitle';
import { useApi } from '@/hooks/useApi';
import { usePostApi } from '@/hooks/usePostApi';
import { getSectionApi } from '@/service/userApi';
import { Eye, EyeClosed, GripVertical, ListOrdered } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

export const ThemePage = () => {

    type Section = {
        is_visible: boolean;
        id: string;
        sort_order: number;
        title: string;
    }
    const { id } = useParams()
    const { data } = useApi<Section[]>(() => getSectionApi(id))
    const { post } = usePostApi()
    const [localData, setLocalData] = useState<Section[]>([])
    const dragIndex = useRef<number | null>(null)
    const refreshHomeRef = useRef<(() => void) | null>(null)

    useEffect(() => {
        if (data?.length) {
            setLocalData([...data].sort((a, b) => a.sort_order - b.sort_order))
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
    const handleDrop = async (dropIndex: number) => {
        if (dragIndex.current === null || dragIndex.current === dropIndex) return
        const updated = [...localData]
        const [moved] = updated.splice(dragIndex.current, 1)
        updated.splice(dropIndex, 0, moved)
        setLocalData(updated)
        dragIndex.current = null
        await Promise.all(
            updated.map((s, i) =>
                post("/api/sections", { id: s.id, isVisible: s.is_visible, sortOrder: i + 1 }, { method: "PUT" })
            )
        )
        refreshHomeRef.current?.()
    }
console.log(data)
    return (
        <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2 w-1/3 px-5">
            <IconTitle title="Visibilité" icon={ListOrdered} />

            {localData.map((s, i) => (
                <div
                    key={s.id}
                    draggable
                    onDragStart={() => dragIndex.current = i}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(i)}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors cursor-grab active:cursor-grabbing select-none"
                >
                    <h2>{i + 1}</h2>
                    <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium text-gray-800">{s.title}</span>
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
            ))}

            </div>
            <div className="w-2/3 h-screen flex justify-center items-center">
                <Home onRefreshReady={onRefreshReady} />
            </div>
        </div>
    )
}