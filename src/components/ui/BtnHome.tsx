import { LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

type Props = {
    to: string
    label: string
    icon: LucideIcon
    iconColor?: string
    iconBg?: string
    wide?: boolean
    propertyId: string
}

export const BtnHome = ({ to, label, icon: Icon, iconColor, iconBg, wide, propertyId }: Props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const fullPath = `/properties/${propertyId}/${to}`
    const isActive = location.pathname === fullPath

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (document.startViewTransition) {
            document.startViewTransition(() => navigate(fullPath))
        } else {
            navigate(fullPath)
        }
    }

    return (
        <Link
            to={fullPath}
            onClick={handleClick}
            className={`rounded-2xl shadow-xs flex flex-col items-center justify-center gap-2.5 p-5
        border transition-colors h-full ${wide ? 'col-span-2' : ''}
        ${isActive
                    ? 'border-violet-200 bg-violet-50'
                    : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'
                }`}
        >
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: iconBg, color: iconColor }}
            >
                <Icon size={20} />
            </div>
            <span className="text-sm font-medium text-center">{label}</span>
        </Link>
    )
}