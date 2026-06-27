import { getCookie } from "@/utilis/cookies";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router";

type Props = {
    to: string
    label: string
    icon: LucideIcon
    iconColor?: string
    iconBg?: string
    wide?: boolean
    propertyId: string
}

export const BtnHome = ({ to, label, icon: Icon, iconColor, iconBg, wide, sublabel, propertyId }: Props) => {
    return (
        <Link
            to={`/properties/${propertyId}/${to}`}
            className={`rounded-2xl shadow-xs flex flex-col items-center justify-center gap-2.5 p-5
        border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200
        transition-colors h-full ${wide ? 'col-span-2' : ''}`}
        >
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: iconBg, color: iconColor }}
            >
                <Icon size={20} />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    )
}