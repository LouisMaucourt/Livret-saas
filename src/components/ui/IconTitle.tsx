import React from 'react'
import { LucideIcon } from 'lucide-react'

type IconTitleProps = {
    icon: LucideIcon
    title?: string
    className?: string
    sublabel?:string
}

export const IconTitle = ({
    icon: Icon,
    title, 
    className,
    sublabel
}: IconTitleProps) => {
    return (
        <div className={`flex items-center gap-2 my-5 ${className}`}>
            <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="size-6 text-blue-600" />
            </div>

            <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm ">{title}</p>
            <p className="text-xs text-gray-400">{sublabel}</p>
            </div>
        </div>
    )
}