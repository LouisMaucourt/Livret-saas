import React from "react"

type ButtonVariant = "default" | "absolute" | "absoluteCenter" | "delete"
type ButtonSize = "sm" | "md" | "big" 

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    icon?: React.ReactNode
}
const variants: Record<ButtonVariant, string> = {
    default: "text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700",
    absolute: " shadow-2xl text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 fixed bottom-20 right-30",
    absoluteCenter: "text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 fixed top-1/2 left-1/2 -translate-x-1/2",
    delete: "text-white bg-red-500 hover:bg-red-400 active:bg-red-600",
}

const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    big: "px-6 py-3 rounded-lg min-w-50",
}
export const Button = ({ icon, children, className, variant = "default", size = "md", ...props }: ButtonProps) => {
    return (
        <button
            className={`flex justify-center items-center gap-3 z-10 cursor-pointer font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
}