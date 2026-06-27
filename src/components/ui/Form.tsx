import React from "react"

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
    children: React.ReactNode
}

export const Form = ({ children, className, ...props }: FormProps) => {
    return (
        <form
            {...props}
            className={`p-4 space-y-4 ${className ?? ""}`}
        >
            {children}
        </form>
    )
}