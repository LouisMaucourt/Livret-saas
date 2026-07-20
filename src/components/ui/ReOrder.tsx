import { ReactNode, useState } from "react"

type ReorderableItem = {
    id: string | null
}

type ReOrderProps<T extends ReorderableItem> = {
    items: T[]
    onReorder: (newItems: T[]) => void
    children: (item: T, index: number, dragProps: {
        draggable: boolean
        onDragStart: (e: React.DragEvent) => void
        onDragOver: (e: React.DragEvent) => void
        onDrop: () => void
        onDragEnd: () => void
        className: string
    }) => ReactNode
}

export const ReOrder = <T extends ReorderableItem>({ items, onReorder, children }: ReOrderProps<T>) => {
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [overId, setOverId] = useState<string | null>(null)

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", id)
        setDraggedId(id)
    }

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        if (id !== overId) setOverId(id)
    }

    const handleDrop = (targetId: string) => {
        if (!draggedId || draggedId === targetId) return

        const newItems = [...items]
        const fromIndex = newItems.findIndex((i) => i.id === draggedId)
        const toIndex = newItems.findIndex((i) => i.id === targetId)

        const [moved] = newItems.splice(fromIndex, 1)
        newItems.splice(toIndex, 0, moved)

        onReorder(newItems)
        setDraggedId(null)
        setOverId(null)
    }

    const handleDragEnd = () => {
        setDraggedId(null)
        setOverId(null)
    }

    return (
        <>
            {items.map((item, index) => {
                if (!item.id) return null
                const id = item.id
                return (
                    <div key={id}>
                        {children(item, index, {
                            draggable: true,
                            onDragStart: (e) => handleDragStart(e, id),
                            onDragOver: (e) => handleDragOver(e, id),
                            onDrop: () => handleDrop(id),
                            onDragEnd: handleDragEnd,
                            className: `cursor-grab transition rounded-xl
                    ${draggedId === id ? "opacity-40" : ""}
                    ${overId === id && draggedId !== id ? "ring-2 ring-violet-500" : ""}
                `,
                        })}
                    </div>
                )
            })}
        </>
    )
}