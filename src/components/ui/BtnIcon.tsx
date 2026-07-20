import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router';

interface BtnIconProps {
    to: string,
    children: React.ReactNode
    icon: React.ReactNode
}

export const BtnIcon = ({ to, children, icon }: BtnIconProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const isActive = location.pathname === to

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (document.startViewTransition) {
            document.startViewTransition(() => navigate(to))
        } else {
            navigate(to)
        }
    }

    return (
        <Link to={to} onClick={handleClick}>
            <div className={`
                flex items-center gap-3 px-4 py-3
                rounded-xl
                transition-all duration-100 cursor-pointer
                select-none
                active:scale-95
                ${isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
                }
            `}>
                <span className={isActive ? 'text-violet-600' : 'text-gray-500'}>{icon}</span>
                <span className="text-sm font-medium">{children}</span>
            </div>
        </Link>
    )
}