import React from "react";

type LabelProps = {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
};

export const Label = ({ htmlFor, children, className }: LabelProps) => {
    return (
        <label htmlFor={htmlFor} className={className}>
            {children}
        </label>
    );
};