
import React from 'react'
import { Link } from 'react-router';
import { Card } from './Card';

interface BtnIconProps {
    to: string,
    children: React.ReactNode
    icon: React.ReactNode
}

export const BtnIcon = ({ to, children, icon }: BtnIconProps) => {
    return (
        <Link to={to}>
            <div className="
                flex items-center gap-3 px-4 py-3
                rounded-xl
                text-gray-700
                hover:bg-gray-100 hover:text-gray-900
                active:scale-95 active:bg-gray-200
                transition-all duration-150 cursor-pointer
                select-none
            ">
                <span className="text-gray-500">{icon}</span>
                <span className="text-sm font-medium">{children}</span>
            </div>
        </Link>
    )
}
