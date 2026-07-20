import { ChevronDown, LucideIcon } from "lucide-react"
import { ReactNode } from "react"

type AccordionCardProps = {
    icon: LucideIcon
    iconColor?: string
    iconBg?: string
    title: ReactNode
    badge?: ReactNode
    isOpen: boolean
    onToggle: () => void
    children: ReactNode
    actions?: ReactNode
}

export const AccordionCard = ({
    icon: Icon,
    iconColor = "text-violet-500",
    iconBg = "bg-violet-50",
    title,
    badge,
    isOpen,
    onToggle,
    children,
    actions,
}: AccordionCardProps) => {
    return (
        <div className="group relative bg-white border border-gray-200 rounded-xl p-4 transition hover:shadow-sm">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
                <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
                    <Icon size={14} className={iconColor} />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-900">{title}</span>
                {badge}
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {isOpen && (
                <div className="mt-2">
                    {children}
                    {actions && (
                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                            {actions}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}