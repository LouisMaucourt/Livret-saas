import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: InputProps) => {
    return (
        <input
            {...props}
            className={`border rounded px-3 py-2 w-full ${props.className ?? ""}`}
        />
    );
};