import { ChevronsUpDown, LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type DropDownProps = {
    title: string
    icon: LucideIcon
    children?: React.ReactNode
    align?: "top" | "bottom"
}

export const DropDown = ({ title, icon: Icon, children, align = "top" }: DropDownProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative z-40">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg border border-black/[0.07] bg-white/70 hover:bg-white transition-colors"
            >
                <div className="size-[26px] rounded-md bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                    <Icon size={13} />
                </div>
                <span className="text-sm font-medium flex-1 text-left truncate">{title}</span>
                <ChevronsUpDown size={13} className="opacity-35 shrink-0" />
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}  // ← ici
                    className={`absolute flex flex-col left-full ml-2 w-52 z-50 p-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-xl shadow-md ${align === "bottom" ? "bottom-0" : "top-0"}`}
                >
                    {children}
                </div>

            )}
        </div>
    )
}