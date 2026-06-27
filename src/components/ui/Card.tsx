import React from 'react'
import { Link } from 'react-router-dom'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    link?: string
    className?: string
}

export const Card = ({ children, link, className, ...props }: CardProps) => {
    const base = `rounded-xl p-2 border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 w-full text-left h-full ${className}`

    return link ?
        <Link to={link} className={base}>
            {children}
        </Link>
        :
        <div {...props} className={base}>
            {children}
        </div>
}